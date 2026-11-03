import { expect, test } from "vitest";
import { formatMonth, formatRange } from "@/lib/format";

test("formatMonth turns YYYY-MM into a short month and year", () => {
  expect(formatMonth("2026-06")).toBe("Jun 2026");
  expect(formatMonth("2012-04")).toBe("Apr 2012");
  expect(formatMonth("2022-12")).toBe("Dec 2022");
});

test("formatRange shows Present for a role with no end", () => {
  expect(formatRange("2026-06", null)).toBe("Jun 2026 – Present");
});

test("formatRange shows both dates for a finished role", () => {
  expect(formatRange("2024-03", "2026-06")).toBe("Mar 2024 – Jun 2026");
});
