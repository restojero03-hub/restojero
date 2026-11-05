import type { SiteContent } from "@/lib/content/schema";

export type NavLink = { href: string; label: string };

// A hidden section has nothing to scroll to, so its link goes too.
export function navLinks(content: SiteContent): NavLink[] {
  const links = [
    { href: "#about", label: "About", shown: content.about.visible },
    { href: "#services", label: "Services", shown: content.services.visible },
    { href: "#portfolio", label: "Portfolio", shown: content.portfolio.visible },
    { href: "#resume", label: "Resume", shown: content.resume.visible },
    { href: "#contacts", label: "Contact", shown: content.contact.visible },
  ];
  return links.filter((link) => link.shown).map(({ href, label }) => ({ href, label }));
}
