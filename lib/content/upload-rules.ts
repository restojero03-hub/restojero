// Used by the upload route and by the browser, for a quick answer before anything is sent.
// SVG is left out on purpose because it can carry scripts.
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export function checkImageFile(file: { type: string; size: number }): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return "Please choose a JPG, PNG, WebP or AVIF image.";
  if (file.size > MAX_IMAGE_BYTES) return "That image is over 8 MB. Please choose a smaller one.";
  return null;
}
