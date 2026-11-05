import { getContent } from "@/lib/content/get-content";
import { renderCv } from "@/pdf/cv-document";

// Built once and rebuilt when the dashboard saves, so it always matches the site.
export const dynamic = "force-static";

export async function GET() {
  const pdf = await renderCv(await getContent());
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="ronil-estojero-cv.pdf"',
    },
  });
}
