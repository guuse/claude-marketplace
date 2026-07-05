# Flow discovery — the adversarial catalogue & failure-signal hooks

Phase 2 turns the app-map into `flows.md`. Phase 4B uses the signal hooks here to
catch breakage the scripted specs didn't anticipate. Stay in the skeptical-QA
mindset: your job is to make the app fail.

Record each flow as a row:
`id | area | type (happy/breaking) | preconditions | steps | expected result`

Prioritise each flow by **user impact × likelihood**.

## Happy flows

For every feature, write the intended successful journey end-to-end, e.g.
*register → verify email → log in → land on dashboard → create first item*. These
are the baseline; if a happy flow breaks, that's the highest-severity class of bug.

## Breaking flows — the adversarial catalogue

Apply each relevant category to every interactive surface:

### Input abuse
- **Invalid format** — bad email, non-numeric in number fields, malformed dates/URLs.
- **Boundary values** — 0, negative, max int, off-by-one on length limits, min/max dates.
- **Empty / whitespace-only** — submit with required fields blank or just spaces.
- **Oversized** — paste 10k+ chars into a text field; huge numbers.
- **Special characters & injection-shaped input** — quotes, `<script>`, `{{7*7}}`, emoji, RTL/unicode, SQL-ish strings. You're checking the app *sanitises and renders safely*, not attacking a third party.
- **Un-sanitised round-trip** — input that gets rendered back (names, comments, titles): does `<img onerror>` execute or display as text?

### Interaction abuse
- **Double-submit / rapid clicks** — click submit twice fast; does it create duplicates or double-charge?
- **Out-of-order steps** — skip a wizard step, submit step 2 before step 1.
- **Back / forward / refresh mid-flow** — browser back after submit, refresh on a POST-result page, forward into stale state.
- **Concurrent tabs** — same session in two tabs; mutate in one, act on stale state in the other.
- **Interrupt & resume** — navigate away mid-upload/mid-payment and come back.

### Navigation & auth abuse
- **Deep-linking into protected routes** — hit an authed URL logged out; expect redirect, not crash/leak.
- **Deep-linking into stateful routes** — jump to step 3 of a wizard directly, or a detail page with a bogus/`:id` that doesn't exist.
- **Expired / absent auth** — let a session expire, then act; tamper with/remove the token.
- **Role escalation surfaces** — access an admin-only route as a normal user.

### Environment abuse
- **Offline** — go offline mid-flow; expect a graceful message, not a white screen.
- **Slow / flaky network** — throttle; check loading states, timeouts, retries, and that double-submit guards hold.
- **Wrong file uploads** — wrong type, 0-byte, oversized, wrong extension vs. content, many files at once.

For each: the app should **fail gracefully** — validation message, stay on a valid
state, no uncaught crash, no data corruption, no security leak.

## Failure-signal hooks (wire these into the browser in Phase 4B)

Capture failures automatically so exploratory testing doesn't rely on eyeballing.
In Playwright:

```ts
const consoleErrors: string[] = [];
const pageErrors: string[] = [];
const failedRequests: string[] = [];

page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => pageErrors.push(err.message)); // uncaught exceptions
page.on("requestfailed", (req) =>
  failedRequests.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText}`)
);
page.on("response", (res) => {
  if (res.status() >= 400) failedRequests.push(`${res.status()} ${res.url()}`);
});
// Unhandled promise rejections surface via 'pageerror' in modern Chromium.
```

After each interaction, assert these buffers are empty (or contain only known-benign
noise). Signals to treat as failures:

- Uncaught exceptions (`pageerror`).
- `console.error` output.
- Failed network requests (`requestfailed`) and 4xx/5xx responses on user actions.
- Unhandled promise rejections.
- **Layout breakage** — overflow, overlap, content pushed off-screen (screenshot + visual check).
- **Focus traps** — keyboard focus stuck in a modal with no escape; can't tab out.
- **Dead ends** — states the user can get into but not out of without a refresh (e.g. a spinner that never resolves, a disabled submit with no reason shown).

Every genuinely new breakage → add a spec for it so it's covered on re-run, then
log it to `results/findings.md`.
