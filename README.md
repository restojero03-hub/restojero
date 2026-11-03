# Ronil Estojero portfolio

The personal site and CV of Ronil Estojero ("Engr. Nil"): AI full-stack developer, SaaS and automated sales funnels.

Built with Next.js (App Router), TypeScript, Tailwind CSS and shadcn/ui. Pages are static. The only server code is the contact form.

## Run it locally

You need Node.js 24.

```bash
npm install
npm run dev
```

The site opens at <http://localhost:3000>. The contact form stays hidden until you add its settings (see below), so copy `.env.example` to `.env.local` if you want to test it.

## Edit the content

All the text lives in `content/`, so you can change it without touching any components.

| To change | Edit |
|---|---|
| Name, promise, location, links, booking link | `content/site.ts` |
| Hero proof strip, CoNexa and funnel summaries, About | `content/home.ts` |
| Services | `content/services.ts` |
| How I work | `content/process.ts` |
| Tools | `content/tools.ts` |
| All projects grid | `content/projects.ts` |
| FAQ | `content/faq.ts` |
| Case studies | `content/work/*.mdx`, and `content/work/meta.ts` for titles and stack |
| CV (both the page and the PDF) | `content/resume.ts` |

### Common changes

- **Add your booking link:** set `calUrl` in `content/site.ts`. Every "Let's talk" button becomes "Book a call" and opens your link.
- **Add a real review:** add it to `content/testimonials.ts`. The section appears on the home page as soon as the list has an entry. Never add a quote a real client didn't write.
- **Swap an image:** put the file in `public/images/`, then update its path in `content/projects.ts`, or in the component or MDX file that uses it. Check for private data first, and write useful alt text.
- **Change the CV:** edit `content/resume.ts`. The PDF rebuilds itself from that file on every `npm run dev` and `npm run build`. Run `npm run cv` to rebuild it by hand. It's written to `public/ronil-estojero-cv.pdf`, which isn't committed.

## Environment variables

Set these in Vercel (Project, Settings, Environment Variables) and in `.env.local` for local work. Never commit them. Redeploy after changing them, because pages read them at build time.

| Name | Required | What it does |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | No | The site's address, used for SEO, the sitemap and the CV. Defaults to `https://restojero.vercel.app`. Change this one value when you move to a final domain. |
| `RESEND_API_KEY` | For the form | Your Resend API key. |
| `RESEND_FROM_EMAIL` | For the form | The sender address. It must use a domain verified in Resend. A `vercel.app` address can't be verified. |
| `CONTACT_TO_EMAIL` | For the form | The inbox that receives form messages. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | For the form | Cloudflare Turnstile site key. Add the site's hostname to the widget in Cloudflare. |
| `TURNSTILE_SECRET_KEY` | For the form | Cloudflare Turnstile secret key. |

Until all five form settings exist, visitors see your LinkedIn and Upwork links in place of the form. Turnstile is required on purpose: without it, a script could post straight to the form and fill your inbox.

## Check your work

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run e2e
```

`npm test` runs the unit tests, including checks that keep banned content out of the site, such as phone numbers, third-party contact details, pricing and year counts. `npm run e2e` needs Chrome installed and a finished `npm run build`, and it runs the production build. To run it against a server you already have running, set `E2E_BASE_URL`.

To test the form itself, start a server with all five contact settings, using Cloudflare's published always-pass test keys and any dummy Resend key, then run the browser tests with `E2E_CONFIGURED=1` and `E2E_BASE_URL` pointing at that server. The dummy key makes every send fail, which is what those tests expect.

## Deploy

The project is on Vercel and linked to this repo:

- Pushing to `main` deploys to production.
- Pushing any other branch creates a preview deployment.

### Moving to a final domain

1. Add the domain in Vercel (Project, Settings, Domains) and follow its DNS instructions.
2. Set `NEXT_PUBLIC_SITE_URL` to the new address.
3. Redeploy.
4. Add the new hostname to the Turnstile widget, if you use it.

## Private files

`docs/reference/` and `assets-inbox/` are git-ignored on purpose. The old CV in `docs/reference/` holds other people's contact details, so don't commit that folder.
