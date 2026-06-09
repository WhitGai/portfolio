# Idea → Execution: how I build with AI

A repeatable method for going from a raw idea to a shipped, tested, documented
product — fast, and faster each time. The projects are proof; this is the engine.

---

## The one principle everything hangs on

**The LLM extracts; tested code decides.**

Anything that must be *exact* — a game rule, a match score, a CRM field mapping —
lives in deterministic, tested code. The model orchestrates around it: reading
messy input, pulling out structure, narrating results. This is the line between a
demo that drifts and a system you can trust in front of real people.

Everything below is in service of that principle.

## The pipeline (idea → live in ~a day)

1. **Idea → one-line brief.** What it does, who it's for, and *the one thing that
   must be correct*. That last clause is the whole design — it tells you what to
   put in tested code.
2. **Scaffold the shape.** A small, dependency-light **engine** (the load-bearing
   logic) + a **surface** (MCP server, web app, or API) + **tests** from day one.
   The engine never imports the surface.
3. **Build the engine first, test it hard.** Pin the tricky cases. If the engine is
   right, the product is trustworthy.
4. **Wrap it in surfaces.** One engine answers from many places — a chat tool, a
   bot, a web UI — because the surface only renders what the engine computes.
5. **Make it real software.** Installable, containerized, CI on every push. Offline
   must always work (no demo should need credentials).
6. **Publish & document.** Ship to GitHub; write the architecture + a build-vs-
   production spec so the gaps are owned, not hidden.

## The toolchain

- **Claude (Cowork)** — the build environment: research, code, tests, docs, design
  surfaces, and browser/desktop actions in one place.
- **MCP** — the protocol layer when a model needs a provably-correct tool to lean on.
- **Local `Repos` folder + GitHub Desktop** — code lives local (never in cloud-sync),
  GitHub is the backup and the shop window.
- **The pattern is the moat** — engine + surface + tests + spec. Reusable across any
  domain; each new project starts from a known shape.

## Why it scales

- **Adapters & repositories** make integrations additive — a new CRM or data source
  is a new file, not a rewrite.
- **One engine, many surfaces** means new front-ends are wiring, not rebuilds.
- **Each project is faster** — the folder structure, the publish flow, and the
  principles are already decided; only the domain logic is new.

## The receipts (built with this method)

| Project | The exact thing in code | Surfaces |
|---|---|---|
| **Recruit Ops** | Explainable candidate↔job match scores; CRM field mapping | MCP · Slack/Teams intake · selection-hub web app · Bullhorn/Salesforce |
| **CourtVision Rules MCP** | Pickleball side-out/rally scoring | MCP tools |
| **CourtVision Match Mode** | The same scoring, in the browser | Live scorekeeper web app |

Three public repos — installable, tested, containerized, CI-wired, each with an
architecture spec. From scattered ideas to shipped products on one stack.

---

*Part of the Gerrity AI methodology. The capability is the product; the apps are the proof.*
