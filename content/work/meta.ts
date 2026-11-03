import { site } from "@/content/site";

export type CaseStudyMeta = {
  slug: string;
  title: string;
  description: string;
  role: string;
  // The middle cell in the summary box.
  fact: { label: string; value: string };
  stack: string[];
  live: { label: string; href: string };
};

export const caseStudies: CaseStudyMeta[] = [
  {
    slug: "conexa-pro",
    title: "CoNexa Pro: a live construction SaaS, designed, built and run solo",
    description:
      "A multi-tenant, AI-powered construction operations platform that brings scattered project data into one place.",
    role: "Solo full-stack developer. I designed, built and run it, using AI-assisted engineering with Claude Code.",
    fact: { label: "Timeline", value: "Since June 2026" },
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind",
      "shadcn/ui",
      "Node.js",
      "PostgreSQL on Neon",
      "Prisma",
      "Better Auth",
      "Cloudflare R2",
      "Cloudflare Turnstile",
      "Resend",
      "Xendit",
      "Vercel",
      "GitHub",
    ],
    live: { label: "See it live", href: site.links.conexa },
  },
  {
    slug: "meta-ads-funnel",
    title: "A Meta Ads and 3-page sales funnel with automated follow-ups",
    description:
      "Paid traffic, a 3-page funnel and email and SMS automation, built and run for my own online course in construction and engineering education.",
    role: "Funnel builder, email and SMS automation specialist, and Meta Ads campaign manager.",
    fact: {
      label: "Project",
      value: "My own course. Client work stays confidential, so this is the one I can show in full.",
    },
    stack: [
      "Meta Ads Manager",
      "WordPress",
      "FunnelKit",
      "Meta Pixel",
      "Google Analytics",
      "Google API",
      "Canva",
    ],
    live: { label: "See the live registration page", href: site.links.funnel },
  },
];
