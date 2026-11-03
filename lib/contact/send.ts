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

export type ContactDeps = {
  send: (email: OutgoingEmail) => Promise<void>;
  verifyTurnstile: (token: string, secret: string) => Promise<boolean>;
  env: Env;
};

const SEND_FAILED =
  "Your message didn't send. Please try again, or reach me on LinkedIn or Upwork instead.";
const SPAM_CHECK_FAILED = "The spam check didn't pass. Please try it again, then resend your message.";

// Turnstile is part of this on purpose: without it, a script could post straight
// to the server action and fill the inbox.
export function isContactConfigured(env: Env = process.env): boolean {
  return Boolean(
    env.RESEND_API_KEY &&
      env.RESEND_FROM_EMAIL &&
      env.CONTACT_TO_EMAIL &&
      env.NEXT_PUBLIC_TURNSTILE_SITE_KEY &&
      env.TURNSTILE_SECRET_KEY,
  );
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

  const { env } = deps;
  if (!isContactConfigured(env)) return { status: "error", message: SEND_FAILED, values };

  const token = text(form, TURNSTILE_FIELD);
  const passed = token ? await deps.verifyTurnstile(token, env.TURNSTILE_SECRET_KEY as string) : false;
  if (!passed) return { status: "error", message: SPAM_CHECK_FAILED, values };

  const { name, email, message } = parsed.data;
  try {
    await deps.send({
      from: `Portfolio contact form <${env.RESEND_FROM_EMAIL}>`,
      to: env.CONTACT_TO_EMAIL as string,
      replyTo: email,
      subject: `New message from ${name.replace(/[\r\n]+/g, " ")}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
  } catch (error) {
    console.error("Contact form email failed", error);
    return { status: "error", message: SEND_FAILED, values };
  }
  return { status: "success" };
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
