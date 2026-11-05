import { loadEnvConfig } from "@next/env";
import { defineConfig } from "prisma/config";

// Prisma doesn't read .env.local on its own. Migrations use the direct connection.
// `prisma generate` needs no database, so a missing URL is fine for a fresh clone.
loadEnvConfig(process.cwd());

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env.DATABASE_URL_UNPOOLED ?? "" },
});
