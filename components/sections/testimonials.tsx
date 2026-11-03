import { Section } from "@/components/blueprint/section";
import { testimonials } from "@/content/testimonials";

// Hidden until real reviews are added to content/testimonials.ts.
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <Section id="testimonials" title="What clients say">
      <ul className="space-y-8">
        {testimonials.map((item) => (
          <li key={item.name}>
            <blockquote className="text-lg">{item.quote}</blockquote>
            <p className="mt-2 text-sm text-muted-foreground">
              {item.name}, {item.role}. {item.source}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
