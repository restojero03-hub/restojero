import { expect, test } from "@playwright/test";

const routes = ["/", "/work/conexa-pro", "/work/meta-ads-funnel", "/resume", "/contact"];

for (const width of [320, 375]) {
  test.describe(`at ${width}px`, () => {
    test.use({ viewport: { width, height: 800 } });

    for (const route of routes) {
      test(`${route} has no sideways scroll`, async ({ page }) => {
        await page.goto(route);
        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
      });
    }
  });
}

for (const route of routes) {
  test(`${route} has one h1, and alt text on every image`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("h1")).toHaveCount(1);
    const missingAlt = await page.locator("img:not([alt])").count();
    expect(missingAlt).toBe(0);
    const emptyAlt = await page.locator('img[alt=""]').count();
    expect(emptyAlt).toBe(0);
  });

  test(`${route} has only working internal links`, async ({ page, request }) => {
    await page.goto(route);
    const hrefs = await page.locator('a[href^="/"]').evaluateAll((links) =>
      links.map((link) => link.getAttribute("href")!.split("#")[0] || "/"),
    );
    for (const href of new Set(hrefs)) {
      const response = await request.get(href);
      expect(response.status(), href).toBe(200);
    }
  });

  test(`${route} loads no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      // Vercel serves its analytics script only once deployed.
      if (message.type() === "error" && !message.text().includes("404")) errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
}

test("server-only validation code never reaches the browser", async ({ page, request }) => {
  await page.goto("/");
  const scripts = await page.locator("script[src]").evaluateAll((tags) =>
    tags.map((tag) => tag.getAttribute("src")!).filter((src) => src.includes("/_next/")),
  );
  expect(scripts.length).toBeGreaterThan(0);
  for (const src of scripts) {
    const body = await (await request.get(src)).text();
    expect(body.includes("ZodError"), src).toBe(false);
  }
});

test("in-page navigation targets exist", async ({ page }) => {
  await page.goto("/");
  for (const id of ["work", "about", "projects", "contact"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
});

test("the intro video loads nothing from YouTube until played", async ({ page }) => {
  const youtube: string[] = [];
  page.on("request", (request) => {
    if (/youtube|ytimg/.test(request.url())) youtube.push(request.url());
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(youtube).toEqual([]);

  await page.getByRole("button", { name: /Watch my intro video/ }).click();
  await expect(page.locator('iframe[title="Watch my intro video"]')).toHaveAttribute(
    "src",
    /youtube-nocookie\.com\/embed\/K3TOs3JgBkg/,
  );
});

test("the theme toggle switches to dark and remembers it", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await page.getByRole("button", { name: "Switch between light and dark theme" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("the structured data and social tags are in the page", async ({ page }) => {
  await page.goto("/");
  const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
  expect(JSON.parse(jsonLd!).name).toBe("Ronil Estojero");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /\/opengraph-image/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://restojero.vercel.app",
  );
});

test("the sitemap, robots and social image respond", async ({ request }) => {
  for (const path of ["/sitemap.xml", "/robots.txt", "/opengraph-image", "/ronil-estojero-cv.pdf"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
  }
});
