import { beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({ requireAdmin: vi.fn(), handleUpload: vi.fn() }));

vi.mock("@/lib/auth/admin", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@vercel/blob/client", () => ({ handleUpload: mocks.handleUpload }));

import { POST } from "@/app/api/upload/route";
import { checkImageFile, MAX_IMAGE_BYTES } from "@/lib/content/upload-rules";

const tokenRequest = () =>
  new Request("http://localhost/api/upload", {
    method: "POST",
    body: JSON.stringify({ type: "blob.generate-client-token", payload: { pathname: "me.webp" } }),
  });

beforeEach(() => {
  mocks.requireAdmin.mockReset();
  mocks.handleUpload.mockReset();
  mocks.requireAdmin.mockResolvedValue({ id: "user_1", email: "owner@example.com" });
  mocks.handleUpload.mockResolvedValue({ type: "blob.generate-client-token", clientToken: "token" });
});

describe("the upload route", () => {
  test("gives nothing to anyone who isn't the admin", async () => {
    mocks.requireAdmin.mockRejectedValue(new Error("Not allowed"));
    const response = await POST(tokenRequest());
    expect(response.status).toBe(401);
    expect(mocks.handleUpload).not.toHaveBeenCalled();
  });

  test("limits uploads to images of a sensible size", async () => {
    const response = await POST(tokenRequest());
    expect(response.status).toBe(200);

    const { onBeforeGenerateToken } = mocks.handleUpload.mock.calls[0][0];
    const rules = await onBeforeGenerateToken("me.webp", null, false);
    expect(rules.maximumSizeInBytes).toBe(MAX_IMAGE_BYTES);
    expect(rules.addRandomSuffix).toBe(true);
    expect(rules.allowedContentTypes).toEqual(["image/jpeg", "image/png", "image/webp", "image/avif"]);
  });

  test("refuses anything other than a token request", async () => {
    const response = await POST(
      new Request("http://localhost/api/upload", {
        method: "POST",
        body: JSON.stringify({ type: "blob.upload-completed", payload: {} }),
      }),
    );
    expect(response.status).toBe(400);
    expect(mocks.handleUpload).not.toHaveBeenCalled();
  });

  test("doesn't pass internal errors back", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.handleUpload.mockRejectedValue(new Error("token secret"));
    const response = await POST(tokenRequest());
    expect(response.status).toBe(500);
    expect(await response.text()).not.toContain("secret");
  });
});

describe("checkImageFile", () => {
  const file = (type: string, size = 100) => ({ type, size });

  test("accepts common photo formats", () => {
    expect(checkImageFile(file("image/webp"))).toBeNull();
    expect(checkImageFile(file("image/jpeg"))).toBeNull();
  });

  test("refuses other file types, including SVG", () => {
    expect(checkImageFile(file("application/pdf"))).toContain("JPG");
    expect(checkImageFile(file("image/svg+xml"))).toContain("JPG");
  });

  test("refuses files over the limit", () => {
    expect(checkImageFile(file("image/png", MAX_IMAGE_BYTES + 1))).toContain("MB");
    expect(checkImageFile(file("image/png", MAX_IMAGE_BYTES))).toBeNull();
  });
});
