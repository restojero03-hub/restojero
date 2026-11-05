import type { SiteContent } from "@/lib/content/schema";
import { getSiteUrl } from "@/lib/site-url";

export function personJsonLd({ site, hero }: Pick<SiteContent, "site" | "hero">) {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    alternateName: site.nickname,
    jobTitle: hero.titles[0],
    description: site.metaDescription,
    url,
    image: hero.photo.src.startsWith("/") ? `${url}${hero.photo.src}` : hero.photo.src,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Palo",
      addressRegion: "Leyte",
      addressCountry: "PH",
    },
    knowsLanguage: ["English", "Filipino"],
    knowsAbout: ["Full-stack development", "SaaS", "AI features", "Digital marketing", "Sales funnels", "Marketing automation"],
    sameAs: site.socialLinks.map((link) => link.url),
  };
}

// Escapes "<" so the data can't close the script tag it sits in.
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
