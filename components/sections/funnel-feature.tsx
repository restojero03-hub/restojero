import Link from "next/link";
import { FlowLine } from "@/components/diagrams/flow-line";
import { Button } from "@/components/ui/button";
import { home } from "@/content/home";
import { site } from "@/content/site";

export function FunnelFeature() {
  const { funnel } = home;
  return (
    <section aria-labelledby="funnel-heading" className="border-t bg-background/70">
      <div className="page-width py-14 sm:py-20">
        <h2 id="funnel-heading" className="max-w-3xl text-3xl leading-[1.08] font-semibold sm:text-4xl">
          {funnel.title}
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{funnel.body}</p>

        <FlowLine className="mt-10" steps={funnel.steps.map((title) => ({ title }))} />

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/work/meta-ads-funnel">Read the case study</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={site.links.funnel} target="_blank" rel="noopener noreferrer">
              See the live registration page
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
