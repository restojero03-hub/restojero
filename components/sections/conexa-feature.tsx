import Link from "next/link";
import { Figure } from "@/components/blueprint/figure";
import { Button } from "@/components/ui/button";
import { home } from "@/content/home";
import { site } from "@/content/site";

export function ConexaFeature() {
  const { conexa } = home;
  return (
    <section id="work" aria-labelledby="conexa-heading" className="scroll-mt-6 border-t bg-background/70">
      <div className="page-width py-14 sm:py-20">
        <h2 id="conexa-heading" className="max-w-3xl text-3xl leading-[1.08] font-semibold sm:text-5xl">
          {conexa.title}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-lg">{conexa.problem}</p>
            <p className="mt-4 text-muted-foreground">{conexa.solution}</p>

            <h3 className="mt-8 text-lg font-semibold">What it does</h3>
            <ul className="mt-2 divide-y border-y text-sm">
              {conexa.modules.map((module) => (
                <li key={module} className="py-2">
                  {module}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm text-muted-foreground">{conexa.realWorld}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/work/conexa-pro">Read the case study</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={site.links.conexa} target="_blank" rel="noopener noreferrer">
                  See it live
                </a>
              </Button>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-8">
            <div className="sm:col-span-2">
              <Figure
                src="/images/conexa/schedule.png"
                alt="CoNexa Pro schedule screen listing work breakdown items with planned dates, durations and percent done, for a demo project."
                width={1440}
                height={900}
                sizes="(min-width: 1024px) 780px, 100vw"
                caption="Schedule, with work breakdown and progress. Demo data."
              />
            </div>
            <Figure
              src="/images/conexa/daily-report.png"
              alt="CoNexa Pro daily report for a demo project, showing weather, working hours and work accomplished."
              width={1440}
              height={900}
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
              caption="Daily site report. Demo data."
            />
            <Figure
              src="/images/conexa/cost-tracking.png"
              alt="CoNexa Pro cost tracking overview for a demo project, with budget, committed and actual cost figures."
              width={1440}
              height={900}
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
              caption="Cost tracking, budget vs actual. Demo data."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
