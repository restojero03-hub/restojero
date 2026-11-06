"use client";

import Script from "next/script";
import { useCallback, useEffect, useImperativeHandle, useRef, type Ref } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          "response-field": boolean;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
        },
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export type TurnstileHandle = { reset: () => void };

type TurnstileProps = {
  siteKey: string;
  onToken: (token: string | null) => void;
  onFail: () => void;
  ref: Ref<TurnstileHandle>;
};

// Renders explicitly, because the script only scans the page once when it first
// loads. That scan would miss this form after a move between pages.
export function Turnstile({ siteKey, onToken, onFail, ref }: TurnstileProps) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useImperativeHandle(ref, () => ({
    reset() {
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
    },
  }));

  const render = useCallback(() => {
    if (!container.current || !window.turnstile || widgetId.current) return;
    widgetId.current = window.turnstile.render(container.current, {
      sitekey: siteKey,
      // The form submits the token itself, so it survives React resetting the form.
      "response-field": false,
      callback: onToken,
      "expired-callback": () => onToken(null),
      "error-callback": () => {
        onToken(null);
        onFail();
      },
    });
  }, [siteKey, onToken, onFail]);

  // Covers mounting when the script is already loaded. onReady handles the first load.
  useEffect(() => {
    render();
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [render]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onReady={render}
        onError={onFail}
      />
      <div ref={container} />
    </>
  );
}
