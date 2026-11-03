import { site } from "@/content/site";
import { getSiteUrl } from "@/lib/site-url";

export function personJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    alternateName: site.nickname,
    jobTitle: "AI Full-Stack Developer",
    description: site.promise,
    url,
    image: `${url}/images/ronil-estojero.webp`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Palo",
      addressRegion: "Leyte",
      addressCountry: "PH",
    },
    knowsLanguage: ["English", "Filipino"],
    knowsAbout: ["SaaS development", "Next.js", "TypeScript", "AI features", "Sales funnels"],
    sameAs: [site.links.linkedin, site.links.upwork],
  };
}

// Escapes "<" so the data can't close the script tag it sits in.
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
