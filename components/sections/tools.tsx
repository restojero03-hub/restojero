import { Section } from "@/components/blueprint/section";
import { tools } from "@/content/tools";

export function Tools() {
  return (
    <Section id="tools" title="Tools I work with">
      <dl className="divide-y border-y">
        {tools.map((tool) => (
          <div key={tool.group} className="grid grid-cols-1 gap-1 py-3 md:grid-cols-3 md:gap-6">
            <dt className="font-semibold [font-stretch:90%]">{tool.group}</dt>
            <dd className="text-muted-foreground md:col-span-2">{tool.items.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
