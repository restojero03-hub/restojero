"use server";

import type { ContactState } from "@/lib/contact/form-fields";
import { HOURLY_LIMIT_WINDOW_MS, handleContact, sendWithResend, verifyWithCloudflare, type ContactInbox } from "@/lib/contact/send";
import { getDb, isDatabaseConfigured } from "@/lib/db";

const databaseInbox: ContactInbox = {
  async save(message) {
    await getDb().message.create({ data: message });
  },
  countRecent() {
    const since = new Date(Date.now() - HOURLY_LIMIT_WINDOW_MS);
    return getDb().message.count({ where: { createdAt: { gte: since } } });
  },
};

export async function submitContact(_previous: ContactState, form: FormData): Promise<ContactState> {
  return handleContact(form, {
    send: sendWithResend,
    verifyTurnstile: verifyWithCloudflare,
    env: process.env,
    inbox: isDatabaseConfigured() ? databaseInbox : null,
  });
}
