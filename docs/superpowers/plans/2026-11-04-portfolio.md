# Ronil Estojero Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A fast, static Next.js portfolio that turns a founder or hiring manager into a message or booked call, plus a CV page and PDF from one data source.

**Architecture:** App Router pages render typed objects from `/content`; case studies are MDX. The CV PDF is generated at build time from the same data file the `/resume` page uses. The only server code is one contact server action. Everything else is statically generated.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, `@next/mdx`, `@react-pdf/renderer`, Resend, Cloudflare Turnstile, Vercel Web Analytics, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-04-portfolio-design.md`. Facts come only from `docs/reference/HANDOVER-portfolio.md` Section 5, as amended by the spec.

## Global Constraints

- `docs/reference/` is never committed. The old CV in it holds third-party contact details.
- No invented facts, metrics, testimonials or logos. If a fact is missing, leave it out and ask.
- No phone number anywhere. Email only in the PDF, never in web pages or HTML.
- No pricing. No Facebook link. No trainer experience. No Upwork stats.
- No third-party names or contact details from the old CV's references section.
- Location is "Palo, Leyte, Philippines" with UTC+8. No city on the CoNexa Pro job line.
- Experience is stated in dates, never as a year count.
- Pilot client stays unnamed: "a 3-month pilot and transition program with a Philippine construction company".
- Site URL comes from one setting: `NEXT_PUBLIC_SITE_URL`, default `https://restojero.vercel.app`.
- The site must build and work with no environment variables set.
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- Odd form input (very long message, newlines in name, bad email): a clear field error, no crash, nothing injected into the email. Tested in Task 6.
- Missing configuration (no Cal.com link, no Resend or Turnstile keys): CTAs fall back to "Let's talk" pointing at `/contact`, and the form is replaced by LinkedIn and Upwork links. Tested in Tasks 2 and 6.
- 320px phone: no horizontal page scroll, including wide BOQ screenshots and the diagrams. Tested in Task 8.
- Printing `/resume` in dark mode: light background, dark text, no header, footer or buttons. Tested in Task 5.
- Unknown `/work/<slug>`: the styled 404, not a crash. Tested in Task 4.

## File Structure

```
app/                layout, home, work/[slug], resume, contact, not-found, sitemap, robots, opengraph-image
components/         site-header, site-footer, cta-link, theme-toggle, video-facade
components/sections/ one file per home section
components/blueprint/ drawing-language primitives (sheet label, grid, dimension rule)
components/diagrams/ request-path, funnel-flow
components/contact/ contact-block (server), contact-form (client)
components/ui/      shadcn components
content/            site, services, process, tools, projects, faq, testimonials, resume
content/work/       conexa-pro.mdx, meta-ads-funnel.mdx
lib/                site-url, cta, json-ld, contact/schema, contact/send, utils
pdf/                cv-document
scripts/            generate-cv
tests/              vitest unit tests
e2e/                playwright checks
```

---

### Task 1: Scaffold, repo and hosting

**Files:** Create: Next.js scaffold, `.gitignore` entries, `.env.example`, `vitest.config.ts`, `playwright.config.ts`

**Produces:** `npm run lint`, `npm run typecheck`, `npm test`, `npm run e2e`, `npm run build`

- [ ] Run `create-next-app` in place (TypeScript, Tailwind, ESLint, App Router, no `src/`, alias `@/*`, npm); set package name to `restojero`
- [ ] Init shadcn/ui; add button, input, textarea, label, accordion
- [ ] Add `docs/reference/` and `assets-inbox/` to `.gitignore`; confirm with `git check-ignore docs/reference/ronil-estojero-cv-2024-v3-2.pdf`
- [ ] Add scripts and Vitest; `npm test` passes with a smoke test
- [ ] `git init`, first commit on `main`; `git ls-files | grep -c docs/reference` prints 0
- [ ] Create public GitHub repo `restojero03-hub/restojero` and push (needs `gh`)
- [ ] Create Vercel project `restojero` in team `adt-v4's projects`, linked to the repo

### Task 2: Content files

**Files:** Create: `content/site.ts`, `services.ts`, `process.ts`, `tools.ts`, `projects.ts`, `faq.ts`, `testimonials.ts`, `resume.ts`; `lib/cta.ts`; `lib/site-url.ts`. Test: `tests/content.test.ts`, `tests/cta.test.ts`

**Produces:**
- `site: { name, nickname, title, promise, audience, location, timezone, experience, email, cvPath, calUrl: string | null, links: { linkedin, upwork, conexa, funnel, video } }`
- `primaryCta(calUrl = site.calUrl): { label: string; href: string; external: boolean }`
- `getSiteUrl(): string`
- `projects: Project[]` with `{ title, client, date, summary, stack, href: string | null, caseStudy: string | null, image: { src, alt } | null }`
- `resume: { summary, roles: Role[], engineering: Role[], education: Education[], tools: ToolGroup[], languages: string[] }`

- [ ] Write failing `tests/content.test.ts`, walking every exported string. Asserts: no phone pattern (`927`, `+63`); the old CV's references absent, checked by hash because the repo is public; no `lorem`, `Hitatchi`, `Google Out Tech`, `Nike`, `Facebook`, `$30`, `$6K`; no `Manila`; no `10+`/`11+` year counts; `site.email` only exported from `site.ts`; Home of Aesthetics ends `Jun 2026`; roles newest first; `projects[0].title` is `CoNexa Pro` with `href` `https://app.conexapro.io`; OnlineTabo and Modern Resolve have `href: null`
- [ ] Write failing `tests/cta.test.ts`: `primaryCta(null)` returns `{ label: "Let's talk", href: '/contact', external: false }`; `primaryCta('https://cal.com/x')` returns `{ label: 'Book a call', href: 'https://cal.com/x', external: true }`
- [ ] Implement the content from handover Sections 3 and 5 and the spec's decisions; tests pass
- [ ] Commit

