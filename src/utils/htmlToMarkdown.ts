/**
 * htmlToMarkdown.ts
 * 
 * Zero-dependency HTML-to-Markdown converter.
 * Uses the browser's built-in DOMParser to parse HTML
 * and converts common elements to GFM-compatible Markdown.
 */

/**
 * Convert an HTML string to Markdown.
 * Prioritizes preserving table structure for RTL content.
 */
export function htmlToMarkdown(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Remove script and style elements
    doc.querySelectorAll('script, style').forEach(el => el.remove());

    const markdown = processNode(doc.body);
    return cleanupMarkdown(markdown);
}

/**
 * Recursively process a DOM node and convert to Markdown.
 */
function processNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || '';
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
        return '';
    }

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    switch (tag) {
        // --- Headings ---
        case 'h1': return `\n# ${getInlineContent(el)}\n\n`;
        case 'h2': return `\n## ${getInlineContent(el)}\n\n`;
        case 'h3': return `\n### ${getInlineContent(el)}\n\n`;
        case 'h4': return `\n#### ${getInlineContent(el)}\n\n`;
        case 'h5': return `\n##### ${getInlineContent(el)}\n\n`;
        case 'h6': return `\n###### ${getInlineContent(el)}\n\n`;

        // --- Inline formatting ---
        case 'strong':
        case 'b':
            return `**${getInlineContent(el)}**`;

        case 'em':
        case 'i':
            return `*${getInlineContent(el)}*`;

        case 'del':
        case 's':
            return `~~${getInlineContent(el)}~~`;

        case 'code':
            // Check if parent is <pre> — handled by 'pre' case
            if (el.parentElement?.tagName.toLowerCase() === 'pre') {
                return el.textContent || '';
            }
            return `\`${el.textContent || ''}\``;

        // --- Code blocks ---
        case 'pre': {
            const codeEl = el.querySelector('code');
            const codeText = codeEl ? codeEl.textContent : el.textContent;
            const lang = extractLanguage(codeEl || el);
            return `\n\`\`\`${lang}\n${(codeText || '').trim()}\n\`\`\`\n\n`;
        }

        // --- Paragraphs & line breaks ---
        case 'p':
            return `\n${getInlineContent(el)}\n\n`;

        case 'br':
            return '\n';

        case 'hr':
            return '\n---\n\n';

        // --- Links & images ---
        case 'a': {
            const href = el.getAttribute('href') || '';
            const text = getInlineContent(el);
            if (!href || href === text) return text;
            return `[${text}](${href})`;
        }

        case 'img': {
            const src = el.getAttribute('src') || '';
            const alt = el.getAttribute('alt') || '';
            return `![${alt}](${src})`;
        }

        // --- Lists ---
        case 'ul':
            return '\n' + processListItems(el, 'ul') + '\n';

        case 'ol':
            return '\n' + processListItems(el, 'ol') + '\n';

        case 'li': {
            // Handled by processListItems
            return getInlineContent(el);
        }

        // --- Blockquote ---
        case 'blockquote': {
            const content = processChildren(el).trim();
            const lines = content.split('\n');
            return '\n' + lines.map(line => `> ${line}`).join('\n') + '\n\n';
        }

        // --- Tables ---
        case 'table':
            return '\n' + processTable(el) + '\n';

        // Skip these — handled by table processing
        case 'thead':
        case 'tbody':
        case 'tfoot':
        case 'tr':
        case 'th':
        case 'td':
            return processChildren(el);

        // --- Div, span, and other containers ---
        case 'div':
        case 'section':
        case 'article':
        case 'main':
        case 'aside':
        case 'header':
        case 'footer':
        case 'nav':
            return processChildren(el);

        case 'span':
            return getInlineContent(el);

        default:
            return processChildren(el);
    }
}

/**
 * Process all children of a node.
 */
function processChildren(node: Node): string {
    let result = '';
    node.childNodes.forEach(child => {
        result += processNode(child);
    });
    return result;
}

/**
 * Get inline content from an element (processes children but trims).
 */
function getInlineContent(el: HTMLElement): string {
    let result = '';
    el.childNodes.forEach(child => {
        result += processNode(child);
    });
    return result.replace(/\n{2,}/g, '\n').trim();
}

/**
 * Process list items (ul or ol).
 */
function processListItems(listEl: HTMLElement, type: 'ul' | 'ol', depth: number = 0): string {
    const items: string[] = [];
    let index = 1;
    const indent = '  '.repeat(depth);

    listEl.childNodes.forEach(child => {
        if (child.nodeType !== Node.ELEMENT_NODE) return;
        const childEl = child as HTMLElement;
        if (childEl.tagName.toLowerCase() !== 'li') return;

        let content = '';
        const subParts: string[] = [];

        childEl.childNodes.forEach(liChild => {
            if (liChild.nodeType === Node.ELEMENT_NODE) {
                const liChildEl = liChild as HTMLElement;
                const liChildTag = liChildEl.tagName.toLowerCase();
                if (liChildTag === 'ul' || liChildTag === 'ol') {
                    subParts.push(processListItems(liChildEl, liChildTag, depth + 1));
                    return;
                }
            }
            content += processNode(liChild);
        });

        const prefix = type === 'ul' ? '- ' : `${index}. `;
        const line = `${indent}${prefix}${content.replace(/\n{2,}/g, ' ').trim()}`;
        items.push(line);
        if (subParts.length > 0) {
            items.push(...subParts);
        }
        index++;
    });

    return items.join('\n');
}

