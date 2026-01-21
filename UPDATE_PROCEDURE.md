# Update Procedure - mongooseproject

## Standard Update (Most Common)

```bash
cd /Users/robertturner/local-only/framer-site
./update-content.sh
git add site/ download-site.sh update-content.sh
git commit -m "Update from Framer"
git push origin main
```

That's it. Netlify auto-deploys in 1-2 minutes.

---

## If Git Says "Changes not staged"

This means files weren't added. Run:

```bash
git add site/ download-site.sh update-content.sh
git commit -m "Update from Framer"
git push origin main
```

---

## If Git Says "Your branch is ahead"

You have uncommitted changes. Run:

```bash
git add site/ download-site.sh update-content.sh
git commit -m "Update from Framer"
git push origin main
```

---

## If Git Says "Your branch is behind"

Someone else pushed, or you made changes elsewhere. Run:

```bash
git pull origin main
# Then continue with normal update
./update-content.sh
git add site/ download-site.sh update-content.sh
git commit -m "Update from Framer"
git push origin main
```

---

## If Git Says "Merge conflict"

**Don't panic.** Run:

```bash
git status
# See which files have conflicts
# Edit the conflicted files, remove the conflict markers (<<<<<<, ======, >>>>>>)
# Then:
git add .
git commit -m "Resolve merge conflict"
git push origin main
```

**Or, if you just want to keep your local version:**

```bash
git checkout --ours site/
git add site/
git commit -m "Update from Framer (keep local)"
git push origin main
```

---

## One-Liner (Copy/Paste)

```bash
cd /Users/robertturner/local-only/framer-site && ./update-content.sh && git add site/ download-site.sh update-content.sh && git commit -m "Update from Framer" && git push origin main
```

---

## Quick Reference

**Always do these 3 commands after `./update-content.sh`:**
1. `git add site/ download-site.sh update-content.sh`
2. `git commit -m "Update from Framer"`
3. `git push origin main`

**That's it. Everything else is automatic.**
