import { Section } from "@/components/blueprint/section";
import { services } from "@/content/services";

export function Services() {
  return (
    <Section
      id="services"
      title="What I build for you"
      intro="One person who can take a product from idea to paying customers, and handle the marketing that gets them there."
    >
      <ul className="divide-y border-y">
        {services.map((service) => (
          <li key={service.title} className="grid grid-cols-1 gap-2 py-5 md:grid-cols-5 md:gap-6">
            <h3 className="text-xl leading-snug font-semibold md:col-span-2">{service.title}</h3>
            <div className="md:col-span-3">
              <p className="text-muted-foreground">{service.body}</p>
              <p className="mt-2 font-medium">{service.result}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
