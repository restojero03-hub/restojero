import { Resend } from "resend";
import { HONEYPOT_FIELD, TURNSTILE_FIELD, type ContactState } from "@/lib/contact/form-fields";
import { contactSchema } from "@/lib/contact/schema";

type Env = Record<string, string | undefined>;

export type OutgoingEmail = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
};

export type ContactInbox = {
  save: (message: { name: string; email: string; body: string }) => Promise<void>;
  countRecent: () => Promise<number>;
};

export type ContactDeps = {
  send: (email: OutgoingEmail) => Promise<void>;
  verifyTurnstile: (token: string, secret: string) => Promise<boolean>;
  env: Env;
  inbox?: ContactInbox | null;
};

// A cap on how fast the inbox can fill if a script finds the form.
const HOURLY_LIMIT = 30;
export const HOURLY_LIMIT_WINDOW_MS = 60 * 60 * 1000;

const SEND_FAILED =
  "Your message didn't send. Please try again, or reach me on LinkedIn or Upwork instead.";
const SPAM_CHECK_FAILED = "The spam check didn't pass. Please try it again, then resend your message.";
const TOO_MANY_MESSAGES = "A lot of messages came in just now. Please try again later, or reach me on LinkedIn or Upwork.";

function isEmailConfigured(env: Env): boolean {
  return Boolean(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL && env.CONTACT_TO_EMAIL);
}

function isSpamCheckConfigured(env: Env): boolean {
  return Boolean(env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET_KEY);
}

// With a database, messages land in the dashboard inbox under an hourly limit. Email on its
// own has no limit, so it needs the spam check: a script could otherwise fill the mailbox.
export function isContactConfigured(env: Env = process.env): boolean {
  return Boolean(env.DATABASE_URL) || (isEmailConfigured(env) && isSpamCheckConfigured(env));
}

function text(form: FormData, field: string): string {
  const value = form.get(field);
  return typeof value === "string" ? value : "";
}

export async function handleContact(form: FormData, deps: ContactDeps): Promise<ContactState> {
  // Bots get the same answer as people, so they can't tell they were caught.
  if (text(form, HONEYPOT_FIELD)) return { status: "success" };

  const values = {
    name: text(form, "name"),
    email: text(form, "email"),
    message: text(form, "message"),
  };

  const parsed = contactSchema.safeParse({ ...values, email: values.email.trim() });
  if (!parsed.success) {
    const fields = parsed.error.flatten().fieldErrors;
    return {
      status: "error",
      values,
      fieldErrors: {
        name: fields.name?.[0],
        email: fields.email?.[0],
        message: fields.message?.[0],
      },
    };
  }

  const { env, inbox } = deps;
  if (!isContactConfigured(env)) return { status: "error", message: SEND_FAILED, values };

  if (isSpamCheckConfigured(env)) {
    const token = text(form, TURNSTILE_FIELD);
    const passed = token ? await deps.verifyTurnstile(token, env.TURNSTILE_SECRET_KEY as string) : false;
    if (!passed) return { status: "error", message: SPAM_CHECK_FAILED, values };
  }

  const { name, email, message } = parsed.data;
  let delivered = false;
  let limitChecked = false;

  if (inbox) {
    try {
      if ((await inbox.countRecent()) >= HOURLY_LIMIT) {
        return { status: "error", message: TOO_MANY_MESSAGES, values };
      }
      limitChecked = true;
      await inbox.save({ name, email, body: message });
      delivered = true;
    } catch (error) {
      console.error("Saving a contact message failed", error);
    }
  }

  // Email always needs something limiting it. With the database down and no spam check,
  // nothing is, so a script could otherwise fill the mailbox.
  if (isEmailConfigured(env) && (limitChecked || isSpamCheckConfigured(env))) {
    try {
      await deps.send({
        from: `Portfolio contact form <${env.RESEND_FROM_EMAIL}>`,
        to: env.CONTACT_TO_EMAIL as string,
        replyTo: email,
        subject: `New message from ${name.replace(/[\r\n]+/g, " ")}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      });
      delivered = true;
    } catch (error) {
      console.error("Contact form email failed", error);
    }
  }

  return delivered ? { status: "success" } : { status: "error", message: SEND_FAILED, values };
}

export async function sendWithResend(email: OutgoingEmail): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send(email);
  if (error) throw new Error(error.message);
}

export async function verifyWithCloudflare(token: string, secret: string): Promise<boolean> {
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token }),
    });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch (error) {
    console.error("Turnstile check failed", error);
    return false;
  }
}
