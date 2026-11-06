import { afterEach, describe, expect, test, vi } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { defaultContent } from "@/content/defaults";
import { jsonLdScript, personJsonLd } from "@/lib/json-ld";
import { getSiteUrl } from "@/lib/site-url";

afterEach(() => vi.unstubAllEnvs());

describe("personJsonLd", () => {
  test("describes Ronil with his profiles", () => {
    const person = personJsonLd(defaultContent);
    expect(person["@type"]).toBe("Person");
    expect(person.name).toBe("Ronil Estojero");
    expect(person.alternateName).toBe("Engr. Nil");
    expect(person.jobTitle).toBe("AI Full-Stack Developer");
    expect(person.url).toBe("https://restojero.conexapro.io");
    expect(person.sameAs).toEqual(defaultContent.site.socialLinks.map((link) => link.url));
    expect(person.address.addressLocality).toBe("Palo");
  });

  test("never exposes email or phone", () => {
    const person = personJsonLd(defaultContent);
    expect(person).not.toHaveProperty("email");
    expect(person).not.toHaveProperty("telephone");
    expect(JSON.stringify(person)).not.toMatch(/@gmail|\+63/);
  });

  test("follows the site URL setting", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://restojero.conexapro.io");
    expect(personJsonLd(defaultContent).url).toBe("https://restojero.conexapro.io");
  });

  test("keeps an uploaded photo's full address", () => {
    const content = structuredClone(defaultContent);
    content.hero.photo.src = "https://example.public.blob.vercel-storage.com/me.webp";
    expect(personJsonLd(content).image).toBe(content.hero.photo.src);
  });
});

describe("jsonLdScript", () => {
  test("can't break out of its script tag", () => {
    expect(jsonLdScript({ name: "</script><script>alert(1)</script>" })).not.toContain("</script>");
  });
});

describe("getSiteUrl", () => {
  test("defaults to the site domain", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(getSiteUrl()).toBe("https://restojero.conexapro.io");
  });

  test("reads the one setting and drops a trailing slash", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://restojero.conexapro.io/");
    expect(getSiteUrl()).toBe("https://restojero.conexapro.io");
  });
});

describe("sitemap", () => {
  test("lists the one page on the site URL", () => {
    expect(sitemap().map((entry) => entry.url)).toEqual(["https://restojero.conexapro.io/"]);
  });
});

describe("robots", () => {
  test("allows the site, keeps the dashboard out, and points to the sitemap", () => {
    const result = robots();
    expect(result.rules).toEqual({ userAgent: "*", allow: "/", disallow: ["/dashboard", "/sign-in"] });
    expect(result.sitemap).toBe("https://restojero.conexapro.io/sitemap.xml");
  });
});
