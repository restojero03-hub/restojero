import nextEnv from "@next/env";

// Puts the starter content in an empty database. It never overwrites saved edits.
nextEnv.loadEnvConfig(process.cwd());

const { defaultContent } = await import("../content/defaults");
const { CONTENT_ID, siteContentSchema } = await import("../lib/content/schema");
const { getDb, isDatabaseConfigured } = await import("../lib/db");

if (!isDatabaseConfigured()) throw new Error("DATABASE_URL isn't set");

const data = siteContentSchema.parse(defaultContent);
const db = getDb();
const existing = await db.siteContent.findUnique({ where: { id: CONTENT_ID } });

if (existing) {
  console.log("Content is already saved. Nothing changed.");
} else {
  await db.siteContent.create({ data: { id: CONTENT_ID, data } });
  console.log("Starter content saved.");
}
await db.$disconnect();
