import Image from "next/image";
import { BookCallButton } from "@/components/site/book-call-button";
import { SocialLinks } from "@/components/site/social-links";
import { TypedTitles } from "@/components/site/typed-titles";
import { shown } from "@/lib/content/list";
import { CV_PATH } from "@/lib/cv";
import type { SiteContent, Tool } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

function ToolTile({ tool }: { tool: Tool }) {
  return (
    <li className="tile" title={tool.name}>
      {tool.icon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={tool.icon}
          alt={tool.name}
          width={28}
          height={28}
          loading="lazy"
          className={cn(tool.invertInDark && "invert-in-dark", tool.icon.endsWith(".webp") && "rounded-md")}
        />
      ) : (
        <span aria-label={tool.name} role="img" className="font-heading text-sm font-bold text-title">
          {tool.name
            .split(/(?=[A-Z])|\s/)
            .slice(0, 2)
            .map((word) => word[0])
            .join("")}
        </span>
      )}
    </li>
  );
}

export function Hero({ hero, site }: { hero: SiteContent["hero"]; site: SiteContent["site"] }) {
  const [firstName, ...rest] = site.name.split(" ");

  return (
    <section id="home" aria-labelledby="hero-heading" className="py-10 sm:py-16 lg:py-20">
      <div className="page-width grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7">
          <p className="text-sm tracking-[0.18em] text-title uppercase">{hero.eyebrow}</p>
          <h1
            id="hero-heading"
            className="mt-5 text-[clamp(2.5rem,5.2vw,3.75rem)] leading-[1.15] font-bold text-heading"
          >
            Hi, I&rsquo;m{" "}
            <span className="text-pink">
              {firstName} {rest.join(" ")}
            </span>
          </h1>
          {/* Two lines tall on phones, so the page doesn't jump as the titles type. */}
          <p className="mt-2 min-h-[2.6em] font-heading text-[clamp(1.6rem,3.6vw,2.75rem)] leading-tight font-bold text-heading sm:min-h-[1.3em]">
            <span className="sr-only">{hero.titles.join(", ")}</span>
            <TypedTitles titles={hero.titles} />
          </p>
          <p className="mt-6 max-w-2xl text-lg">{hero.intro}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <BookCallButton calUrl={site.calUrl} className="btn btn-solid" />
            <a href={CV_PATH} download className="btn">
              Download my CV
            </a>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-[auto_1fr] sm:gap-16">
            <div>
              <p className="meta-label">{hero.socialLabel}</p>
              <SocialLinks links={site.socialLinks} />
            </div>
            <div>
              <p className="meta-label">{hero.toolsLabel}</p>
              <ul className="flex flex-wrap gap-5">
                {shown(hero.tools).map((tool) => (
                  <ToolTile key={tool.name} tool={tool} />
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md min-w-0 lg:col-span-5 lg:max-w-none">
          <div className="neu absolute inset-x-0 top-[18%] bottom-0 rounded-[10px]" aria-hidden />
          <Image
            src={hero.photo.src}
            alt={hero.photo.alt}
            width={700}
            height={960}
            preload
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1270px) 490px, (min-width: 1024px) 38vw, (min-width: 480px) 448px, calc(100vw - 32px)"
            className="relative block h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
