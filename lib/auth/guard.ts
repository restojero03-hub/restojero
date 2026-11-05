import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAdmin, type Admin } from "@/lib/auth/admin";

// For dashboard pages: signed-out visitors go to the login page, other accounts to "no access".
export async function guardDashboardPage(): Promise<Admin> {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const admin = await getAdmin();
  if (!admin) redirect("/dashboard/no-access");
  return admin;
}
