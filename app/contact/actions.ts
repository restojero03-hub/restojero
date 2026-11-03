"use server";

import type { ContactState } from "@/lib/contact/form-fields";
import { handleContact, sendWithResend, verifyWithCloudflare } from "@/lib/contact/send";

export async function submitContact(_previous: ContactState, form: FormData): Promise<ContactState> {
  return handleContact(form, {
    send: sendWithResend,
    verifyTurnstile: verifyWithCloudflare,
    env: process.env,
  });
}
