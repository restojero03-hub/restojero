import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({ currentUser: vi.fn() }));

vi.mock("@clerk/nextjs/server", () => ({ currentUser: mocks.currentUser }));

import { getAdmin, isAuthConfigured, NotAdminError, requireAdmin } from "@/lib/auth/admin";

const user = (email: string, status = "verified") => ({
  id: "user_1",
  emailAddresses: [{ emailAddress: email, verification: { status } }],
});

describe("admin check", () => {
  beforeEach(() => {
    mocks.currentUser.mockReset();
    vi.stubEnv("ADMIN_EMAILS", "owner@example.com, second@example.com");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("rejects signed-out visitors", async () => {
    mocks.currentUser.mockResolvedValue(null);
    await expect(getAdmin()).resolves.toBeNull();
    await expect(requireAdmin()).rejects.toBeInstanceOf(NotAdminError);
  });

  test("rejects a signed-in user who isn't on the list", async () => {
    mocks.currentUser.mockResolvedValue(user("someone@example.com"));
    await expect(getAdmin()).resolves.toBeNull();
    await expect(requireAdmin()).rejects.toBeInstanceOf(NotAdminError);
  });

  test("rejects a listed email that hasn't been verified", async () => {
    mocks.currentUser.mockResolvedValue(user("owner@example.com", "unverified"));
    await expect(getAdmin()).resolves.toBeNull();
  });

  test("lets nobody in when the list is empty", async () => {
    vi.stubEnv("ADMIN_EMAILS", "");
    mocks.currentUser.mockResolvedValue(user("owner@example.com"));
    await expect(getAdmin()).resolves.toBeNull();
  });

  test("lets a verified, listed email in, ignoring capitals", async () => {
    mocks.currentUser.mockResolvedValue(user("Second@Example.com"));
    await expect(requireAdmin()).resolves.toEqual({ id: "user_1", email: "second@example.com" });
  });

  test("login counts as set up only with both keys", () => {
    expect(isAuthConfigured({ CLERK_SECRET_KEY: "a" })).toBe(false);
    expect(isAuthConfigured({ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "b" })).toBe(false);
    expect(isAuthConfigured({ CLERK_SECRET_KEY: "a", NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "b" })).toBe(true);
  });
});
