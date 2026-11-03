import Image from "next/image";
import { VideoFacade } from "@/components/video-facade";
import { home } from "@/content/home";
import { site } from "@/content/site";

// Real dates, drawn to scale from 2014 to 2026.
const SCALE_START = 2014;
const SCALE_END = 2026.85;
const spans = [
  { label: "Electrical engineering", from: 2014.25, to: 2021.25, dates: "2014 to 2021" },
  { label: "Building for the web", from: 2015.25, to: SCALE_END, dates: "2015 to now" },
  { label: "CoNexa Pro", from: 2026.45, to: SCALE_END, dates: "Since June 2026" },
];

const percent = (year: number) => ((year - SCALE_START) / (SCALE_END - SCALE_START)) * 100;

export function About() {
  const { about } = home;
  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-6 border-t bg-background/70">
      <div className="page-width grid grid-cols-1 gap-10 py-14 sm:py-20 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7">
          <h2 id="about-heading" className="text-3xl leading-[1.08] font-semibold sm:text-4xl">
            {about.title}
          </h2>
          <div className="mt-5 max-w-prose space-y-4 text-lg">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <ul className="mt-10 max-w-2xl space-y-5" aria-label="Career timeline">
            {spans.map((span) => (
              <li key={span.label}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 text-sm">
                  <span className="font-medium">{span.label}</span>
                  <span className="drawing-label">{span.dates}</span>
                </div>
                <div className="relative mt-2 h-3" aria-hidden>
                  <span
                    className="absolute top-1/2 h-px bg-(--dimension)"
                    style={{ left: "0", right: "0", opacity: 0.35 }}
                  />
                  <span
                    className="absolute top-0 flex h-3 items-center justify-between border-x-2 border-primary"
                    style={{
                      left: `${percent(span.from)}%`,
                      width: `${percent(span.to) - percent(span.from)}%`,
                    }}
                  >
                    <span className="h-0.5 w-full bg-primary" />
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          <figure className="drawing-frame overflow-hidden bg-secondary">
            <Image
              src="/images/ronil-estojero.webp"
              alt={about.photoAlt}
              width={700}
              height={960}
              sizes="(min-width: 1024px) 460px, (min-width: 640px) 50vw, 100vw"
              className="mx-auto block h-auto w-full max-w-sm"
            />
          </figure>
          <VideoFacade videoId={site.links.videoId} title="Watch my intro video" />
        </div>
      </div>
    </section>
  );
}
