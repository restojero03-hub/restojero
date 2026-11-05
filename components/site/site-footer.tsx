import { ArrowUp } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { SocialLinks } from "@/components/site/social-links";
import type { SiteContent } from "@/lib/content/schema";

export function SiteFooter({ site, photo }: { site: SiteContent["site"]; photo: SiteContent["hero"]["photo"] }) {
  return (
    <footer className="border-t border-(--line)">
      <div className="page-width flex flex-col items-center gap-6 py-10 sm:flex-row sm:justify-between">
        <Logo text={site.logoText} photo={photo} />
        <SocialLinks links={site.socialLinks} />
        <div className="flex items-center gap-4">
          <p className="text-sm">&copy; {site.name}</p>
          <a
            href="#home"
            aria-label="Back to the top of the page"
            className="neu flex size-11 items-center justify-center rounded-full text-pink-text"
          >
            <ArrowUp className="size-5" aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
