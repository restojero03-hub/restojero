# Ronil Estojero portfolio: approved design

**Status:** approved by Ronil on 2026-11-04.
**Facts:** `docs/reference/HANDOVER-portfolio.md`, Section 5, is the source of truth. That folder stays out of git because the old CV in it contains third-party contact details.

## Intent

Turn a visitor (a founder or hiring manager) into a message or a booked call, and produce a clean CV (web page plus PDF) for Upwork and other platforms. Linked from Upwork proposals, LinkedIn, job platforms and outreach.

Core promise: "I build your SaaS, and the funnel that sells it."

## Anti-goals

- No invented facts, metrics, testimonials or client logos
- Nothing from handover Section 6 (fake testimonials, fake logos, fake jobs, lorem ipsum, skill bars, likes, nine-title hero, trainer experience)
- No third-party contact details, ever
- No pricing

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui. Static wherever possible. Content in `/content` (typed TS plus MDX). No CMS, no database. Target Lighthouse 95+ on mobile.

## Decisions Ronil made

| Topic | Decision |
|---|---|
| Domain | `restojero.vercel.app` for now. Final domain later, so the site URL is a single setting. |
| Contact | Cal.com booking link plus a form via Resend |
| Email and phone | Email on the CV PDF only (`restojero@gmail.com`). No phone anywhere. Web pages show form and booking only. |
| Location | Palo, Leyte, Philippines, with UTC+8 |
| Experience wording | "Building for the web since 2015, engineering since 2014." Dates, not year counts. |
| CoNexa pilot client | Unnamed: "a 3-month pilot and transition program with a Philippine construction company" |
| Funnel link | `https://go.conexapro.io/op/live-ai-driven-construction-project-management-registration/` |
| Funnel results | No numbers for now |
| Project grid | "All projects", newest first: CoNexa Pro (links to `https://app.conexapro.io`), Home of Aesthetics, OnlineTabo (no link, site down), Dr. David, Modern Resolve (no link) |
| "Also on Upwork" projects | Not at launch |
| Pricing | None |
| Photo | Blazer photo in About and Resume; hero stays on the product |
| Intro video | `https://youtu.be/K3TOs3JgBkg`, embedded in About, click-to-load |
| CV | One version, developer-led. Engineering years brief (2 to 3 bullets). |
| Blog | Skip for now |
| Upwork | Plain "Upwork profile" link, footer and contact only. No badge, no stats. |
| Analytics | Vercel Web Analytics |
| Facebook | Left off |
| Trainer experience | Left out entirely |
| AC to FluentCRM contract | CV only, client unnamed |
| Home of Aesthetics dates | Mar 2024 to Jun 2026 |
| Job titles | Section 5 titles. Ronil updates Upwork to match. |
| GitHub | Public repo `restojero` under `restojero03-hub` |
| Vercel | Project `restojero` in team `adt-v4's projects` |
| Old site | Stays running for now, not linked from the new site |
| Images | Start with what exists, swap in later. Entries without images render as clean text cards, not grey boxes. |
| Visual direction | Blueprint |

## Calls made by Claude (shown to Ronil, not objected to)

- Title is shown in normal case ("Experienced AI Full-Stack Developer | SaaS & Automated Sales Funnels")
- Work history uses "Various clients (Upwork and remote)", as the Upwork profile words it
- No city on the CoNexa Pro job line
- Hero image is the BOQ screenshot
- Proof strip: Live SaaS: CoNexa Pro; Licensed Electrical Engineer; Building for the web since 2015
- FAQ has 4 questions answered only from the handover: AI use, data separation, safe releases, marketing
- All copy is drafted from handover Sections 3 and 5; Ronil reviews at each step
- Spam protection: hidden honeypot field plus Turnstile loaded only once someone starts the form

## Visual direction: Blueprint

Off-white "drawing paper" background, navy ink, one blue accent (`#2563EB`, the live product's blue), fine grid lines and small engineering-style labels. Light by default with a deep navy dark mode. The drawing language stays in labels and dividers so it never gets in the way of reading.

## Sitemap

- `/` Home
- `/work/conexa-pro`
- `/work/meta-ads-funnel`
- `/resume`, plus the CV PDF
- `/contact`
- 404, `sitemap.xml`, `robots.txt`, Open Graph image

Every page: header (Ronil Estojero, Work, About, Resume, "Book a call" button) and footer (LinkedIn, Upwork profile, Download CV).

## Home sections

1. Hero: title, promise, who it's for, "Book a call", "Download CV", CoNexa Pro screenshot
2. Proof strip
3. Services: the 6 from handover Section 3, short outcome-led cards
4. CoNexa Pro feature: problem, modules, screenshots, "Read the case study", "See it live"
5. Meta Ads funnel feature: funnel flow, link to case study
6. How I work: discovery, build, staging, launch, support
7. About: engineer to developer in 3 to 4 sentences, blazer photo, click-to-load video
8. Tools: grouped lists, no skill bars
9. All projects grid
10. FAQ
11. Testimonials: component built, hidden while the list is empty
12. Contact: "Let's build your product and the system that sells it", booking, form, LinkedIn and Upwork links

## Case study pages (MDX)

`/work/conexa-pro`: summary (what, role, start date, stack, live link); problem; what I built with screenshots; SaaS foundation; AI layer with a request-path diagram, "humans still review", "no direct database access"; how releases work; real-world use with no metrics; call to action.

`/work/meta-ads-funnel`: summary (own online course, three roles); why it was built (needs Ronil's input); funnel diagram; screenshots when supplied; live registration link, no results numbers; call to action.

## Resume

`/resume`: name, title, location, links, PDF button; summary; experience newest first; brief engineering background; education and certifications; tools and languages; "References available on request". Prints cleanly. Email appears only in the PDF.

PDF generated from the same data file with `@react-pdf/renderer`: real text, one column, about 2 pages. Text extraction is checked before calling it done.

## Contact

`/contact` and the Home contact section share one component: "Book a call", form with name, email and message, honeypot, Turnstile on first interaction, a short note on where the message goes. Server action, no secrets on the client, `.env.example` committed. Form emails send from a domain verified in Ronil's Resend account, because `vercel.app` can't be verified. The form only appears once Resend and Turnstile are both configured; until then visitors see LinkedIn and Upwork links.

## SEO

Metadata API, generated Open Graph image, JSON-LD `Person`, sitemap, robots. Site URL read from one setting.

## Done means

Lint, type-check and build pass; Lighthouse checked on mobile; every link clicked through; CV PDF opened and checked; site checked at mobile width; README covers local setup, editing content, deploying and environment variables.

## Waiting on Ronil

- Cal.com link
- Verified Resend domain, plus Resend and Turnstile keys added directly to Vercel and `.env.local`
- Funnel case study: why it was built and which tools it used
- Blazer photo and remaining images
- `gh` installed and signed in
