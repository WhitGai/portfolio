# Publishing the portfolio to GitHub — live walkthrough guide

We'll do this together when you're at your laptop. I'll drive the browser steps
with you (via Claude in Chrome) and prep the local git work; **you** authenticate
and click the final publish/push. I never enter your credentials.

Everything below is already publish-ready: no secrets committed, `.env` and data
stores are git-ignored, both repos are MIT-licensed, 53 tests pass.

## What gets published

| Repo | What it is |
|---|---|
| `courtvision-rules-mcp` | Pickleball rules MCP server (doubles/singles, side-out/rally) |
| `recruit-ai-documenter` | AI recruiting desk: documenter + matcher + hub + CRM + webhook |
| `WhitGai` (profile) | Special repo whose README shows on your GitHub profile |

## Steps (we do these live)

1. **Confirm your handle.** The repos reference `github.com/WhitGai`. If
   that's not your handle, tell me and I'll update every link first.
2. **Create the repos.** On github.com → New repository → name it exactly
   `courtvision-rules-mcp` (public, no README/license — we have them). Repeat for
   `recruit-ai-documenter`. For the profile, create a repo named exactly
   `WhitGai` and drop in `profile-README.md` as its `README.md`.
3. **Push the code.** From each repo folder on your machine:
   ```bash
   cd "courtvision-rules-mcp"
   git init && git add . && git commit -m "CourtVision rules MCP — doubles/singles, side-out/rally"
   git branch -M main
   git remote add origin https://github.com/WhitGai/courtvision-rules-mcp.git
   git push -u origin main
   ```
   (Same for `recruit-ai-documenter`.) You'll authenticate the push.
4. **Turn on GitHub Pages** (optional, high-leverage) for a live link:
   repo → Settings → Pages → deploy from `main` / root. The hub then has a public
   URL you can send. The `portfolio/` landing page can be its own Pages repo too.
5. **Pin both repos** on your profile so they show first.
6. **Add a screenshot/GIF.** Once Pages is live, I can capture a real screenshot
   of the hub and engine for the README hero images (currently committable SVGs).

## Pre-flight checklist (already done)

- [x] No secrets in source (scanned)
- [x] `.gitignore` covers `.venv`, `__pycache__`, `.env`, data stores
- [x] MIT `LICENSE` in both repos
- [x] READMEs with preview images and quickstart
- [x] 53 tests passing (26 CourtVision, 27 Recruit)
- [x] Synthetic-data / clean-room note in both READMEs

## When ready

Say "let's publish" while you're at your laptop and I'll start the live
walkthrough.
