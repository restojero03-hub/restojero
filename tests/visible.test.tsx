import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { Services } from "@/components/site/services";
import { SocialLinks } from "@/components/site/social-links";
import { defaultContent } from "@/content/defaults";
import { siteContentSchema } from "@/lib/content/schema";
import { moveItem } from "@/lib/content/list";

describe("hiding items", () => {
  test("content saved before items could be hidden shows everything", () => {
    const copy = structuredClone(defaultContent) as unknown as {
      services: { items: { visible?: boolean }[] };
    };
    delete copy.services.items[0].visible;
    const parsed = siteContentSchema.parse(copy);
    expect(parsed.services.items[0].visible).toBe(true);
  });

  test("a hidden service stays off the page", () => {
    const items = defaultContent.services.items.map((item, index) => ({ ...item, visible: index !== 0 }));
    const html = renderToStaticMarkup(<Services services={{ ...defaultContent.services, items }} />);
    expect(html).not.toContain(items[0].title);
    expect(html).toContain(items[1].title);
  });

  test("a hidden social link stays off the page", () => {
    const links = defaultContent.site.socialLinks.map((link, index) => ({ ...link, visible: index !== 0 }));
    const html = renderToStaticMarkup(<SocialLinks links={links} />);
    expect(html).not.toContain(links[0].url);
    expect(html).toContain(links[1].url);
  });
});

describe("moveItem", () => {
  test("moves an item up and down", () => {
    expect(moveItem(["a", "b", "c"], 1, -1)).toEqual(["b", "a", "c"]);
    expect(moveItem(["a", "b", "c"], 1, 1)).toEqual(["a", "c", "b"]);
  });

  test("leaves the list alone at the ends", () => {
    expect(moveItem(["a", "b"], 0, -1)).toEqual(["a", "b"]);
    expect(moveItem(["a", "b"], 1, 1)).toEqual(["a", "b"]);
  });
});
