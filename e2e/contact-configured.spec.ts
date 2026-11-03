import { expect, test, type Page } from "@playwright/test";

// Runs only against a server started with the contact settings, using Cloudflare's
// always-pass Turnstile test keys and a dummy Resend key. See the README.
test.skip(!process.env.E2E_CONFIGURED, "needs a server with contact settings");

const alert = (page: Page) => page.locator('form [role="alert"]');
const send = (page: Page) => page.getByRole("button", { name: /Send message|Sending/ });

async function startForm(page: Page) {
  await page.getByLabel("Your name").fill("Test Person");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("What are you building?").fill("This is a test message for the form.");
}

test("nothing loads from Cloudflare until someone starts the form", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("challenges.cloudflare.com")) requests.push(request.url());
  });
  await page.goto("/contact");
  await page.waitForLoadState("networkidle");
  expect(requests).toEqual([]);
  await page.getByLabel("Your name").focus();
  await expect.poll(() => requests.length).toBeGreaterThan(0);
});

test("send stays off until the spam check passes, then turns on", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Your name").focus();
  await expect(send(page)).toBeDisabled();
  await startForm(page);
  await expect(send(page)).toBeEnabled({ timeout: 15_000 });
});

test("the spam check still appears after moving between pages", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Your name").focus();
  await expect(send(page)).toBeEnabled({ timeout: 15_000 });

  // A client-side navigation: the script is already loaded and won't run again.
  await page.locator("header").getByRole("link", { name: "Let's talk" }).click();
  await expect(page).toHaveURL(/\/contact$/);

  await startForm(page);
  await expect(send(page)).toBeEnabled({ timeout: 15_000 });
});

test("after a failed send the message stays and a retry gets a new check", async ({ page }) => {
  await page.goto("/contact");
  await startForm(page);
  await expect(send(page)).toBeEnabled({ timeout: 15_000 });
  await send(page).click();

  // The dummy Resend key always fails, past the spam check.
  await expect(alert(page)).toContainText("didn't send", { timeout: 20_000 });
  await expect(page.getByLabel("What are you building?")).toHaveValue(
    "This is a test message for the form.",
  );

  await expect(send(page)).toBeEnabled({ timeout: 15_000 });
  await send(page).click();
  // Sent again with a fresh token: the failure is still Resend, never the spam check.
  await expect(alert(page)).toContainText("didn't send", { timeout: 20_000 });
  await expect(alert(page)).not.toContainText("spam check");
});
