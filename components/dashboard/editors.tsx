"use client";

import {
  IconField,
  ImageField,
  LinesField,
  ListEditor,
  OptionalTextField,
  ParagraphsField,
  SelectField,
  TextArea,
  TextField,
  Toggle,
} from "@/components/dashboard/fields";
import { SectionForm } from "@/components/dashboard/section-form";
import type { Project, Role, SiteContent } from "@/lib/content/schema";
import { serviceIcons, socialIcons } from "@/lib/content/sections";

type VisibleHeading = { visible: boolean; eyebrow: string; title: string };

function HeadingFields<T extends VisibleHeading>({ draft, update }: { draft: T; update: (patch: Partial<T>) => void }) {
  return (
    <>
      <Toggle
        label="Show this section on the site"
        checked={draft.visible}
        onChange={(visible) => update({ visible } as Partial<T>)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Small heading"
          value={draft.eyebrow}
          onChange={(eyebrow) => update({ eyebrow } as Partial<T>)}
        />
        <TextField label="Main heading" value={draft.title} onChange={(title) => update({ title } as Partial<T>)} />
      </div>
    </>
  );
}

export function SiteEditor({ initial }: { initial: SiteContent["site"] }) {
  return (
    <SectionForm section="site" initial={initial}>
      {(draft, update) => (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Full name" value={draft.name} onChange={(name) => update({ name })} />
            <TextField label="Nickname" value={draft.nickname} onChange={(nickname) => update({ nickname })} />
            <TextField label="Logo text" value={draft.logoText} onChange={(logoText) => update({ logoText })} />
            <TextField label="Location" value={draft.location} onChange={(location) => update({ location })} />
            <TextField label="Time zone" value={draft.timezone} onChange={(timezone) => update({ timezone })} />
            <OptionalTextField
              label="Calendar link"
              hint="Your Cal.com link. Leave it empty to point booking buttons at the contact section."
              type="url"
              value={draft.calUrl}
              onChange={(calUrl) => update({ calUrl })}
            />
            <TextField
              label="Email on the CV"
              hint="Only the CV PDF shows this. It never appears on a web page."
              type="email"
              value={draft.cvEmail}
              onChange={(cvEmail) => update({ cvEmail })}
            />
          </div>
          <TextField
            label="Title in search results"
            value={draft.metaTitle}
            onChange={(metaTitle) => update({ metaTitle })}
          />
          <TextArea
            label="Description in search results"
            rows={3}
            value={draft.metaDescription}
            onChange={(metaDescription) => update({ metaDescription })}
          />
          <ListEditor
            label="Social links"
            items={draft.socialLinks}
            onChange={(socialLinks) => update({ socialLinks })}
            newItem={() => ({ label: "", url: "", icon: "website" as const, visible: true })}
            addLabel="Add a link"
            itemTitle={(link) => link.label}
            renderItem={(link, change) => (
              <>
                <Toggle
                  label="Show on the site"
                  checked={link.visible}
                  onChange={(visible) => change({ ...link, visible })}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="Name" value={link.label} onChange={(label) => change({ ...link, label })} />
                  <SelectField
                    label="Icon"
                    value={link.icon}
                    options={socialIcons}
                    onChange={(icon) => change({ ...link, icon })}
                  />
                </div>
                <TextField label="Link" type="url" value={link.url} onChange={(url) => change({ ...link, url })} />
              </>
            )}
          />
        </>
      )}
    </SectionForm>
  );
}

export function HeroEditor({ initial }: { initial: SiteContent["hero"] }) {
  return (
    <SectionForm section="hero" initial={initial}>
      {(draft, update) => (
        <>
          <Toggle
            label="Show this section on the site"
            checked={draft.visible}
            onChange={(visible) => update({ visible })}
          />
          <TextField label="Small heading" value={draft.eyebrow} onChange={(eyebrow) => update({ eyebrow })} />
          <LinesField
            label="Typed titles"
            hint="One per line. The site adds 'a' or 'an' in front."
            rows={4}
            value={draft.titles}
            onChange={(titles) => update({ titles })}
          />
          <TextArea label="Introduction" value={draft.intro} onChange={(intro) => update({ intro })} />
          <ImageField label="Photo" value={draft.photo} onChange={(photo) => update({ photo })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Label above social links"
              value={draft.socialLabel}
              onChange={(socialLabel) => update({ socialLabel })}
            />
            <TextField
              label="Label above tools"
              value={draft.toolsLabel}
              onChange={(toolsLabel) => update({ toolsLabel })}
            />
          </div>
          <ListEditor
            label="Tools"
            items={draft.tools}
            onChange={(tools) => update({ tools })}
            newItem={() => ({ name: "", icon: null, invertInDark: false, visible: true })}
            addLabel="Add a tool"
            itemTitle={(tool) => tool.name}
            renderItem={(tool, change) => (
              <>
                <Toggle
                  label="Show on the site"
                  checked={tool.visible}
                  onChange={(visible) => change({ ...tool, visible })}
                />
                <TextField label="Name" value={tool.name} onChange={(name) => change({ ...tool, name })} />
                <IconField label="Logo" value={tool.icon} onChange={(icon) => change({ ...tool, icon })} />
                <Toggle
                  label="Logo is black, so turn it white in dark mode"
                  checked={tool.invertInDark}
                  onChange={(invertInDark) => change({ ...tool, invertInDark })}
                />
              </>
            )}
          />
        </>
      )}
    </SectionForm>
  );
}

export function AboutEditor({ initial }: { initial: SiteContent["about"] }) {
  return (
    <SectionForm section="about" initial={initial}>
      {(draft, update) => (
        <>
          <HeadingFields draft={draft} update={update} />
          <ParagraphsField
            label="Paragraphs"
            value={draft.paragraphs}
            onChange={(paragraphs) => update({ paragraphs })}
          />
          <OptionalTextField
            label="YouTube video ID"
            hint="The part after v= in the link. Leave it empty to show no video."
            value={draft.videoId}
            onChange={(videoId) => update({ videoId })}
          />
        </>
      )}
    </SectionForm>
  );
}

export function ServicesEditor({ initial }: { initial: SiteContent["services"] }) {
  return (
    <SectionForm section="services" initial={initial}>
      {(draft, update) => (
        <>
          <HeadingFields draft={draft} update={update} />
          <ListEditor
            label="Services"
            items={draft.items}
            onChange={(items) => update({ items })}
            newItem={() => ({ title: "", body: "", icon: "code" as const, visible: true })}
            addLabel="Add a service"
            itemTitle={(service) => service.title}
            renderItem={(service, change) => (
              <>
                <Toggle
                  label="Show on the site"
                  checked={service.visible}
                  onChange={(visible) => change({ ...service, visible })}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="Title" value={service.title} onChange={(title) => change({ ...service, title })} />
                  <SelectField
                    label="Icon"
                    value={service.icon}
                    options={serviceIcons}
                    onChange={(icon) => change({ ...service, icon })}
                  />
                </div>
                <TextArea label="Description" value={service.body} onChange={(body) => change({ ...service, body })} />
              </>
            )}
          />
        </>
      )}
    </SectionForm>
  );
}

function newProject(): Project {
  return {
    slug: `new-project-${Date.now()}`,
    title: "",
    tags: [],
    cover: { src: "", alt: "" },
    gallery: [],
    facts: [],
    body: [],
    results: [],
    link: null,
    visible: true,
  };
}

function ProjectFields({ project, change }: { project: Project; change: (next: Project) => void }) {
  const link = project.link ?? { label: "", url: "" };
  const changeLink = (next: { label: string; url: string }) =>
    change({ ...project, link: next.label === "" && next.url === "" ? null : next });

  return (
    <>
      <Toggle
        label="Show on the site"
        checked={project.visible}
        onChange={(visible) => change({ ...project, visible })}
      />
      <TextField label="Title" value={project.title} onChange={(title) => change({ ...project, title })} />
      <TextField
        label="Share link name"
        hint="Lowercase words joined by hyphens. It becomes /#project-name."
        value={project.slug}
        onChange={(slug) => change({ ...project, slug })}
      />
      <LinesField label="Tags" rows={3} value={project.tags} onChange={(tags) => change({ ...project, tags })} />
      <ImageField label="Cover image" value={project.cover} onChange={(cover) => change({ ...project, cover })} />
      <ListEditor
        label="Large images below the description"
        items={project.gallery}
        onChange={(gallery) => change({ ...project, gallery })}
        newItem={() => ({ src: "", alt: "" })}
        addLabel="Add an image"
        itemTitle={(image) => image.alt}
        renderItem={(image, update) => <ImageField label="Image" value={image} onChange={update} />}
      />
      <ListEditor
        label="Facts"
        items={project.facts}
        onChange={(facts) => change({ ...project, facts })}
        newItem={() => ({ label: "", value: "" })}
        addLabel="Add a fact"
        itemTitle={(fact) => fact.label}
        renderItem={(fact, update) => (
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Label" value={fact.label} onChange={(label) => update({ ...fact, label })} />
            <TextField label="Value" value={fact.value} onChange={(value) => update({ ...fact, value })} />
          </div>
        )}
      />
      <ParagraphsField label="Description" value={project.body} onChange={(body) => change({ ...project, body })} />
      <LinesField label="Results" value={project.results} onChange={(results) => change({ ...project, results })} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Button text"
          hint="Leave both empty to show no button."
          value={link.label}
          onChange={(label) => changeLink({ ...link, label })}
        />
        <TextField label="Button link" type="url" value={link.url} onChange={(url) => changeLink({ ...link, url })} />
      </div>
    </>
  );
}

export function PortfolioEditor({ initial }: { initial: SiteContent["portfolio"] }) {
  return (
    <SectionForm section="portfolio" initial={initial}>
      {(draft, update) => (
        <>
          <HeadingFields draft={draft} update={update} />
          <TextField
            label="Projects shown before Load more"
            type="number"
            value={String(draft.initialCount)}
            onChange={(value) => update({ initialCount: Number(value) })}
          />
          <ListEditor
            label="Projects"
            items={draft.items}
            onChange={(items) => update({ items })}
            newItem={newProject}
            addLabel="Add a project"
            itemTitle={(project) => project.title}
            renderItem={(project, change) => <ProjectFields project={project} change={change} />}
          />
        </>
      )}
    </SectionForm>
  );
}

function newRole(): Role {
  return { company: "", title: "", employment: "", country: null, start: "", end: null, bullets: [], visible: true };
}

function RolesField({ label, value, onChange }: { label: string; value: Role[]; onChange: (value: Role[]) => void }) {
  return (
    <ListEditor
      label={label}
      items={value}
      onChange={onChange}
      newItem={newRole}
      addLabel="Add a job"
      itemTitle={(role) => [role.title, role.company].filter(Boolean).join(", ")}
      renderItem={(role, change) => (
        <>
          <Toggle
            label="Show on the site and CV"
            checked={role.visible}
            onChange={(visible) => change({ ...role, visible })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Job title" value={role.title} onChange={(title) => change({ ...role, title })} />
            <TextField label="Company" value={role.company} onChange={(company) => change({ ...role, company })} />
            <TextField
              label="Type of work"
              hint="For example Freelance or Full-time."
              value={role.employment}
              onChange={(employment) => change({ ...role, employment })}
            />
            <OptionalTextField
              label="Country badge"
              hint="Short, such as PH or AU. Leave empty for no badge."
              value={role.country}
              onChange={(country) => change({ ...role, country })}
            />
            <TextField
              label="Started"
              hint="Year and month, such as 2025-06."
              type="month"
              value={role.start}
              onChange={(start) => change({ ...role, start })}
            />
            <OptionalTextField
              label="Ended"
              hint="Leave empty if this is your current job."
              type="month"
              value={role.end}
              onChange={(end) => change({ ...role, end })}
            />
          </div>
          <LinesField
            label="What you did"
            value={role.bullets}
            onChange={(bullets) => change({ ...role, bullets })}
          />
        </>
      )}
    />
  );
}

export function ResumeEditor({ initial }: { initial: SiteContent["resume"] }) {
  return (
    <SectionForm section="resume" initial={initial}>
      {(draft, update) => (
        <>
          <HeadingFields draft={draft} update={update} />
          <TextField
            label="Headline on the CV"
            value={draft.headline}
            onChange={(headline) => update({ headline })}
          />
          <TextArea label="Summary on the CV" value={draft.summary} onChange={(summary) => update({ summary })} />
          <RolesField label="Experience" value={draft.roles} onChange={(roles) => update({ roles })} />
          <RolesField
            label="Engineering experience"
            value={draft.engineering}
            onChange={(engineering) => update({ engineering })}
          />
          <ListEditor
            label="Education"
            items={draft.education}
            onChange={(education) => update({ education })}
            newItem={() => ({ title: "", school: "", dates: "", note: null, visible: true })}
            addLabel="Add education"
            itemTitle={(item) => item.title}
            renderItem={(item, change) => (
              <>
                <Toggle
                  label="Show on the site and CV"
                  checked={item.visible}
                  onChange={(visible) => change({ ...item, visible })}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="Title" value={item.title} onChange={(title) => change({ ...item, title })} />
                  <TextField label="School" value={item.school} onChange={(school) => change({ ...item, school })} />
                  <TextField label="Dates" value={item.dates} onChange={(dates) => change({ ...item, dates })} />
                  <OptionalTextField
                    label="Note"
                    value={item.note}
                    onChange={(note) => change({ ...item, note })}
                  />
                </div>
              </>
            )}
          />
          <ListEditor
            label="Skill groups"
            items={draft.skillGroups}
            onChange={(skillGroups) => update({ skillGroups })}
            newItem={() => ({ name: "", skills: [], visible: true })}
            addLabel="Add a skill group"
            itemTitle={(group) => group.name}
            renderItem={(group, change) => (
              <>
                <Toggle
                  label="Show on the site and CV"
                  checked={group.visible}
                  onChange={(visible) => change({ ...group, visible })}
                />
                <TextField label="Group name" value={group.name} onChange={(name) => change({ ...group, name })} />
                <LinesField
                  label="Skills"
                  rows={8}
                  value={group.skills}
                  onChange={(skills) => change({ ...group, skills })}
                />
              </>
            )}
          />
          <LinesField
            label="Languages on the CV"
            rows={3}
            value={draft.languages}
            onChange={(languages) => update({ languages })}
          />
          <TextField
            label="References line on the CV"
            value={draft.references}
            onChange={(references) => update({ references })}
          />
        </>
      )}
    </SectionForm>
  );
}

export function ContactEditor({ initial }: { initial: SiteContent["contact"] }) {
  return (
    <SectionForm section="contact" initial={initial}>
      {(draft, update) => (
        <>
          <HeadingFields draft={draft} update={update} />
          <ImageField label="Photo" value={draft.photo} onChange={(photo) => update({ photo })} />
          <TextField label="Your role" value={draft.role} onChange={(role) => update({ role })} />
          <TextArea label="Introduction" value={draft.intro} onChange={(intro) => update({ intro })} />
          <TextArea
            label="Note under the form"
            rows={2}
            value={draft.formNote}
            onChange={(formNote) => update({ formNote })}
          />
        </>
      )}
    </SectionForm>
  );
}
