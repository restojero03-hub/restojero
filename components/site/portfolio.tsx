"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { SectionHeading } from "@/components/site/section-heading";
import type { Project, SiteContent } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

// The open project lives in the URL, so a pop-up has its own share link
// and the back button closes it.
const HASH_PREFIX = "#project-";

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
}

function clearHash() {
  history.pushState(null, "", window.location.pathname + window.location.search);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

const COVER_SIZES = "(min-width: 1204px) 534px, (min-width: 1024px) calc(50vw - 68px), calc(100vw - 64px)";
const LARGE_SIZES = "(min-width: 1204px) 1100px, (min-width: 640px) calc(100vw - 104px), calc(100vw - 64px)";

// A large image in the description. It's held at its real shape so the page doesn't jump as it
// loads, and small images are never stretched past their real width. Opening one in a new tab
// shows the original, which helps most on a phone.
function LargeImage({ image }: { image: Project["gallery"][number] }) {
  return (
    <a
      href={image.src}
      target="_blank"
      rel="noopener noreferrer"
      style={{ maxWidth: image.width }}
      className="mx-auto block cursor-zoom-in overflow-hidden rounded-[10px] bg-secondary"
    >
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width ?? 1200}
        height={image.height ?? 675}
        sizes={LARGE_SIZES}
        className="block h-auto w-full"
      />
      <span className="sr-only">Opens full size in a new tab.</span>
    </a>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  return (
    <div className="p-5 sm:p-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/3] min-w-0 overflow-hidden rounded-[10px] bg-secondary">
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            loading="eager"
            sizes={COVER_SIZES}
            className="object-contain"
          />
        </div>

        <div className="min-w-0">
          <p className="tag">{project.tags.join(" | ")}</p>
          <h3 className="mt-3 text-[clamp(1.5rem,2.4vw,1.875rem)] leading-tight font-bold text-pretty lg:pr-10">{project.title}</h3>

          <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {project.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-sm font-semibold text-title">{fact.label}</dt>
                <dd className="text-sm">{fact.value}</dd>
              </div>
            ))}
          </dl>

          {project.tools.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-semibold text-title">
                Tools
              </p>
              <ul aria-label="Tools" className="mt-2 flex flex-wrap gap-2">
                {project.tools.map((tool) => (
                  <li key={tool} className="tool-box">
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.link && (
            <a href={project.link.url} target="_blank" rel="noopener noreferrer" className="btn mt-7">
              {project.link.label}
            </a>
          )}
        </div>
      </div>

      {(project.body.length > 0 || project.results.length > 0) && (
        <div
          className={cn(
            "mt-8 grid grid-cols-1 gap-8 border-t border-(--line) pt-8",
            project.body.length > 0 && project.results.length > 0 && "lg:grid-cols-2",
          )}
        >
          {project.body.length > 0 && (
            <div className="min-w-0 space-y-3">
              {project.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          )}
          {project.results.length > 0 && (
            <div className="min-w-0">
              <h4 className="font-semibold">Results</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {project.results.map((result) => (
                  <li key={result}>{result}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {project.gallery.length > 0 && (
        <div className="mt-8 border-t border-(--line) pt-8">
          <p className="text-sm">Tap or click any image to open it full size.</p>
          <div className="mt-4 space-y-6">
            {project.gallery.map((image) => (
              <LargeImage key={image.src} image={image} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Portfolio({ portfolio }: { portfolio: SiteContent["portfolio"] }) {
  const projects = portfolio.items;
  const [visibleCount, setVisibleCount] = useState(portfolio.initialCount);
  const dialog = useRef<HTMLDialogElement>(null);
  const cards = useRef<HTMLUListElement>(null);
  const focusCard = useRef<number | null>(null);

  // Load more can disappear once everything shows, so focus moves on to the first new card.
  useEffect(() => {
    if (focusCard.current === null) return;
    cards.current?.querySelectorAll("button")[focusCard.current]?.focus();
    focusCard.current = null;
  }, [visibleCount]);

  const hash = useSyncExternalStore(
    subscribeToHash,
    () => window.location.hash,
    () => "",
  );
  const active = hash.startsWith(HASH_PREFIX)
    ? (projects.find((project) => project.slug === hash.slice(HASH_PREFIX.length)) ?? null)
    : null;

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (active && !element.open) element.showModal();
    // Pop-ups can be long, so the next one shouldn't open partway down.
    if (active) element.scrollTop = 0;
    if (!active && element.open) element.close();
  }, [active]);

  return (
    <section id="portfolio" aria-labelledby="portfolio-heading" className="site-section">
      <div className="page-width">
        <SectionHeading id="portfolio-heading" eyebrow={portfolio.eyebrow} title={portfolio.title} />

        <ul ref={cards} className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, visibleCount).map((project) => (
            <li key={project.slug}>
              <button
                type="button"
                data-project={project.slug}
                onClick={() => {
                  window.location.hash = `project-${project.slug}`;
                }}
                className="neu-card group flex size-full cursor-pointer flex-col justify-start text-left hover:-translate-y-1"
              >
                <span className="relative block aspect-[340/250] overflow-hidden rounded-[10px] bg-secondary">
                  <Image
                    src={project.cover.src}
                    alt={project.cover.alt}
                    fill
                    sizes="(min-width: 1024px) 340px, (min-width: 768px) 45vw, calc(100vw - 64px)"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </span>
                <span className="tag mt-5 block">{project.tags.join(" | ")}</span>
                <span className="mt-2 block font-heading text-xl leading-snug font-semibold text-title transition-colors group-hover:text-pink-text">
                  {project.title}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {visibleCount < projects.length && (
          <div className="mt-12 text-center">
            <button
              type="button"
              className="btn"
              onClick={() => {
                focusCard.current = visibleCount;
                setVisibleCount((count) => count + portfolio.initialCount);
              }}
            >
              Load more
            </button>
          </div>
        )}
      </div>

      <dialog
        ref={dialog}
        className="site-dialog"
        aria-label={active?.title ?? "Project"}
        onClose={() => {
          if (window.location.hash.startsWith(HASH_PREFIX)) clearHash();
        }}
        onClick={(event) => {
          if (event.target === dialog.current) clearHash();
        }}
      >
        {/* Takes up no height, and stays in view while a long project scrolls on a phone. */}
        <div className="sticky top-4 z-10 flex h-0 justify-end pr-4">
          <button
            type="button"
            aria-label="Close"
            onClick={clearHash}
            className="neu flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-pink-text"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        {active && <ProjectDetail key={active.slug} project={active} />}
      </dialog>
    </section>
  );
}
