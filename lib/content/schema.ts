import { z } from "zod";
import { serviceIcons, socialIcons } from "@/lib/content/sections";

// The shape of everything the site shows. The dashboard edits this document, and
// every save is checked against this schema, so bad data can't reach the page.

const webUrl = z.url({ protocol: /^https?$/ });
const text = z.string().trim().min(1);
// Only files in this site or uploads to its image store, because next/image refuses other hosts
// and one bad link would break the whole page.
const imageSrc = z
  .string()
  .regex(/^(\/(?!\/)|https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/)/, "Upload the image from the dashboard");
const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Use YYYY-MM");

const image = z.object({ src: imageSrc, alt: text });

export const CONTENT_ID = "main";

export { serviceIcons, socialIcons };

// Older saved content has no show or hide setting on these, so it defaults to showing.
const visible = z.boolean().default(true);

const socialLink = z.object({ label: text, url: webUrl, icon: z.enum(socialIcons), visible });

const tool = z.object({
  name: text,
  // null shows the tool's initials until a logo is uploaded.
  icon: imageSrc.nullable(),
  // For black logos that would disappear on the dark background.
  invertInDark: z.boolean(),
  visible,
});

const service = z.object({ title: text, body: text, icon: z.enum(serviceIcons), visible });

const project = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase words joined by hyphens"),
  title: text,
  tags: z.array(text),
  cover: image,
  gallery: z.array(image),
  facts: z.array(z.object({ label: text, value: text })),
  body: z.array(text),
  results: z.array(text),
  link: z.object({ label: text, url: webUrl }).nullable(),
  visible: z.boolean(),
});

const role = z.object({
  company: text,
  title: text,
  employment: text,
  // Short badge such as PH, AU or US. null shows no badge.
  country: z.string().trim().max(8).nullable(),
  start: yearMonth,
  // null means the role is current.
  end: yearMonth.nullable(),
  bullets: z.array(text),
  visible,
});

const education = z.object({
  title: text,
  school: text,
  dates: text,
  note: z.string().trim().nullable(),
  visible,
});

const skillGroup = z.object({ name: text, skills: z.array(text), visible });

const sectionBase = z.object({ visible: z.boolean(), eyebrow: text, title: text });

export const siteContentSchema = z.object({
  site: z.object({
    name: text,
    nickname: text,
    logoText: text,
    metaTitle: text,
    metaDescription: text,
    location: text,
    timezone: text,
    // Your Cal.com link. null hides booking and points those buttons at the contact section.
    calUrl: webUrl.nullable(),
    // Only the CV PDF uses this. It never appears on a web page.
    cvEmail: z.email(),
    socialLinks: z.array(socialLink),
  }),
  hero: z.object({
    visible: z.boolean(),
    eyebrow: text,
    titles: z.array(text).min(1),
    intro: text,
    photo: image,
    socialLabel: text,
    toolsLabel: text,
    tools: z.array(tool),
  }),
  about: sectionBase.extend({
    paragraphs: z.array(text).min(1),
    videoId: z.string().regex(/^[\w-]{6,20}$/, "Use the ID from the YouTube link").nullable(),
  }),
  services: sectionBase.extend({ items: z.array(service) }),
  portfolio: sectionBase.extend({
    initialCount: z.number().int().min(1).max(30),
    items: z.array(project).superRefine((items, context) => {
      // The link is how a project is found, so two can't share one.
      const seen = new Set<string>();
      items.forEach((item, index) => {
        if (seen.has(item.slug)) {
          context.addIssue({ code: "custom", message: "Another project already uses this link", path: [index, "slug"] });
        }
        seen.add(item.slug);
      });
    }),
  }),
  resume: sectionBase.extend({
    // The headline and summary at the top of the CV PDF.
    headline: text,
    summary: text,
    roles: z.array(role),
    engineering: z.array(role),
    education: z.array(education),
    skillGroups: z.array(skillGroup),
    languages: z.array(text),
    references: text,
  }),
  contact: sectionBase.extend({
    photo: image,
    role: text,
    intro: text,
    formNote: text,
  }),
});

export type SiteContent = z.infer<typeof siteContentSchema>;
export type SiteContentInput = z.input<typeof siteContentSchema>;
export type SocialIcon = (typeof socialIcons)[number];
export type ServiceIcon = (typeof serviceIcons)[number];
export type Tool = z.infer<typeof tool>;
export type Service = z.infer<typeof service>;
export type Project = z.infer<typeof project>;
export type Role = z.infer<typeof role>;
export type Education = z.infer<typeof education>;
export type SkillGroup = z.infer<typeof skillGroup>;
