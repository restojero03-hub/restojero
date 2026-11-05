import { cache } from "react";
import { defaultContent } from "@/content/defaults";
import { withoutHidden } from "@/lib/content/list";
import { CONTENT_ID, siteContentSchema, type SiteContent } from "@/lib/content/schema";
import { getDb, isDatabaseConfigured } from "@/lib/db";

// A failed read throws on purpose, because falling back to the defaults would replace the
// owner's edits with starter copy. A build then fails and the last deployment stays online.
// A page being rebuilt shows the error page until the database is back.
export const getContent = cache(async (): Promise<SiteContent> => {
  if (!isDatabaseConfigured()) return defaultContent;
  const row = await getDb().siteContent.findUnique({ where: { id: CONTENT_ID } });
  if (!row) return defaultContent;
  return siteContentSchema.parse(row.data);
});

// For the public pages. The dashboard reads getContent, so it can still see hidden items.
export const getPublicContent = cache(async (): Promise<SiteContent> => withoutHidden(await getContent()));
