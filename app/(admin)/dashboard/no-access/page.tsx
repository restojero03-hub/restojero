import { auth } from "@clerk/nextjs/server";
import { AccessDenied } from "@/components/dashboard/access-denied";

export default async function NoAccessPage() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();
  return <AccessDenied />;
}
