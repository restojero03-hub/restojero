import Image from "next/image";
import { DownloadCv, PrimaryCta } from "@/components/cta-link";
import { site } from "@/content/site";

// Balloons sit on the feature they name. Positions are percentages of the screenshot.
const callouts = [
  { id: "A", left: "9%", top: "42%", label: "Every project module in one place" },
  { id: "B", left: "60%", top: "28.5%", label: "Material, labor and equipment costs" },
  { id: "C", left: "30%", top: "89.5%", label: "Totals roll up from each division" },
];

export function Hero() {
  return (
    <section aria-labelledby="hero-heading">
      <div className="page-width grid grid-cols-1 items-start gap-10 py-10 sm:py-14 lg:grid-cols-12 lg:gap-12 lg:py-16">
        <div className="min-w-0 lg:col-span-5">
          <p className="max-w-md text-sm font-medium [font-stretch:92%] text-muted-foreground">
            {site.title}
          </p>
          <h1
            id="hero-heading"
            className="mt-4 text-[clamp(2.75rem,6vw,4.5rem)] leading-[0.98] font-semibold"
          >
            {site.promise}
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">{site.audience}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <PrimaryCta />
            <DownloadCv />
          </div>
        </div>

        <div className="min-w-0 lg:col-span-7 lg:pt-1">
          {/* Dimension line across the top of the drawing */}
          <div className="mb-3 flex items-center gap-2" aria-hidden>
            <span className="h-3 w-px bg-(--dimension)" />
            <span className="draw-x h-px flex-1 bg-(--dimension)" />
            <span className="drawing-label">CoNexa Pro, live multi-tenant SaaS</span>
            <span className="draw-x h-px flex-1 bg-(--dimension)" />
            <span className="h-3 w-px bg-(--dimension)" />
          </div>

          <figure>
            <div className="drawing-frame">
              <Image
                src="/images/conexa/boq.png"
                alt="CoNexa Pro Bill of Quantities screen for a demo project, with material, labor and equipment costs by division and a grand total."
                width={1440}
                height={900}
                preload
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 1200px) 660px, (min-width: 1024px) 55vw, calc(100vw - 32px)"
                className="block h-auto w-full"
              />
              {callouts.map((callout) => (
                <span
                  key={callout.id}
                  aria-hidden
                  className="balloon absolute -translate-x-1/2 -translate-y-1/2 shadow-sm"
                  style={{ left: callout.left, top: callout.top }}
                >
                  {callout.id}
                </span>
              ))}
            </div>
            <figcaption className="mt-3">
              <ol className="grid grid-cols-1 gap-1.5 text-sm sm:grid-cols-3 sm:gap-4">
                {callouts.map((callout) => (
                  <li key={callout.id} className="flex gap-2">
                    <span className="balloon" aria-hidden>
                      {callout.id}
                    </span>
                    <span className="text-muted-foreground">{callout.label}</span>
                  </li>
                ))}
              </ol>
              <p className="drawing-label mt-3">
                Bill of Quantities screen, shown with demo data.{" "}
                <a
                  className="text-link"
                  href={site.links.conexa}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  See it live
                </a>
              </p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
