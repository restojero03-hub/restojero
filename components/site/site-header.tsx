"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BookCallButton } from "@/components/site/book-call-button";
import { Logo } from "@/components/site/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import type { NavLink } from "@/lib/content/nav";
import type { SiteContent } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  logoText: string;
  photo: SiteContent["hero"]["photo"];
  calUrl: string | null;
  links: NavLink[];
};

export function SiteHeader({ logoText, photo, calUrl, links }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  // The menu comes before its button in the page order, so Tab alone wouldn't reach it.
  useEffect(() => {
    if (menuOpen) nav.current?.querySelector("a")?.focus();
  }, [menuOpen]);

  return (
    <header
      className="sticky top-0 z-40 bg-background/95 shadow-[0_8px_24px_rgb(0_0_0_/_0.12)] backdrop-blur"
      onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) {
          setMenuOpen(false);
          toggle.current?.focus();
        }
      }}
    >
      <div className="page-width flex items-center justify-between gap-4 py-3 lg:py-4">
        <Logo text={logoText} photo={photo} />

        <nav
          id="main-nav"
          ref={nav}
          aria-label="Main"
          className={cn(
            "absolute top-full right-0 left-0 flex-col gap-1 bg-background px-4 py-4 shadow-lg lg:static lg:flex lg:flex-row lg:gap-7 lg:bg-transparent lg:p-0 lg:shadow-none",
            menuOpen ? "flex" : "hidden",
          )}
        >
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="py-2 font-heading text-sm font-medium tracking-wide uppercase transition-colors hover:text-pink-text lg:py-0"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <BookCallButton calUrl={calUrl} className="btn hidden sm:inline-flex" />
          <button
            ref={toggle}
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen((open) => !open)}
            className="neu flex size-11 cursor-pointer items-center justify-center rounded-full text-pink-text lg:hidden"
          >
            {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>
    </header>
  );
}
