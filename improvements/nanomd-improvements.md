# 🛠️ NanoMD — Planned Improvements

> **Status:** Documented — Pending Implementation
> **Last Updated:** 2026-04-07
> **Reference:** `protocols/05-review-mode-rules.md` → Section 13

---
repo link : https://github.com/Alfareslab/NanoMD-Public.git



## Improvement 1: URL Hash Loading

**Goal:** Allow the AI agent to generate a clickable link in chat that opens NanoMD with the review file content pre-loaded — no manual copy/paste needed.

### How It Works

```
https://nanomd.alfares-acelab.workers.dev/#BASE64_ENCODED_CONTENT
```

1. Agent reads the review file
2. Encodes content to Base64
3. Appends to URL as hash fragment (`#`)
4. Writes clickable link in chat
5. Developer clicks → browser opens → NanoMD auto-loads content

### Agent Workflow (Windows PowerShell)

```powershell
# Read file and encode to Base64
$content = Get-Content "path\to\reviews\XX-review-name.md" -Raw -Encoding UTF8
$bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
$base64 = [Convert]::ToBase64String($bytes)
$url = "https://nanomd.alfares-acelab.workers.dev/#$base64"

# Agent writes in chat:
# [📋 Open in NanoMD]($url)
```

### Required NanoMD Code Change

Add this script at page load in NanoMD's main JS file:

```javascript
window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.slice(1);
  if (hash) {
    try {
      const decoded = atob(decodeURIComponent(hash));
      // Call whatever function NanoMD uses to load markdown content
      loadMarkdownContent(decoded); // Replace with actual NanoMD function name
    } catch (e) {
      console.warn('[NanoMD] Invalid URL hash content:', e);
    }
  }
});
```

### Size Limits

| File Size | Base64 Size | Browser Support |
|-----------|------------|-----------------|
| 5 KB (typical review) | ~7 KB | ✅ Works |
| 20 KB | ~27 KB | ✅ Works |
| 50 KB+ | ~68 KB | ⚠️ Some browsers |

> Review files are typically under 5 KB — no issues expected.

### Chat Output Format (Agent)

After saving the review file, the agent writes:

```
✅ Review saved — [📋 Open in NanoMD](https://nanomd.../#{base64})
```

---

## Improvement 2: Split Columns (Item + Recommendation)

**Goal:** Separate `Item` and `Recommendation` into two distinct table columns while NanoMD merges them on copy with `←`.

### Current State

```markdown
| # | Item ← Recommendation | Details | Decision |
```

### Desired State

```markdown
| # | Item | Recommendation | Details | Decision |
```

NanoMD auto-merges on copy: `Item ← Recommendation → Decision`

---

## Improvement 3: Section Separator Row

**Goal:** Support a visual separator row inside the table for section grouping — no buttons, not copied.

### Desired Behavior

| # | Item ← Recommendation | Details | Decision |
|---|----------------------|---------|---------|
| | **📌 Section Name** | | | ← separator — no buttons |
| 1 | 🔴 Item ← Rec | ... | | ← normal row — has buttons |

---

## Improvement 4: Section Background Colors

**Goal:** Each group of items belonging to the same section gets a subtle different background color for visual separation.

---

## Improvement 5: Load Markdown File from Disk

**Goal:** Add a file upload button in NanoMD — developer can load `.md` files directly instead of copy/paste.

| Current | Desired |
|---------|---------|
| Manual copy/paste of file content | File picker button → auto-load |
