"use client";

import { ExternalLink, X } from "lucide-react";
import { useRef, useState } from "react";

type BookCallButtonProps = {
  calUrl: string | null;
  className: string;
};

// The calendar loads only once it's opened, so it can't slow the page down.
export function BookCallButton({ calUrl, className }: BookCallButtonProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [opened, setOpened] = useState(false);

  if (!calUrl) {
    return (
      <a href="#contacts" className={className}>
        Contact me
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => {
          setOpened(true);
          dialog.current?.showModal();
        }}
      >
        Book a call
      </button>
      <dialog
        ref={dialog}
        className="site-dialog"
        aria-label="Book a call"
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current?.close();
        }}
      >
        <div className="flex items-center justify-between gap-4 px-5 py-3">
          <a href={calUrl} target="_blank" rel="noopener noreferrer" className="text-link inline-flex items-center gap-2 text-sm">
            Open in a new tab
            <ExternalLink className="size-4" aria-hidden />
          </a>
          <button
            type="button"
            aria-label="Close"
            onClick={() => dialog.current?.close()}
            className="neu flex size-11 cursor-pointer items-center justify-center rounded-full text-pink-text"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        {opened && (
          <iframe
            src={`${calUrl}?embed=true`}
            title="Book a call with Ronil Estojero"
            className="h-[75dvh] w-full border-0 bg-white"
          />
        )}
      </dialog>
    </>
  );
}
