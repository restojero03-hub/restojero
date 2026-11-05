import Image from "next/image";
import { ContactForm } from "@/components/contact/contact-form";
import { BookCallButton } from "@/components/site/book-call-button";
import { SectionHeading } from "@/components/site/section-heading";
import { SocialLinks } from "@/components/site/social-links";
import { isContactConfigured } from "@/lib/contact/send";
import type { SiteContent } from "@/lib/content/schema";

export function Contact({ contact, site }: { contact: SiteContent["contact"]; site: SiteContent["site"] }) {
  return (
    <section id="contacts" aria-labelledby="contacts-heading" className="site-section">
      <div className="page-width">
        <SectionHeading id="contacts-heading" eyebrow={contact.eyebrow} title={contact.title} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="neu-card min-w-0 lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-secondary">
              <Image
                src={contact.photo.src}
                alt={contact.photo.alt}
                fill
                sizes="(min-width: 1024px) 440px, calc(100vw - 64px)"
                className="object-cover object-top"
              />
            </div>
            <h3 className="mt-6 text-2xl font-bold">{site.name}</h3>
            <p className="mt-1">{contact.role}</p>
            <p className="mt-4">{contact.intro}</p>
            <div className="mt-6">
              <BookCallButton calUrl={site.calUrl} className="btn btn-solid w-full" />
            </div>
            <p className="meta-label mt-8">Find with me</p>
            <SocialLinks links={site.socialLinks} />
          </div>

          <div className="neu-card min-w-0 lg:col-span-7">
            {isContactConfigured() ? (
              <ContactForm note={contact.formNote} />
            ) : (
              <div data-testid="contact-fallback" className="flex h-full flex-col justify-center">
                <h3 className="text-2xl font-bold">Prefer to write?</h3>
                <p className="mt-3 max-w-prose text-lg">
                  The fastest way to reach me right now is a message on LinkedIn or Upwork.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
