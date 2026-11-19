# Templates

## design/BRIEF.md

```markdown
# Design brief: <project>

> **Decision (round N):** <direction>, palette <x>, voice <y>, headings <z>. (Updated as rounds land.)
> **Feedback that reset the brief:** "<the user's quote>" (round N)

## 1. Who this is for
<the person or product in 3 sentences>

| # | Audience | In 30 seconds they want | In 5 minutes they want |
|---|----------|-------------------------|------------------------|
| 1 | | | |

Not the audience: <who, and why>

## 2. What the design has to do
1. <say who/what/where in one screen>
2. <show depth instead of claiming it>
3. <the feel, in the user's words>
4. <fast, accessible, well made>

## 3. Avoid (checked every round)
- [ ] <the generic look for this genre, e.g. gradient blob hero, bento icon cards, skill bars>
- [ ] <copy clichés>
- [ ] <anything the user said they dislike>

What reads as made by a person: specifics, a point of view in the layout, type with character,
humour that comes from the content.

## 4. Constraints
Stack, hosting, a11y/perf bar, languages, public repo.
**Privacy:** <what must never appear>.
```

## design/CONTENT.md

```markdown
# Content inventory and copy deck
Every direction uses this copy. Directions may shorten or restructure it, but must not invent
facts. Items marked `[CONFIRM]` need the owner's check before launch.

## 0. Meta
| Field | Value |
|---|---|
| Name | |
| Role | `[CONFIRM since when]` |
| Contact | |
| Page title / description | |

> **Naming rules:** <e.g. never name X; say "an old laptop">

## 1. Hero
One-liner options: A. … B. … C. …

## 2…n. Sections
<facts, numbers, stories, sourced: "(from repo X, README)">

## Writing rules
<voice, the words to avoid, spelling, punctuation: grows every round>
```

## design/system/ (token contract)

```
FOUNDATIONS.md     tiers (primitive → semantic → component), scales, a11y, motion, perf rules
tokens.schema.json the token names every direction must define
base.css           reset + direction-neutral primitives
```
A direction's `system.html` sets the token values and shows each component once.

## directions/NN-name/README.md

```markdown
# NN-name · <one-line idea>

## The idea
<3 sentences>

## Type
<fonts and why>

## Why it fits <user>
<tie it to the brief's audiences and the user's words>

## What it needs
<photos, illustrations, screenshots: a shot list with ratios>

## How it scales
<more projects, more pages, phone>

## Round N: …   ← appended each round (see rounds.md)
```

## Handoff (end of BRIEF.md, or design/README.md)

```markdown
## The approved design
<direction> after round N is the spec for the build.

| Mock | Production |
|---|---|
| <site.css values> | <tokens/> |
| <art.js> | <component/lib> |
| <*.html> | <pages> |

Rejected options and why: <list>.
Everything under archive/ and earlier rounds is history and is not shipped.
```
