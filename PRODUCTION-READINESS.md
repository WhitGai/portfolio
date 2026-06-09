# From portfolio to product — readiness & what's left

Both repos are now built as real products, not demos: installable, tested,
containerized, CI-ready, and (for Recruit) backed by a live API. This is the
state and the precise remaining steps — split by who does them.

## Done (in the code, verifiable today)

| Area | CourtVision Rules MCP | Recruit Ops |
|---|---|---|
| Tests | 26 passing | 33 passing |
| Installable | `pip install -e .` · `courtvision-rules-mcp` | `pip install -e .` · `recruit-ops*` scripts |
| Runnable service | MCP over stdio (or `MCP_TRANSPORT=sse`) | Live hub + REST API (`recruit-ops-serve`, :8090) |
| Live app | n/a (protocol layer) | Hub fetches the API; Select/Submit are real writes; auto-seeds a demo slate |
| CRM | n/a | Bullhorn + Salesforce read (repository) and write (adapters) |
| Intake | n/a | Slack/Teams webhook receiver |
| Container | Dockerfile | Dockerfile + docker-compose + healthcheck |
| CI | GitHub Actions (3.10–3.12) | GitHub Actions (3.10–3.12) |
| Hygiene | Makefile, CHANGELOG, CONTRIBUTING, badges | same |

59 tests total. No secrets committed. Synthetic data only.

## What still needs YOU (accounts, money, or auth I can't do)

These are the genuine "make it a deployed product" steps — each needs your
credentials or a paid resource, so you do them (I'll guide live):

1. **GitHub** — confirm the handle (`WhitGai`), create the repos, push.
   You authenticate; I prep commits and walk you through it. *(blocks everything below)*
2. **CI activation** — happens automatically on first push (workflows are in
   `.github/workflows/`). Just confirm the green check appears.
3. **Host the Recruit hub** — pick a runtime and deploy the container:
   - Easiest: Render / Railway / Fly.io (point at the repo, it builds the Dockerfile).
   - Or any box with Docker: `docker compose up -d`.
   - You'll set env vars there (see below). Needs a hosting account (free tiers exist).
4. **Domain + HTTPS** (optional) — a custom domain for the hub and for Slack/Teams
   webhooks (both require public HTTPS URLs). Needs a domain purchase.
5. **API keys / OAuth** — add as host env vars, never in git:
   - `ANTHROPIC_API_KEY` — turns on the LLM documenter (else offline fallback).
   - `SLACK_BOT_TOKEN` / Slack app setup — live intake + replies.
   - `TEAMS_WEBHOOK_URL` — Teams replies.
   - Bullhorn OAuth (`BULLHORN_REST_URL`, `BULLHORN_REST_TOKEN`) — live CRM read/write.
   - Salesforce OAuth (`SALESFORCE_INSTANCE_URL`, `SALESFORCE_ACCESS_TOKEN`).
6. **Hosted MCP (optional)** — to expose CourtVision beyond your own machine, run
   it with `MCP_TRANSPORT=sse` behind HTTPS. For local use (Claude Desktop), the
   stdio config in the README is all you need — no hosting required.
7. **Custom domain for GitHub Pages** (optional) — for the portfolio landing page.

## Suggested order

1. Publish to GitHub (live, together) → 2. confirm CI green → 3. deploy the hub
container to a free host → 4. add `ANTHROPIC_API_KEY` → 5. wire Slack when you
want live intake → 6. CRM OAuth when you have a sandbox to test against.

Nothing above is blocked by code. It's all accounts and auth — the build is done.
