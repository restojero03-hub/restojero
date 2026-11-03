export type Role = {
  company: string;
  title: string;
  employment: string;
  start: string; // YYYY-MM
  end: string | null; // YYYY-MM, null means present
  bullets: string[];
};

export type Education = { title: string; school: string; dates: string; note?: string };

// Only the PDF reads this. Don't render it in web pages.
export const cvEmail = "restojero@gmail.com";

export const resume = {
  headline: "AI Full-Stack Developer | SaaS & Automated Sales Funnels",
  summary:
    "AI full-stack developer who builds SaaS products and the funnels that sell them. I designed, built and run CoNexa Pro, a live multi-tenant SaaS for construction companies. Licensed Electrical Engineer with a marine vessel and construction background, so I build around how a business actually runs. Building for the web since 2015, engineering since 2014.",
  roles: [
    {
      company: "CoNexa Pro",
      title: "Solo Full-Stack Developer",
      employment: "Own product",
      start: "2026-06",
      end: null,
      bullets: [
        "Designed, built and run a live multi-tenant SaaS for construction companies, using AI-assisted engineering (Claude Code).",
        "Modules: estimating and Bill of Quantities, Gantt scheduling with dependencies, procurement, inventory, daily site reports, cost tracking, budget vs actual, AI assistant and paid subscriptions.",
        "SaaS foundation: per-company workspaces, 6 roles plus project-level access, permission checks on every API call, plan limits on users, AI credits and storage, and subscription billing via Xendit.",
        "AI layer checks login and access before any data reaches the model, which never gets direct database access. Humans still review engineering, cost and schedule decisions.",
        "Releases go through feature branches, staging and production, with database branching and migration testing.",
        "Real-world use: a 3-month pilot and transition program with a Philippine construction company.",
      ],
    },
    {
      company: "Upwork client",
      title: "AC to FluentCRM Migration and Automation",
      employment: "Contract, remote",
      start: "2025-11",
      end: null,
      bullets: ["ActiveCampaign to FluentCRM migration and automations."],
    },
    {
      company: "Home of Aesthetics",
      title: "Web Developer / Marketing",
      employment: "Part-time, remote",
      start: "2024-03",
      end: "2026-06",
      bullets: [
        "Team contributor on an Australian B2B multivendor marketplace for beauty professionals (WordPress, WooCommerce, Dokan).",
      ],
    },
    {
      company: "Digital Health Co. (Australia)",
      title: "Lead Web Developer / Marketing",
      employment: "Part-time, remote",
      start: "2021-11",
      end: "2024-06",
      bullets: ["Health and beauty website. Built a web application for their SaaS offering."],
    },
    {
      company: "Advance Digital Team",
      title: "Operations and Digital Marketing Manager",
      employment: "Part-time, remote",
      start: "2020-03",
      end: "2024-03",
      bullets: [
        "Automation to cut manual work.",
        "Facebook and Instagram ad funnels using the H.I.C.A., A.I.D.A. and P.A.S.A. formulas, with conversion rate optimization.",
        "Consulting on marketing and automation tools.",
      ],
    },
    {
      company: "Upwork contracts",
      title: "DIVI Web Developer and WooCommerce Developer",
      employment: "Remote",
      start: "2021-11",
      end: "2024-01",
      bullets: [],
    },
    {
      company: "Quality Clinicians (US)",
      title: "Web Developer",
      employment: "Full-time, remote",
      start: "2022-04",
      end: "2022-12",
      bullets: ["Healthcare staffing sites, custom code and APIs."],
    },
    {
      company: "Meridian Remote Teams",
      title: "Front-End Web Developer",
      employment: "Full-time, remote",
      start: "2021-11",
      end: "2022-04",
      bullets: ["For client Advance Medical Group. WordPress, HTML, CSS and JavaScript."],
    },
    {
      company: "Modern Resolve",
      title: "Lead UX and Frontend Developer",
      employment: "Part-time, remote",
      start: "2021-02",
      end: "2021-11",
      bullets: ["UI/UX design and front end for a project management and CRM web app."],
    },
    {
      company: "Mediboost Australia",
      title: "Web Designer/Developer",
      employment: "Full-time, remote",
      start: "2021-04",
      end: "2021-09",
      bullets: ["Healthcare sites with SEO."],
    },
    {
      company: "Various clients (Upwork and remote)",
      title: "Web Designer/Developer/Marketing",
      employment: "Part-time, remote",
      start: "2015-04",
      end: "2021-09",
      bullets: [],
    },
  ] satisfies Role[],
  engineering: [
    {
      company: "Pacificfortia Marine Technologies Inc.",
      title: "Senior/Head Electrical Engineer",
      employment: "Office-based",
      start: "2014-04",
      end: "2021-04",
      bullets: [
        "Boat construction projects for the Philippine Coast Guard, Philippine Navy, Philippine Marine Corps and BFAR.",
        "Wrote technical specifications and General Arrangement drawings for bids, ran boat surveys and repair proposals, and designed electrical, navigation and communication systems.",
        "Kept projects on time and on budget. Also facility improvement and construction of a new warehouse and manufacturing facility.",
      ],
    },
    {
      company: "Hitachi Global Storage",
      title: "Intern Electrical Engineer",
      employment: "Internship",
      start: "2012-04",
      end: "2012-06",
      bullets: [],
    },
  ] satisfies Role[],
  education: [
    {
      title: "Claude Code – The Ultimate Guide! Build Websites & SaaS Apps",
      school: "Udemy",
      dates: "Jun – Oct 2026",
      note: "Certificate",
    },
    { title: "Project Management", school: "MST Connect Educational Consultancy", dates: "Jan 2024" },
    { title: "Full Stack Web Development", school: "Udemy", dates: "2020 – 2022" },
    {
      title: "Digital Marketing Course",
      school: "Udemy",
      dates: "2020 – 2022",
      note: 'Certificate: "Learn How To Start and Grow Your Own Digital Marketing Agency"',
    },
    {
      title: "Web Development Course",
      school: "QuickPro Online Professional Training Academy",
      dates: "2020",
      note: 'Certificate: "Website Development Expert"',
    },
    {
      title: "BS Electrical Engineering",
      school: "Eastern Visayas State University",
      dates: "2008 – 2013",
      note: "Licensed Electrical Engineer",
    },
  ] satisfies Education[],
  languages: ["English (fluent)", "Filipino/Tagalog (fluent)"],
  references: "References available on request.",
};
