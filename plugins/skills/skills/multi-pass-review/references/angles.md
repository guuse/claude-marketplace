# Angle catalogue

Each angle is one reviewer's question. Use the passes in order, or pick the angles that fit the
work. Paste the prompt after the shared preamble (see `briefs.md`). Adapt the specifics (pages,
budgets, browsers) to the project.

## Pass: animation / motion

| Angle | Prompt |
|---|---|
| **craft** | ANIMATION CRAFT: Does every animation have a purpose, an easing that fits, and timing that feels intentional? Check entrances, scroll-driven scenes, hover states and hand-overs between states. Look for jumps, pops, double animations, things moving that shouldn't, and motion that fights the reading. Capture frame sequences while scrolling slowly. |
| **robustness** | ANIMATION ROBUSTNESS: Do animations run in every browser, after back/forward navigation, after resize, in background tabs, with slow CPU, and with no JS? Do they stop when idle (WCAG 2.2.2: nothing moves for more than 5 s without a way to stop it)? Reduced motion: no movement, but the content is still complete. No console errors. |
| **performance** | ANIMATION PERFORMANCE: Scroll fps at 4× CPU throttle per page (median of ≥ 5 runs, load noted). Long tasks, forced layout or style recalc per frame, and layout thrash. Trace the worst page and name the cause (file:line). |

## Pass: UX

| Angle | Prompt |
|---|---|
| **journeys-desktop** | USER JOURNEYS (desktop): Walk every real journey: land → explore → detail → back, the nav, anchors, scroll-spy, external links, the 404. Test at 1024–1920. Flag anything confusing, broken or surprising, and anything that loses the reader's place. |
| **journeys-mobile** | USER JOURNEYS (mobile and tablet): The same at 320, 390, landscape phone and tablet, with touch emulation. Flag overflow, clipped text, tap targets under 44 px, hover-only affordances and anything hidden behind sticky UI. |
| **details-a11y** | DETAILS AND ACCESSIBILITY: Run axe on every page. Check the keyboard-only journey, focus visibility and order, screen-reader names, contrast, forced colours, 200–400% zoom and reflow, and live regions. |
| **first-impression** | FIRST IMPRESSION: You are the target visitor (a recruiter, a buyer, a new user). What do you understand in 5 s, 30 s and 2 min? What would make you leave? Is the most important thing the most visible? |

## Pass: frontend

| Angle | Prompt |
|---|---|
| **perf-standards** | PERFORMANCE AND STANDARDS: Lighthouse with the repo config (≥ 3 runs per page, medians): TBT, LCP, CLS against the budget. Check fonts and images per page, cache headers, compression, CSP/security headers (zero violations), valid HTML and structured data. |
| **browsers** | CROSS-BROWSER: Chromium, Firefox and WebKit on every page at three widths. Find visual differences that matter, broken features, console errors and font fallbacks. |
| **code** | CODE AND REPO: In a fresh clone, run the full check/build/tests. Review the recent diff for bugs, dead code, type holes, duplicated logic, design-token misuse and test quality. Check that CI is correct and green, and that nothing private or secret is in the tree. |
| **design-system** | DESIGN SYSTEM: Are colours, spacing, type and motion all tokens? Are components consistent? Is it easy to change one token and see it everywhere? Does the documentation match reality? |

## Pass: text

| Angle | Prompt |
|---|---|
| **edit-reader** | TEXT AS THE TARGET READER: Read every page as the intended reader (e.g. a hiring CTO). Does it show what it should (seniority, outcomes, specifics)? Quote lines that are vague, padded, repeated or off-voice. Is any story told in full twice? |
| **de-ai** | AI TONE: Flag corny one-liners, slogans, "not X but Y", rule-of-three lists, payoff lines, winks, em-dash flourishes and personified tech. Quote each line and give a plain rewrite. Build a "patterns to avoid" list for the fixers. |
| **facts-privacy** | FACTS AND PRIVACY: Check every factual claim against the sources (repos, docs, the owner's answers). Flag overclaims, invented details and cross-page contradictions. Make sure no client names, IPs, internal hostnames, account IDs, secrets or links to private repos appear (rendered HTML, metadata, OG images, shipped JS, comments). |
| **repo-text** | REPO TEXT: README, ADRs, docs, commit messages, code comments. Are they accurate against the code? Concise? Right voice? No stale numbers? |

## Final round

Run one angle from each pass, plus facts/privacy and code: typically anim (craft and perf
combined), perf-standards, code, journeys (all viewports and browsers), a11y, text, and
facts. In re-check rounds, run only the failed and touched angles.

## Writing a new angle

One question, one owner. State:
1. what to check;
2. how to check it (tools, viewports, number of runs);
3. what counts as a blocker or major for this angle;
4. where to save the evidence.

If two angles would report the same finding, merge them or narrow one.
