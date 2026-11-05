import { currentUser } from "@clerk/nextjs/server";
import { cache } from "react";

export type Admin = { id: string; email: string };

export class NotAdminError extends Error {
  constructor() {
    super("Not allowed");
    this.name = "NotAdminError";
  }
}

export function isAuthConfigured(env: Record<string, string | undefined> = process.env): boolean {
  return Boolean(env.CLERK_SECRET_KEY && env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
}

// ADMIN_EMAILS lives in the environment because this repo is public. An empty list lets nobody in.
function adminEmails(): Set<string> {
  const list = (process.env.ADMIN_EMAILS ?? "").split(",");
  return new Set(list.map((email) => email.trim().toLowerCase()).filter(Boolean));
}

// The signed-in user if they're allowed into the dashboard, otherwise null. Only verified
// addresses count, so nobody gets in by typing the owner's email into a new account.
export const getAdmin = cache(async (): Promise<Admin | null> => {
  const user = await currentUser();
  if (!user) return null;

  const allowed = adminEmails();
  const match = user.emailAddresses
    .filter((address) => address.verification?.status === "verified")
    .map((address) => address.emailAddress.toLowerCase())
    .find((email) => allowed.has(email));

  return match ? { id: user.id, email: match } : null;
});

// Every dashboard read and write calls this, as close to the data as possible.
export async function requireAdmin(): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) throw new NotAdminError();
  return admin;
}
