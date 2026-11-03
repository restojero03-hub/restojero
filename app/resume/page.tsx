import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { PrimaryCta } from "@/components/cta-link";
import { Button } from "@/components/ui/button";
import { resume, type Role } from "@/content/resume";
import { site } from "@/content/site";
import { tools } from "@/content/tools";
import { formatRange } from "@/lib/format";

export const metadata: Metadata = {
  title: "Resume",
  description: `${site.name}, ${resume.headline}. ${site.experience}`,
  alternates: { canonical: "/resume" },
};

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10 print:mt-5 print:break-inside-auto">
      <h2 className="border-b pb-2 text-2xl font-semibold print:pb-1 print:text-base">{title}</h2>
      <div className="mt-4 print:mt-2">{children}</div>
    </section>
  );
}

function RoleEntry({ role }: { role: Role }) {
  return (
    <li className="print:break-inside-avoid">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="text-lg font-semibold print:text-sm">{role.title}</h3>
        <p className="drawing-label print:text-[10px]">{formatRange(role.start, role.end)}</p>
      </div>
      <p className="text-sm text-muted-foreground print:text-xs">
        {role.company}, {role.employment}
      </p>
      {role.bullets.length > 0 && (
        <ul className="mt-2 max-w-prose list-disc space-y-1 pl-5 print:mt-1 print:max-w-none print:space-y-0 print:text-xs">
          {role.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function ResumePage() {
  return (
    <div className="bg-background/70 print:bg-transparent">
      <article className="page-width py-10 sm:py-14 print:max-w-none print:p-0">
        <header className="flex flex-col-reverse gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[clamp(2.5rem,6vw,4rem)] leading-none font-semibold print:text-3xl">
              {site.name}
            </h1>
            <p className="mt-3 text-lg font-medium print:mt-1 print:text-sm">{resume.headline}</p>
            <p className="mt-2 text-muted-foreground print:mt-1 print:text-xs">
              {site.location} ({site.timezone})
            </p>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm print:mt-1 print:text-xs">
              <a
                className="text-link"
                href={site.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                className="text-link"
                href={site.links.upwork}
                target="_blank"
                rel="noopener noreferrer"
              >
                Upwork profile
              </a>
            </p>
            <div className="mt-6 flex flex-wrap gap-3 print:hidden">
              <Button asChild size="lg" variant="outline">
                <a href={site.cvPath} download>
                  Download PDF
                </a>
              </Button>
              <PrimaryCta />
            </div>
          </div>
          <figure className="drawing-frame w-32 shrink-0 overflow-hidden bg-secondary sm:w-40 print:hidden">
            <Image
              src="/images/ronil-estojero.webp"
              alt="Ronil Estojero in a dark blazer"
              width={700}
              height={960}
              sizes="160px"
              className="block h-auto w-full"
            />
          </figure>
        </header>

        <Block title="Summary">
          <p className="max-w-prose text-lg print:max-w-none print:text-xs">{resume.summary}</p>
        </Block>

        <Block title="Experience">
          <ol className="space-y-6 print:space-y-2">
            {resume.roles.map((role) => (
              <RoleEntry key={`${role.company}-${role.start}`} role={role} />
            ))}
          </ol>
        </Block>

        <Block title="Engineering background">
          <ol className="space-y-6 print:space-y-2">
            {resume.engineering.map((role) => (
              <RoleEntry key={`${role.company}-${role.start}`} role={role} />
            ))}
          </ol>
        </Block>

        <Block title="Education and certifications">
          <ul className="space-y-4 print:space-y-1">
            {resume.education.map((item) => (
              <li key={item.title} className="print:break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-semibold print:text-xs">{item.title}</h3>
                  <p className="drawing-label print:text-[10px]">{item.dates}</p>
                </div>
                <p className="text-sm text-muted-foreground print:text-xs">
                  {item.school}
                  {item.note ? `. ${item.note}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Tools">
          <dl className="space-y-2 print:space-y-0.5 print:text-xs">
            {tools.map((tool) => (
              <div key={tool.group}>
                <dt className="inline font-semibold">{tool.group}: </dt>
                <dd className="inline text-muted-foreground">{tool.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </Block>

        <Block title="Languages">
          <p className="print:text-xs">{resume.languages.join(", ")}</p>
        </Block>

        <Block title="References">
          <p className="print:text-xs">{resume.references}</p>
        </Block>
      </article>
    </div>
  );
}
