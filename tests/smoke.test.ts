import { expect, test } from "vitest";
import { cn } from "@/lib/utils";

test("the @ alias resolves and cn merges class names", () => {
  expect(cn("a", "b")).toBe("a b");
});
