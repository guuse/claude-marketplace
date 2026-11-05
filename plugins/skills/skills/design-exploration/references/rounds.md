# Running design rounds

## One round
1. **Read the feedback twice.** Split it into: explicit changes, implied changes (e.g. "too
   techy" also means fewer mono labels and no terminal motifs), and questions to ask back.
2. **Change only that.** If you see something else worth changing, propose it as a question;
   don't slip it in.
3. **Check against BRIEF.md's avoid list** and the privacy rules.
4. **Screenshot** at desktop (1440) and phone (390) width into `previews/rNN-<direction>-*`.
   Look at the screenshots yourself before showing them.
5. **Publish**: republish the same artifact (same URL) so the user's link stays current. For
   a structural fork the user might want to compare, publish a second one.
6. **Log** a "Round N: <title>" entry in the direction's README:
   ```
   ## Round N: <short title>
   Feedback: "<the user's words, quoted>"
   - What changed, and why (one bullet per change)
   - Removed: <things taken out>
   - Open: <questions asked this round>
   ```
7. **Ask** 1–3 questions about this round, each with options and a recommendation.

## Diverging well (round 1)
Vary these deliberately across directions:
- **Concept**: plain/editorial, image-first, typographic, illustrative, a metaphor.
- **Layout**: centred/asymmetric, single column/grid, long scroll/separate pages.
- **Type**: serif display, characterful grotesk, mono accents, or none.
- **Colour**: light, dark, one strong accent, near-monochrome.

At least one direction should be the **plain, well-made** option. Users often turn out to want
"just a normal website, done well".

## Narrowing well (round 2)
- Keep 2–3 directions, each one mood the user reacted to positively.
- Put them all on the shared token contract, so switching skins is cheap.
- Add the review bar for the variant axes the user is unsure about (palette, copy voice,
  heading style). Ask for one pick per axis.

## Converging
- When the user asks for a combo ("this header, that styling"), build exactly that and say
  which round each part came from.
- When feedback shrinks to wording and spacing, you're converging; ask whether anything bigger
  is still bothering them.
- When feedback keeps flipping, stop and ask the underlying question: "Is the goal X or Y?"
  Churn usually means the brief is wrong, not the mock.
- Bring in content depth early. A layout that works with three lines per project can break
  with three paragraphs.
- Every 3–4 rounds, or before calling it final: run a fresh-eyes review (an agent without your
  context, or yourself with only BRIEF.md) against the avoid list, the audiences' 30-second
  test, and phone width.

## Mock quality bar
Mocks are for deciding, not for shipping, but they must be good enough to judge:
- real copy (from CONTENT.md), never lorem ipsum;
- placeholders in the right aspect ratio with a caption saying what goes there;
- working at phone width;
- the key interactions present (hover, a detail page, a scroll moment) if the design depends
  on them;
- no external requests a published artifact can't make. Inline or bundle assets.
