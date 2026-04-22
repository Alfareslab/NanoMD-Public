# 🚀 Cloudflare Workers + GitHub Auto-Deploy — Deployment Report & Guide

> **Project:** NanoMD  
> **Date:** 2026-02-25  
> **Stack:** Vite + React + TypeScript → Cloudflare Workers  
> **Repo:** `Alfareslab/NanoMD-Public`  
> **Live URL:** `nanomd.alfares-acelab.workers.dev`

---

## 📋 Overview

This report documents the full deployment pipeline setup for serving a **Vite/React static site** via **Cloudflare Workers**, with **automatic deploys triggered from GitHub pushes**.

---

## 🔴 Errors Encountered & Fixes Applied

### Error 1: No Automatic Deployments After Git Push

| Detail | Value |
|--------|-------|
| **Symptom** | Pushing to `main` branch did NOT trigger a new Cloudflare build |
| **Root Cause** | Missing `wrangler.toml` and Worker entry point (`src/worker.ts`) |
| **Why** | `npx wrangler deploy` (the Deploy command) needs both files to function |

**Fix:**

Created `wrangler.toml`:

```toml
name = "nanomd"
main = "src/worker.ts"
compatibility_date = "2024-12-01"

[site]
bucket = "./dist"
```

Created `src/worker.ts`:

A Worker script using `@cloudflare/kv-asset-handler` to serve static files from `dist/`.

---

### Error 2: TypeScript Build Failure — `ExecutionContext` Not Found

| Detail | Value |
|--------|-------|
| **Symptom** | `error TS2304: Cannot find name 'ExecutionContext'` |
| **Root Cause** | `tsc -b` was compiling `src/worker.ts` along with the React app |
| **Why** | `ExecutionContext` is a Cloudflare Workers type, not available in the browser TypeScript config |

**Fix:**

Added `exclude` to `tsconfig.app.json`:

```json
{
  "include": ["src"],
  "exclude": ["src/worker.ts"]
}
```

> `wrangler` compiles `worker.ts` separately with its own types — no need for the main `tsc` to touch it.

---

### Error 3: Root Directory Misconfiguration

| Detail | Value |
|--------|-------|
| **Symptom** | Build fails because `package.json` not found |
| **Root Cause** | "Root directory" in Cloudflare was set to `dist` instead of `/` |
| **Why** | Root directory = where source code lives (`package.json`), NOT the build output |

**Fix:**

Changed Root directory back to `/` (empty) in Cloudflare Dashboard → Settings → Build Configuration.

---

### Error 4: TypeScript Strict Mode — Unused Import

| Detail | Value |
|--------|-------|
| **Symptom** | `error TS6133: 'useMemo' is declared but its value is never read` |
| **Root Cause** | Unused import in `PreviewPane.tsx` |

**Fix:** Removed the unused `useMemo` import.

---

### Error 5: React-Markdown Component Type Mismatch

| Detail | Value |
|--------|-------|
| **Symptom** | Complex TypeScript error on `components` prop in `ReactMarkdown` |
| **Root Cause** | Strict typing conflict between custom component props and `react-markdown` types |

**Fix:** Changed the `code` component to use `any` for props typing.

---

## ✅ Correct Cloudflare Dashboard Settings

| Setting | Correct Value | ⚠️ Common Mistake |
|---------|--------------|-------------------|
| **Build command** | `npm run build` | — |
| **Deploy command** | `npx wrangler deploy` | — |
| **Root directory** | `/` (empty) | ❌ Setting it to `dist` |
| **Production branch** | `main` | — |

---

## 📁 Required Files for Cloudflare Workers Static Site

| File | Purpose | Without It |
|------|---------|------------|
| `wrangler.toml` | Tells Wrangler the worker name, entry point, and static assets folder | ❌ `wrangler deploy` fails |
| `src/worker.ts` | The Worker script that serves files from `dist/` to visitors | ❌ No entry point = no deployment |
| `@cloudflare/kv-asset-handler` (dependency) | Library used by the worker to serve static files | ❌ Worker crashes at runtime |
| `tsconfig.app.json` (with exclude) | Must exclude `worker.ts` from main TypeScript compilation | ❌ Build fails with type errors |

---

## 🛡️ Checklist for New Projects (Same Setup)

Use this checklist when setting up a new **Vite/React + Cloudflare Workers** project:

- [ ] Create `wrangler.toml` with `name`, `main`, `compatibility_date`, and `[site] bucket`
- [ ] Create `src/worker.ts` with the static asset serving logic
- [ ] Install `@cloudflare/kv-asset-handler` as a dev dependency
- [ ] Exclude `src/worker.ts` in `tsconfig.app.json` → `"exclude": ["src/worker.ts"]`
- [ ] Verify `npm run build` passes locally before pushing
- [ ] In Cloudflare Dashboard, set Root directory to `/` (NOT `dist`)
- [ ] In Cloudflare Dashboard, connect the GitHub repo and set branch to `main`
- [ ] Confirm first auto-deploy triggers successfully after a `git push`

---

## 🔄 Deployment Flow (How It Works)

```
git push origin main
       ↓
GitHub notifies Cloudflare (webhook)
       ↓
Cloudflare clones repo → cd / (Root directory)
       ↓
Runs: npm clean-install
       ↓
Runs: npm run build (tsc + vite build → creates dist/)
       ↓
Runs: npx wrangler deploy (reads wrangler.toml → uploads dist/ + worker.ts)
       ↓
Site is live at: nanomd.alfares-acelab.workers.dev ✅
```

---

## 📌 Key Takeaways

1. **Root directory ≠ Build output.** Root = where `package.json` lives. Output = `dist/`.
2. **Workers need an entry point.** Unlike Cloudflare Pages, Workers require a `worker.ts` script.
3. **Exclude worker from main tsc.** Wrangler compiles the worker separately.
4. **Always test `npm run build` locally** before pushing to avoid failed Cloudflare builds.
5. **Check Deployments tab** in Cloudflare Dashboard → "View build history" to see logs.
