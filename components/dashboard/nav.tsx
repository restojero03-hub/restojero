"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sectionKeys, sectionLabels } from "@/lib/content/sections";
import { cn } from "@/lib/utils";

export function DashboardNav({ unread }: { unread: number }) {
  const pathname = usePathname();
  const links = [
    ...sectionKeys.map((key) => ({ href: `/dashboard/${key}`, label: sectionLabels[key], count: 0 })),
    { href: "/dashboard/messages", label: "Messages", count: unread },
  ];

  return (
    <nav aria-label="Dashboard" className="flex flex-wrap gap-x-1 gap-y-1 lg:flex-col">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors hover:text-pink-text",
              active && "neu text-pink-text",
            )}
          >
            {link.label}
            {link.count > 0 && (
              <span className="rounded-full bg-primary px-2 text-xs font-semibold text-white">
                {link.count}
                <span className="sr-only"> unread</span>
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
