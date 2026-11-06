import { SignIn } from "@clerk/nextjs";

// Sign-in only. New accounts are turned off in Clerk with an allowlist, so the
// "Sign up" link is hidden here too rather than leading to a dead end.
export default function SignInPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <SignIn appearance={{ elements: { footerAction: { display: "none" } } }} />
    </main>
  );
}
