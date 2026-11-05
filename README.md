# Ronil Estojero portfolio

The personal site and CV of Ronil Estojero ("Engr. Nil"): freelance full-stack developer, digital marketer and funnel builder.

Built with Next.js (App Router), TypeScript, Tailwind CSS and shadcn/ui, with a logged-in dashboard for editing everything on the site. Public pages are pre-built, so visitors never wait on the database. Saving in the dashboard rebuilds them within seconds.

## Edit the content

Go to `/dashboard` and sign in. From there you can change all the text and photos, the hero titles and tool icons, services, projects and their pop-ups, experience, education, skills and links. You can also reorder lists and show or hide any section or item. The CV PDF is built from the same content, and contact form messages land under **Messages**.

Only verified email addresses listed in `ADMIN_EMAILS` can get in. Anyone else who signs up sees a "No access" page.

`content/defaults.ts` holds the starter copy. The site only uses it when no database is connected or nothing has been saved yet. Once the dashboard is in use, change content there, not in that file.

## Run it locally

You need Node.js 24.

```bash
npm install
npx vercel@latest link
npx vercel@latest env pull .env.local
npm run dev
```

The site opens at <http://localhost:3000>.

**Local and live share one database.** With `.env.local` pulled from Vercel, a save in your local dashboard changes the live content too. To work on the site without touching real content, leave `DATABASE_URL` out of `.env.local`. The site then shows the starter copy and the dashboard can't save.

A copy with no settings at all still builds and runs. It shows the starter copy, with no login and no contact form.

## Environment variables

Set these in Vercel (Project, Settings, Environment Variables) and in `.env.local` for local work. Never commit them. Redeploy after changing one.

| Name | Required | What it does |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | No | The site's address, used for SEO, the sitemap and the CV. Defaults to `https://restojero.vercel.app`. |
| `DATABASE_URL` | For the dashboard | Neon connection used by the site. Set up through the Vercel Marketplace. |
| `DATABASE_URL_UNPOOLED` | For migrations | Neon direct connection, used by Prisma when changing tables. |
| `CLERK_SECRET_KEY` | For the dashboard | Clerk login. Set up through the Vercel Marketplace. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | For the dashboard | Clerk login, browser side. |
| `ADMIN_EMAILS` | For the dashboard | Comma-separated emails allowed in. If empty, nobody can get in. It's kept out of the code because this repo is public. |
| `BLOB_READ_WRITE_TOKEN` | For uploads | Vercel Blob store for images uploaded from the dashboard. |
| `RESEND_API_KEY` | No | Also email each form message through Resend. |
| `RESEND_FROM_EMAIL` | No | The sender address. It must use a domain verified in Resend. |
| `CONTACT_TO_EMAIL` | No | The address that receives those emails. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | No | Cloudflare Turnstile site key, for the spam check on the form. |
| `TURNSTILE_SECRET_KEY` | No | Cloudflare Turnstile secret key. |

The contact form appears when a database is connected, or when email and Turnstile are both set. With a database, messages are capped at 30 an hour across the site. Email only goes out for a message that was saved, or one that passed Turnstile, so a script can't fill the mailbox.

## Changing the database

Tables are defined in `prisma/schema.prisma`. After changing it:

```bash
npx prisma migrate dev --name what-changed
```

That also applies the change to the database in `.env.local`. Migrations don't run during a deploy, so apply them before pushing code that needs them:

```bash
npm run db:migrate
```

`npm run db:seed` puts the starter copy in an empty database. It never overwrites saved edits.

Saved content is checked against `lib/content/schema.ts` every time it's read. If you add a required field, give it a default, or a read of older content will fail. A failed read never swaps in the starter copy: a build fails and the last deployment stays online, and a page being rebuilt shows a short "try again" page until the database is back. Saving rebuilds the public pages straight away, so a visitor would only see that during an outage in the moment after a save.

## Check your work

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run e2e
```

`npm test` runs the unit tests, including checks that keep banned content out of the site, such as phone numbers and third-party contact details, and checks that every save, upload and inbox action rejects anyone who isn't the admin. The tests never touch the real database.

`npm run e2e` runs the browser tests against the production build, reading the database in `.env.local` but never writing to it. Its checks expect the starter copy, so after real edits, build with no database first:

```bash
DATABASE_URL= npm run build
DATABASE_URL= npm run e2e
```

Saving and uploading aren't in the browser tests, because those need a real login and would change real content.

To test the form with email and the spam check, start a server with those settings, using Cloudflare's published always-pass test keys and any dummy `RESEND_API_KEY`, then run `E2E_CONFIGURED=1 npm run e2e`.

## Deploy

The project is on Vercel and linked to this repo:

- Pushing to `main` deploys to production.
- Pushing any other branch creates a preview deployment. Previews use the same database as production.

### Moving to a final domain

1. Add the domain in Vercel (Project, Settings, Domains) and follow its DNS instructions.
2. Set `NEXT_PUBLIC_SITE_URL` to the new address.
3. In Clerk, create the production instance for that domain and replace the two Clerk keys. Clerk's production mode needs your own domain, so on `vercel.app` the login page shows a small "Development mode" label.
4. Redeploy, then sign in again. A production Clerk instance starts with no users.
5. Add the new hostname to the Turnstile widget, if you use it.

## Private files

`docs/reference/` and `assets-inbox/` are git-ignored on purpose. The old CV in `docs/reference/` holds other people's contact details, and this repo is public.
