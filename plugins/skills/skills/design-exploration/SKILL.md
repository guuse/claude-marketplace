---
name: design-exploration
description: Turn a rough idea for a website, app or page into an agreed design through review rounds with the user. Ask the questions that matter, write a brief and a copy deck from real facts, build several divergent directions as clickable static mocks (published as artifacts where available), capture the user's reactions word for word, narrow and combine, and keep refining until the user approves a design. Ends with a handoff spec a production build can follow. Use this skill whenever the user wants to design something new from a loose description ("I want a portfolio that…", "make me some design options", "let's explore what this could look like", "show me a few directions"), wants UX/visual design rounds, or wants to iterate on mockups until they like one — even if they don't say "design exploration".
---

# Design exploration

The user has a rough idea. Your job is to turn it into a design they say yes to, through short
rounds of **show, listen, adjust**. You lead: you propose, you ask, you make calls when the
answer is obvious, and you keep a written trail so nothing gets decided twice.

The user reacts to things far better than they describe them. So show early, show several
different options, and ask questions **about what they just saw**.

## The flow

```
0  Intake        ask the questions only the user can answer; research their own sources
1  Brief         BRIEF.md + CONTENT.md (copy deck from real facts) + a shared token contract
2  Diverge       3–5 clearly different directions as static mocks → publish → ask
3  Narrow        2–3 directions from the feedback, with a review bar for variants → publish → ask
4  Converge      one direction, refined round by round (combos allowed) → publish → ask
5  Agree         the user approves → a handoff spec (decision log, tokens, copy rules, mock → build map)
```

Loop inside steps 2–4 until the feedback stops changing direction. Expect many rounds: one
real project needed 17. That's normal; just keep each round small and fast.

## Step 0 — Intake

Restate the idea in two sentences and ask the first questions. Use the question bank in
`references/intake.md`. The essentials:
- **Who** is it for, in order, and what should each reader do or feel in 30 seconds and in 5 minutes?
- **What** goes on it: the content inventory. Where do the facts come from (their repos, docs,
  CV, the existing site)?
- **Mood**: three words, plus one or two sites they like and one they dislike (and why).
- **Constraints**: brand, stack, hosting, accessibility, languages, privacy (what must never
  appear: names, hosts, private links).

Rules:
- Use the AskUserQuestion tool where available. Ask 1–4 questions at a time, each with 2–4
  options and your recommendation first. Use `preview` for visual choices. Free-text "Other" is
  always there.
- Don't ask what you can find out. Read their repos, docs and old site first, then ask only
  to confirm or fill gaps.
- Never invent facts about the user. Mark unknowns `[CONFIRM: …]` in the copy deck and ask.
- If the user says "just go", make sensible calls, state them in one line each, and start
  Step 1.

## Step 1 — Brief, copy and contract

Write these in a `design/` folder in the repo (or the scratchpad if there's no repo).
Templates are in `references/templates.md`.
- **BRIEF.md**: who it's for, what the design must do, audiences with their 30 s / 5 min
  needs, constraints, and an **"avoid" checklist**: the generic look the user doesn't want
  (for a portfolio in 2026 that's gradient blobs, bento grids of icon cards, "passionate about…"
  copy, skill bars, a fake terminal). Each round is checked against it.
- **CONTENT.md**: the copy deck every direction uses, built from real facts with `[CONFIRM]`
  markers. Directions may cut or restructure it, but never invent facts.
- **The token contract** (`system/`): token names every direction must define (colour roles,
  type scale, spacing, radii, motion) and a direction-neutral base CSS. That way a direction
  is a **skin**, not a rewrite, and the winner can be ported to production cleanly.

## Step 2 — Diverge

Build **3–5 directions that genuinely differ** in concept, layout, type and colour, not five
shades of one idea. Each direction is a folder `directions/NN-name/` with:
- `index.html` plus 1–2 key inner pages, static HTML/CSS with only the JS it needs, real copy
  from CONTENT.md and placeholders in the right aspect ratio;
- `README.md`: the idea in 3 sentences, the type choices and why, why it fits this user, what it
  needs (photos, illustrations) and how it scales to more content.

Load the `artifact-design` skill before building, if available. Then publish each direction as
an artifact (one per direction, or one index with links). Without an Artifact tool, serve it
locally and send screenshots at desktop and phone widths. Present them side by side in one
message: name, one line each, and the link.

Then ask: "Which one do you *feel*, and what do you dislike in each?" Write down the answer
**verbatim** in the round log. Strong negative reactions ("none of these; it shouldn't be that
techy") are the most valuable feedback: they reset the brief. Update BRIEF.md with them.

## Step 3 — Narrow

Build 2–3 directions from the feedback, all on the same token contract. Add a **review bar**
(`assets/review-bar.js`) to each mock: switches for colour options, copy voice and heading
style, driven by `?param=` and localStorage. The user can then compare variants in one
artifact instead of five. Ask them to pick per switch, with a recommendation.

## Step 4 — Converge

Develop the chosen direction round by round. Each round:
1. Apply the feedback, and **only** the feedback plus what it implies. Don't sneak in
   redesigns.
2. Append a "Round N" section to the direction's README: the feedback (quoted), what changed,
   and why.
3. Save screenshots to `previews/rNN-*` at desktop and phone width.
4. Republish the same artifact URL, then ask 1–3 focused questions about this round.

Moves that work:
- **Combos.** "The header from this round, the styling from the previous one": build exactly
  that. Keep old rounds reachable (git history or previews), so going back is cheap.
- **Content questions alongside design.** Depth of copy changes the layout. Ask about the real
  work ("what did you actually do there?") and offer clickable options instead of open
  questions where you can.
- **Fresh eyes.** Every few rounds, a reviewer agent (if available) looks at the mock against
  BRIEF.md and the avoid list, without your context, and you fix the clear hits before
  showing the user.

See `references/rounds.md` for round mechanics, feedback capture and how to tell convergence
from churn.

## Step 5 — Agree and hand off

The design is agreed when the user says so in their own words ("this is really good now", "yes
to all"). Don't declare it yourself. Then write the handoff:
- the decision log in BRIEF.md (direction, palette, voice, type, and the rejected options with why);
- the final token values and the component inventory;
- the copy deck with the writing rules learned along the way (the words to avoid, voice, naming rules);
- a mock → production map (which mock file becomes which part of the build);
- an archive note: earlier rounds are history and are not shipped.

Ask whether they want to start the production build next. Don't start it unasked.

## Pitfalls

- **Clever concepts nobody asked for.** Round-1 metaphors (a datasheet, a floor plan, a zine)
  can be fun for you and "cringy" for them. Include at least one plain, well-made direction.
- **Inventing facts** to fill a mock. Use placeholders and `[CONFIRM]` markers.
- **Too many questions at once**, or open questions where options would do.
- **Losing feedback.** Quote it in the round log, or you'll undo it in round 9.
- **Directions that differ only in colour.** Diverge on structure and type first.
- **Private details in the mocks.** If the repo is public, apply the privacy rules from
  intake to the copy, the screenshots and the file names.
