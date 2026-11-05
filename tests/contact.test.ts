import { beforeEach, describe, expect, test, vi } from "vitest";
import { handleContact, isContactConfigured, type OutgoingEmail } from "@/lib/contact/send";

const env = {
  RESEND_API_KEY: "test-key",
  RESEND_FROM_EMAIL: "portfolio@example.com",
  CONTACT_TO_EMAIL: "inbox@example.com",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "site-key",
  TURNSTILE_SECRET_KEY: "secret",
};

// Every form carries a Turnstile token unless a test says otherwise.
function form(fields: Record<string, string>) {
  const data = new FormData();
  data.set("cf-turnstile-response", "token");
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

const valid = {
  name: "Ana Reyes",
  email: "ana@example.com",
  message: "We need a multi-tenant SaaS built for our team.",
};

function setup(overrides: { env?: Record<string, string>; verified?: boolean; failSend?: boolean } = {}) {
  const sent: OutgoingEmail[] = [];
  const verifyTurnstile = vi.fn(async () => overrides.verified ?? true);
  const send = vi.fn(async (email: OutgoingEmail) => {
    if (overrides.failSend) throw new Error("Resend 500: internal key rejected");
    sent.push(email);
  });
  return { sent, send, verifyTurnstile, deps: { send, verifyTurnstile, env: overrides.env ?? env } };
}

describe("handleContact", () => {
  test("sends one plain-text email with the visitor as reply-to", async () => {
    const { sent, deps } = setup();
    const result = await handleContact(form(valid), deps);
    expect(result.status).toBe("success");
    expect(sent).toHaveLength(1);
    expect(sent[0].to).toBe("inbox@example.com");
    expect(sent[0].from).toContain("portfolio@example.com");
    expect(sent[0].replyTo).toBe("ana@example.com");
    expect(sent[0].text).toContain(valid.message);
    expect(sent[0]).not.toHaveProperty("html");
  });

  test("a filled honeypot looks successful but sends nothing", async () => {
    const { send, deps } = setup();
    const result = await handleContact(form({ ...valid, website: "https://spam.example" }), deps);
    expect(result.status).toBe("success");
    expect(send).not.toHaveBeenCalled();
  });

  test("a bad email returns a field error", async () => {
    const { send, deps } = setup();
    const result = await handleContact(form({ ...valid, email: "not-an-email" }), deps);
    expect(result.status).toBe("error");
    expect(result.fieldErrors?.email).toBeTruthy();
    expect(send).not.toHaveBeenCalled();
  });

  test("a very short message returns a field error", async () => {
    const { deps } = setup();
    const result = await handleContact(form({ ...valid, message: "hi" }), deps);
    expect(result.fieldErrors?.message).toBeTruthy();
  });

  test("an empty name returns a field error", async () => {
    const { deps } = setup();
    const result = await handleContact(form({ ...valid, name: "   " }), deps);
    expect(result.fieldErrors?.name).toBeTruthy();
  });

  test("a message over 5000 characters is rejected", async () => {
    const { send, deps } = setup();
    const result = await handleContact(form({ ...valid, message: "x".repeat(5001) }), deps);
    expect(result.fieldErrors?.message).toBeTruthy();
    expect(send).not.toHaveBeenCalled();
  });

  test("a message of exactly 5000 characters is accepted", async () => {
    const { deps } = setup();
    const result = await handleContact(form({ ...valid, message: "x".repeat(5000) }), deps);
    expect(result.status).toBe("success");
  });

  test("newlines in the name can't reach the email subject", async () => {
    const { sent, deps } = setup();
    await handleContact(form({ ...valid, name: "Ana\r\nBcc: victim@example.com" }), deps);
    expect(sent[0].subject).not.toMatch(/[\r\n]/);
  });

  test("a failed Turnstile check returns an error and sends nothing", async () => {
    const { send, verifyTurnstile, deps } = setup({ verified: false });
    const result = await handleContact(form(valid), deps);
    expect(result.status).toBe("error");
    expect(verifyTurnstile).toHaveBeenCalledWith("token", "secret");
    expect(send).not.toHaveBeenCalled();
  });

  test("a scripted post with no Turnstile token sends nothing", async () => {
    const { send, verifyTurnstile, deps } = setup();
    const result = await handleContact(form({ ...valid, "cf-turnstile-response": "" }), deps);
    expect(result.status).toBe("error");
    expect(verifyTurnstile).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  test.each(["TURNSTILE_SECRET_KEY", "NEXT_PUBLIC_TURNSTILE_SITE_KEY"])(
    "with %s missing, nothing is sent and the check isn't skipped",
    async (key) => {
      const { send, verifyTurnstile, deps } = setup({ env: { ...env, [key]: "" } });
      const result = await handleContact(form(valid), deps);
      expect(result.status).toBe("error");
      expect(verifyTurnstile).not.toHaveBeenCalled();
      expect(send).not.toHaveBeenCalled();
    },
  );

  test("a sending failure gives a friendly error with no internal details", async () => {
    const { deps } = setup({ failSend: true });
    const result = await handleContact(form(valid), deps);
    expect(result.status).toBe("error");
    expect(result.message).toBeTruthy();
    expect(result.message).not.toMatch(/Resend|500|key/i);
  });

  test("a sending failure keeps what the visitor typed", async () => {
    const { deps } = setup({ failSend: true });
    const result = await handleContact(form(valid), deps);
    expect(result.values).toEqual(valid);
  });

  test("a field error keeps what the visitor typed", async () => {
    const { deps } = setup();
    const result = await handleContact(form({ ...valid, email: "not-an-email" }), deps);
    expect(result.values).toEqual({ ...valid, email: "not-an-email" });
  });

  test("a success doesn't echo the message back", async () => {
    const { deps } = setup();
    const result = await handleContact(form(valid), deps);
    expect(result.values).toBeUndefined();
  });

  test("missing configuration returns an error and sends nothing", async () => {
    const { send, deps } = setup({ env: {} });
    const result = await handleContact(form(valid), deps);
    expect(result.status).toBe("error");
    expect(send).not.toHaveBeenCalled();
  });
});

describe("isContactConfigured", () => {
  test("without a database, needs all five email and spam settings", () => {
    expect(isContactConfigured(env)).toBe(true);
    expect(isContactConfigured({})).toBe(false);
    for (const key of Object.keys(env)) {
      expect(isContactConfigured({ ...env, [key]: "" }), key).toBe(false);
      expect(isContactConfigured({ ...env, [key]: undefined }), key).toBe(false);
    }
  });

  test("with a database, the form works on its own", () => {
    expect(isContactConfigured({ DATABASE_URL: "postgres://example" })).toBe(true);
  });
});

describe("the inbox", () => {
  const dbEnv = { DATABASE_URL: "postgres://example" };

  function withInbox(
    overrides: { env?: Record<string, string>; failSave?: boolean; failSend?: boolean; recent?: number } = {},
  ) {
    const base = setup({ env: overrides.env ?? { ...env, ...dbEnv }, failSend: overrides.failSend });
    const save = vi.fn(async () => {
      if (overrides.failSave) throw new Error("database down");
    });
    const countRecent = vi.fn(async () => overrides.recent ?? 0);
    return { ...base, save, deps: { ...base.deps, inbox: { save, countRecent } } };
  }

  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  test("saves the message and emails it", async () => {
    const { save, sent, deps } = withInbox();
    const result = await handleContact(form(valid), deps);
    expect(result.status).toBe("success");
    expect(save).toHaveBeenCalledWith({ name: valid.name, email: valid.email, body: valid.message });
    expect(sent).toHaveLength(1);
  });

  test("a failed email still counts, because the message is saved", async () => {
    const { save, deps } = withInbox({ failSend: true });
    const result = await handleContact(form(valid), deps);
    expect(result.status).toBe("success");
    expect(save).toHaveBeenCalled();
  });

  test("a failed save still counts when the email goes out", async () => {
    const { sent, deps } = withInbox({ failSave: true });
    const result = await handleContact(form(valid), deps);
    expect(result.status).toBe("success");
    expect(sent).toHaveLength(1);
  });

  test("when both fail, the visitor is told and keeps their text", async () => {
    const { deps } = withInbox({ failSave: true, failSend: true });
    const result = await handleContact(form(valid), deps);
    expect(result.status).toBe("error");
    expect(result.values?.message).toBe(valid.message);
  });

  test("works with no email or spam settings, using only the database", async () => {
    const { save, send, verifyTurnstile, deps } = withInbox({ env: dbEnv });
    const data = new FormData();
    for (const [key, value] of Object.entries(valid)) data.set(key, value);
    const result = await handleContact(data, deps);
    expect(result.status).toBe("success");
    expect(save).toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    expect(verifyTurnstile).not.toHaveBeenCalled();
  });

  test("still enforces the spam check when it's set up", async () => {
    const { save, deps } = withInbox();
    deps.verifyTurnstile.mockResolvedValue(false);
    const result = await handleContact(form(valid), deps);
    expect(result.status).toBe("error");
    expect(save).not.toHaveBeenCalled();
  });

  test("with no spam check, sends no email if the limit can't be checked", async () => {
    const emailOnly = { RESEND_API_KEY: "k", RESEND_FROM_EMAIL: "a@example.com", CONTACT_TO_EMAIL: "b@example.com" };
    const { save, send, deps } = withInbox({ env: { ...emailOnly, ...dbEnv } });
    deps.inbox.countRecent.mockRejectedValue(new Error("database down"));
    const result = await handleContact(form(valid), deps);
    expect(result.status).toBe("error");
    expect(result.values?.message).toBe(valid.message);
    expect(save).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  test("with the spam check, email still goes out if the database is down", async () => {
    const { sent, deps } = withInbox();
    deps.inbox.countRecent.mockRejectedValue(new Error("database down"));
    const result = await handleContact(form(valid), deps);
    expect(result.status).toBe("success");
    expect(sent).toHaveLength(1);
  });

  test("a flood of messages hits the hourly limit", async () => {
    const { save, send, deps } = withInbox({ recent: 30 });
    const result = await handleContact(form(valid), deps);
    expect(result.status).toBe("error");
    expect(result.values?.message).toBe(valid.message);
    expect(save).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });
});
