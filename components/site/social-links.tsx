import { Globe } from "lucide-react";
import type { SiteContent, SocialIcon } from "@/lib/content/schema";

function Icon({ icon }: { icon: SocialIcon }) {
  switch (icon) {
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" className="size-6 fill-current text-title" aria-hidden>
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className="size-6 fill-current text-title" aria-hidden>
          <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
        </svg>
      );
    case "upwork":
      // eslint-disable-next-line @next/next/no-img-element
      return <img src="/icons/tools/upwork.svg" alt="" width={28} height={28} loading="lazy" />;
    case "github":
      // eslint-disable-next-line @next/next/no-img-element
      return <img src="/icons/tools/github.svg" alt="" width={28} height={28} loading="lazy" className="invert-in-dark" />;
    default:
      return <Globe className="size-6 text-title" aria-hidden />;
  }
}

export function SocialLinks({ links }: { links: SiteContent["site"]["socialLinks"] }) {
  return (
    <ul className="flex flex-wrap gap-5">
      {links.map((link) => (
        <li key={link.url}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            data-tip={link.label}
            className="tile"
          >
            <Icon icon={link.icon} />
          </a>
        </li>
      ))}
    </ul>
  );
}
