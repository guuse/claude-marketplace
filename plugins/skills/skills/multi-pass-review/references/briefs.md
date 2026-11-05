# Brief templates

Fill these in and save them in the scratchpad workspace. Agents get the paths, not pasted
copies, so one edit reaches every later agent.

## PASSES.md: the shared reviewer brief

```markdown
# Review passes: shared brief for every reviewer

The work: <one paragraph: what it is, who it's for, the bar it must meet>.
Repo: <path>, branch <name>. Plan: <path to PLAN.md>. Design reference: <path or URL>.

## How to look at it
- Run: <build + serve command>, or the production container on <url>. Use a unique port
  per reviewer, so parallel reviewers don't collide.
- Browser: Playwright (`require('playwright')`). Scroll slowly with `mouse.wheel` in steps
  with waits. Emulate devices, reduced motion, zoom and landscape where your angle needs it.
- Save evidence only under <workspace>/review/<round>/<angle>/.
- **Read-only:** don't edit repo files, don't commit or push. You report; a fixer applies.
- Timings are noisy on a shared machine: re-run anything that looks off, and say how many runs.

## Report format (≤ 400 words)
1. Verdict: PASS or FAIL for your angle, and a 0–10 score.
2. Findings, most severe first. Each one has a severity (blocker/major/minor), where it is
   (page/viewport or file:line), the evidence (screenshot path or measurement) and a concrete fix.
3. What works (≤ 3 bullets).
PASS = zero blockers and zero majors. Be strict but fair: don't pad with nitpicks you wouldn't
defend, and don't wave things through either.
```

## DECISIONS.md: owner decisions, don't re-flag

```markdown
# Owner decisions (final; reviewers: don't flag these)
- <decision, in the owner's words where possible>
- <accepted trade-off, e.g. "Brotli is done at the CDN, not the origin">
- <facts the owner confirmed, so reviewers don't call them unsupported>
- <things that must never appear: names, hostnames, private repos>

## Accepted minors (don't re-flag)
- <minor the owner accepted>
```

## RECHECK.md: appended each round

```markdown
## Update N (commit <sha>)
Since <previous sha>, these were fixed: <one line per fix area>.
New owner facts or decisions: <list>.
Lead decisions to judge on their result (not on the choice): <e.g. "the crossfade replaces the slide">.
Verify that each fix in your angle holds, then do your full angle again: fixes can cause
regressions.
```

## fix-<area>.md: a fixer brief

```markdown
# Fix brief: <area>

Repo <path>, branch <name> at <sha>. Git: <authorship and trailer rules>. Don't push.
**You own:** <files/dirs>. **Don't touch:** <files another agent owns>, <README etc.>.
Stage only your own paths (`git add <paths>`, never `-A`). Small commits.

Evidence: <workspace>/review/<round>/<angles>/

## Majors
1. <finding: where, what, cause if known, the fix direction, how to verify it>

## Minors (do them all unless one conflicts with a decision)
- <finding>

## Still applies
- <the decisions from DECISIONS.md that touch this area>

## Verify
<lint/typecheck/unit/e2e/a11y/perf/build commands>, plus <screenshots/measurements to save>.
Report in ≤ 12 lines: the commits, the before → after numbers, anything skipped and why, and
anything the owner must confirm.
```

## The reviewer prompt (for each angle)

```
You are a strict, fair reviewer of <the work> (repo <path>, commit <sha>; running at <url>).
First read <workspace>/PASSES.md, DECISIONS.md and RECHECK.md. Read-only: don't edit,
commit or push, and don't restart shared services. Save evidence to
<workspace>/review/<round>/<angle>/. Several reviewers run at once; re-run timings before you
report them. Return a PASS/FAIL verdict, a score out of 10, and findings, each with a severity,
a location and a concrete fix.

Your angle: <prompt from angles.md>
```
