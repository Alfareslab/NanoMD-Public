# Quickstart: NanoMD MVP 1.0

This guide provides the necessary steps to run and test the NanoMD application locally.

## Prerequisites

Ensure you have the following installed on your system:

- **Node.js**: v18 or higher
- **pnpm**: v8 or higher (If not installed: `npm install -g pnpm`)
- **Git** (optional, for cloning)

## Setup Instructions

1. **Navigate to the project root:**

   ```bash
   cd d:\Myprojects\NanoMD
   ```

2. **Install all dependencies:**

   ```bash
   pnpm install
   ```

3. **Start the development server:**

   ```bash
   pnpm run dev
   ```

4. **Access the application:**
   Open your browser and navigate to `http://localhost:5173` (or the port specified in the terminal).

## Testing Methodology

NanoMD is a highly visual, UI-centric application. Automated unit testing is deferred for the MVP in favor of strict visual and functional manual testing scenarios.

### 1. Smart Paste Validation

- Copy a complex Arabic Markdown snippet from ChatGPT.
- Open the app (Empty State).
- Press `Ctrl+V` (or `Cmd+V` on Mac).
- **Expected**: Text renders instantly in Preview Mode. RTL alignment is perfect.

### 2. View Mode & Theming

- Press `Ctrl+3` to enter Split Mode.
- Type in the right pane; verify real-time updates in the left pane.
- Click the Theme toggle button in the header.
- **Expected**: UI smoothly cycles between Light, Dark, and Warm (Banana) themes without losing content or throwing errors.

### 3. Export Validation

- Open the Copy Menu (Floating Action Button).
- Select "Rich Text".
- Paste into Microsoft Word or Google Docs.
- **Expected**: Formatting (bold, lists, tables) is preserved.

### 4. Offline & Persistence Test

- Write some text and change the theme to "Warm".
- Wait 3 seconds (look for the "تم الحفظ" Toast/Indicator).
- Close the browser tab entirely.
- Open a new tab and navigate back to `localhost:5173`.
- **Expected**: Your text and the "Warm" theme are instantly restored from `localStorage`.

### 5. Build & Bundle Size Check

- Run `pnpm run build`
- **Expected**: Production build completes successfully. Inspect the `dist` folder to ensure JS/CSS assets are minimized and the total gzipped size is under 150KB.
