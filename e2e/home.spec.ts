import { expect, test, type Locator } from "@playwright/test";
import { PHONE_PATTERN } from "../tests/helpers/private-terms";

test.describe("the page", () => {
  test("shows the sections in the approved order", async ({ page }) => {
    await page.goto("/");
    const ids = await page.locator("main > section").evaluateAll((sections) => sections.map((s) => s.id));
    expect(ids).toEqual(["home", "about", "services", "portfolio", "resume", "contacts"]);
  });

  test("has one h1 with the name, and alt text on every image", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText("Ronil Estojero");
    await expect(page.locator("img:not([alt])")).toHaveCount(0);
  });

  test("leads with all four roles for screen readers", async ({ page }) => {
    await page.goto("/");
    for (const title of ["AI Full-Stack Developer", "Digital Marketer", "Sales Funnel Builder", "Automation Specialist"]) {
      await expect(page.locator("#home")).toContainText(title);
    }
  });

  test("never exposes the email address or a phone number", async ({ page }) => {
    await page.goto("/");
    const html = await page.content();
    expect(html).not.toContain("restojero@gmail.com");
    expect(html).not.toContain("tel:");
    expect(await page.locator("body").innerText()).not.toMatch(PHONE_PATTERN);
  });

  test("an icon shows its name on hover, and a link on keyboard focus too", async ({ page }) => {
    await page.goto("/");
    const label = (tile: Locator) => tile.evaluate((element) => getComputedStyle(element, "::after").content);

    const social = page.locator("#home").getByRole("link", { name: "LinkedIn" });
    expect(await label(social)).toBe("none");
    await social.focus();
    expect(await label(social)).toBe('"LinkedIn"');
    await social.blur();

    await social.hover();
    expect(await label(social)).toBe('"LinkedIn"');

    const tool = page.locator("#home li.tile").filter({ has: page.getByRole("img", { name: "Claude", exact: true }) });
    expect(await label(tool)).toBe("none");
    await tool.hover();
    expect(await label(tool)).toBe('"Claude"');

    const initials = page.locator("#home li.tile").filter({ has: page.getByRole("img", { name: "FunnelKit" }) });
    await initials.hover();
    expect(await label(initials)).toBe('"FunnelKit"');
  });

  test("has no percent bars or like counts", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: "Professional Skills" }).click();
    await expect(page.locator("#resume")).not.toContainText(/\d+%/);
    await expect(page.locator("#portfolio")).not.toContainText(/like this/i);
  });

  test("loads without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      // Vercel serves its analytics script only once deployed.
      if (message.type() === "error" && !message.text().includes("404")) errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
});

test.describe("the theme", () => {
  test("is dark by default, and the toggle switches and remembers", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await page.getByRole("button", { name: "Switch between light and dark theme" }).click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await page.reload();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });
});

