import { FlowLine } from "@/components/diagrams/flow-line";
import { process as steps } from "@/content/process";

export function HowIWork() {
  return (
    <section aria-labelledby="process-heading" className="border-t bg-background/70">
      <div className="page-width py-14 sm:py-20">
        <h2 id="process-heading" className="text-3xl leading-[1.08] font-semibold sm:text-4xl">
          How I work
        </h2>
        <FlowLine className="mt-10" steps={steps} />
      </div>
    </section>
  );
}
