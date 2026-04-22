# 🗺️ NanoMD v1.2.0 — Print & Share Features
> **الإصدار:** 1.2.0
> **التاريخ:** 2026-04-22
> **المنهجية:** Multi-Model Development

---

## 🎯 الهدف العام

Add two major features to NanoMD:
1. **Print** — Clean, preview-only printing via `@media print` CSS with a dedicated button.
2. **Share via Cloudflare KV** — Generate short shareable links that store content on Cloudflare KV with 30-day TTL auto-expiry, plus a local share history panel.

---

## 🚪 بوابات ما قبل التنفيذ (Pre-Implementation Gates)

### 🚪 بوابة البساطة:
- [x] The solution uses the **minimum number of files** possible
- [x] No "future improvements" or speculative code
- [x] Every technical decision has a **clear reason**

### 🚪 بوابة عدم التجريد:
- [x] We use the framework **directly** (React + Cloudflare Workers)
- [x] No unnecessary abstraction layers

### 🚪 بوابة الوضوح:
- [x] Requirements are **100% clear** (confirmed with developer)
- [x] No pending `[need clarification]` items

---

## 📅 المراحل التنفيذية

---

### **المرحلة 1: Print Feature — CSS & Button 🖨️**
> **النموذج:** `Claude Opus` 🔴
> **الهدف:** Enhance existing print styles and add a print button to the Header (visible only when content exists).
> **يعتمد على:** لا شيء (مرحلة مستقلة)

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[x]` | `[ ]` | Enhance `@media print` rules in `src/styles/globals.css` — hide Header, Footer, MobileNav, CopyMenu FAB, editor pane, sidebar |
| `[x]` | `[ ]` | Add print-specific rules in `src/styles/preview.css` — clean Review Tables (hide action buttons, quick-buttons, input fields, progress bar, copy bar; show data-only table) |
| `[x]` | `[ ]` | Add `Printer` icon button to `Header.tsx` — visible only when `hasContent` is true, placed in Row 2 (Actions) after the copy button |
| `[x]` | `[ ]` | Pass `hasContent` prop from `App.tsx` to `Header.tsx` to conditionally show Print & Share buttons |
| `[x]` | `[ ]` | Test: verify `window.print()` produces clean preview-only output with no UI chrome |

**الملفات المتأثرة:**

| الملف | التعديل |
|-------|---------|
| `src/styles/globals.css` | Expand `@media print` section |
| `src/styles/preview.css` | Add `@media print` overrides for review-table internals |
| `src/components/layout/Header.tsx` | Add Print button (conditional on content) |
| `src/App.tsx` | Pass `hasContent` to `<Header />` |

**🔄 برومبت بدء هذه المرحلة:**
```
Phase 1: Print Feature.
Read the plan file: plans/06-print-and-share.md
Read files: src/styles/globals.css, src/styles/preview.css, src/components/layout/Header.tsx, src/App.tsx
Execute all tasks for Phase 1. Mark completed items [x] in the plan.
Key rules:
- Print must show ONLY the preview pane content (no header, footer, nav, editor, FAB).
- Review Tables in print mode must render as clean read-only tables (no buttons, inputs, progress bars).
- Print button in Header only appears when content exists.
- All code comments in English.
```

---

### **المرحلة 2: Cloudflare KV Worker API 🔗**
> **النموذج:** `Claude Opus` 🔴
> **الهدف:** Extend `src/worker.ts` to handle Share API endpoints (POST to save, GET to retrieve) using Cloudflare KV with 30-day TTL.
> **يعتمد على:** لا شيء (مستقلة عن المرحلة 1)

#### 🔐 المرحلة 2أ: إعداد Cloudflare (يدوي — المطور)

> ⚠️ **هذه الخطوات يقوم بها المطور يدوياً قبل بدء كتابة الكود:**

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[ ]` | `[ ]` | 🧑‍💻 **[يدوي]** تسجيل الدخول لـ Wrangler عبر: `npx wrangler login` (يفتح المتصفح ← يطلب الموافقة ← يتم الربط) |
| `[ ]` | `[ ]` | 🧑‍💻 **[يدوي]** إنشاء KV Namespace عبر: `npx wrangler kv:namespace create SHARED_CONTENT` (يطلع ID ← نحتاجه للخطوة التالية) |
| `[ ]` | `[ ]` | 🧑‍💻 **[يدوي]** إبلاغ الوكيل بالـ ID الناتج وتأكيد نجاح تسجيل الدخول |

