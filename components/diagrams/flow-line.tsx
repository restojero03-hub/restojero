import { cn } from "@/lib/utils";

export type FlowStep = { title: string; body?: string };

type FlowLineProps = {
  steps: FlowStep[];
  // Accessible name for the list.
  label?: string;
  // Stay vertical at every width, for steps with longer text.
  vertical?: boolean;
  className?: string;
};

// A single-line diagram: numbered nodes on one continuous line. It's a real
// sequence, so the numbers carry meaning. Vertical on phones, horizontal above.
export function FlowLine({ steps, label, vertical, className }: FlowLineProps) {
  return (
    <ol
      aria-label={label}
      className={cn(
        "grid gap-0",
        !vertical && "md:grid-flow-col md:auto-cols-fr",
        className,
      )}
    >
      {steps.map((step, index) => (
        <li
          key={step.title}
          className={cn("relative flex gap-3 pb-6 last:pb-0", !vertical && "md:block md:pb-0 md:pr-4")}
        >
          {/* Connector to the next node */}
          {index < steps.length - 1 && (
            <span
              aria-hidden
              className={cn(
                "absolute top-6 bottom-0 left-3 w-px bg-(--dimension)",
                !vertical && "md:top-3 md:right-0 md:bottom-auto md:left-6 md:h-px md:w-auto",
              )}
            />
          )}
          <span className="balloon relative">{index + 1}</span>
          <div className={cn("min-w-0 pt-0.5", !vertical && "md:mt-3 md:pt-0")}>
            <p className="font-semibold [font-stretch:90%]">{step.title}</p>
            {step.body && <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
