import { auth } from "@clerk/nextjs/server";
import { AccessDenied } from "@/components/dashboard/access-denied";
import { getAdmin } from "@/lib/auth/admin";

export default async function DashboardPage() {
  const { redirectToSignIn, userId } = await auth();
  if (!userId) return redirectToSignIn();

  const admin = await getAdmin();
  if (!admin) return <AccessDenied />;

  return (
    <main className="page-width py-16">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-4">You&apos;re signed in as {admin.email}.</p>
    </main>
  );
}
