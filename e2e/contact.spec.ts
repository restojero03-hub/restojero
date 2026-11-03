import { expect, test } from "@playwright/test";

// These run with no environment variables set, which is how the site launches
// until Ronil adds his Resend keys.
test("the contact page works before the form is configured", async ({ page }) => {
  const response = await page.goto("/contact");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Let's build your product");
  await expect(page.getByTestId("contact-fallback")).toBeVisible();
  const contact = page.locator("#contact");
  await expect(contact.getByRole("link", { name: "LinkedIn" })).toBeVisible();
  await expect(contact.getByRole("link", { name: "Upwork profile" })).toBeVisible();
});

test("without a booking link the header CTA opens the contact page", async ({ page }) => {
  await page.goto("/");
  const cta = page.locator("header").getByRole("link", { name: "Let's talk" });
  await expect(cta).toHaveAttribute("href", "/contact");
  await cta.click();
  await expect(page).toHaveURL(/\/contact$/);
});

test("no web page exposes the email address", async ({ page }) => {
  for (const path of ["/", "/contact", "/resume", "/work/conexa-pro", "/work/meta-ads-funnel"]) {
    await page.goto(path);
    expect(await page.content(), path).not.toContain("restojero@gmail.com");
  }
});
