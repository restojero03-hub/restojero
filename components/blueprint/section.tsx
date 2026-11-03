import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  title: string;
  intro?: string;
  children: ReactNode;
};

// Heading in the left notes column, content in the wide right column.
export function Section({ id, title, intro, children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-6 border-t bg-background/70">
      <div className="page-width grid grid-cols-1 gap-8 py-14 sm:py-20 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <h2 id={headingId} className="text-3xl leading-[1.08] font-semibold sm:text-4xl">
            {title}
          </h2>
          {intro && <p className="mt-4 max-w-prose text-muted-foreground">{intro}</p>}
        </div>
        <div className="min-w-0 lg:col-span-8">{children}</div>
      </div>
    </section>
  );
}
