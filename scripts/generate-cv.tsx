import { writeFile } from "node:fs/promises";
import path from "node:path";
import { defaultContent } from "@/content/defaults";
import { renderCv } from "@/pdf/cv-document";

// Runs before dev and build, so the PDF always matches the content.
async function main() {
  const target = path.join(process.cwd(), "public", "ronil-estojero-cv.pdf");
  await writeFile(target, await renderCv(defaultContent));
  console.log(`CV written to ${path.relative(process.cwd(), target)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
