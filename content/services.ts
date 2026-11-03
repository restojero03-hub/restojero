export type Service = { title: string; body: string; result: string };

export const services: Service[] = [
  {
    title: "SaaS MVP to production",
    body: "From requirements to a deployed app your customers can pay for. Next.js, TypeScript, PostgreSQL and Prisma, on Vercel with staging and production.",
    result: "A real product in your users' hands, not a half-built prototype.",
  },
  {
    title: "Multi-tenant architecture, roles and billing",
    body: "Auth, teams and workspaces, role-based permissions, tenant isolation, server-side security checks, subscription plans, usage limits and a payment gateway (Xendit).",
    result: "Your customers' data stays separated and safe.",
  },
  {
    title: "AI features inside your app",
    body: "LLM summaries, report drafting and Q&A over your app's data, built behind your access rules.",
    result: "AI only sees what each user is allowed to see.",
  },
  {
    title: "Automated sales funnels",
    body: "Meta Ads on Facebook and Instagram, landing pages and 3-page funnels, and email and SMS follow-ups through to checkout.",
    result: "Your product and your marketing, built by one person who understands both.",
  },
  {
    title: "Integrations and automation",
    body: "APIs, webhooks, CRMs and payment gateways, using Zapier, n8n, FluentCRM, FunnelKit, Klaviyo and ActiveCampaign.",
    result: "One connected system instead of duct-taped tools.",
  },
  {
    title: "Safe releases",
    body: "Feature branches to staging to production, database branching and migration testing, and automated and smoke tests on every release.",
    result: "Changes reach your users without surprises.",
  },
];
