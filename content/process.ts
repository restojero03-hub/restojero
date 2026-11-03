export type ProcessStep = { title: string; body: string };

export const process: ProcessStep[] = [
  {
    title: "Discovery",
    body: "We go through how your business actually runs and agree what the first version has to do.",
  },
  {
    title: "Build",
    body: "I build in feature branches on a modern stack: Next.js, TypeScript and PostgreSQL.",
  },
  {
    title: "Staging",
    body: "Changes go to staging first, with database branching and migration testing.",
  },
  {
    title: "Launch",
    body: "It moves to production after automated and smoke tests pass.",
  },
  {
    title: "Support",
    body: "I stay available to fix, improve and extend what's live.",
  },
];
