"use client";

import { upload } from "@vercel/blob/client";
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { moveItem } from "@/lib/content/list";
import { checkImageFile } from "@/lib/content/upload-rules";

const inputClass =
  "form-field mt-1.5 block w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <>
      <span className="text-sm font-semibold text-title">{label}</span>
      {hint && <span className="mt-0.5 block text-xs">{hint}</span>}
    </>
  );
}

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  type?: "text" | "url" | "email" | "month" | "number";
};

export function TextField({ label, value, onChange, hint, type = "text" }: TextFieldProps) {
  return (
    <label className="block min-w-0">
      <FieldLabel label={label} hint={hint} />
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} />
    </label>
  );
}

type TextAreaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  rows?: number;
};

export function TextArea({ label, value, onChange, hint, rows = 4 }: TextAreaProps) {
  return (
    <label className="block min-w-0">
      <FieldLabel label={label} hint={hint} />
      <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} />
    </label>
  );
}

// For optional values, where leaving the box empty means "none".
export function OptionalTextField({
  value,
  onChange,
  ...props
}: Omit<TextFieldProps, "value" | "onChange"> & {
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  return <TextField {...props} value={value ?? ""} onChange={(next) => onChange(next === "" ? null : next)} />;
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-5 cursor-pointer accent-[var(--primary)]"
      />
      <span className="text-sm font-semibold text-title">{label}</span>
    </label>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="block min-w-0">
      <FieldLabel label={label} />
      <select value={value} onChange={(event) => onChange(event.target.value as T)} className={inputClass}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

// One entry per line. Reordering is just moving the lines around.
export function LinesField({
  label,
  value,
  onChange,
  hint = "One per line.",
  rows = 5,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  hint?: string;
  rows?: number;
}) {
  // Keeps blank lines while typing. They're only dropped from the saved list.
  const [raw, setRaw] = useState(value.join("\n"));

  return (
    <TextArea
      label={label}
      hint={hint}
      rows={rows}
      value={raw}
      onChange={(next) => {
        setRaw(next);
        onChange(
          next
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        );
      }}
    />
  );
}

const smallButton =
  "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-title transition-colors hover:text-pink-text disabled:cursor-default disabled:opacity-30";

type ListEditorProps<T> = {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  addLabel: string;
  itemTitle: (item: T, index: number) => string;
  renderItem: (item: T, update: (next: T) => void) => ReactNode;
};

// A list of cards that can be added, removed, opened and moved up or down.
export function ListEditor<T>({ label, items, onChange, newItem, addLabel, itemTitle, renderItem }: ListEditorProps<T>) {
  // Each card keeps its id as it moves, so what's being typed stays with the right card.
  const nextId = useRef(items.length);
  const [ids, setIds] = useState(() => items.map((_, index) => index));
  const [open, setOpen] = useState<Set<number>>(new Set());

  const toggle = (id: number) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const move = (index: number, delta: -1 | 1) => {
    onChange(moveItem(items, index, delta));
    setIds((current) => moveItem(current, index, delta));
  };

  const remove = (index: number) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
    setIds((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const add = () => {
    const id = nextId.current++;
    onChange([...items, newItem()]);
    setIds((current) => [...current, id]);
    setOpen((current) => new Set(current).add(id));
  };

  return (
    <fieldset className="min-w-0">
      <legend className="text-sm font-semibold text-title">{label}</legend>
      <ul className="mt-2 space-y-2">
        {items.map((item, index) => {
          const id = ids[index];
          const isOpen = open.has(id);
          const title = itemTitle(item, index) || "(empty)";
          return (
            <li key={id} className="rounded-md border border-border">
              <div className="flex items-center gap-1 pr-1">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggle(id)}
                  className="flex min-h-11 min-w-0 flex-1 cursor-pointer items-center gap-2 px-3 text-left text-sm text-title"
                >
                  {isOpen ? (
                    <ChevronDown className="size-4 shrink-0" aria-hidden />
                  ) : (
                    <ChevronRight className="size-4 shrink-0" aria-hidden />
                  )}
                  <span className="truncate">{title}</span>
                </button>
                <button
                  type="button"
                  aria-label={`Move ${title} up`}
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                  className={smallButton}
                >
                  <ArrowUp className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label={`Move ${title} down`}
                  disabled={index === items.length - 1}
                  onClick={() => move(index, 1)}
                  className={smallButton}
                >
                  <ArrowDown className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${title}`}
                  onClick={() => remove(index)}
                  className={smallButton}
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </div>
              <div hidden={!isOpen} className="space-y-4 border-t border-border p-3">
                {renderItem(item, (next) => onChange(items.map((other, i) => (i === index ? next : other))))}
              </div>
            </li>
          );
        })}
      </ul>
      <button type="button" onClick={add} className="btn mt-3 min-h-10 px-4 text-xs">
        {addLabel}
      </button>
    </fieldset>
  );
}

export function ParagraphsField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <ListEditor
      label={label}
      items={value}
      onChange={onChange}
      newItem={() => ""}
      addLabel="Add a paragraph"
      itemTitle={(paragraph) => paragraph.slice(0, 70)}
      renderItem={(paragraph, update) => <TextArea label="Text" value={paragraph} onChange={update} rows={5} />}
    />
  );
}

function ImageUploadButton({ onUploaded }: { onUploaded: (url: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  // An upload takes a while and the form can change meanwhile. Calling the handler from when
  // the file was chosen would undo those edits, so this always holds the newest one, or
  // null once this field is gone.
  const latestOnUploaded = useRef<((url: string) => void) | null>(null);
  useEffect(() => {
    latestOnUploaded.current = onUploaded;
    return () => {
      latestOnUploaded.current = null;
    };
  }, [onUploaded]);

  async function send(file: File) {
    const fileProblem = checkImageFile(file);
    setProblem(fileProblem);
    if (fileProblem) return;

    setBusy(true);
    try {
      const safeName = file.name.replace(/[^\w.-]+/g, "-");
      const blob = await upload(`uploads/${safeName}`, file, { access: "public", handleUploadUrl: "/api/upload" });
      latestOnUploaded.current?.(blob.url);
    } catch (error) {
      console.error("Upload failed", error);
      setProblem("The upload didn't work. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void send(file);
        }}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => input.current?.click()}
        className="btn min-h-10 gap-2 px-4 text-xs"
      >
        <Upload className="size-4" aria-hidden />
        {busy ? "Uploading..." : "Upload an image"}
      </button>
      {problem && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {problem}
        </p>
      )}
    </div>
  );
}

function Preview({ src }: { src: string }) {
  return (
    <span className="block size-24 shrink-0 overflow-hidden rounded-md bg-secondary">
      {src && (
        // A plain image so a new upload shows right away.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-contain" />
      )}
    </span>
  );
}

type Image = { src: string; alt: string };

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Image;
  onChange: (value: Image) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="text-sm font-semibold text-title">{label}</legend>
      <div className="mt-2 flex flex-wrap items-start gap-4">
        <Preview src={value.src} />
        <div className="min-w-48 flex-1 space-y-3">
          <ImageUploadButton onUploaded={(src) => onChange({ ...value, src })} />
          <TextField
            label="Description"
            hint="Read aloud by screen readers and shown if the image can't load."
            value={value.alt}
            onChange={(alt) => onChange({ ...value, alt })}
          />
        </div>
      </div>
    </fieldset>
  );
}

// A small logo that's optional. With none, the tile shows the tool's initials.
export function IconField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="text-sm font-semibold text-title">{label}</legend>
      <div className="mt-2 flex flex-wrap items-center gap-4">
        <Preview src={value ?? ""} />
        <div className="flex flex-wrap items-start gap-3">
          <ImageUploadButton onUploaded={onChange} />
          {value && (
            <button type="button" onClick={() => onChange(null)} className="btn min-h-10 px-4 text-xs">
              Use initials
            </button>
          )}
        </div>
      </div>
    </fieldset>
  );
}
