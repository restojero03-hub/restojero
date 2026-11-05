import { expect, test } from "@playwright/test";

// Everything here runs signed out. Saving and uploading are covered by the unit tests,
// because they'd need a real login and would change real content.

test.describe("signed out", () => {
  for (const path of ["/dashboard", "/dashboard/hero", "/dashboard/portfolio", "/dashboard/messages", "/dashboard/no-access"]) {
    test(`${path} goes to the login page`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(/\/sign-in/);
    });
  }

  test("the upload route refuses the request", async ({ request }) => {
    const response = await request.post("/api/upload", {
      data: { type: "blob.generate-client-token", payload: { pathname: "x.png" } },
    });
    expect(response.status()).toBe(401);
  });
});

test("visitors to the public site download nothing from Clerk", async ({ page }) => {
  const clerk: string[] = [];
  page.on("request", (request) => {
    if (/clerk/i.test(request.url())) clerk.push(request.url());
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(clerk).toEqual([]);
});

test("the CV is a real PDF built from the content", async ({ request }) => {
  const response = await request.get("/ronil-estojero-cv.pdf");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toBe("application/pdf");
  expect((await response.body()).subarray(0, 4).toString()).toBe("%PDF");
});

test("search engines are kept out of the dashboard", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /dashboard");
  expect(robots).toContain("Disallow: /sign-in");
});
