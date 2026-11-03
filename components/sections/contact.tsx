import { ContactForm } from "@/components/contact/contact-form";
import { PrimaryCta } from "@/components/cta-link";
import { site } from "@/content/site";
import { isContactConfigured } from "@/lib/contact/send";

// Used on the home page and case studies (as h2) and on /contact (as h1).
export function Contact({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const Heading = headingLevel;
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-6 bg-(--blueprint) text-(--blueprint-ink) print:hidden"
      style={{
        backgroundImage:
          "linear-gradient(var(--blueprint-grid) 1px, transparent 1px), linear-gradient(90deg, var(--blueprint-grid) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="page-width grid grid-cols-1 gap-10 py-16 sm:py-24 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-6">
          <Heading
            id="contact-heading"
            className="text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] font-semibold"
          >
            {site.closing}
          </Heading>
          <p className="mt-5 max-w-md text-lg text-(--blueprint-soft)">
            Tell me what you&apos;re building. I work from {site.location} ({site.timezone}), with
            clients overseas.
          </p>
          {site.calUrl && (
            <div className="mt-7">
              <PrimaryCta className="bg-white text-[#10233f] hover:bg-white/90" />
            </div>
          )}
          <p className="mt-7 flex flex-wrap gap-x-5 gap-y-1">
            <a
              className="font-medium underline decoration-1 underline-offset-4 hover:decoration-2"
              href={site.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="font-medium underline decoration-1 underline-offset-4 hover:decoration-2"
              href={site.links.upwork}
              target="_blank"
              rel="noopener noreferrer"
            >
              Upwork profile
            </a>
          </p>
        </div>

        {isContactConfigured() ? (
          <div className="min-w-0 rounded-sm bg-card p-5 text-card-foreground sm:p-7 lg:col-span-6">
            <ContactForm />
          </div>
        ) : (
          <div className="min-w-0 lg:col-span-6" data-testid="contact-fallback">
            <p className="max-w-md text-lg">
              The fastest way to reach me right now is a message on LinkedIn or Upwork.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
