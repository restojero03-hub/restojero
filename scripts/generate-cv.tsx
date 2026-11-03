import { writeFile } from "node:fs/promises";
import path from "node:path";
import { renderCv } from "@/pdf/cv-document";

// Runs before dev and build, so the PDF always matches content/resume.ts.
async function main() {
  const target = path.join(process.cwd(), "public", "ronil-estojero-cv.pdf");
  await writeFile(target, await renderCv());
  console.log(`CV written to ${path.relative(process.cwd(), target)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
