import { beforeEach, describe, expect, test, vi } from "vitest";
import { defaultContent } from "@/content/defaults";

const mocks = vi.hoisted(() => ({ configured: true, findUnique: vi.fn() }));

vi.mock("@/lib/db", () => ({
  isDatabaseConfigured: () => mocks.configured,
  getDb: () => ({ siteContent: { findUnique: mocks.findUnique } }),
}));

import { getContent } from "@/lib/content/get-content";

describe("getContent", () => {
  beforeEach(() => {
    mocks.configured = true;
    mocks.findUnique.mockReset();
  });

  test("uses the starter content when no database is set up", async () => {
    mocks.configured = false;
    await expect(getContent()).resolves.toEqual(defaultContent);
    expect(mocks.findUnique).not.toHaveBeenCalled();
  });

  test("returns what the dashboard saved", async () => {
    const saved = { ...defaultContent, about: { ...defaultContent.about, title: "Edited title" } };
    mocks.findUnique.mockResolvedValue({ id: "main", data: saved });
    const content = await getContent();
    expect(content.about.title).toBe("Edited title");
  });

  test("uses the starter content before anything has been saved", async () => {
    mocks.findUnique.mockResolvedValue(null);
    await expect(getContent()).resolves.toEqual(defaultContent);
  });

  // Falling back here would swap the owner's edits for the starter copy on the live site.
  test("throws when the read fails, so the last good page keeps showing", async () => {
    mocks.findUnique.mockRejectedValue(new Error("database down"));
    await expect(getContent()).rejects.toThrow("database down");
  });

  test("throws when the saved content is damaged", async () => {
    mocks.findUnique.mockResolvedValue({ id: "main", data: { hero: "not valid" } });
    await expect(getContent()).rejects.toThrow();
  });
});
