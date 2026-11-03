import { site } from "@/content/site";

export type Cta = { label: string; href: string; external: boolean };

export function primaryCta(calUrl: string | null = site.calUrl): Cta {
  if (calUrl) return { label: "Book a call", href: calUrl, external: true };
  return { label: "Let's talk", href: "/contact", external: false };
}
