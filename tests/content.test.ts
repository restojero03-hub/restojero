import { describe, expect, test } from "vitest";
import { defaultContent } from "@/content/defaults";
import { siteContentSchema, type Role } from "@/lib/content/schema";
import { findPrivateTerms, PHONE_PATTERN } from "./helpers/private-terms";

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

// Everything visitors can read. The CV email is left out because only the PDF uses it.
const { cvEmail, ...publicSite } = defaultContent.site;
const text = strings({ ...defaultContent, site: publicSite }).join("\n");

describe("the content", () => {
  test("passes the schema", () => {
    expect(() => siteContentSchema.parse(defaultContent)).not.toThrow();
  });

  test.each([
    ["phone fragments", /927|\+63/],
    ["fake testimonials", /Nevine|Delevingne|Duone/],
    ["fake clients", /John Due|Smiths Marth/],
    ["fake jobs", /Google Out Tech|Apple Developer|Nike/],
    ["lorem ipsum", /lorem/i],
    ["misspelled Hitachi", /Hitatchi/],
    ["Facebook profile", /facebook\.com/i],
    ["trainer experience", /trainer|gym instructor|school teacher/i],
    ["pricing", /\$\d/],
    ["Upwork stats", /hourly job/i],
    ["old location conflict", /Manila/],
    ["year counts", /\b\d+\+?\s*years?\b/i],
    ["the Plus Code from the OnlineTabo mockups", /5X5R/],
    ["filler from the old AI-written copy", /revolutioni|groundbreaking|cutting-edge|seamless|leverag|tailored|instrumental|pivotal|elevat|testament|thrive|unlock/i],
  ])("has no %s", (_name, pattern) => {
    expect(text).not.toMatch(pattern);
  });

  test("has nothing shaped like a phone number", () => {
    expect(text).not.toMatch(PHONE_PATTERN);
  });

  test("has no names or contact details from the old CV", () => {
    expect(findPrivateTerms(text)).toEqual([]);
  });

  test("has no email address in anything visitors can read", () => {
    expect(text).not.toMatch(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
  });

  test("keeps the approved CV email", () => {
    expect(cvEmail).toBe("restojero@gmail.com");
  });
});

describe("the hero", () => {
  test("uses the approved titles", () => {
    expect(defaultContent.hero.titles).toEqual([
      "AI Full-Stack Developer",
      "Digital Marketer",
      "Sales Funnel Builder",
      "Automation Specialist",
    ]);
  });

  test("shows the tools Ronil named", () => {
    const names = defaultContent.hero.tools.map((tool) => tool.name);
    for (const name of ["Claude", "ChatGPT", "Vercel", "Neon", "Supabase"]) {
      expect(names).toContain(name);
    }
  });
});

describe("the portfolio", () => {
  const { items } = defaultContent.portfolio;
  const bySlug = Object.fromEntries(items.map((project) => [project.slug, project]));

  test("is in the approved order, so CoNexa Pro isn't the highlight", () => {
    expect(items.map((project) => project.slug)).toEqual([
      "meta-ads-funnel",
      "home-of-aesthetics",
      "conexa-pro",
      "modern-resolve",
      "digital-marketing-analysis",
      "onlinetabo",
      "dr-david",
    ]);
  });

  test("starts with 6, so Load more has something to show", () => {
    expect(defaultContent.portfolio.initialCount).toBe(6);
  });

  test("has unique slugs", () => {
    expect(new Set(items.map((project) => project.slug)).size).toBe(items.length);
  });

  test("OnlineTabo and Modern Resolve have no live link", () => {
    expect(bySlug["onlinetabo"].link).toBeNull();
    expect(bySlug["modern-resolve"].link).toBeNull();
  });

  test("labels the analysis as a sample", () => {
    expect(bySlug["digital-marketing-analysis"].title).toMatch(/sample/i);
  });

  test("shows the funnel's real results with the date range", () => {
    const results = bySlug["meta-ads-funnel"].results.join(" ");
    expect(results).toContain("8.03");
    expect(results).toContain("48 orders");
    expect(results).toContain("₱62,352");
    expect(results).toContain("May 1 to July 31, 2025");
  });

  test("only the funnel claims results", () => {
    const withResults = items.filter((project) => project.results.length > 0);
    expect(withResults.map((project) => project.slug)).toEqual(["meta-ads-funnel"]);
  });

  test("keeps the pilot client unnamed", () => {
    expect(bySlug["conexa-pro"].body.join(" ")).toContain("a Philippine construction company");
  });
});

describe("the resume", () => {
  const { resume } = defaultContent;
  const sortKey = (role: Role) => `${role.end ?? "9999-99"}|${role.start}`;
  const newestFirst = (roles: Role[]) =>
    roles.every((role, index) => index === 0 || sortKey(roles[index - 1]) >= sortKey(role));

  test("lists roles newest first", () => {
    expect(newestFirst(resume.roles)).toBe(true);
    expect(newestFirst(resume.engineering)).toBe(true);
  });

  test("keeps Home of Aesthetics ending June 2026", () => {
    const role = resume.roles.find((item) => item.company === "Home of Aesthetics");
    expect(role?.start).toBe("2024-03");
    expect(role?.end).toBe("2026-06");
  });

  test("uses Section 5 titles", () => {
    const titleOf = (company: string) => resume.roles.find((role) => role.company === company)?.title;
    expect(titleOf("Advance Digital Team")).toBe("Operations and Digital Marketing Manager");
    expect(titleOf("Modern Resolve")).toBe("Lead UX and Frontend Developer");
    expect(resume.engineering[0].title).toBe("Senior/Head Electrical Engineer");
  });

  test("keeps the FluentCRM client unnamed", () => {
    const role = resume.roles.find((item) => item.title.includes("FluentCRM"));
    expect(role?.company).toBe("Upwork client");
  });

  test("keeps engineering brief", () => {
    for (const role of resume.engineering) expect(role.bullets.length).toBeLessThanOrEqual(3);
  });

  test("puts Engineering last in the skills", () => {
    expect(resume.skillGroups.at(-1)?.name).toBe("Engineering");
  });

  test("states experience as dates, not a count", () => {
    expect(resume.eyebrow).toBe("Building for the web since 2015");
  });
});

describe("the schema", () => {
  test("rejects a project with a bad slug", () => {
    const content = structuredClone(defaultContent);
    content.portfolio.items[0].slug = "Not A Slug";
    expect(() => siteContentSchema.parse(content)).toThrow();
  });

  test("rejects a link that isn't a real URL", () => {
    const content = structuredClone(defaultContent);
    content.site.socialLinks[0].url = "javascript:alert(1)";
    expect(() => siteContentSchema.parse(content)).toThrow();
  });

  test("rejects an image with no alt text", () => {
    const content = structuredClone(defaultContent);
    content.hero.photo.alt = "";
    expect(() => siteContentSchema.parse(content)).toThrow();
  });

  test("allows no booking link", () => {
    const content = structuredClone(defaultContent);
    content.site.calUrl = null;
    expect(() => siteContentSchema.parse(content)).not.toThrow();
  });
});