#### 🤖 المرحلة 2ب: كتابة الكود (الوكيل)

> ⏳ **لا تبدأ إلا بعد تأكيد المطور أن الخطوات اليدوية تمت بنجاح.**

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[x]` | `[ ]` | Verify Wrangler login by running `npx wrangler whoami` — confirm account is connected |
| `[x]` | `[ ]` | Add KV namespace binding `SHARED_CONTENT` in `wrangler.toml` using the ID provided by the developer |
| `[x]` | `[ ]` | Add `POST /api/share` handler in `worker.ts` — accepts `{ content: string }` body, generates random 8-char ID, stores in KV with `expirationTtl: 2592000` (30 days), returns `{ id, expiresAt }` |
| `[x]` | `[ ]` | Add `GET /api/share/:id` handler in `worker.ts` — retrieves content from KV by ID, returns `{ content }` or 404 |
| `[x]` | `[ ]` | Add ID generation utility function (8-char alphanumeric, URL-safe) inside `worker.ts` |
| `[x]` | `[ ]` | Add CORS headers for the API routes (same-origin + the production domain) |
| `[x]` | `[ ]` | Add content size validation (reject if > 500KB) with proper error response |

**الملفات المتأثرة:**

| الملف | التعديل |
|-------|---------|
| `wrangler.toml` | Add `[[kv_namespaces]]` binding |
| `src/worker.ts` | Add API route handler for `/api/share` (POST & GET) |

**🔄 برومبت بدء هذه المرحلة:**
```
Phase 2: Cloudflare KV Share API.
Read the plan file: plans/06-print-and-share.md
Read files: src/worker.ts, wrangler.toml
PREREQUISITE: Developer has confirmed Wrangler login and KV namespace creation.
First: run "npx wrangler whoami" to verify login.
Then execute all code tasks for Phase 2b. Mark completed items [x] in the plan.
Key rules:
- Worker must handle both static assets AND API routes (api routes take priority).
- POST /api/share: receives JSON { content }, generates 8-char random ID, stores in KV with 30-day TTL.
- GET /api/share/:id: retrieves content by ID, returns JSON { content } or 404.
- Max content size: 500KB.
- Use the KV namespace ID provided by the developer in wrangler.toml.
- All code comments in English.
```

---

### **المرحلة 3: Share Button & Frontend Integration 🔗**
> **النموذج:** `Claude Opus` 🔴
> **الهدف:** Add Share button to Header, call the Worker API, copy the generated link to clipboard, and show feedback toast.
> **يعتمد على:** المرحلة 1 ✅ + المرحلة 2 ✅

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[x]` | `[ ]` | Create `src/utils/share.ts` — async function `shareContent(content: string): Promise<{id: string, url: string}>` that POSTs to `/api/share` and returns the full shareable URL |
| `[x]` | `[ ]` | Add `Share2` icon button to `Header.tsx` Row 2 (Actions) — visible only when `hasContent` is true, shows loading state during API call |
| `[x]` | `[ ]` | On successful share: copy URL to clipboard using `navigator.clipboard.writeText()` and show Toast "تم نسخ رابط المشاركة" |
| `[x]` | `[ ]` | On error: show Toast "فشل في إنشاء رابط المشاركة" |
| `[x]` | `[ ]` | Save share record to LocalStorage: `{ id, url, createdAt, expiresAt, contentPreview (first 100 chars) }` |

**الملفات المتأثرة:**

| الملف | التعديل |
|-------|---------|
| `src/utils/share.ts` | [NEW] Share API client + LocalStorage history manager |
| `src/components/layout/Header.tsx` | Add Share button with loading state |

