import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for the ux-testing skill.
 *
 * Copy this into the app under test and adjust the two markers below:
 *   1. `baseURL`     — the URL the preview/dev server serves.
 *   2. `webServer.command` / `.url` — the detected preview command (fall back
 *      to dev). Let Playwright start and health-check the server via this
 *      block; it will not run tests until `url` responds.
 *
 * Specs written by the skill live in `ux-test-run/specs/`.
 */
export default defineConfig({
  testDir: "./ux-test-run/specs",
  // Adversarial suites can be slow; give each test room but keep it bounded.
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  // Fail the run if someone leaves test.only in a spec.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: "ux-test-run/results/html-report", open: "never" }],
  ],
  outputDir: "ux-test-run/results/artifacts",
  use: {
    // ── ADJUST: match the preview/dev server URL ──────────────────────────
    baseURL: process.env.BASE_URL ?? "http://localhost:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  // ── ADJUST: the detected preview command (fall back to dev) ─────────────
  webServer: {
    command: process.env.PREVIEW_CMD ?? "npm run preview",
    url: process.env.BASE_URL ?? "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
