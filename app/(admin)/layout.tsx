import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { isAuthConfigured } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

// Clerk loads only under this layout, so visitors to the public site never download it.
export default function AdminLayout({ children }: { children: ReactNode }) {
  if (!isAuthConfigured()) {
    return (
      <main className="page-width flex min-h-dvh items-center justify-center text-center">
        <p>The dashboard login isn&apos;t set up on this copy of the site.</p>
      </main>
    );
  }

  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      afterSignOutUrl="/sign-in"
      appearance={{ variables: { colorPrimary: "#e4004b" } }}
    >
      {children}
    </ClerkProvider>
  );
}
