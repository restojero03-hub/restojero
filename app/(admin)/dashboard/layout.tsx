import { SignOutButton } from "@clerk/nextjs";
import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { DashboardNav } from "@/components/dashboard/nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { getAdmin } from "@/lib/auth/admin";
import { getDb, isDatabaseConfigured } from "@/lib/db";

// The menu is only for the owner. Each page also checks for itself, because a layout
// isn't run again when moving between pages.
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const admin = await getAdmin();
  if (!admin) return children;

  const unread = isDatabaseConfigured() ? await getDb().message.count({ where: { readAt: null } }) : 0;

  return (
    <div className="page-width grid grid-cols-1 gap-6 py-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 lg:py-10">
      <aside className="space-y-5 lg:sticky lg:top-10 lg:self-start">
        <p className="font-heading text-xl font-bold text-title">Dashboard</p>
        <DashboardNav unread={unread} />
        <div className="flex flex-wrap items-center gap-3">
          <ThemeToggle />
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link inline-flex items-center gap-2 text-sm"
          >
            View site
            <ExternalLink className="size-4" aria-hidden />
          </a>
        </div>
        <div>
          <p className="truncate text-xs">{admin.email}</p>
          <SignOutButton>
            <button type="button" className="text-link mt-1 cursor-pointer text-sm">
              Sign out
            </button>
          </SignOutButton>
        </div>
      </aside>
      <main className="min-w-0">{children}</main>
    </div>
  );
}
