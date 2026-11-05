import { notFound } from "next/navigation";
import {
  AboutEditor,
  ContactEditor,
  HeroEditor,
  PortfolioEditor,
  ResumeEditor,
  ServicesEditor,
  SiteEditor,
} from "@/components/dashboard/editors";
import { guardDashboardPage } from "@/lib/auth/guard";
import { getContent } from "@/lib/content/get-content";
import { isSectionKey } from "@/lib/content/sections";

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  await guardDashboardPage();

  const { section } = await params;
  if (!isSectionKey(section)) notFound();

  const content = await getContent();
  switch (section) {
    case "hero":
      return <HeroEditor initial={content.hero} />;
    case "about":
      return <AboutEditor initial={content.about} />;
    case "services":
      return <ServicesEditor initial={content.services} />;
    case "portfolio":
      return <PortfolioEditor initial={content.portfolio} />;
    case "resume":
      return <ResumeEditor initial={content.resume} />;
    case "contact":
      return <ContactEditor initial={content.contact} />;
    case "site":
      return <SiteEditor initial={content.site} />;
  }
}
