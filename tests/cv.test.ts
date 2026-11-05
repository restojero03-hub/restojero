import { beforeAll, describe, expect, test } from "vitest";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { renderCv } from "@/pdf/cv-document";
import { defaultContent } from "@/content/defaults";
import { findPrivateTerms, PHONE_PATTERN } from "./helpers/private-terms";

const { resume } = defaultContent;
const cvEmail = defaultContent.site.cvEmail;

let text = "";
let pageCount = 0;
const pages: string[] = [];

beforeAll(async () => {
  const buffer = await renderCv(defaultContent);
  const pdf = await getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
    disableFontFace: true,
  }).promise;
  pageCount = pdf.numPages;
  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => ("str" in item ? item.str : "")).join(" ");
    pages.push(pageText);
    text += pageText + "\n";
  }
}, 30_000);

describe("the CV PDF", () => {
  test("has real, extractable text with the key facts", () => {
    for (const expected of [
      "Ronil Estojero",
      "restojero@gmail.com",
      "Palo, Leyte, Philippines",
      "CoNexa Pro",
      "Solo Full-Stack Developer",
      "Hitachi Global Storage",
      "BS Electrical Engineering",
      "References available on request",
    ]) {
      expect(text).toContain(expected);
    }
  });

  test("leaves out the phone number, references and trainer experience", () => {
    for (const banned of ["927", "+63", "Trainer", "Manila", "$"]) {
      expect(text).not.toContain(banned);
    }
    expect(text).not.toMatch(PHONE_PATTERN);
    expect(findPrivateTerms(text)).toEqual([]);
  });

  test("the only email address in it is the owner's", () => {
    const emails = text.match(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g) ?? [];
    expect(new Set(emails)).toEqual(new Set([cvEmail]));
  });

  test("reads newest role first, in one column", () => {
    const order = ["CoNexa Pro", "Home of Aesthetics", "Modern Resolve", "Pacificfortia"].map((word) =>
      text.indexOf(word),
    );
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(text.indexOf("Summary")).toBeLessThan(text.indexOf("Experience"));
    expect(text.indexOf("Experience")).toBeLessThan(text.indexOf("Education"));
  });

  test("never splits a job across two pages", () => {
    for (const role of [...resume.roles, ...resume.engineering]) {
      const entry = `${role.title}|${role.company}`;
      const titlePage = pages.findIndex((page) => page.includes(role.title));
      const companyPage = pages.findIndex((page) => page.includes(`${role.company}, ${role.employment}`));
      expect(titlePage, entry).toBe(companyPage);
    }
  });

  test("fits on 2 pages", () => {
    expect(pageCount).toBeLessThanOrEqual(2);
  });
});
