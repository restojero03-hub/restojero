import type { SiteContent } from "@/lib/content/schema";

// Moves one item up (-1) or down (+1). At either end the list stays as it is.
export function moveItem<T>(items: T[], index: number, delta: -1 | 1): T[] {
  const target = index + delta;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function shown<T extends { visible: boolean }>(items: T[]): T[] {
  return items.filter((item) => item.visible);
}

// What the public pages and the CV get. This has to run on the server: anything passed to a
// client component is readable in the page source, even if that component doesn't show it.
export function withoutHidden(content: SiteContent): SiteContent {
  const { site, hero, services, portfolio, resume } = content;
  return {
    ...content,
    site: { ...site, socialLinks: shown(site.socialLinks) },
    hero: { ...hero, tools: shown(hero.tools) },
    services: { ...services, items: shown(services.items) },
    portfolio: { ...portfolio, items: shown(portfolio.items) },
    resume: {
      ...resume,
      roles: shown(resume.roles),
      engineering: shown(resume.engineering),
      education: shown(resume.education),
      skillGroups: shown(resume.skillGroups),
    },
  };
}