/**
 * Process an HTML <table> into a GFM markdown table.
 */
function processTable(tableEl: HTMLElement): string {
    const rows: string[][] = [];
    let headerRowCount = 0;

    // Collect all rows
    const trElements = tableEl.querySelectorAll('tr');
    trElements.forEach((tr, rowIndex) => {
        const cells: string[] = [];
        const cellElements = tr.querySelectorAll('th, td');
        cellElements.forEach(cell => {
            cells.push(getInlineContent(cell as HTMLElement).replace(/\|/g, '\\|'));
        });
        if (cells.length > 0) {
            rows.push(cells);
        }

        // Detect header row (first row with <th> elements)
        if (rowIndex === 0 && tr.querySelector('th')) {
            headerRowCount = 1;
        }
    });

    if (rows.length === 0) return '';

    // Normalize column count (pad shorter rows)
    const maxCols = Math.max(...rows.map(r => r.length));
    rows.forEach(row => {
        while (row.length < maxCols) {
            row.push('');
        }
    });

    // Build the markdown table
    const lines: string[] = [];

    if (headerRowCount > 0) {
        // Use first row as header
        lines.push('| ' + rows[0].join(' | ') + ' |');
        lines.push('| ' + rows[0].map(() => '---').join(' | ') + ' |');

        // Data rows
        for (let i = 1; i < rows.length; i++) {
            lines.push('| ' + rows[i].join(' | ') + ' |');
        }
    } else {
        // No explicit header — use first row as header anyway (GFM requires it)
        lines.push('| ' + rows[0].join(' | ') + ' |');
        lines.push('| ' + rows[0].map(() => '---').join(' | ') + ' |');

        for (let i = 1; i < rows.length; i++) {
            lines.push('| ' + rows[i].join(' | ') + ' |');
        }
    }

    return lines.join('\n') + '\n';
}

/**
 * Try to extract language from code element class (e.g., "language-javascript").
 */
function extractLanguage(el: Element): string {
    const className = el.className || '';
    const match = className.match(/language-(\w+)/);
    return match ? match[1] : '';
}

/**
 * Clean up the final markdown output.
 */
function cleanupMarkdown(md: string): string {
    return md
        // Collapse 3+ newlines into 2
        .replace(/\n{3,}/g, '\n\n')
        // Remove leading/trailing whitespace
        .trim()
        + '\n';
}

/**
 * Smart-convert plain text to markdown.
 * Detects tab-separated data and converts to markdown tables.
 * Returns the original text if no tabular pattern is detected.
 */
export function plainTextSmartConvert(text: string): string {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    if (lines.length < 2) return text;

    // Detect tab-separated lines
    const tabCounts = lines.map(line => (line.match(/\t/g) || []).length);
    const linesWithTabs = tabCounts.filter(count => count > 0).length;

    // If majority of lines have tabs and consistent tab count, it's a table
    if (linesWithTabs >= 2) {
        // Find the most common tab count (the table's column separator count)
        const tabFreq: Record<number, number> = {};
        tabCounts.forEach(count => {
            if (count > 0) tabFreq[count] = (tabFreq[count] || 0) + 1;
        });
        const dominantTabCount = Object.entries(tabFreq)
            .sort((a, b) => b[1] - a[1])[0]?.[0];

        if (dominantTabCount && parseInt(dominantTabCount) > 0) {
            return convertTabSeparatedToMarkdown(lines, tabCounts, parseInt(dominantTabCount));
        }
    }

    return text;
}

/**
 * Convert tab-separated lines to a markdown table.
 * Groups consecutive tab-separated lines into tables.
 */
function convertTabSeparatedToMarkdown(
    lines: string[],
    tabCounts: number[],
    expectedTabs: number
): string {
    const result: string[] = [];
    let tableBuffer: string[][] = [];
    let inTable = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const isTableRow = tabCounts[i] >= expectedTabs;

        if (isTableRow) {
            const cells = line.split('\t').map(cell => cell.trim());
            tableBuffer.push(cells);
            inTable = true;
        } else {
            // Flush any accumulated table
            if (inTable && tableBuffer.length > 0) {
                result.push(buildMarkdownTable(tableBuffer));
                tableBuffer = [];
                inTable = false;
            }
            result.push(line);
        }
    }

    // Flush remaining table
    if (tableBuffer.length > 0) {
        result.push(buildMarkdownTable(tableBuffer));
    }

    return result.join('\n\n');
}

/**
 * Build a markdown table from rows of cells.
 */
function buildMarkdownTable(rows: string[][]): string {
    if (rows.length === 0) return '';

    // Normalize column count
    const maxCols = Math.max(...rows.map(r => r.length));
    rows.forEach(row => {
        while (row.length < maxCols) {
            row.push('');
        }
    });

    const lines: string[] = [];

    // First row as header
    lines.push('| ' + rows[0].join(' | ') + ' |');
    lines.push('| ' + rows[0].map(() => '---').join(' | ') + ' |');

    // Data rows
    for (let i = 1; i < rows.length; i++) {
        lines.push('| ' + rows[i].join(' | ') + ' |');
    }

    return lines.join('\n');
}

