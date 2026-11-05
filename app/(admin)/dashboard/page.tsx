import { redirect } from "next/navigation";
import { guardDashboardPage } from "@/lib/auth/guard";

export default async function DashboardPage() {
  await guardDashboardPage();
  redirect("/dashboard/hero");
}
