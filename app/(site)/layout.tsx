import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getContent } from "@/lib/content/get-content";
import { jsonLdScript, personJsonLd } from "@/lib/json-ld";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const content = await getContent();
  const { site } = content;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-card focus:p-2"
      >
        Skip to content
      </a>
      <SiteHeader logoText={site.logoText} photo={content.hero.photo} calUrl={site.calUrl} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter site={site} photo={content.hero.photo} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(personJsonLd(content)) }}
      />
    </>
  );
}
