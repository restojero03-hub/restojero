import { describe, expect, test } from "vitest";
import { defaultContent } from "@/content/defaults";
import { calEmbedUrl } from "@/lib/cal";
import { moveItem, withoutHidden } from "@/lib/content/list";
import { navLinks } from "@/lib/content/nav";
import { siteContentSchema, type SiteContent } from "@/lib/content/schema";

const hideFirst = <T extends { visible: boolean }>(items: T[]): T[] =>
  items.map((item, index) => ({ ...item, visible: index !== 0 }));

describe("hiding items", () => {
  test("content saved before items could be hidden shows everything", () => {
    const copy = structuredClone(defaultContent) as unknown as {
      services: { items: { visible?: boolean }[] };
    };
    delete copy.services.items[0].visible;
    const parsed = siteContentSchema.parse(copy);
    expect(parsed.services.items[0].visible).toBe(true);
  });

  // Client components get everything they're passed in the page source, so hiding has to
  // happen on the server. A hidden job must not be readable with "view source".
  test("nothing hidden is left in what the public pages receive", () => {
    const { site, hero, services, portfolio, resume } = defaultContent;
    const content: SiteContent = {
      ...defaultContent,
      site: { ...site, socialLinks: hideFirst(site.socialLinks) },
      hero: { ...hero, tools: hideFirst(hero.tools) },
      services: { ...services, items: hideFirst(services.items) },
      portfolio: { ...portfolio, items: hideFirst(portfolio.items) },
      resume: {
        ...resume,
        roles: hideFirst(resume.roles),
        engineering: hideFirst(resume.engineering),
        education: hideFirst(resume.education),
        skillGroups: hideFirst(resume.skillGroups),
      },
    };

    const result = withoutHidden(content);
    expect(result.site.socialLinks).toEqual(site.socialLinks.slice(1));
    expect(result.hero.tools).toEqual(hero.tools.slice(1));
    expect(result.services.items).toEqual(services.items.slice(1));
    expect(result.portfolio.items).toEqual(portfolio.items.slice(1));
    expect(result.resume.roles).toEqual(resume.roles.slice(1));
    expect(result.resume.engineering).toEqual(resume.engineering.slice(1));
    expect(result.resume.education).toEqual(resume.education.slice(1));
    expect(result.resume.skillGroups).toEqual(resume.skillGroups.slice(1));
    expect(JSON.stringify(result.portfolio)).not.toContain(portfolio.items[0].slug);
  });

  test("leaves content with nothing hidden as it was", () => {
    expect(withoutHidden(defaultContent)).toEqual(defaultContent);
  });
});

describe("the main menu", () => {
  test("links to every section by default", () => {
    expect(navLinks(defaultContent).map((link) => link.href)).toEqual([
      "#about",
      "#services",
      "#portfolio",
      "#resume",
      "#contacts",
    ]);
  });

  test("drops the link to a hidden section", () => {
    const content = { ...defaultContent, services: { ...defaultContent.services, visible: false } };
    expect(navLinks(content).map((link) => link.href)).not.toContain("#services");
  });
});

describe("calEmbedUrl", () => {
  test("adds the embed setting to a plain link", () => {
    expect(calEmbedUrl("https://cal.com/restojero/30min")).toBe("https://cal.com/restojero/30min?embed=true");
  });

  test("keeps a link's existing settings", () => {
    expect(calEmbedUrl("https://cal.com/restojero/30min?month=2026-12")).toBe(
      "https://cal.com/restojero/30min?month=2026-12&embed=true",
    );
  });
});

describe("moveItem", () => {
  test("moves an item up and down", () => {
    expect(moveItem(["a", "b", "c"], 1, -1)).toEqual(["b", "a", "c"]);
    expect(moveItem(["a", "b", "c"], 1, 1)).toEqual(["a", "c", "b"]);
  });

  test("leaves the list alone at the ends", () => {
    expect(moveItem(["a", "b"], 0, -1)).toEqual(["a", "b"]);
    expect(moveItem(["a", "b"], 1, 1)).toEqual(["a", "b"]);
  });
});
