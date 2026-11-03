// Shared by the browser form and the server. Keep validation libraries out of
// this file, or they end up in every visitor's download.
export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
  // What the visitor typed, so a failed attempt doesn't clear the form.
  values?: { name: string; email: string; message: string };
};

export const initialContactState: ContactState = { status: "idle" };

// Hidden field that only bots fill in.
export const HONEYPOT_FIELD = "website";
export const TURNSTILE_FIELD = "cf-turnstile-response";
