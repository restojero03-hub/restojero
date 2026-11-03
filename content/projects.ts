export type Project = {
  title: string;
  client: string;
  date: string;
  summary: string;
  stack: string[];
  // Live link. null when there's nothing public to link to.
  href: string | null;
  // Slug under /work, when a case study exists.
  caseStudy: string | null;
  // null renders a text-only card. Add an image here when you have one.
  image: { src: string; alt: string } | null;
};

export const projects: Project[] = [
  {
    title: "CoNexa Pro",
    client: "My own product",
    date: "2026",
    summary:
      "A live multi-tenant SaaS for construction companies: estimating, Gantt scheduling, procurement, inventory, daily site reports, cost tracking and an AI assistant.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Xendit"],
    href: "https://app.conexapro.io",
    caseStudy: "conexa-pro",
    image: {
      src: "/images/conexa/daily-report.png",
      alt: "CoNexa Pro daily site report for a demo project, with weather, hours and work accomplished.",
    },
  },
  {
    title: "Home of Aesthetics",
    client: "Home of Aesthetics, Australia",
    date: "Feb 2024",
    summary:
      "An Australian B2B multivendor marketplace for beauty professionals. I worked on it as a team contributor.",
    stack: ["WordPress", "WooCommerce", "Dokan"],
    href: "https://homeofaesthetics.com.au",
    caseStudy: null,
    image: {
      src: "/images/work/home-of-aesthetics.webp",
      alt: "Home of Aesthetics marketplace shop page with product filters and skincare listings.",
    },
  },
  {
    title: "OnlineTabo",
    client: "Taboan Products Trading, Philippines",
    date: "Oct 2022",
    summary: "A web and mobile e-commerce app for agricultural products.",
    stack: ["PHP", "MySQL", "JavaScript", "React Native"],
    href: null,
    caseStudy: null,
    image: {
      src: "/images/work/onlinetabo.webp",
      alt: "OnlineTabo app on a laptop, tablet and phone, showing produce listings and categories.",
    },
  },
  {
    title: "Dr. David website",
    client: "Mediboost, for David L. Sykes DMD, New Jersey",
    date: "Jul 2021",
    summary: "An oral surgery practice site with booking integration and SEO.",
    stack: ["WordPress"],
    href: "https://www.davidlsykes.com",
    caseStudy: null,
    image: {
      src: "/images/work/dr-david.webp",
      alt: "Home page of the David L. Sykes DMD oral and maxillofacial surgery website.",
    },
  },
  {
    title: "Modern Resolve CRM",
    client: "Modern Resolve",
    date: "May 2021",
    summary: "A project management and CRM web app. I handled the UI/UX design and front end.",
    stack: ["UI/UX design", "Front end"],
    href: null,
    caseStudy: null,
    image: {
      src: "/images/work/modern-resolve.webp",
      alt: "Modern Resolve CRM dashboard with task counts, a project timeline and invoice statistics.",
    },
  },
];
