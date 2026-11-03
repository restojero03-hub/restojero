import { afterEach, describe, expect, test, vi } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { site } from "@/content/site";
import { jsonLdScript, personJsonLd } from "@/lib/json-ld";

afterEach(() => vi.unstubAllEnvs());

describe("personJsonLd", () => {
  test("describes Ronil with his profiles", () => {
    const person = personJsonLd();
    expect(person["@type"]).toBe("Person");
    expect(person.name).toBe("Ronil Estojero");
    expect(person.alternateName).toBe("Engr. Nil");
    expect(person.jobTitle).toContain("AI Full-Stack Developer");
    expect(person.url).toBe("https://restojero.vercel.app");
    expect(person.sameAs).toEqual([site.links.linkedin, site.links.upwork]);
    expect(person.address.addressLocality).toBe("Palo");
  });

  test("never exposes email or phone", () => {
    const person = personJsonLd();
    expect(person).not.toHaveProperty("email");
    expect(person).not.toHaveProperty("telephone");
    expect(JSON.stringify(person)).not.toMatch(/@gmail|927|\+63/);
  });

  test("follows the site URL setting", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://restojero.conexapro.io");
    expect(personJsonLd().url).toBe("https://restojero.conexapro.io");
  });
});

describe("jsonLdScript", () => {
  test("can't break out of its script tag", () => {
    expect(jsonLdScript({ name: "</script><script>alert(1)</script>" })).not.toContain("</script>");
  });
});

describe("sitemap", () => {
  test("lists all five pages on the site URL", () => {
    expect(sitemap().map((entry) => entry.url)).toEqual([
      "https://restojero.vercel.app/",
      "https://restojero.vercel.app/work/conexa-pro",
      "https://restojero.vercel.app/work/meta-ads-funnel",
      "https://restojero.vercel.app/resume",
      "https://restojero.vercel.app/contact",
    ]);
  });
});

describe("robots", () => {
  test("allows crawling and points to the sitemap", () => {
    const result = robots();
    expect(result.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(result.sitemap).toBe("https://restojero.vercel.app/sitemap.xml");
  });
});