test.describe("the portfolio", () => {
  const cards = (page: import("@playwright/test").Page) => page.locator("#portfolio [data-project]");

  test("shows 6, and Load more reveals the rest", async ({ page }) => {
    await page.goto("/");
    await expect(cards(page)).toHaveCount(6);
    await page.getByRole("button", { name: "Load more" }).click();
    await expect(page.locator("#portfolio li button").nth(6)).toBeFocused();
    await expect(cards(page)).toHaveCount(7);
    await expect(page.getByRole("button", { name: "Load more" })).toHaveCount(0);
  });

  test("doesn't lead with CoNexa Pro", async ({ page }) => {
    await page.goto("/");
    await expect(cards(page).first()).not.toContainText("CoNexa");
  });

  test("a card opens a pop-up, and Escape closes it and returns focus", async ({ page }) => {
    await page.goto("/");
    const card = cards(page).first();
    await card.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Meta Ads");
    await expect(dialog).toContainText("₱62,352");
    await expect(page).toHaveURL(/#project-meta-ads-funnel$/);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page).not.toHaveURL(/#project-/);
    await expect(card).toBeFocused();
  });

  test("a share link opens that project's pop-up", async ({ page }) => {
    await page.goto("/#project-conexa-pro");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("CoNexa Pro");
    await expect(dialog.getByRole("link", { name: "See it live" })).toHaveAttribute("href", "https://app.conexapro.io");
  });

  test("a share link to a project hidden behind Load more still opens", async ({ page }) => {
    await page.goto("/#project-dr-david");
    await expect(page.getByRole("dialog")).toContainText("Dr. David");
  });

  test("a bad share link is ignored", async ({ page }) => {
    await page.goto("/#project-nope");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("the back button closes the pop-up", async ({ page }) => {
    await page.goto("/");
    await cards(page).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.goBack();
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("OnlineTabo offers no dead link", async ({ page }) => {
    await page.goto("/#project-onlinetabo");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText("OnlineTabo");
    await expect(dialog.locator('a[href*="onlinetabo"]')).toHaveCount(0);
  });
});

test.describe("the resume", () => {
  test("switches tabs, by mouse and by arrow key", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#resume")).toContainText("Operations and Digital Marketing Manager");
    await page.getByRole("tab", { name: "Education" }).click();
    await expect(page.getByRole("tabpanel")).toContainText("BS Electrical Engineering");
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: "Professional Skills" })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("Next.js");
  });

  test("lists software work before engineering", async ({ page }) => {
    await page.goto("/");
    const text = await page.getByRole("tabpanel").innerText();
    expect(text.indexOf("Solo Full-Stack Developer")).toBeLessThan(text.indexOf("Electrical Engineer"));
  });

  test("the CV download serves a PDF", async ({ page, request }) => {
    await page.goto("/");
    const href = await page.locator("#about").getByRole("link", { name: "Download my CV" }).getAttribute("href");
    const response = await request.get(href!);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
  });
});

test.describe("booking and video", () => {
  test("nothing loads from Cal.com until Book a call is clicked", async ({ page }) => {
    const cal: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("cal.com")) cal.push(request.url());
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(cal).toEqual([]);

    await page.locator("#contacts").getByRole("button", { name: "Book a call" }).click();
    const frame = page.getByTitle("Book a call with Ronil Estojero");
    await expect(frame).toBeVisible();
    await expect(frame).toHaveAttribute("src", /cal\.com\/restojero\/30min/);
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
});

test.describe("old links", () => {
  for (const [path, target] of [
    ["/work/conexa-pro", /#project-conexa-pro$/],
    ["/work/meta-ads-funnel", /#project-meta-ads-funnel$/],
    ["/resume", /#resume$/],
    ["/contact", /#contacts$/],
  ] as const) {
    test(`${path} redirects`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveURL(target);
    });
  }

  test("an unknown page shows the styled 404", async ({ page }) => {
    const response = await page.goto("/nope");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
    await expect(page.getByRole("link", { name: "Back to the home page" })).toBeVisible();
  });
});

for (const width of [320, 375]) {
  test.describe(`at ${width}px`, () => {
    test.use({ viewport: { width, height: 800 } });

    const noSideScroll = async (page: import("@playwright/test").Page) => {
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    };

    test("the page doesn't scroll sideways", async ({ page }) => {
      await page.goto("/");
      await noSideScroll(page);
    });

    test("an icon's name doesn't push the page wider", async ({ page }) => {
      await page.goto("/");
      for (const tile of await page.locator("#home .tile").all()) {
        await tile.hover();
        await noSideScroll(page);
      }
    });

    test("the pop-up fits", async ({ page }) => {
      await page.goto("/#project-meta-ads-funnel");
      await expect(page.getByRole("dialog")).toBeVisible();
      await noSideScroll(page);
      const box = await page.getByRole("dialog").boundingBox();
      expect(box!.width).toBeLessThanOrEqual(width);
    });

    test("the pop-up's Close button stays in view while it scrolls", async ({ page }) => {
      await page.goto("/#project-meta-ads-funnel");
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await dialog.evaluate((element) => element.scrollTo(0, element.scrollHeight));
      await expect(dialog.getByRole("button", { name: "Close" })).toBeInViewport({ ratio: 1 });
    });

    test("the menu takes keyboard focus and Escape closes it", async ({ page }) => {
      await page.goto("/");
      const toggle = page.getByRole("button", { name: "Open menu" });
      await toggle.focus();
      await page.keyboard.press("Enter");
      const nav = page.getByRole("navigation", { name: "Main" });
      await expect(nav.getByRole("link", { name: "About" })).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(nav).toBeHidden();
      await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
    });

    test("the menu opens and its links work", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: "Open menu" }).click();
      const link = page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Portfolio" });
      await expect(link).toBeVisible();
      await link.click();
      await expect(page).toHaveURL(/#portfolio$/);
    });
  });
}
