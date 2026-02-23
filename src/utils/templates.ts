import { Template } from '../types';

export const templates: Template[] = [
    {
        id: 'blank',
        name: 'Blank',
        icon: 'File',
        content: '',
    },
    {
        id: 'article',
        name: 'Article',
        icon: 'FileText',
        content: `# Article Title

## Introduction

Write the introduction here...

## Main Content

### First Point

Explanation of the first point...

### Second Point

Explanation of the second point...

## Conclusion

Write the conclusion here...

---

*Written with NanoMD 🍌*`,
    },
    {
        id: 'report',
        name: 'Report',
        icon: 'ClipboardList',
        content: `# Report: [Report Title]

**Date:** [Date]
**Author:** [Name]

---

## Executive Summary

Brief summary of the report...

## Findings

| Finding | Value | Notes |
|---------|-------|-------|
| Result 1 | 100 | Note |
| Result 2 | 200 | Note |

## Recommendations

1. First recommendation
2. Second recommendation
3. Third recommendation

## Next Steps

- [ ] Task one
- [ ] Task two
- [ ] Task three`,
    },
    {
        id: 'todo',
        name: 'Tasks',
        icon: 'CheckSquare',
        content: `# Task List

## Urgent ⚡

- [ ] Urgent task 1
- [ ] Urgent task 2

## Important 📌

- [ ] Important task 1
- [ ] Important task 2

## Later 📅

- [ ] Deferred task 1
- [ ] Deferred task 2

---

> **Note:** Sort your tasks by priority`,
    },
    {
        id: 'comparison',
        name: 'Comparison',
        icon: 'Columns2',
        content: `# Comparison: [Comparison Topic]

## Options

| Criterion | Option A | Option B | Option C |
|-----------|----------|----------|----------|
| Price     | ⭐⭐⭐  | ⭐⭐    | ⭐       |
| Quality   | ⭐⭐    | ⭐⭐⭐  | ⭐⭐⭐   |
| Speed     | ⭐⭐⭐  | ⭐      | ⭐⭐     |

## Analysis

### Option A
Strengths and weaknesses...

### Option B
Strengths and weaknesses...

## Final Recommendation

The best option is **[Option]** because...`,
    },
    {
        id: 'docs',
        name: 'Docs',
        icon: 'BookOpen',
        content: `# Project Name

## Overview

Brief description of the project...

## Installation

\`\`\`bash
npm install my-package
\`\`\`

## Usage

\`\`\`javascript
import { myFunction } from 'my-package';

const result = myFunction();
console.log(result);
\`\`\`

## API Reference

### \`myFunction(param)\`

| Parameter | Type | Description |
|-----------|------|-------------|
| param | string | Parameter description |

**Returns:** \`string\`

## Contributing

1. Fork the repository
2. Create a branch: \`git checkout -b feature/amazing\`
3. Commit: \`git commit -m 'Add feature'\`
4. Push: \`git push origin feature/amazing\`
5. Open a Pull Request`,
    },
];
