import { SignOutButton } from "@clerk/nextjs";

export function AccessDenied() {
  return (
    <main className="page-width flex min-h-dvh flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-3xl font-bold">No access</h1>
      <p>This account isn&apos;t allowed into the dashboard.</p>
      <SignOutButton>
        <button type="button" className="btn">
          Sign out
        </button>
      </SignOutButton>
    </main>
  );
}
