import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { caseStudies } from "@/content/work/meta";
import { findPrivateTerms, PHONE_PATTERN } from "./helpers/private-terms";
import { faq } from "@/content/faq";
import { home } from "@/content/home";
import { process as steps } from "@/content/process";
import { projects } from "@/content/projects";
import { cvEmail, resume, type Role } from "@/content/resume";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { testimonials } from "@/content/testimonials";
import { tools } from "@/content/tools";

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

const caseStudyText = ["conexa-pro", "meta-ads-funnel"].map((slug) =>
  readFileSync(path.resolve(__dirname, `../content/work/${slug}.mdx`), "utf8"),
);

const all = strings([
  caseStudies,
  caseStudyText,
  faq,
  home,
  steps,
  projects,
  resume,
  services,
  site,
  testimonials,
  tools,
]);
const text = all.join("\n");

describe("nothing from the old CV or template leaks in", () => {
  test.each([
    ["phone number", /927|\+63/],
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
  ])("no %s", (_name, pattern) => {
    expect(text).not.toMatch(pattern);
  });

  test("nothing that looks like a phone number", () => {
    expect(text).not.toMatch(PHONE_PATTERN);
  });

  test("no names or contact details from the old CV", () => {
    expect(findPrivateTerms(text)).toEqual([]);
  });

  test("no email address in any web content", () => {
    expect(text).not.toMatch(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
  });
});

describe("site", () => {
  test("uses the promise and location Ronil approved", () => {
    expect(site.promise).toBe("I build your SaaS, and the funnel that sells it.");
    expect(site.location).toBe("Palo, Leyte, Philippines");
    expect(site.timezone).toBe("UTC+8");
    expect(site.experience).toBe("Building for the web since 2015, engineering since 2014.");
  });

  test("links to the approved funnel page and video", () => {
    expect(site.links.funnel).toBe(
      "https://go.conexapro.io/op/live-ai-driven-construction-project-management-registration/",
    );
    expect(site.links.conexa).toBe("https://app.conexapro.io");
    expect(site.links.videoId).toBe("K3TOs3JgBkg");
  });
});

describe("services and tools", () => {
  test("has the 6 services from the handover", () => {
    expect(services).toHaveLength(6);
  });

  test("has the 9 tool groups from the handover", () => {
    expect(tools).toHaveLength(9);
  });

  test("tools carry no percentages", () => {
    expect(strings(tools).join(" ")).not.toMatch(/\d+\s*%/);
  });
});

describe("projects", () => {
  test("lists CoNexa Pro first, linked to the live app", () => {
    expect(projects[0].title).toBe("CoNexa Pro");
    expect(projects[0].href).toBe("https://app.conexapro.io");
  });

  test("has the five approved entries, newest first", () => {
    expect(projects.map((p) => p.title)).toEqual([
      "CoNexa Pro",
      "Home of Aesthetics",
      "OnlineTabo",
      "Dr. David website",
      "Modern Resolve CRM",
    ]);
  });

  test("OnlineTabo and Modern Resolve have no link", () => {
    const byTitle = Object.fromEntries(projects.map((p) => [p.title, p]));
    expect(byTitle["OnlineTabo"].href).toBeNull();
    expect(byTitle["Modern Resolve CRM"].href).toBeNull();
  });

  test("no project links to davidlsykes.com except Dr. David", () => {
    const wrong = projects.filter(
      (p) => p.href?.includes("davidlsykes") && p.title !== "Dr. David website",
    );
    expect(wrong).toEqual([]);
  });
});

describe("resume", () => {
  const sortKey = (r: Role) => `${r.end ?? "9999-99"}|${r.start}`;
  const isNewestFirst = (roles: Role[]) =>
    roles.every((r, i) => i === 0 || sortKey(roles[i - 1]) >= sortKey(r));

  test("roles are newest first", () => {
    expect(isNewestFirst(resume.roles)).toBe(true);
    expect(isNewestFirst(resume.engineering)).toBe(true);
  });

  test("Home of Aesthetics ended June 2026", () => {
    const hoa = resume.roles.find((r) => r.company === "Home of Aesthetics");
    expect(hoa?.start).toBe("2024-03");
    expect(hoa?.end).toBe("2026-06");
  });

  test("uses Section 5 titles, not the Upwork variants", () => {
    const titleOf = (company: string) => resume.roles.find((r) => r.company === company)?.title;
    expect(titleOf("Advance Digital Team")).toBe("Operations and Digital Marketing Manager");
    expect(titleOf("Modern Resolve")).toBe("Lead UX and Frontend Developer");
    expect(titleOf("Home of Aesthetics")).toBe("Web Developer / Marketing");
    expect(resume.engineering[0].title).toBe("Senior/Head Electrical Engineer");
  });

  test("the FluentCRM client stays unnamed", () => {
    const role = resume.roles.find((r) => r.title.includes("FluentCRM"));
    expect(role?.company).toBe("Upwork client");
  });

  test("uses the Upwork-matching wording for older client work", () => {
    expect(resume.roles.some((r) => r.company === "Various clients (Upwork and remote)")).toBe(true);
  });

  test("engineering is brief: at most 3 bullets per role", () => {
    for (const role of resume.engineering) expect(role.bullets.length).toBeLessThanOrEqual(3);
  });

  test("the pilot client stays unnamed", () => {
    expect(text).toContain(
      "a 3-month pilot and transition program with a Philippine construction company",
    );
  });

  test("the CV email is the approved address", () => {
    expect(cvEmail).toBe("restojero@gmail.com");
  });
});

describe("case studies", () => {
  const fact = (slug: string) => caseStudies.find((study) => study.slug === slug)?.fact;

  test("label each summary fact for what it actually says", () => {
    expect(fact("conexa-pro")).toEqual({ label: "Timeline", value: "Since June 2026" });
    expect(fact("meta-ads-funnel")?.label).toBe("Project");
  });
});

describe("testimonials", () => {
  test("stay empty until real reviews exist", () => {
    expect(testimonials).toEqual([]);
  });
});
