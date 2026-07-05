# Fix loop — dispatch, re-test, retry caps & optional Linear mirroring

Phases 6 & 7. `tasks.md` is the queue and the source of truth. Work it top-down by
severity. The invariant across the whole loop: **fix the app, never soften the test.**

## Per-task loop

For each task in `tasks.md`:

1. **Dispatch a fixing agent** — a subagent via the Task tool, **one task per agent**.
   Give it:
   - the task entry (id, title, repro steps, expected vs. actual, severity, suspected files),
   - the failing spec file,
   - the relevant slice of `app-map.md`.

   Its job: find the **root cause** and fix it minimally, without weakening the
   assertion to force a pass.

   **Parallelism rule:** run agents in parallel **only when their tasks touch disjoint
   files.** If two tasks might edit the same file, **serialise** them — otherwise the
   agents clobber each other's edits. When unsure, serialise.

2. **Re-run only that flow's spec** (not the whole suite):

   ```bash
   npx playwright test ux-test-run/specs/<area>.spec.ts -g "<flow title>"
   ```

   - **Green** → mark the task `done` in `tasks.md`.
   - **Red** → feed the new failure output back to the fixer and retry.

3. **Retry cap: 3 attempts.** After 3 failed attempts, stop. Flag the task
   `needs-human` with notes (what was tried, why it's still failing, best current
   hypothesis). **Do not** loop forever, and **do not** gut the test to make it pass.

4. **Test integrity.** Never edit a test just to make it go green. If the *test itself*
   was wrong (bad selector, wrong expectation), correct it **explicitly** and record in
   the task that the test — not the app — was fixed, and why.

## After all tasks are done or flagged

Run the **full suite once more** to catch regressions the fixes introduced:

```bash
npx playwright test
```

Any new failure becomes a fresh task and re-enters the loop (subject to the same
3-attempt cap). Then write `final-report.md`:

- flows tested (count by area, happy vs. breaking),
- bugs found (by severity),
- what was fixed (task id → one-line resolution),
- what still needs a human (`needs-human` tasks with notes),
- final pass/fail counts.

Report honestly — a short list of `needs-human` items beats an over-claimed all-green.

## Optional: mirror tasks to Linear

Local `tasks.md` is the default and remains the source of truth for the loop. If the
user works in Linear or asks, also mirror tasks there:

- Create one Linear issue per `tasks.md` task, title = task title, description = repro +
  expected/actual + suspected files, priority mapped from severity.
- As the loop resolves each task, update the mirrored issue (in-progress → done, or
  flag `needs-human` and leave it open with the notes).
- Keep the id mapping in `tasks.md` (e.g. `linear: ENG-123`) so re-runs don't create
  duplicates.

Use the available Linear MCP/integration tools if present; if not, tell the user
what you'd mirror rather than inventing issue ids.
