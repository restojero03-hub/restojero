"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { getContent } from "@/lib/content/get-content";
import { CONTENT_ID, siteContentSchema } from "@/lib/content/schema";
import { isSectionKey, type SectionKey } from "@/lib/content/sections";
import { CV_PATH } from "@/lib/cv";
import { getDb, isDatabaseConfigured } from "@/lib/db";

export type SaveResult =
  | { status: "saved" }
  | { status: "invalid"; issues: { path: string; message: string }[] }
  | { status: "error"; message: string };

export async function saveSection(section: SectionKey, value: unknown): Promise<SaveResult> {
  try {
    await requireAdmin();
  } catch {
    return { status: "error", message: "You're not signed in as the owner. Please sign in again." };
  }

  // Requests can be forged, so nothing about this one is taken on trust.
  if (!isSectionKey(section) || !isDatabaseConfigured()) {
    return { status: "error", message: "That couldn't be saved." };
  }

  const parsed = siteContentSchema.shape[section].safeParse(value);
  if (!parsed.success) {
    return {
      status: "invalid",
      issues: parsed.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
    };
  }

  try {
    const data = siteContentSchema.parse({ ...(await getContent()), [section]: parsed.data });
    await getDb().siteContent.upsert({
      where: { id: CONTENT_ID },
      create: { id: CONTENT_ID, data },
      update: { data },
    });
  } catch (error) {
    console.error("Saving content failed", error);
    return { status: "error", message: "That didn't save. Please try again in a moment." };
  }

  // The home page, its share image and search details, and the CV are all built from this content.
  revalidatePath("/", "layout");
  revalidatePath(CV_PATH);
  return { status: "saved" };
}
