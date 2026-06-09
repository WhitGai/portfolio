# Demo walkthrough — talk track

A ~3.5-minute narrated demo for presenting the portfolio live, or as the script
for a screen recording. Two projects, one thesis. Times are guides.

**Assets to have open:** `portfolio/index.html` (landing), the two demo GIFs
(`courtvision-demo.gif`, `recruit-hub-demo.gif`), and — if presenting live — the
real hub at `recruit-ai-documenter/hub/index.html`.

---

## 0:00 — Cold open (20s)

> "Language models are great at reading messy input and pulling out structure.
> They're unreliable the moment something has to be *exact* — a score, a rule, a
> calculation. So I build that way on purpose: the model extracts, and tested
> code decides. Here are two systems built on that one idea."

*(On screen: the landing page header / thesis line.)*

---

## 0:20 — Project 1: Recruit Ops (75s)

> "Recruit Ops is an AI recruiting desk. Intake comes in where recruiters already
> live — Slack, Teams, or Claude. Claude documents it and matches candidates to
> the role. Then the client sees this."

*(Play `recruit-hub-demo.gif`, or click through the live hub.)*

> "This is the candidate-selection hub. Six candidates, ranked. But the score
> isn't a black box — every one carries a rationale. Dana scores 92 because she's
> four-for-four on required skills. Lena's strong too, but she's a lead applying
> to a senior role, so she gives back a few points. Devin drops to 'possible' —
> he's missing Kubernetes and Terraform."

> "The key part: the LLM read the resumes and pulled out the skills. But the
> *number* — 92 versus 78 — is computed by tested Python. That's defensible in a
> room. I click select, and it writes straight back to Bullhorn or Salesforce
> through one MCP server. Same engine answers from Claude, a Slack bot, or here."

**Live option:** open the hub, expand "Why this score" on Lena, hit "Submit
selected" to show the exact MCP payload.

---

## 1:35 — Project 2: CourtVision Rules MCP (60s)

> "Same idea, different domain. CourtVision is a pickleball companion. Pickleball
> scoring is exactly the thing a model gets *almost* right and then drifts on —
> the one-server rule, the rotation, win-by-two."

*(Play `courtvision-demo.gif`.)*

> "So I moved scoring out of the model and into an MCP server. Watch the same
> seven rallies run through four different rule sets at once — doubles and
> singles, side-out and rally scoring. Side-out only credits the serving side, so
> it lands at 3-1-1 and 2-2. Rally scores every point, so both reach 4-3. One
> engine, every call correct, twenty-six unit tests pinning the tricky cases."

> "The model never improvises a rule. It calls a tool that can't be wrong."

---

## 2:35 — How it's built (35s)

> "All of this was built on the Claude stack: the engines, the CRM layer, and the
> webhook in code; the hub as a visual surface; the publish and OAuth steps in the
> browser with me in the loop. Fifty-three tests across the two repos. Clean-room
> and synthetic data — no former-employer IP."

*(On screen: the deck's "Proof" slide — 53 / 2 / 4 / 0.)*

---

## 3:10 — Close (15s)

> "Two working MCP servers, a live product surface, and one principle underneath:
> the model extracts, the code decides. That's how I'd build the next one too."

*(Landing page footer / contact.)*

---

## Recording tips

- Record at 1280×720 or higher; the GIFs are already sized for clean playback.
- For a live capture of the real hub, open `recruit-ai-documenter/hub/index.html`
  full-screen and use the Select / Why-this-score / Submit interactions.
- Keep it under 4 minutes. If you need a 60-second cut, use the cold open +
  Recruit hub + close.
