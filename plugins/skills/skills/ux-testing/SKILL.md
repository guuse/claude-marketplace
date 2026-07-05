---
name: ux-testing
description: Autonomously test a web app end-to-end from a real user's perspective — map every user flow, start the app's preview/dev server, drive a real browser with Playwright, and adversarially try to break each flow. Then file a fix task per bug, dispatch a fixing agent per task, and re-run that flow's E2E test until it passes. Use this skill whenever the user wants to UX-test, QA, or "break" a web app; find bugs across all user flows; run or set up end-to-end / e2e / browser tests; test happy paths and edge/error cases; or auto-fix and re-verify failing flows — even if they don't say "e2e" or "Playwright" explicitly. Trigger on phrases like "test my app", "find the bugs", "try to break it", "test all the flows", "QA this", or "make the tests pass".
---

# UX Testing

Autonomously exercise a running web app the way an adversarial user would, catalogue every failure, fix each one, and prove the fix with a re-run of the same flow. The goal is not to confirm the app works — it's to **find where it breaks** and leave it green.

## Operating principle

You are playing two roles in sequence: a **skeptical QA engineer** whose job is to make the app fail, and then a **fixer** whose job is to make each failure go away without breaking anything else. Stay in the QA mindset during discovery — a run where nothing broke usually means you didn't push hard enough, not that the app is flawless.

## Workspace

Create `ux-test-run/` at the repo root and keep all artifacts there:

```
ux-test-run/
├── app-map.md        # Phase 1 — what the app is and does
├── flows.md          # Phase 2 — every flow, happy + breaking
├── specs/            # Phase 4 — Playwright test files (one per flow area)
├── results/
│   ├── screenshots/  # failure screenshots / traces
│   └── findings.md   # every failure, with repro
├── tasks.md          # Phase 5 — one fix task per distinct bug
└── final-report.md   # Phase 7 — summary + before/after
```

Track progress with a todo list so nothing is skipped across the long run.

---

## Phase 1 — Analyze the app

Understand the app before touching it. Run the detector, then read code to fill gaps.

```bash
python3 scripts/detect_stack.py <app-root>
```

It reports framework, package manager, the dev/preview/build/test commands, and likely route/page locations from `package.json` and the file tree. Then read the routing to enumerate every reachable screen. See `references/app-analysis.md` for how to handle each framework (Next.js, Vite/React, Vue, SvelteKit, Remix, Astro, plain SPA) and what to look for: routes, auth boundaries, forms, wizards, modals, tables, uploads, payments, and external/API dependencies.

Write `app-map.md`: the stack, how to run it, an inventory of screens, and every interactive surface with its data/auth prerequisites. **Do not guess** — if a screen needs a logged-in user or seed data, note it; you'll need it to test.

## Phase 2 — Discover flows (happy + breaking)

For every feature in the app-map, enumerate flows into `flows.md`. Two kinds:

- **Happy flows** — the intended successful journey (e.g. *register → verify → log in → land on dashboard*).
- **Breaking flows** — deliberate attempts to make it fail.

Do not stop at the obvious happy path. Work through the adversarial catalogue in `references/flow-discovery.md` for each surface: invalid/boundary/empty input, oversized and special-character input, missing required fields, double-submit and rapid clicks, back/forward/refresh mid-flow, deep-linking into protected or stateful routes, expired/absent auth, offline and slow network, concurrent tabs, wrong file types/sizes on upload, and un-sanitised input in fields that get rendered back. Prioritise each flow by user impact × likelihood.

Record each flow as a row: `id | area | type (happy/breaking) | preconditions | steps | expected result`.

## Phase 3 — Start the preview server

Set up Playwright and get the app running so the browser has something to hit. See `references/playwright-setup.md` for full detail. In short:

1. Install Playwright + browsers if absent (`npm i -D @playwright/test && npx playwright install chromium`).
2. Copy `assets/playwright.config.ts` into the app and adjust `baseURL`/`webServer` to the detected command.
3. Prefer letting Playwright's `webServer` block start and health-check the app. If starting it yourself, launch the detected **preview** command (fall back to **dev**) in the background and poll the URL with `scripts/wait_for_server.sh <url>` until it responds before running any test.