**🔄 برومبت بدء هذه المرحلة:**
```
Phase 3: Share Button & Frontend Integration.
Read the plan file: plans/06-print-and-share.md
Read files: src/components/layout/Header.tsx, src/utils/clipboard.ts, src/components/ui/Toast.tsx
Execute all tasks for Phase 3. Mark completed items [x] in the plan.
Key rules:
- Share button appears only when content exists (same logic as Print button).
- On click: POST content to /api/share, copy returned URL to clipboard, show toast.
- Save share record in LocalStorage key "nanomd_share_history".
- All code comments in English.
```

---

### **المرحلة 4: Shared Content Viewer (Read-Only Mode) 📖**
> **النموذج:** `Gemini Pro` 🟠
> **الهدف:** When a user opens a shared link `/p/:id`, fetch content from the API and display it in read-only preview mode.
> **يعتمد على:** المرحلة 2 ✅ + المرحلة 3 ✅

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[x]` | `[ ]` | Add shared content detection in `App.tsx` — check if URL path starts with `/p/`, extract the ID |
| `[x]` | `[ ]` | Fetch content from `GET /api/share/:id` and set it as read-only preview content |
| `[x]` | `[ ]` | Add `isSharedView` state to `AppState` in `types/index.ts` — when true, hide editor-related buttons and show "read-only" indicator |
| `[x]` | `[ ]` | In shared view mode: hide Edit, Split, Focus buttons + hide CopyMenu FAB (viewer can only read) |
| `[x]` | `[ ]` | Handle 404 (expired/invalid link): show friendly "الرابط منتهي أو غير صالح" message |
| `[x]` | `[ ]` | Ensure SPA routing in `worker.ts` serves `index.html` for `/p/:id` paths |

**الملفات المتأثرة:**

| الملف | التعديل |
|-------|---------|
| `src/App.tsx` | Add `/p/:id` detection + fetch + read-only state |
| `src/types/index.ts` | Add `isSharedView` to `AppState` |
| `src/contexts/AppContext.tsx` | Add default `isSharedView: false` |
| `src/components/layout/Header.tsx` | Conditionally hide edit controls in shared view |

**🔄 برومبت بدء هذه المرحلة:**
```
Phase 4: Shared Content Viewer.
Read the plan file: plans/06-print-and-share.md
Read files: src/App.tsx, src/types/index.ts, src/contexts/AppContext.tsx, src/components/layout/Header.tsx, src/worker.ts
Execute all tasks for Phase 4. Mark completed items [x] in the plan.
Key rules:
- Detect /p/:id in URL path (not hash).
- Fetch from GET /api/share/:id, display in preview-only mode.
- Add isSharedView flag to AppState, hide editing controls when true.
- Show friendly Arabic error message if link is expired/invalid.
- All code comments in English.
```

---

### **المرحلة 5: Share History Modal 📋**
> **النموذج:** `Gemini Pro` 🟠
> **الهدف:** Create a modal/panel that shows previously shared links from LocalStorage, with the ability to copy or delete entries.
> **يعتمد على:** المرحلة 3 ✅

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[x]` | `[ ]` | Create `src/components/ui/ShareHistory.tsx` — Modal component showing list of shared links from LocalStorage |
| `[x]` | `[ ]` | Each entry shows: content preview (first 100 chars), creation date, expiry date, copy-link button, delete-from-history button |
| `[x]` | `[ ]` | Add "سجل المشاركات" button to `Header.tsx` — only visible when history has entries |
| `[x]` | `[ ]` | Style the modal consistent with the existing Manus UI design system |
| `[x]` | `[ ]` | Visual indicator for expired links (strike-through or dimmed) based on current date vs expiresAt |

**الملفات المتأثرة:**

| الملف | التعديل |
|-------|---------|
| `src/components/ui/ShareHistory.tsx` | [NEW] Share history modal component |
| `src/components/layout/Header.tsx` | Add history toggle button |

