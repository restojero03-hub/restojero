import { beforeEach, describe, expect, test, vi } from "vitest";
import { defaultContent } from "@/content/defaults";

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  revalidatePath: vi.fn(),
  findUnique: vi.fn(),
  upsert: vi.fn(),
  updateMessage: vi.fn(),
  deleteMessage: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/lib/auth/admin", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/db", () => ({
  isDatabaseConfigured: () => true,
  getDb: () => ({
    siteContent: { findUnique: mocks.findUnique, upsert: mocks.upsert },
    message: { update: mocks.updateMessage, delete: mocks.deleteMessage },
  }),
}));

import { saveSection } from "@/lib/content/actions";
import { deleteMessage, setMessageRead } from "@/lib/contact/inbox-actions";

const about = { ...defaultContent.about, title: "Edited title" };

beforeEach(() => {
  for (const mock of Object.values(mocks)) mock.mockReset();
  mocks.requireAdmin.mockResolvedValue({ id: "user_1", email: "owner@example.com" });
  mocks.findUnique.mockResolvedValue({ id: "main", data: defaultContent });
  mocks.upsert.mockResolvedValue({});
});

describe("saveSection", () => {
  test("stores the section, keeps the others, and refreshes the public pages", async () => {
    const result = await saveSection("about", about);
    expect(result).toEqual({ status: "saved" });

    const { create, update, where } = mocks.upsert.mock.calls[0][0];
    expect(where).toEqual({ id: "main" });
    expect(update.data.about.title).toBe("Edited title");
    expect(update.data.hero).toEqual(defaultContent.hero);
    expect(create).toEqual({ id: "main", data: update.data });

    expect(mocks.revalidatePath).toHaveBeenCalledWith("/", "layout");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/ronil-estojero-cv.pdf");
  });

  test("rejects anyone who isn't the admin and stores nothing", async () => {
    mocks.requireAdmin.mockRejectedValue(new Error("Not allowed"));
    const result = await saveSection("about", about);
    expect(result.status).toBe("error");
    expect(mocks.findUnique).not.toHaveBeenCalled();
    expect(mocks.upsert).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  test("rejects invalid content, says what's wrong, and stores nothing", async () => {
    const result = await saveSection("about", { ...about, title: "   " });
    expect(result.status).toBe("invalid");
    expect(result.status === "invalid" && result.issues[0].path).toBe("title");
    expect(mocks.upsert).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  test("says what's wrong in plain words", async () => {
    const result = await saveSection("about", { ...about, title: "   " });
    expect(result.status === "invalid" && result.issues[0].message).toBe("This can't be empty");
  });

  test("rejects a section name that doesn't exist", async () => {
    // @ts-expect-error A forged request can send anything.
    const result = await saveSection("__proto__", about);
    expect(result.status).toBe("error");
    expect(mocks.upsert).not.toHaveBeenCalled();
  });

  test("rejects two projects with the same link", async () => {
    const [first] = defaultContent.portfolio.items;
    const result = await saveSection("portfolio", {
      ...defaultContent.portfolio,
      items: [first, { ...first }],
    });
    expect(result.status).toBe("invalid");
    expect(mocks.upsert).not.toHaveBeenCalled();
  });

  test("rejects an image from another site", async () => {
    const photo = { src: "https://example.com/me.webp", alt: "Me" };
    const result = await saveSection("contact", { ...defaultContent.contact, photo });
    expect(result.status).toBe("invalid");
    expect(mocks.upsert).not.toHaveBeenCalled();
  });

  test("a database failure gives a plain error, not the internal one", async () => {
    mocks.upsert.mockRejectedValue(new Error("connection string secret leaked"));
    const result = await saveSection("about", about);
    expect(result.status).toBe("error");
    expect(JSON.stringify(result)).not.toContain("secret");
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});

describe("inbox actions", () => {
  test("reject anyone who isn't the admin", async () => {
    mocks.requireAdmin.mockRejectedValue(new Error("Not allowed"));
    await expect(setMessageRead("m1", true)).rejects.toThrow();
    await expect(deleteMessage("m1")).rejects.toThrow();
    expect(mocks.updateMessage).not.toHaveBeenCalled();
    expect(mocks.deleteMessage).not.toHaveBeenCalled();
  });

  test("mark a message read and unread", async () => {
    await setMessageRead("m1", true);
    expect(mocks.updateMessage.mock.calls[0][0].where).toEqual({ id: "m1" });
    expect(mocks.updateMessage.mock.calls[0][0].data.readAt).toBeInstanceOf(Date);

    await setMessageRead("m1", false);
    expect(mocks.updateMessage.mock.calls[1][0].data.readAt).toBeNull();
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/dashboard", "layout");
  });

  test("delete a message", async () => {
    await deleteMessage("m1");
    expect(mocks.deleteMessage).toHaveBeenCalledWith({ where: { id: "m1" } });
  });
});
