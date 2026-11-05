"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { getDb } from "@/lib/db";

export async function setMessageRead(id: string, read: boolean): Promise<void> {
  await requireAdmin();
  await getDb().message.update({ where: { id }, data: { readAt: read ? new Date() : null } });
  revalidatePath("/dashboard", "layout");
}

export async function deleteMessage(id: string): Promise<void> {
  await requireAdmin();
  await getDb().message.delete({ where: { id } });
  revalidatePath("/dashboard", "layout");
}
