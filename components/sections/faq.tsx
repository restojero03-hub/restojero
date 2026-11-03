import { ChevronDown } from "lucide-react";
import { Section } from "@/components/blueprint/section";
import { faq } from "@/content/faq";

// Native details needs no JavaScript, which keeps the home page fast on phones.
export function Faq() {
  return (
    <Section id="faq" title="Common questions">
      <div className="divide-y border-y">
        {faq.map((item) => (
          <details key={item.question} name="faq" className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold [&::-webkit-details-marker]:hidden">
              {item.question}
              <ChevronDown className="size-4 shrink-0 group-open:rotate-180" aria-hidden />
            </summary>
            <p className="max-w-prose pb-4 text-muted-foreground">{item.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