### Task 3: Layout and home page

**Files:** Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `components/site-header.tsx`, `site-footer.tsx`, `cta-link.tsx`, `theme-toggle.tsx`, `video-facade.tsx`, `components/blueprint/*`, `components/sections/*`; copy the 4 screenshots and the mark into `public/images/conexa/`

**Consumes:** Everything in Task 2's Produces block.

- [ ] Use the `frontend-design` skill; set Blueprint tokens in `globals.css` (paper, ink, accent `#2563EB`, grid lines) with a dark variant
- [ ] Build the 12 sections in spec order; `testimonials` renders nothing while the list is empty; project entries with `image: null` render as text cards
- [ ] `VideoFacade` loads no YouTube resource until clicked; it's a real `<button>` with an accessible name
- [ ] Check desktop and 375px in the browser; send progress
- [ ] Commit

### Task 4: Case studies

**Files:** Create: `app/work/[slug]/page.tsx`, `mdx-components.tsx`, `content/work/conexa-pro.mdx`, `content/work/meta-ads-funnel.mdx`, `content/work/index.ts`, `components/diagrams/request-path.tsx`, `funnel-flow.tsx`; Modify: `next.config.ts`. Test: `e2e/work.spec.ts`

- [ ] Write failing e2e: both slugs return 200 with their H1; `/work/nope` returns 404 and shows the styled not-found page
- [ ] Implement with `generateStaticParams` and `dynamicParams = false`
- [ ] Write the MDX from Section 5. Funnel page leaves out tools and motivation until Ronil supplies them
- [ ] Request-path diagram uses the handover's exact steps: user asks, login checked, access checked, only allowed data, project tools, LLM, checked answer
- [ ] Tests pass; commit

### Task 5: Resume and PDF

**Files:** Create: `app/resume/page.tsx`, `pdf/cv-document.tsx`, `scripts/generate-cv.tsx`. Test: `tests/cv.test.ts`, `e2e/resume.spec.ts`

**Produces:** `renderCv(): Promise<Buffer>` in `pdf/cv-document.tsx`; generated `public/ronil-estojero-cv.pdf` via `predev` and `prebuild` (git-ignored)

- [ ] Write failing `tests/cv.test.ts`: extract text from `renderCv()` with `pdfjs-dist`. Contains `Ronil Estojero`, `restojero@gmail.com`, `CoNexa Pro`, `References available on request`, `Hitachi`. Does not contain the phone digits, any reference from the old CV, or `Trainer`. `CoNexa Pro` appears before `Pacificfortia`. Page count is 3 or fewer
- [ ] Write failing `e2e/resume.spec.ts`: rendered HTML doesn't contain `restojero@gmail.com`; PDF link returns `application/pdf`; with print media and dark color scheme, header, footer and PDF button are hidden and the body background is white
- [ ] Implement; tests pass
- [ ] Open the PDF and inspect each page visually; commit

### Task 6: Contact

**Files:** Create: `lib/contact/schema.ts`, `lib/contact/send.ts`, `app/contact/page.tsx`, `app/contact/actions.ts`, `components/contact/contact-block.tsx`, `contact-form.tsx`. Test: `tests/contact.test.ts`

**Produces:**
- `contactSchema`: name 1 to 100, email valid and at most 254, message 10 to 5000
- `submitContact(prev: ContactState, form: FormData): Promise<ContactState>`, where `ContactState = { status: 'idle' | 'success' | 'error'; message?: string; fieldErrors?: Record<string, string> }`
- `isContactConfigured(): boolean`, true only when `RESEND_API_KEY`, `RESEND_FROM_EMAIL` and `CONTACT_TO_EMAIL` are set

- [ ] Write failing tests. Valid input calls the sender once with `replyTo` set to the visitor and plain `text` only. Filled honeypot returns success without sending. Bad email and short message return `fieldErrors`. 5001-character message rejected. Newlines in name removed from the subject. Failed Turnstile returns an error without sending. Resend failure returns a friendly error with no internal details. Missing config makes `isContactConfigured()` false
- [ ] Implement; tests pass
- [ ] Turnstile script loads only on first form interaction; absent site key means no widget
- [ ] `ContactBlock` renders LinkedIn and Upwork links instead of the form when not configured
- [ ] Commit; add env vars to `.env.example`

### Task 7: SEO and analytics

**Files:** Create: `app/sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `lib/json-ld.ts`; Modify: `app/layout.tsx`, page metadata. Test: `tests/seo.test.ts`

- [ ] Write failing test: `personJsonLd()` has `name`, `jobTitle`, `url` and `sameAs` (LinkedIn, Upwork), and has no `email` or `telephone`; `sitemap()` lists all 5 routes on `getSiteUrl()`
- [ ] Implement; add `<Analytics />` from `@vercel/analytics/next`; tests pass
- [ ] Commit

### Task 8: Verify and launch

**Files:** Create: `README.md`, `e2e/smoke.spec.ts`

- [ ] Write `e2e/smoke.spec.ts`: at 320px and 375px on every route, `scrollWidth <= clientWidth`; every internal link returns 200; every image has alt text
- [ ] Run lint, typecheck, unit tests, e2e and build; all pass
- [ ] Check external links; Lighthouse on mobile against the production build, target 95+
- [ ] Write the README: setup, editing content, deploying, environment variables
- [ ] Merge to `main`, deploy, verify the live URL on a mobile viewport
