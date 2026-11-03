import { expect, test } from "@playwright/test";

test("the resume page shows experience but never the email address", async ({ page }) => {
  const response = await page.goto("/resume");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ronil Estojero");
  await expect(page.getByText("Solo Full-Stack Developer")).toBeVisible();
  await expect(page.getByText("References available on request.")).toBeVisible();
  expect(await page.content()).not.toContain("restojero@gmail.com");
});

test("the PDF download link serves a PDF", async ({ page, request }) => {
  await page.goto("/resume");
  const href = await page.getByRole("link", { name: "Download PDF" }).getAttribute("href");
  expect(href).toBe("/ronil-estojero-cv.pdf");
  const response = await request.get(href!);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
});

test("printing in dark mode gives a clean light page", async ({ page }) => {
  await page.goto("/resume");
  await page.evaluate(() => document.documentElement.classList.add("dark"));
  await page.emulateMedia({ media: "print" });

  await expect(page.locator("header").first()).toBeHidden();
  await expect(page.locator("footer")).toBeHidden();
  await expect(page.getByRole("link", { name: "Download PDF" })).toBeHidden();

  const colors = await page.evaluate(() => {
    const body = getComputedStyle(document.body);
    const heading = getComputedStyle(document.querySelector("h1")!);
    return { background: body.backgroundColor, text: heading.color };
  });
  expect(colors.background).toBe("rgb(255, 255, 255)");
  expect(colors.text).toBe("rgb(0, 0, 0)");
});
