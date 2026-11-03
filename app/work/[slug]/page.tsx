import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { PrimaryCta } from "@/components/cta-link";
import { Contact } from "@/components/sections/contact";
import { Button } from "@/components/ui/button";
import ConexaPro from "@/content/work/conexa-pro.mdx";
import { caseStudies } from "@/content/work/meta";
import MetaAdsFunnel from "@/content/work/meta-ads-funnel.mdx";

const bodies: Record<string, ComponentType> = {
  "conexa-pro": ConexaPro,
  "meta-ads-funnel": MetaAdsFunnel,
};

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) return {};
  return {
    title: study.title,
    description: study.description,
    alternates: { canonical: `/work/${slug}` },
    openGraph: { title: study.title, description: study.description, url: `/work/${slug}` },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);
  const Body = bodies[slug];
  if (!study || !Body) notFound();

  const other = caseStudies.find((item) => item.slug !== slug);

  return (
    <>
      <article>
        <header className="border-b bg-background/70">
          <div className="page-width py-10 sm:py-14">
            <Link href="/#work" className="text-link text-sm">
              Back to work
            </Link>
            <h1 className="mt-4 max-w-4xl text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] font-semibold">
              {study.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{study.description}</p>

            <dl className="drawing-frame mt-8 grid grid-cols-1 md:grid-cols-3 md:divide-x">
              <div className="border-b p-4 md:border-b-0">
                <dt className="drawing-label">Role</dt>
                <dd className="mt-1">{study.role}</dd>
              </div>
              <div className="border-b p-4 md:border-b-0">
                <dt className="drawing-label">{study.fact.label}</dt>
                <dd className="mt-1">{study.fact.value}</dd>
              </div>
              <div className="p-4">
                <dt className="drawing-label">Stack</dt>
                <dd className="mt-1 text-sm">{study.stack.join(", ")}</dd>
              </div>
            </dl>
          </div>
        </header>

        <div className="bg-background/70">
          <div className="page-width grid grid-cols-1 gap-10 py-12 sm:py-16 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-8">
              <Body />
            </div>

            <aside className="lg:col-span-3 lg:col-start-10">
              <div className="flex flex-col items-start gap-3 lg:sticky lg:top-6">
                <PrimaryCta />
                <Button asChild size="lg" variant="outline" className="h-auto whitespace-normal py-2">
                  <a href={study.live.href} target="_blank" rel="noopener noreferrer">
                    {study.live.label}
                  </a>
                </Button>
                {other && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Next case study:{" "}
                    <Link className="text-link" href={`/work/${other.slug}`}>
                      {other.title}
                    </Link>
                  </p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </article>
      <Contact />
    </>
  );
}
