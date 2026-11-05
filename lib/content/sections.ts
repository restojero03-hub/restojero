// Names shared by the dashboard screens and the server. Keep zod out of this file,
// so the lists can be used in the browser without shipping the validator.

export const sectionKeys = ["hero", "about", "services", "portfolio", "resume", "contact", "site"] as const;

export type SectionKey = (typeof sectionKeys)[number];

export const sectionLabels: Record<SectionKey, string> = {
  hero: "Hero",
  about: "About",
  services: "Services",
  portfolio: "Portfolio",
  resume: "Resume",
  contact: "Contact",
  site: "Site settings",
};

export function isSectionKey(value: unknown): value is SectionKey {
  return typeof value === "string" && (sectionKeys as readonly string[]).includes(value);
}

export const socialIcons = ["linkedin", "upwork", "github", "facebook", "website"] as const;

export const serviceIcons = [
  "code",
  "rocket",
  "sparkles",
  "funnel",
  "megaphone",
  "mail",
  "cart",
  "search",
  "plug",
  "chart",
  "pen",
  "users",
] as const;
