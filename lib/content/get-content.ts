import { defaultContent } from "@/content/defaults";
import type { SiteContent } from "@/lib/content/schema";

export async function getContent(): Promise<SiteContent> {
  return defaultContent;
}
