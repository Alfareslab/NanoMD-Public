# Data Model: NanoMD MVP 1.0

This document defines the data structures and entities used within the NanoMD application. As per the project constitution, there is no backend or traditional database. All data persistence is handled via the browser's `localStorage` API.

## Storage Strategy

- **Mechanism**: `window.localStorage`
- **Serialization**: JSON `stringify` / `parse`
- **Prefix**: All keys should ideally be prefixed (e.g., `nanomd_`) to prevent collisions, though it is a dedicated SPA.

## Entities

### 1. AppState

Represents the global configuration and current UI state of the application. This ensures the user returns exactly to how they left the app.

**Key**: `nanomd_settings`

| Field | Type | Required | Description | Default |
|-------|------|----------|-------------|---------|
| `theme` | `enum('light', 'dark', 'warm')` | Yes | The currently active visual theme. | `'light'` |
| `viewMode` | `enum('preview', 'editor', 'split', 'focus')` | Yes | The currently active layout mode. | `'preview'` |
| `lastActive` | `string (ISO 8601)` | Yes | Timestamp of the last time the user interacted with the app. | Current Time |

**Validation Rules**:

- `theme` must strictly be one of the three allowed string values.
- `viewMode` must strictly be one of the four allowed string values. Fallback to `'preview'` if invalid.

### 2. ContentVersion

Represents a specific snapshot of the user's Markdown text. The system maintains a rolling history of these snapshots.

**Key**: `nanomd_history` (Stores an `Array<ContentVersion>`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string (UUID or Timestamp-based)` | Yes | Unique identifier for the snapshot. |
| `timestamp` | `number (Epoch ms)` | Yes | The exact time this snapshot was saved. |
| `markdownString` | `string` | Yes | The actual raw Markdown text content. |
| `charCount` | `number` | No | Useful metadata for displaying in the history list UI without parsing the full string. |

**State Transitions & Rules**:

- **Auto-Save Mechanism**: A new `ContentVersion` is created and pushed to the `nanomd_history` array whenever the user stops typing for 3 seconds (debounced).
- **Rolling Hook Limit**: The array MUST NOT exceed 5 items. If a 6th item is added, the oldest item (lowest `timestamp`) MUST be removed (`history.shift()`).
- **Restoration**: When a user selects a version from history, the current editor state is immediately replaced by that version's `markdownString`.

## Current Draft Context

A secondary key `nanomd_current_draft` can be used to hold the *live* editor content that hasn't yet triggered a 3-second debounce save, ensuring absolute zero data loss on sudden tab closure.

**Key**: `nanomd_current_draft`

- **Type**: `string` (The live raw Markdown)
- **Behavior**: Updated on every keystroke. Cleared or synced with `nanomd_history[latest]` upon successful debounce save.