Never run tests against a server that isn't confirmed up — you'll get false failures.

## Phase 4 — Test everything E2E, and try to break it

This is the core. Two passes:

**A. Scripted pass.** Turn every flow in `flows.md` into a Playwright spec under `specs/` (group by area). Each spec asserts the *expected result*, and for breaking flows asserts the app fails *gracefully* (shows a validation message, stays on a valid state, no crash) rather than white-screening or throwing. Run the suite.

**B. Exploratory adversarial pass.** Scripted tests only find what you thought to write. Now actively hunt for the unexpected: drive the browser interactively (Playwright MCP if available, otherwise short throwaway scripts or `npx playwright codegen`), and while doing so **capture the failure signals automatically** — uncaught exceptions, `console.error`, failed network requests, unhandled promise rejections, 4xx/5xx on user actions, layout that breaks, focus traps, and states the user can get stuck in. `references/flow-discovery.md` lists the signal hooks to wire up. Every genuinely new breakage you find, add as a spec so it's covered on re-run.

For every failure (either pass), append to `results/findings.md`: what you did, expected vs actual, a screenshot/trace path, the console/network evidence, severity, and your best guess at the responsible code. Deduplicate — the same root cause hit by three flows is one finding.

## Phase 5 — Create fix tasks

Convert `findings.md` into `tasks.md`: **one task per distinct root cause**, ordered by severity. Each task has a stable id, title, the affected flow(s) and their spec file, exact repro steps, expected vs actual, severity, and suspected files/cause. This file is the queue for Phase 6 and the checklist you close out in Phase 7.

If the user works in Linear (or asks), also mirror tasks there — see `references/fix-loop.md` for the optional integration. Local `tasks.md` is the default and the source of truth for the loop.

## Phase 6 & 7 — Fix each task, then re-test until green

Run the loop in `references/fix-loop.md`. Per task:

1. Dispatch a **fixing agent** (a subagent via the Task tool, one task per agent, run in parallel only when the tasks touch disjoint files — otherwise serialise to avoid clobbering). Give it the task entry, the failing spec, and the app-map. Its job: find the root cause and fix it minimally, without weakening the assertion to force a pass.
2. **Re-run only that flow's spec.** If green, mark the task done. If red, feed the new failure back to the fixer and retry — but cap at **3 attempts**, then flag the task as `needs-human` with notes rather than looping forever or gutting the test.
3. Never edit a test just to make it pass. If a test itself was wrong, correct it explicitly and say so in the task.

After every task is done or flagged, run the **full suite once more** to catch regressions introduced by the fixes. Then write `final-report.md`: flows tested, bugs found, what was fixed, what still needs a human, and the final pass/fail counts.

---

## Guardrails

- **Bounded loops.** Every retry loop has a hard cap (3). Prefer flagging `needs-human` over infinite iteration.
- **Test integrity.** A passing test must reflect real behaviour. Fixing the app is the goal; softening the test to go green is a failure of the skill.
- **Scope of "breaking".** Adversarial testing here means malformed input, edge cases, and abuse of the app's *own* surfaces — standard QA. This is not for attacking third-party systems or infrastructure the user doesn't own.
- **Idempotent runs.** Assume the suite may run many times; make specs self-contained (create their own state, clean up) so re-runs don't accumulate junk.
- **Report, don't hide.** Surface everything you couldn't fix. A short list of honest `needs-human` items is more useful than an over-claimed all-green.

## Reference files

- `references/app-analysis.md` — per-framework detection, route enumeration, what surfaces to catalogue.
- `references/flow-discovery.md` — the full adversarial catalogue and the failure-signal hooks to wire into the browser.
- `references/playwright-setup.md` — installing Playwright, config, and starting/health-checking the preview server.
- `references/fix-loop.md` — the fix/re-test loop, subagent dispatch, retry caps, and optional Linear mirroring.
