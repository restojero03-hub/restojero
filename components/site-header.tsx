import Link from "next/link";
import { PrimaryCta } from "@/components/cta-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/content/site";

const nav = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/resume", label: "Resume" },
];

export function SiteHeader() {
  return (
    <header className="border-b bg-background print:hidden">
      <div className="page-width flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-3">
        <Link href="/" className="text-lg font-semibold [font-stretch:82%]">
          {site.name}
        </Link>
        <div className="flex items-center gap-1 sm:order-3">
          <PrimaryCta size="default" />
        </div>
        <nav
          aria-label="Main"
          className="-mx-2 flex w-full items-center gap-1 sm:mx-0 sm:ml-auto sm:w-auto"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-sm px-2 py-2 text-sm font-medium hover:underline hover:underline-offset-4"
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-auto sm:ml-1">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
