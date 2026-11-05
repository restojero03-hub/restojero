"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { shown } from "@/lib/content/list";
import { SectionHeading } from "@/components/site/section-heading";
import { formatRange } from "@/lib/format";
import type { Role, SiteContent } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Professional Skills" },
] as const;

function TimelineItem({
  title,
  subtitle,
  badge,
  children,
}: {
  title: string;
  subtitle: string;
  badge?: string | null;
  children?: React.ReactNode;
}) {
  return (
    <li className="relative pl-8">
      <span aria-hidden className="absolute top-0 bottom-[-2rem] left-[7px] w-[3px] bg-border last:hidden" />
      <span aria-hidden className="absolute top-9 left-0 size-[17px] rounded-full border-[3px] border-border bg-background" />
      <div className="neu-card">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h4 className="text-lg leading-snug font-semibold [overflow-wrap:anywhere] sm:text-xl">{title.replaceAll("/", "/\u200B")}</h4>
            <p className="mt-1 text-sm">{subtitle}</p>
          </div>
          {badge && (
            <span className="neu shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold text-pink-text">{badge}</span>
          )}
        </div>
        {children}
      </div>
    </li>
  );
}

function RoleItem({ role }: { role: Role }) {
  return (
    <TimelineItem
      title={role.title}
      subtitle={`${role.company}, ${formatRange(role.start, role.end)}`}
      badge={role.country}
    >
      {role.bullets.length > 0 && (
        <ul className="mt-4 list-disc space-y-1.5 border-t pt-4 pl-5">
          {role.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      )}
    </TimelineItem>
  );
}

export function Resume({ resume }: { resume: SiteContent["resume"] }) {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("experience");
  const tabRefs = useRef<Partial<Record<string, HTMLButtonElement | null>>>({});

  function onTabKeyDown(event: KeyboardEvent) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const index = tabs.findIndex((tab) => tab.id === active);
    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = tabs[(index + step + tabs.length) % tabs.length].id;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section id="resume" aria-labelledby="resume-heading" className="site-section">
      <div className="page-width">
        <SectionHeading id="resume-heading" eyebrow={resume.eyebrow} title={resume.title} />

        <div role="tablist" aria-label="Resume" className="grid grid-cols-1 gap-3 sm:grid-cols-3" onKeyDown={onTabKeyDown}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[tab.id] = element;
              }}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={active === tab.id}
              aria-controls={`panel-${tab.id}`}
              tabIndex={active === tab.id ? 0 : -1}
              onClick={() => setActive(tab.id)}
              className={cn(
                "min-h-14 cursor-pointer rounded-[10px] px-4 py-3 font-medium transition-colors",
                active === tab.id ? "neu text-pink-text" : "text-title hover:text-pink-text",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-12">
          <div role="tabpanel" id="panel-experience" aria-labelledby="tab-experience" hidden={active !== "experience"}>
            <h3 className="mb-8 text-3xl font-bold">Job Experience</h3>
            <ol className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {shown([...resume.roles, ...resume.engineering]).map((role) => (
                <RoleItem key={`${role.company}-${role.start}`} role={role} />
              ))}
            </ol>
          </div>

          <div role="tabpanel" id="panel-education" aria-labelledby="tab-education" hidden={active !== "education"}>
            <h3 className="mb-8 text-3xl font-bold">Education</h3>
            <ol className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {shown(resume.education).map((item) => (
                <TimelineItem key={item.title} title={item.title} subtitle={`${item.school}, ${item.dates}`}>
                  {item.note && <p className="mt-4 border-t pt-4">{item.note}</p>}
                </TimelineItem>
              ))}
            </ol>
          </div>

          <div role="tabpanel" id="panel-skills" aria-labelledby="tab-skills" hidden={active !== "skills"}>
            <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-2">
              {shown(resume.skillGroups).map((group) => (
                <div key={group.name}>
                  <h3 className="text-3xl font-bold">{group.name}</h3>
                  <ul className="mt-6 flex flex-wrap gap-3">
                    {group.skills.map((skill) => (
                      <li key={skill} className="skill-tag">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
