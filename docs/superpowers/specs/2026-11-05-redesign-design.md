# Redesign and dashboard: approved design

**Status:** approved by Ronil on 2026-11-05. Replaces the Blueprint design in `2026-11-04-portfolio-design.md`. Facts still come from handover Section 5, plus the funnel figures and project details on his old site that he approved.

## Intent

Bring back the look of the old WordPress site at `restojero.conexapro.io`, lead with Ronil as a freelance full-stack developer, digital marketer and funnel builder, and add a dashboard he can log in to and edit everything from. CoNexa Pro is one project among several, not the highlight. Engineering is background.

## Anti-goals

- No copied theme files: the old site is the commercial Inbio theme, so the look is rebuilt from scratch
- No invented facts, metrics or testimonials; no "like" counters; no lorem ipsum
- No phone number anywhere; email in the CV PDF only
- No percentage skill bars
- No third-party names or contact details from the old CV or old project text

## Decisions Ronil made

| Topic | Decision |
|---|---|
| Dashboard scope | All content: text, photos, hero titles and tool icons, services, projects and pop-ups, experience, education, skills, links, show or hide any section. Design stays fixed. |
| Copy | Rewritten from scratch, short and plain. The old text was AI generated. |
| Login | Clerk, with only Ronil allowed in |
| Hero titles | AI Full-Stack Developer, Digital Marketer, Sales Funnel Builder, Automation Specialist |
| Skills | Same grouped layout, tags, no numbers |
| Funnel results | Show real results with the date range. Leave out slides with the GCash QR, attendee names or customer reviews. |
| Contact | Calendar, form and social links. No phone or email on the page. |
| Calendar | Pop-up from a "Book a call" button, loaded on click: `cal.com/restojero/30min` |
| Sample analysis project | Keep, labeled as a sample, "Applicant" removed from the cover |
| Build order | Local first. Nothing is pushed or deployed until Ronil approves. |

## Look

Dark is the default: charcoal `#212428`, hot pink `#ff014f`, Montserrat headings, Poppins body, soft raised cards. Light is a matching version on `#ecf0f3`. Small pink text is adjusted per theme to pass contrast checks.

## Page

One page, in this order: Hero, About Me, Services Offered, Recent Projects, Resume (Experience, Education, Professional Skills tabs), Contact. Each section can be hidden.

- Recent Projects shows 6, then Load more. A card opens a pop-up with images, facts, description and a live link. Each pop-up has a share link, `/#project-<slug>`.
- Project order: Meta Ads funnel, Home of Aesthetics, CoNexa Pro, Modern Resolve, Digital Marketing Campaign Analysis, OnlineTabo, Dr. David.
- `/work/*`, `/resume` and `/contact` redirect to the matching section.
- The CV PDF stays, built from the same content.

## Dashboard

At `/dashboard`, behind Clerk. Edits content and uploads images. Includes a messages inbox: form messages are saved there, and emailed too when Resend is set up. Saving regenerates the public pages within seconds.

## Architecture

Content is one validated document, split into sections, stored in Neon Postgres through Prisma. Images go to Vercel Blob. Public pages stay static and are regenerated on save, so visitors never wait on the database. With no database configured, the site falls back to the defaults in `content/defaults.ts`. If a database is configured but a read fails, the read throws rather than publishing defaults over real edits.

## Done means

Lint, type-check, unit tests, browser tests and build pass locally; checked at phone widths in both themes; Lighthouse on a local production build; final code review; Ronil approves before anything goes live.
