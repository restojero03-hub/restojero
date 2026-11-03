export type ToolGroup = { group: string; items: string[] };

export const tools: ToolGroup[] = [
  { group: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui"] },
  { group: "Backend and data", items: ["Node.js", "PostgreSQL", "Prisma", "Neon"] },
  {
    group: "Auth, storage, email",
    items: ["Better Auth", "Cloudflare R2", "Cloudflare Turnstile", "Resend"],
  },
  { group: "Payments", items: ["Xendit"] },
  { group: "Hosting and DevOps", items: ["Vercel", "GitHub", "cPanel", "AWS"] },
  { group: "AI", items: ["LLM APIs", "Claude Code", "ChatGPT", "MCP servers"] },
  {
    group: "Marketing and automation",
    items: ["Meta Ads", "FunnelKit", "FluentCRM", "Klaviyo", "ActiveCampaign", "Zapier", "n8n"],
  },
  {
    group: "CMS and e-commerce",
    items: ["WordPress", "WooCommerce", "Shopify", "Divi", "Elementor"],
  },
  { group: "Earlier work", items: ["PHP", "MySQL", "React Native", "Figma", "Canva"] },
];
