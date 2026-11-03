const DEFAULT_SITE_URL = "https://restojero.vercel.app";

// The one setting to change when the site moves to its final domain.
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  return url.replace(/\/+$/, "");
}
