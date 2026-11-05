import { cache } from "react";
import { defaultContent } from "@/content/defaults";
import { CONTENT_ID, siteContentSchema, type SiteContent } from "@/lib/content/schema";
import { getDb, isDatabaseConfigured } from "@/lib/db";

// A failed read throws on purpose: Next.js then keeps serving the last good page,
// where falling back to the defaults would replace the owner's edits with starter copy.
export const getContent = cache(async (): Promise<SiteContent> => {
  if (!isDatabaseConfigured()) return defaultContent;
  const row = await getDb().siteContent.findUnique({ where: { id: CONTENT_ID } });
  if (!row) return defaultContent;
  return siteContentSchema.parse(row.data);
});
