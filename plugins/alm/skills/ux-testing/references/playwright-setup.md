# Playwright setup & starting the preview server

Phase 3: get Playwright installed and the app confirmed-up before any test runs.
**Never run tests against a server that isn't confirmed up** — you'll get false
failures.

## 1. Install Playwright

If the app doesn't already have `@playwright/test`:

```bash
npm i -D @playwright/test
npx playwright install chromium
```

(Use the app's package manager — `pnpm add -D`, `yarn add -D`, `bun add -d` — as
detected in Phase 1.) `chromium` alone is enough for most UX testing; add
`firefox`/`webkit` only if cross-browser behaviour is in scope.

In this managed environment Chromium is pre-installed and Playwright is configured
to find it (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`,
`PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`). Do **not** run `playwright install` here — it's
unnecessary. If a project pins a different `@playwright/test` version, launch with
`executablePath: '/opt/pw-browsers/chromium'` rather than downloading.

## 2. Config

Copy `assets/playwright.config.ts` into the app root and adjust:

- **`baseURL`** — the URL the preview/dev server serves (e.g. `http://localhost:4173`
  for Vite preview, `http://localhost:3000` for Next dev).
- **`webServer.command`** and **`webServer.url`** — the detected **preview** command
  (fall back to **dev**), and the URL to health-check.

The provided config reads `BASE_URL` / `PREVIEW_CMD` from the env so you can point it
without editing the file:

```bash
BASE_URL=http://localhost:3000 PREVIEW_CMD="npm run dev" npx playwright test
```

Specs live in `ux-test-run/specs/`; the config's `testDir` already points there.
Traces, screenshots, and video are retained on failure under `ux-test-run/results/`.

## 3. Starting & health-checking the server

**Preferred: let Playwright's `webServer` block do it.** With `webServer.command` +
`url` set, Playwright starts the server, waits until `url` responds, runs the suite,
then tears it down. `reuseExistingServer: !CI` means a server you already have running
is reused locally. This is the least error-prone path — use it unless you have a
reason not to.

**If starting it yourself** (e.g. exploratory Phase 4B driving, or the server needs
extra setup):

```bash
# Launch the preview command in the background (fall back to dev if no preview script).
npm run preview &   # or the detected command
# Poll until it responds — do NOT run tests before this returns 0.
scripts/wait_for_server.sh http://localhost:4173 60
```

`wait_for_server.sh <url> [timeout] [interval]` exits 0 as soon as the URL responds
(any HTTP status counts as "up") and exits 1 on timeout.

## 4. Preview vs. dev

Prefer a production-like **preview** build — it catches build-time and
production-only bugs (env handling, minification, SSR/hydration mismatches) that dev
mode hides. Fall back to **dev** only when there's no preview script or the build
fails. Record which you used in `app-map.md`, since some findings only reproduce in
one mode.

## 5. Sanity check

Before writing the full suite, run one trivial spec (load `baseURL`, assert the page
renders / a known element is visible) to confirm the harness, config, and server all
work together. If that fails, fix the setup — don't start logging app findings against
a broken harness.
