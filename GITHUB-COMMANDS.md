# Publish to GitHub — one paste (handle: WhitGai)

Run this in **Git Bash** (Start menu → "Git Bash"). It clears the broken `.git`
stubs, commits, and publishes all three repos. If you have the GitHub CLI (`gh`)
it also creates the repos for you; if not, it sets the remotes and tells you to
create each empty repo on github.com first.

```bash
cd "/c/Users/Gerri/OneDrive/.Claude_Master File/Vibe Coding"

for r in courtvision-rules-mcp recruit-ai-documenter; do
  ( cd "$r" \
    && rm -rf .git \
    && git init -q && git add . \
    && git -c user.name="Whit Gerrity" -c user.email="whitlgerrity@icloud.com" commit -qm "Initial release: $r" \
    && git branch -M main \
    && if command -v gh >/dev/null 2>&1; then \
         gh repo create "WhitGai/$r" --public --source=. --remote=origin --push ; \
       else \
         git remote add origin "https://github.com/WhitGai/$r.git" ; \
         echo ">> Create an empty repo WhitGai/$r on github.com, then run: (cd \"$r\" && git push -u origin main)" ; \
       fi )
done
```

## Profile repo (shows on your github.com/WhitGai page)

```bash
cd "/c/Users/Gerri/OneDrive/.Claude_Master File/Vibe Coding/portfolio"
mkdir -p WhitGai-profile && cp profile-README.md WhitGai-profile/README.md
cd WhitGai-profile
git init -q && git add . \
  && git -c user.name="Whit Gerrity" -c user.email="whitlgerrity@icloud.com" commit -qm "Profile README" \
  && git branch -M main
if command -v gh >/dev/null 2>&1; then
  gh repo create "WhitGai/WhitGai" --public --source=. --remote=origin --push
else
  git remote add origin "https://github.com/WhitGai/WhitGai.git"
  echo ">> Create an empty repo named WhitGai/WhitGai on github.com, then: git push -u origin main"
fi
```

## First push authentication
The first `git push` (or `gh`) opens a browser window to authorize — that's you
authenticating, which is exactly right. Approve it and the push completes.

## After publishing
- CI runs automatically (`.github/workflows/ci.yml`) — look for the green check.
- Each repo → Settings → Pages → deploy from `main` / root for a live link.
- Pin both project repos on your profile.

## Don't have gh and prefer it?
Install once: `winget install GitHub.cli` (then close/reopen Git Bash), and the
block above does everything in one go.
