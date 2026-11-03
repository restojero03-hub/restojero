export type FaqItem = { question: string; answer: string };

export const faq: FaqItem[] = [
  {
    question: "How do you use AI to build?",
    answer:
      "I work with AI-assisted engineering, using Claude Code. I designed, built and still run CoNexa Pro this way, and every release goes through staging and tests before it reaches production.",
  },
  {
    question: "How do you keep my customers' data separate?",
    answer:
      "Each customer gets their own workspace, with tenant isolation, role-based permissions and server-side security checks. AI features sit behind the same access rules. In CoNexa Pro, permissions are checked on every API call and the model never gets direct database access.",
  },
  {
    question: "How do you keep releases safe?",
    answer:
      "Changes move from feature branches to staging to production. Database changes go through database branching and migration testing, and automated and smoke tests run on every release.",
  },
  {
    question: "Can you handle the marketing too?",
    answer:
      "Yes. I run Meta Ads on Facebook and Instagram, build landing pages and 3-page funnels, and set up the email and SMS follow-ups through to checkout.",
  },
];
