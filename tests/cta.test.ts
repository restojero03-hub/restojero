import { afterEach, describe, expect, test, vi } from "vitest";
import { primaryCta } from "@/lib/cta";
import { getSiteUrl } from "@/lib/site-url";

describe("primaryCta", () => {
  test("falls back to the contact page when there is no booking link", () => {
    expect(primaryCta(null)).toEqual({ label: "Let's talk", href: "/contact", external: false });
  });

  test("books a call when a booking link exists", () => {
    expect(primaryCta("https://cal.com/x")).toEqual({
      label: "Book a call",
      href: "https://cal.com/x",
      external: true,
    });
  });
});

describe("getSiteUrl", () => {
  afterEach(() => vi.unstubAllEnvs());

  test("defaults to the free Vercel address", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(getSiteUrl()).toBe("https://restojero.vercel.app");
  });

  test("reads the one setting and drops a trailing slash", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://restojero.conexapro.io/");
    expect(getSiteUrl()).toBe("https://restojero.conexapro.io");
  });
});
