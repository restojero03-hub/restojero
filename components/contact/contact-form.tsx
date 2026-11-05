"use client";

import { useActionState, useCallback, useRef, useState } from "react";
import { submitContact } from "@/lib/contact/actions";
import { Turnstile, type TurnstileHandle } from "@/components/contact/turnstile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  HONEYPOT_FIELD,
  initialContactState,
  TURNSTILE_FIELD,
  type ContactState,
} from "@/lib/contact/form-fields";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-destructive">
      {message}
    </p>
  );
}

export function ContactForm({ note }: { note: string }) {
  // Turnstile only loads once someone starts the form, so it can't slow the page down.
  const [started, setStarted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [checkFailed, setCheckFailed] = useState(false);
  const turnstile = useRef<TurnstileHandle>(null);

  const handleToken = useCallback((next: string | null) => {
    setToken(next);
    if (next) setCheckFailed(false);
  }, []);
  const handleCheckFailed = useCallback(() => setCheckFailed(true), []);

  async function send(previous: ContactState, form: FormData) {
    const result = await submitContact(previous, form);
    // Tokens work once, and these failures have already used it. Field errors haven't.
    if (result.status === "error" && result.message) {
      setToken(null);
      turnstile.current?.reset();
    }
    return result;
  }

  const [state, action, pending] = useActionState(send, initialContactState);

  if (state.status === "success") {
    return (
      <p role="status" className="text-lg font-medium">
        Thanks, your message is on its way. I&apos;ll reply by email.
      </p>
    );
  }

  const errors = state.fieldErrors ?? {};
  const values = state.values;

  return (
    <form action={action} onFocusCapture={() => setStarted(true)} noValidate className="grid gap-4">
      <div>
        <Label htmlFor="contact-name">Your name</Label>
        <Input
          id="contact-name"
          name="name"
          defaultValue={values?.name}
          autoComplete="name"
          required
          maxLength={100}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          className="form-field mt-1.5"
        />
        <FieldError id="contact-name-error" message={errors.name} />
      </div>

      <div>
        <Label htmlFor="contact-email">Email</Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          defaultValue={values?.email}
          autoComplete="email"
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          className="form-field mt-1.5"
        />
        <FieldError id="contact-email-error" message={errors.email} />
      </div>

      <div>
        <Label htmlFor="contact-message">What are you building?</Label>
        <Textarea
          id="contact-message"
          name="message"
          defaultValue={values?.message}
          rows={5}
          required
          maxLength={5000}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className="form-field mt-1.5"
        />
        <FieldError id="contact-message-error" message={errors.message} />
      </div>

      {/* Hidden from people and screen readers. Bots fill it in and get ignored. */}
      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </div>

      {turnstileSiteKey && started && (
        <Turnstile
          ref={turnstile}
          siteKey={turnstileSiteKey}
          onToken={handleToken}
          onFail={handleCheckFailed}
        />
      )}
      <input type="hidden" name={TURNSTILE_FIELD} value={token ?? ""} />

      {checkFailed && (
        <p role="alert" className="text-sm text-destructive">
          The spam check couldn&apos;t load. Turn off any content blocker and reload the page, or reach me
          on LinkedIn or Upwork.
        </p>
      )}

      {state.message && (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      )}

      <div>
        <Button type="submit" size="lg" disabled={pending || (started && !token)} className="min-h-12 w-full px-7">
          {pending ? "Sending..." : "Send message"}
        </Button>
        <p className="mt-3 text-sm text-muted-foreground">{note}</p>
      </div>
    </form>
  );
}
