import {
  ChartColumn,
  Code,
  Funnel,
  Mail,
  Megaphone,
  PenLine,
  Plug,
  Rocket,
  Search,
  ShoppingCart,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { shown } from "@/lib/content/list";
import { SectionHeading } from "@/components/site/section-heading";
import type { ServiceIcon, SiteContent } from "@/lib/content/schema";

const icons: Record<ServiceIcon, LucideIcon> = {
  code: Code,
  rocket: Rocket,
  sparkles: Sparkles,
  funnel: Funnel,
  megaphone: Megaphone,
  mail: Mail,
  cart: ShoppingCart,
  search: Search,
  plug: Plug,
  chart: ChartColumn,
  pen: PenLine,
  users: Users,
};

export function Services({ services }: { services: SiteContent["services"] }) {
  return (
    <section id="services" aria-labelledby="services-heading" className="site-section">
      <div className="page-width">
        <SectionHeading id="services-heading" eyebrow={services.eyebrow} title={services.title} />
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {shown(services.items).map((service) => {
            const Icon = icons[service.icon];
            return (
              <li key={service.title} className="neu-card hover:-translate-y-1">
                <Icon className="size-11 stroke-[1.5] text-pink" aria-hidden />
                <h3 className="mt-6 text-2xl leading-snug font-medium">{service.title}</h3>
                <p className="mt-3">{service.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
