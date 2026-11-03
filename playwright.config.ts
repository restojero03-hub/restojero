import { defineConfig } from "@playwright/test";

// Set E2E_BASE_URL to test a running server. Otherwise this starts the production build.
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3100";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "line",
  use: { baseURL, channel: "chrome" },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npx next start -p 3100",
        url: baseURL,
        reuseExistingServer: true,
      },
});
