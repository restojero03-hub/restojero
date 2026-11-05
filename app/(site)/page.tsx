import type { Metadata } from "next";
import { About } from "@/components/site/about";
import { Contact } from "@/components/site/contact";
import { Hero } from "@/components/site/hero";
import { Portfolio } from "@/components/site/portfolio";
import { Resume } from "@/components/site/resume";
import { Services } from "@/components/site/services";
import { getPublicContent } from "@/lib/content/get-content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const content = await getPublicContent();

  return (
    <>
      {content.hero.visible && <Hero hero={content.hero} site={content.site} />}
      {content.about.visible && <About about={content.about} />}
      {content.services.visible && <Services services={content.services} />}
      {content.portfolio.visible && <Portfolio portfolio={content.portfolio} />}
      {content.resume.visible && <Resume resume={content.resume} />}
      {content.contact.visible && <Contact contact={content.contact} site={content.site} />}
    </>
  );
}
