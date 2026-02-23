---
description: "Task list for NanoMD MVP 1.0 implementation"
---

# Tasks: NanoMD MVP 1.0

**Input**: Design documents from `/specs/main/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story, following the "Mobile First", "Arabic Native", and "Reading First" principles defined in the Constitution.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)

---

## Phase 1: Setup

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Vite React TypeScript project in `d:\Myprojects\NanoMD`
- [x] T002 Update `package.json` and install dependencies: `react-markdown`, `remark-gfm`, `rehype-highlight`, `rehype-sanitize`, `lucide-react`, `tailwindcss`
- [x] T003 Configure Tailwind CSS in `tailwind.config.js` and CSS variables in `src/styles/themes.css`
- [x] T004 Create foundational folder structure inside `src/` (components, hooks, utils, types, styles)
- [x] T005 Setup basic routing/App container in `src/App.tsx` and `src/main.tsx`
- [x] T006 Add global CSS and Cairo font imports in `src/styles/globals.css` and `index.html` (with `dir="rtl"`)

---

## Phase 2: Foundational

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**âڑ ï¸ڈ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Define TypeScript interfaces for `AppState` and `ContentVersion` in `src/types/index.ts`
- [x] T008 [P] Implement `useLocalStorage` hook in `src/hooks/useLocalStorage.ts`
- [x] T009 [P] Create `AppContext` and Provider in `src/contexts/AppContext.tsx` to hold global state
- [x] T010 [P] Create `ThemeContext` and Provider in `src/contexts/ThemeContext.tsx`
- [x] T011 Create base `Header` and `MobileNav` layout components in `src/components/layout/`
- [x] T012 Create `EmptyState` component in `src/components/ui/EmptyState.tsx`

**Checkpoint**: Foundation ready - UI layout is present, global state and RTL typography are configured.

---

## Phase 3: User Story 1 - Core Reading Experience (Priority: P1) ًںژ¯ MVP

**Goal**: As a user, I want to paste Markdown text from an AI tool and instantly read it in a clean, formatted, RTL Arabic view without any complex setup.
**Independent Test**: Can be fully tested by pasting raw Markdown containing Arabic and verifying it renders immediately in the Preview Mode.

### Implementation for User Story 1

- [x] T013 [US1] Implement core `PreviewPane` component in `src/components/preview/PreviewPane.tsx`
- [x] T014 [US1] Create `preview.css` to style Markdown elements (headers, paragraphs, lists) in `src/styles/preview.css`
- [x] T015 [US1] Implement `react-markdown` setup within `PreviewPane` combining basic GFM plugins
- [x] T016 [US1] Create `useSmartPaste` hook to intercept `Ctrl+V` globally in `src/hooks/useSmartPaste.ts`
- [x] T017 [US1] Integrate `useSmartPaste` and `PreviewPane` into `src/App.tsx` replacing `EmptyState` on paste

**Checkpoint**: At this point, the app can parse pasted text and display it beautifully in Arabic (MVP achieved).

---

## Phase 4: User Story 2 - Markdown Features & Theming (Priority: P2)

**Goal**: As a user, I want to see complex Markdown elements correctly, and toggle between different themes (Light, Dark, Warm).
**Independent Test**: Paste a complex Markdown document and use the theme toggle button to switch between the 3 CSS variable-based themes.

### Implementation for User Story 2

- [x] T018 [US2] Enhance `PreviewPane.tsx` with `rehype-highlight` and `rehype-sanitize` for code blocks
- [x] T019 [US2] Create responsive `CodeBlock` overrides and copy behavior in `src/components/preview/CodeBlock.tsx`
- [x] T020 [US2] Implement `useTheme` hook to cycle themes and inject classes into `<html>` in `src/hooks/useTheme.ts`
- [x] T021 [US2] Create `ThemeToggle` UI button in `src/components/ui/ThemeToggle.tsx` and attach to `Header`

**Checkpoint**: User Stories 1 AND 2 work independently. The app now supports advanced markdown and theming.

---

## Phase 5: User Story 3 - Multiple View Modes (Priority: P2)

**Goal**: As a user, I want to switch between different view modes (Preview, Editor, Split, Focus).
**Independent Test**: Use UI buttons or shortcuts (`Ctrl+1`, `2`, `3`) to transition between the 4 view modes smoothly.

### Implementation for User Story 3

- [x] T022 [US3] Implement raw `EditorPane` component in `src/components/editor/EditorPane.tsx`
- [x] T023 [US3] Create `SplitView` layout component in `src/components/layout/SplitView.tsx`
- [x] T024 [US3] Create `useViewMode` hook to manage the active layout state in `src/hooks/useViewMode.ts`
- [x] T025 [US3] Create `useKeyboard` hook to map `Ctrl+1/2/3/4` to view mode switches in `src/hooks/useKeyboard.ts`
- [x] T026 [US3] Update `src/App.tsx` to orchestrate `PreviewPane`, `EditorPane`, and `SplitView` based on active mode

**Checkpoint**: The app now supports Split/Editor modes for tweaking content alongside reading.

---

## Phase 6: User Story 4 - Export and Copy Features (Priority: P3)

**Goal**: As a user, I want to easily copy the formatted text as Rich Text, raw Markdown, or save/print it.
**Independent Test**: Click "Copy" menu, choose "Rich Text", and paste into Word/Gmail preserving format.

### Implementation for User Story 4

- [x] T027 [US4] Implement clipboard utilities (copy RTF, Markdown, HTML) in `src/utils/clipboard.ts`
- [x] T028 [US4] Create `CopyMenu` FAB (Floating Action Button) component in `src/components/ui/CopyMenu.tsx`
- [x] T029 [US4] Create `Toast` notification component for feedback in `src/components/ui/Toast.tsx`
- [x] T030 [US4] Add `@media print` overrides to `src/styles/globals.css` to hide UI elements during printing

**Checkpoint**: Export formats and printing capabilities are fully functional.

---

## Phase 7: User Story 5 - Persistence (Auto-Save & History) (Priority: P3)

**Goal**: As a user, I want my content and preferences automatically saved locally.
**Independent Test**: Close the browser tab entirely and reopen to verify state is restored from `localStorage`.

### Implementation for User Story 5

- [x] T031 [US5] Implement `useAutoSave` hook (3s debounce linked to `nanomd_settings` and `nanomd_history`) in `src/hooks/useAutoSave.ts`
- [x] T032 [US5] Create `SaveIndicator` UI component in `src/components/ui/SaveIndicator.tsx`
- [x] T033 [US5] Wire `useAutoSave` to the globally edited content context in `src/App.tsx`
- [x] T034 [US5] Include Drag & Drop file read support in `src/hooks/useSmartPaste.ts` (or create `useDropZone`)

**Checkpoint**: All user stories complete. The application is resilient against tab closures.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T035 [P] Create `README.md` with features and instructions
- [x] T036 Code cleanup and strict TypeScript refactoring
- [x] T037 Validate strict RTL Arabic UI conformance across Desktop and Mobile views
- [x] T038 Review Lighthouse metrics (run build and serve locally to test)
- [x] T039 Check completely gzipped bundle size remains < 150KB (`pnpm run build` analysis)
- [x] T040 Verify offline/localStorage functionality with network disabled
- [x] T041 Run `specs/main/quickstart.md` validation manually

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup (BLOCKED until T006).
- **User Story 1 (Phase 3)**: Depends on Foundational (BLOCKED until T012).
- **User Story 2 (Phase 4)**: Can start after Phase 3 (extends `PreviewPane`).
- **User Story 3 (Phase 5)**: Can start after Phase 3 (extends main UI logic).
- **User Story 4 & 5 (Phases 6-7)**: Dependent on Phase 3 and 5.
- **Polish (Phase 8)**: Must be executed last.

### Parallel Opportunities

- Hooks (`useLocalStorage`, `useTheme`, `useSmartPaste`) can be developed simultaneously by different agents/developers.
- Context providers (T009, T010) can be created in parallel once `types` are defined.
- Utilities (`clipboard.ts`) do not block UI components and can be built anytime after Phase 1.
