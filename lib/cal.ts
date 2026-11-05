// The Cal.com page without its own header and footer, for showing inside the pop-up.
export function calEmbedUrl(calUrl: string): string {
  const url = new URL(calUrl);
  url.searchParams.set("embed", "true");
  return url.toString();
}
