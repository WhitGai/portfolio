# Munch Quest

A meal-planning game that turns picky eating into a quest. Built for two brave eaters (ages 6 and 9). Kids build balanced rainbow plates and climb a tasting ladder — **look → smell → lick → taste** — one brave bite at a time, earning points, levels, streaks, and badges. Offline, no login, runs from a single HTML file.

## Why it's built this way

It's grounded in how kids actually get braver with food, not in lecturing them:

- **Repeated, low-pressure exposure.** The tasting ladder lets a kid engage a food at *any* level — just looking at it counts and scores. No food is "eat it or fail."
- **Reward the try, not the clean plate.** Every rung earns points. The bravest available step is always the one celebrated.
- **Kid agency.** They pick the food, they pick the rung, they lock their own plate. The app never decides for them.
- **Balance as a game, not a rule.** "Eat the rainbow" becomes a visible meter — veg + fruit + protein across at least three colors — so a balanced plate is something to *win*, not something imposed.

## The split that matters

The fun lives on the surface; the scoring lives in a tested engine.

- **`engine.js`** — pure game logic. No DOM, no storage, no randomness. The food catalog, the balance rule, the tasting ladder, and all point/level/streak/badge math live here. It runs identically in the browser (`window.MunchEngine`) and in Node (`module.exports`), so the app ships the *exact* engine the tests verify.
- **`engine.test.js`** — 99 zero-dependency assertions pinning every rule a kid can touch. Run `node engine.test.js`. If it's green, the shipped behavior is the verified behavior.
- **`../munch-quest.html`** — the entire app in one file. Loads `engine.js`, renders the UI, persists each player to `localStorage`. Two profiles, fully independent.

## The engine, briefly

| Piece | Rule |
|---|---|
| **Tasting ladder** | `look(1) → smell(2) → lick(3) → taste(4)`. Each rung = **10 pts**. Reaching `taste` conquers the food: **+25 bonus**, added to the catalog. |
| **Balanced plate** | Covers **veg + fruit + protein** AND spans **≥ 3 rainbow colors**. Scores `colors × 5 + 50` bonus. |
| **Levels** | 7 tiers, Rookie Taster → Munch Master, at 0 / 100 / 250 / 450 / 700 / 1000 / 1400 pts. |
| **Streaks** | Consecutive active days. Reset on a gap. Feed the 🔥 badges. |
| **Badges** | 8 milestones — first bite, five foods, ten foods, veggie brave, rainbow plate, explorer, 3-day and 7-day streaks. |

## Run it

```bash
# play it
open munch-quest.html          # (serve the folder so engine.js loads)

# verify the engine
cd munch-quest && node engine.test.js
```

## Files

```
munch-quest.html      the app (one file, offline, no login)
munch-quest/
  engine.js           pure, testable game logic
  engine.test.js      99 passing assertions
  README.md           this file
```
