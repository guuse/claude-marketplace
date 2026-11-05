---
name: multi-pass-review
description: Take a piece of work (a web app, a site, a feature branch, a document set) to production quality with ordered review passes, each run by several parallel reviewer agents with different angles, followed by fixer agents and re-checks until every angle passes. The orchestrator writes the briefs, keeps the owner's decisions, splits fixes across agents by file ownership, verifies their claims, and ships. Use this skill whenever the user asks for multiple passes, several agents checking from different angles, a final verification round, "review it until everything passes", "make it production ready", "run all the checks with multiple agents", or a thorough multi-angle review of anything large — even if they don't say "multi-pass".
---

# Multi-pass review

You are the **orchestrator**. You don't do the reviewing or most of the fixing yourself: you
write the briefs, launch reviewer agents in parallel, merge their findings, hand fixes to fixer
agents with clear file ownership, check what they claim, ship, and repeat until every angle
passes. Your context is the scarce resource. Agents read the files and run the tools; you keep
the decisions.

## The loop

```
for each pass, in order (e.g. animation → UX → frontend → text):
    review:   N reviewer agents in parallel, one angle each, read-only → PASS/FAIL + findings
    fix:      1–3 fixer agents, disjoint file ownership → small commits, not pushed
    verify:   you check the claims, run the fast checks, rebase, push
then the final round:
    all angles again on the shipped result
    while any angle FAILs:
        fix the blockers and majors (and the cheap minors)
        re-run the failed angles + every angle whose area the fixes touched
    done = every angle PASS on the deployed result
```

**PASS means zero blockers and zero majors for that angle.** Minors don't block. Fix the cheap
ones in the same fix round, and list the rest in the final report.

## Step 0 — Set up the workspace

Make a folder in your scratchpad (never in the repo), e.g. `review-run/`:

```
review-run/
├── PLAN.md        # what's being built, for whom, the bar ("production", "public postcard")
├── PASSES.md      # shared reviewer brief: how to run/look at it, report format, read-only rule
├── DECISIONS.md   # owner decisions and accepted items: reviewers must NOT re-flag these
├── RECHECK.md     # appended per round: what changed since the last round, current commit
├── fix-*.md       # one brief per fixer agent
└── review/<round>/<angle>/   # each reviewer's evidence (screenshots, logs, traces)
```

Templates for each file are in `references/briefs.md`. Write `DECISIONS.md` early and keep it
current. Without it, every round re-litigates choices the owner already made.

## Step 1 — Choose passes and angles

Pick the passes in the order the user asked for, or use the default order. Earlier passes should
change the things later passes judge: motion before UX, UX before frontend polish, and copy
last. Each pass gets 2–4 angles; the final round gets all of them (typically 6–8). The angle
catalogue with ready-to-use prompts is in `references/angles.md`.

Good angles are **orthogonal**: each one owns a question nobody else answers. "Performance" and
"animation smoothness" overlap; "performance budget" and "animation craft" don't. Always include
a **facts/privacy** angle when the work makes claims about real people, systems or numbers.

## Step 2 — Run reviewers

- One agent per angle, all launched in **one message** so they run concurrently.
- Each prompt: role and angle, the paths to PASSES.md, DECISIONS.md and RECHECK.md, the exact
  commit or URL to judge, its own evidence folder, and "read-only: don't edit, commit or push".
- If the Workflow tool is available and the user opted into multi-agent orchestration, use it:
  `assets/review-workflow.js` is a template. Afterwards, read each result from the run's
  `journal.jsonl` instead of the truncated summary. Otherwise use parallel Agent calls.
- Shared machines make timing noisy. Tell reviewers to re-run any timing that looks off and to
  report how many runs they did. Don't believe a single slow run, and don't believe a single
  fast one either.

## Step 3 — Triage

Collect the verdicts into a table: angle | PASS/FAIL | score | blockers/majors. Then for each
finding:
- **Re-flags a decision** in DECISIONS.md → drop it.
- **Needs a fact only the owner knows** (a number, a name, how something really went) → don't
  let an agent invent it. Use the safe wording, collect the question, and ask the owner in your
  report. Never write the agent's guess onto the site as fact.
- **Real** → put it in a fix brief.

## Step 4 — Fix with ownership

- Group the findings into 1–3 fix briefs by **files**, not by topic, so that no two agents
  edit the same file. State ownership explicitly in each prompt: "you own X, Y; don't touch Z
  (another agent is editing it)".
- If agents share one working tree: `git add <own paths>` only (never `-A`), small commits, no
  push. Pre-commit hooks that stash unstaged changes (lint-staged) can touch the other agent's
  work, so keep commits few. Alternatively give each agent its own worktree.
- Each brief: the evidence folder, the exact findings with file:line, the decisions that still
  apply, the verify commands (lint/typecheck/unit/e2e/a11y/perf budget/build), and a word or
  line cap on the report.
- A fixer may push back ("the cause isn't where the reviewer said"). Accept it if it's backed by
  measurement, and note it for the re-check.

## Step 5 — Verify, then ship

Fixers report success with confidence, including when something failed. Before you push:
- `git status` is clean, the authorship and trailers match the repo's rules, and `git log` shows
  the commits they listed.
- Run the repo's fast checks yourself (lint/format/typecheck/unit). A full suite you couldn't run
  locally is not "passing": say so, and let CI be the test.
- Rebase onto the remote branch (bots like image updaters commit too), push, and **watch CI**.
  Red CI on main can mean nothing ships. Read the failed job's log, fix the root cause, and
  don't retry blindly.
- If the work deploys, check the deployed result (the live URL serves the new build, no console
  errors), not just the local copy. "Merged" is not "live".
- Never fabricate identifiers: look up action SHAs, image digests and versions from the source
  before pinning them.

## Step 6 — Re-check until green

Append an update to RECHECK.md (new commit, what was fixed, new decisions), then re-run:
- every angle that FAILed;
- every angle whose area the fixes touched, even if it passed before (fixes cause regressions:
  a perf change can break anchors, a copy change can break facts);
- skip angles that passed and weren't touched.

Give each round a fresh evidence folder (`review/round3/`, `review/round4/`, …). Stop when
every angle passes on the deployed result. Then write the final report.

## Reporting to the user

Keep the user posted at each milestone (agents launched, round results, pushed, live), briefly.
The final report:
- the verdict table, with scores;
- what changed, by area;
- the design changes agents made that the owner should judge (e.g. "the crossfade replaced the
  slide to hit the fps target");
- the open questions only the owner can answer;
- the accepted minors left;
- any manual settings the owner still has to change.

## Pitfalls (each of these happened)

- **Agents editing a file another agent owns.** Assign files, not topics. Name the forbidden
  files in each prompt.
- **A "pass" on the local build while CI was red**, so nothing deployed. Check CI after every
  push.
- **A CI fix that wasn't tested**: a per-step timeout covered the retry too, and a container's
  env var was overridden by the runner. Read the logs and verify the next run.
- **Reviewers re-flagging owner decisions** every round. Use DECISIONS.md.
- **Agents inventing facts** to fill a story (how an incident was fixed, a team size).
  Keep the wording vague and ask.
- **Perf numbers from a loaded machine.** Require medians over several runs, with the load
  noted.
- **Over-trusting a summary.** Read the full reviewer results; the summary is truncated.
- **Fixing everything in one agent.** Long fixer runs drift. Several focused briefs finish
  faster and stay correct.
