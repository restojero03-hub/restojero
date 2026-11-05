"use client";

import { useEffect, useState, useTransition, type ReactNode } from "react";
import { saveSection, type SaveResult } from "@/lib/content/actions";
import { sectionLabels, type SectionKey } from "@/lib/content/sections";

// "items.0.slug" reads as "items 1 > slug", counting from one like a person would.
function readablePath(path: string): string {
  if (!path) return "This section";
  return path
    .split(".")
    .map((part) => (/^\d+$/.test(part) ? `#${Number(part) + 1}` : part))
    .join(" > ");
}

type SectionFormProps<T> = {
  section: SectionKey;
  initial: T;
  children: (draft: T, update: (patch: Partial<T>) => void) => ReactNode;
};

export function SectionForm<T extends object>({ section, initial, children }: SectionFormProps<T>) {
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial);
  // Bumped on "Discard" so every field starts over from the saved values.
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState<SaveResult | null>(null);
  const [pending, startTransition] = useTransition();
  const dirty = draft !== saved;

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function save() {
    startTransition(async () => {
      const next = await saveSection(section, draft);
      setResult(next);
      if (next.status === "saved") setSaved(draft);
    });
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <h1 className="text-3xl font-bold">{sectionLabels[section]}</h1>

      <div key={version} className="mt-6 space-y-5">
        {children(draft, (patch) => {
          setResult(null);
          setDraft((current) => ({ ...current, ...patch }));
        })}
      </div>

      <div className="sticky bottom-0 z-10 mt-8 -mx-4 border-t border-border bg-background px-4 py-3 sm:mx-0 sm:rounded-b-md">
        {result?.status === "invalid" && (
          <div role="alert" className="mb-3 max-h-40 overflow-y-auto text-sm text-destructive">
            <p className="font-semibold">Not saved. Please fix:</p>
            <ul className="mt-1 list-disc pl-5">
              {result.issues.map((issue) => (
                <li key={`${issue.path}-${issue.message}`}>
                  {readablePath(issue.path)}: {issue.message}
                </li>
              ))}
            </ul>
          </div>
        )}
        {result?.status === "error" && (
          <p role="alert" className="mb-3 text-sm text-destructive">
            {result.message}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={pending || !dirty} className="btn btn-solid min-h-11 disabled:opacity-50">
            {pending ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            disabled={pending || !dirty}
            onClick={() => {
              setDraft(saved);
              setResult(null);
              setVersion((current) => current + 1);
            }}
            className="btn min-h-11 disabled:opacity-50"
          >
            Discard changes
          </button>
          <p role="status" className="text-sm">
            {result?.status === "saved" && !dirty ? "Saved. The live site updates within seconds." : ""}
            {dirty && !pending ? "You have unsaved changes." : ""}
          </p>
        </div>
      </div>
    </form>
  );
}
