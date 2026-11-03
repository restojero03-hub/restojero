import type { Metadata } from "next";
import { Contact } from "@/components/sections/contact";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `${site.closing} Message ${site.name} about your SaaS product or sales funnel.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <Contact headingLevel="h1" />;
}
