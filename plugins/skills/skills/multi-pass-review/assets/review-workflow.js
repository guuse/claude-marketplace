// Template for the Workflow tool: one reviewer agent per angle, all in parallel.
// Use it only when the user has opted into multi-agent orchestration. Otherwise launch
// parallel Agent calls with the same prompts.
//
// Fill in WORKSPACE, COMMIT, TARGET and ANGLES. For a re-check round, comment out the angles
// that passed and weren't touched by the fixes, and bump ROUND so the evidence goes to a fresh
// folder. Afterwards, read the full results from the run's journal.jsonl (the summary is
// truncated).

export const meta = {
  name: 'multi-pass-review',
  description: 'Parallel read-only reviewers, one per angle, each returning PASS/FAIL with findings',
  phases: [{ title: 'Review' }],
}

const WORKSPACE = '/path/to/scratchpad/review-run'
const COMMIT = '<sha>'
const TARGET = '<repo path, and the URL or container to judge>'
const ROUND = 'round1'

const common = `You are a strict, fair reviewer of ${TARGET} at commit ${COMMIT}.
First read ${WORKSPACE}/PASSES.md, ${WORKSPACE}/DECISIONS.md and ${WORKSPACE}/RECHECK.md.
Read-only: don't edit, commit or push, and don't restart shared services.
Save evidence to ${WORKSPACE}/review/${ROUND}/<your-angle>/.
Several reviewers run at once, so re-run any timing before you report it, and say how many runs.
PASS = zero blockers and zero majors. Return a PASS/FAIL verdict, a score out of 10, and
findings, each with a severity (blocker/major/minor), a location (file:line or URL) and a
concrete fix. Be concise.`

// [key, angle prompt]: see references/angles.md
const ANGLES = [
  ['anim', 'ANIMATION craft and performance: ...'],
  ['perf', 'PERFORMANCE and standards: ...'],
  ['code', 'CODE and REPO quality: ...'],
  ['journeys', 'USER JOURNEYS on all viewports and browsers: ...'],
  ['a11y', 'ACCESSIBILITY and UX details: ...'],
  ['text', 'TEXT as the target reader, including AI tone: ...'],
  ['facts', 'FACTS and PRIVACY against the sources: ...'],
]

const results = await parallel(
  ANGLES.map(([key, prompt]) => () =>
    agent(`${common}\n\nYour angle: ${prompt}`, { label: `review:${key}`, phase: 'Review' })
      .then((r) => ({ key, r })),
  ),
)
return results
