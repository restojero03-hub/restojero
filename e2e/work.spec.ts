import { expect, test } from "@playwright/test";

test("CoNexa Pro case study renders", async ({ page }) => {
  const response = await page.goto("/work/conexa-pro");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("CoNexa Pro");
  await expect(page.getByText("never gets direct database access")).toBeVisible();
  await expect(page.getByText("Philippine construction company")).toBeVisible();
});

test("the AI request path shows every step in order", async ({ page }) => {
  await page.goto("/work/conexa-pro");
  const steps = page.getByRole("list", { name: "AI request path" }).getByRole("listitem");
  await expect(steps).toHaveText([
    /User asks/,
    /Login checked/,
    /Access checked/,
    /Only allowed data/,
    /Project tools/,
    /LLM/,
    /Checked answer/,
  ]);
});

test("funnel case study renders with its live link", async ({ page }) => {
  const response = await page.goto("/work/meta-ads-funnel");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Meta Ads");
  await expect(page.getByRole("link", { name: "See the live registration page" })).toHaveAttribute(
    "href",
    /go\.conexapro\.io\/op\/live-ai-driven-construction-project-management-registration/,
  );
});

test("the funnel page publishes no result numbers", async ({ page }) => {
  await page.goto("/work/meta-ads-funnel");
  const body = await page.locator("main").innerText();
  expect(body).not.toMatch(/ROAS|₱|PHP\s?\d|\d+\s?%|\d+ leads/i);
});

test("an unknown case study shows the styled not-found page", async ({ page }) => {
  const response = await page.goto("/work/nope");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
  await expect(page.getByRole("link", { name: "Back to the home page" })).toBeVisible();
  await expect(page.locator("main")).not.toContainText("contact details");
});