**🔄 برومبت بدء هذه المرحلة:**
```
Phase 5: Share History Modal.
Read the plan file: plans/06-print-and-share.md
Read files: src/components/layout/Header.tsx, src/utils/share.ts, src/components/ui/Toast.tsx, src/styles/globals.css
Execute all tasks for Phase 5. Mark completed items [x] in the plan.
Key rules:
- Read share history from LocalStorage key "nanomd_share_history".
- Show content preview, dates, copy/delete actions.
- Style consistent with Manus UI (same border-radius, colors, fonts).
- Expired links (date > expiresAt) should appear dimmed.
- All code comments in English.
```

---

### **المرحلة 6: Version Bump, Documentation & Final Testing 📦**
> **النموذج:** `Gemini Flash` 🟢
> **الهدف:** Update version to 1.2.0 everywhere, update documentation files, and run final build test.
> **يعتمد على:** جميع المراحل السابقة ✅

| تنفيذ | مراجعة | المهمة |
| :---: | :---: | :--- |
| `[ ]` | `[ ]` | Update `package.json` version to `1.2.0` |
| `[ ]` | `[ ]` | Update footer in `App.tsx` from `v1.1.1` to `v1.2.0` |
| `[ ]` | `[ ]` | Update `changelog.md` with all v1.2.0 changes |
| `[ ]` | `[ ]` | Update `project-context.md` — current status, active features list, next steps |
| `[ ]` | `[ ]` | Update `project-key.md` — add new files to the index |
| `[ ]` | `[ ]` | Run `npm run build` — verify zero errors |
| `[ ]` | `[ ]` | Manual smoke test: print, share, view shared link, check history |

**الملفات المتأثرة:**

| الملف | التعديل |
|-------|---------|
| `package.json` | Version bump |
| `src/App.tsx` | Footer version |
| `changelog.md` | New entry |
| `project-context.md` | Status update |
| `project-key.md` | New files index |

**🔄 برومبت بدء هذه المرحلة:**
```
Phase 6: Version Bump & Documentation.
Read the plan file: plans/06-print-and-share.md
Read files: package.json, src/App.tsx, changelog.md, project-context.md, project-key.md
Execute all tasks for Phase 6. Mark completed items [x] in the plan.
Key rules:
- Version 1.2.0 everywhere.
- Changelog in same format as existing entries.
- project-context.md: update current status, add new features to active list.
- project-key.md: add new files (share.ts, ShareHistory.tsx).
- Run npm run build and confirm success.
- All code comments in English.
```

---

## 📊 ملخص النماذج والمراحل

| المرحلة | الوصف | النموذج | عدد الملفات | التعقيد |
|---------|-------|---------|-------------|---------|
| 1 | Print Feature (CSS + Button) | 🔴 Claude Opus | 4 | متوسط |
| 2 | Cloudflare KV Worker API | 🔴 Claude Opus | 2 | حرج (Backend) |
| 3 | Share Button & Frontend | 🔴 Claude Opus | 2 | متوسط |
| 4 | Shared Content Viewer | 🟠 Gemini Pro | 4 | عادي |
| 5 | Share History Modal | 🟠 Gemini Pro | 2 | عادي |
| 6 | Version Bump & Docs | 🟢 Gemini Flash | 5 | بسيط |

**إجمالي الملفات الجديدة:** 2 (`share.ts`, `ShareHistory.tsx`)
**إجمالي الملفات المعدّلة:** ~10

---

## ⚠️ ملاحظات مهمة

1. **Cloudflare Wrangler Login:** المطور يقوم يدوياً بـ `npx wrangler login` + `npx wrangler kv:namespace create SHARED_CONTENT` قبل المرحلة 2ب. الوكيل لا يبدأ إلا بعد التأكيد.
2. **Free Tier Limits:** Cloudflare KV free plan = 100K reads/day, 1K writes/day, 1GB storage. More than enough for personal use.
3. **TTL = 30 days** (2,592,000 seconds). Content auto-deletes after expiry — no manual cleanup needed.
4. **Security Model:** Random 8-char IDs (Security by Obscurity). No authentication needed for personal use.
