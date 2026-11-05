import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/lib/generated/prisma/client";

const globalForDb = globalThis as unknown as { db?: PrismaClient };

export function isDatabaseConfigured(env: Record<string, string | undefined> = process.env): boolean {
  return Boolean(env.DATABASE_URL);
}

// Connects on first use, so builds and pages that never touch the database don't need it.
export function getDb(): PrismaClient {
  if (!globalForDb.db) {
    const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
    globalForDb.db = new PrismaClient({ adapter });
  }
  return globalForDb.db;
}
