---
name: muyu-frontend-taste
description: Use when designing or implementing MuYu personal homepage, portfolio, Life Log, visual demos, or any frontend surface where taste, visual personality, motion, and narrative hierarchy matter more than component count.
---

# MuYu Frontend Taste Skill

This project style is based on the local `frontend-skill`:

`/Users/limuyu/.codex/skills/frontend-skill/SKILL.md`

The local adaptation is: build a personal site that feels like a precise builder's notebook, not a generic portfolio. The page should carry both work intelligence and off-screen life texture.

## Visual Thesis

Use restrained editorial composition with tactile materials: paper, notebook lines, postcards, route marks, object-like UI, and deliberate motion. The energy should feel thoughtful, slightly handcrafted, technically competent, and not over-explained.

## Core Taste Rules

- One section, one dominant idea. Do not stack many "cool" effects in one viewport.
- Let the first read come from composition, scale, image, and spacing before decoration.
- Use cards only when the card is the interaction: a note, postcard, project page, city tab, modal, or repeated item.
- Avoid generic SaaS grids, floating dashboard cards, purple-blue gradients, decorative orbs, and over-rounded pill clutter.
- Prefer paper, objects, routes, sticky notes, pages, and selected states over abstract glow.
- Keep copy short, observational, and specific. Do not explain the UI inside the UI.
- Use Chinese main copy when personality matters; use English only as small labels, tags, or system-like texture.
- Motion should change hierarchy: selected page, sticky narrative, depth transition, tab switch, hover lift.
- On mobile, avoid giant scroll-linked theatrics. Use snap, horizontal indexes, or compact object stacks.
- Verify desktop and mobile screenshots before calling a design done.

## Page Personality

Main homepage:

- Work narrative first: maker, problem source, forge, shipped output.
- Keep "life" as a light entry, not a full map on the homepage.
- Project showcase should feel like selecting one serious page, not browsing random cards.
- Avoid forcing labels like "Honest Mode" if they sound performative. Prefer concrete words like `FRICTION`, `FORGE`, `SHIPPED`, `Life Log`.

Life Log:

- Treat travel as a separate notebook page, not a conversion section.
- For many locations, use a city index plus one focused journal page.
- The index is navigation only; the right-side page carries the story.
- Existing places can use real/SVG postcards; future places can use generated notebook sketches until real assets exist.
- "待打卡行程" can use sticky notes because it is informal and future-facing.

## Interaction Patterns

Sticky narrative:

- Use scroll to move between modes, but snap to settled pages when the user stops.
- Avoid long ambiguous middle states if the intended feeling is page switching.
- For depth transitions, scale and distance are better than pure opacity fades.

Project or work showcase:

- Desktop can use sticky stage plus selected project page.
- Mobile should use horizontal `scroll-snap`.
- Make only one item dominant at a time.

Large location sets:

- Use a scrollable vertical index on desktop.
- Use a horizontal index on mobile.
- Always set `min-width: 0` on grid children that contain horizontal scrolling.
- Keep the detail panel stable so switching content does not resize the whole layout.

## Implementation Checks

Before finishing:

- Check `git diff` to understand only intentional changes.
- Run screenshots for at least one desktop and one mobile viewport.
- Check deep links for selected states, for example `life.html?place=changsha#been-there`.
- Look for horizontal overflow on mobile.
- Check that text does not overlap, clip, or force containers wider than the viewport.
- Make sure generated images, SVGs, or data URIs actually render.

## Anti-Patterns

- Hero text inside a card.
- Sections styled as floating cards just to look designed.
- Four or more unrelated visual metaphors in one page.
- Placeholder project cards with weak symbols instead of real product output.
- Travel maps on the homepage if they distract from work credibility.
- Big explanatory paragraphs about "design concept" inside the product UI.
- A palette dominated by one trendy hue family.

## Current Working Motifs

- `ENGINEER / FRICTION / FORGE / SHIPPED` for work identity.
- Paper notebook, postcards, route lines, and city index for Life Log.
- Sticky notes for future travel plans.
- Selected page/depth motion for project browsing.
- Sparse English labels as texture; Chinese copy as the human layer.
