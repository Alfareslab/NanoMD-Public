import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';



// Quick decision buttons
const QUICK_DECISIONS = [
    { label: '✅', value: '✅ موافق', title: 'موافق' },
    { label: '❌', value: '❌ رفض', title: 'رفض' },
    { label: '⏸️', value: '⏸️ تأجيل', title: 'تأجيل' },
];

/**
 * Module-level store to persist review decisions across re-mounts.
 * Key = fingerprint of the table content (headers + first column values).
 * Value = array of decision strings.
 */
const decisionsStore = new Map<string, string[]>();

/**
 * Generate a stable fingerprint from table data so we can persist state.
 */
function getTableFingerprint(headers: string[], rows: string[][]): string {
    const headerPart = headers.join('|');
    const rowPart = rows.map((r) => r[0] || '').join('|');
    return `${headerPart}::${rowPart}`;
}

interface ReviewTableProps {
    headers: string[];
    rows: string[][];
}

/**
 * ReviewTable — Interactive review table for developer-agent collaboration.
 * Renders input fields + quick decision buttons for the review column,
 * and a smart copy button that copies only item # + summary + decision.
 *
 * State persists across re-mounts using a module-level store keyed by
 * the table's content fingerprint.
 */
export const ReviewTable: React.FC<ReviewTableProps> = ({ headers, rows }) => {
    // Generate a stable fingerprint for this table
    const fingerprint = useMemo(() => getTableFingerprint(headers, rows), [headers, rows]);

    // Initialize decisions from the store, or from table data if first time
    const [decisions, setDecisions] = useState<string[]>(() => {
        const stored = decisionsStore.get(fingerprint);
        if (stored && stored.length === rows.length) {
            return stored;
        }
        // First time: read initial values from the last column
        const initial = rows.map((row) => {
            const lastCell = row[row.length - 1]?.trim() || '';
            return lastCell;
        });
        decisionsStore.set(fingerprint, initial);
        return initial;
    });

    // Keep the store in sync with state changes
    const decisionsRef = useRef(decisions);
    useEffect(() => {
        decisionsRef.current = decisions;
        decisionsStore.set(fingerprint, decisions);
    }, [decisions, fingerprint]);

    // Find the index of the item/summary column (usually column 1, after #)
    const itemColIndex = useMemo(() => {
        const idx = headers.findIndex((h) => {
            const lower = h.trim().toLowerCase();
            return lower === 'البند' || lower === 'item' || lower === 'summary';
        });
        return idx >= 0 ? idx : Math.min(1, headers.length - 1);
    }, [headers]);

    // Count reviewed items
    const reviewedCount = decisions.filter((d) => d.trim().length > 0).length;
    const totalCount = rows.length;
    const allReviewed = reviewedCount === totalCount;
    const someReviewed = reviewedCount > 0;

    // Handle quick decision button click
    const handleQuickDecision = useCallback((rowIndex: number, value: string) => {
        setDecisions((prev) => {
            const next = [...prev];
            const current = next[rowIndex];
            // If already has this decision prefix, just keep it (allow editing comment after)
            if (current.startsWith(value)) return prev;
            // If has another decision, replace the prefix
            const hasExistingDecision = QUICK_DECISIONS.some((d) => current.startsWith(d.value));
            if (hasExistingDecision) {
                // Extract any comment after the decision
                const parts = current.split('—');
                const comment = parts.length > 1 ? parts.slice(1).join('—').trim() : '';
                next[rowIndex] = comment ? `${value} — ${comment}` : value;
            } else {
                next[rowIndex] = value;
            }
            return next;
        });
    }, []);

    // Handle clearing a decision
    const handleClear = useCallback((rowIndex: number) => {
        setDecisions((prev) => {
            const next = [...prev];
            next[rowIndex] = '';
            return next;
        });
    }, []);

    // Handle text input change
    const handleInputChange = useCallback((rowIndex: number, value: string) => {
        setDecisions((prev) => {
            const next = [...prev];
            next[rowIndex] = value;
            return next;
        });
    }, []);

    // Build copy text: # + item + decision (skip empty)
    const buildCopyText = useCallback(() => {
        const lines: string[] = [];
        for (let i = 0; i < rows.length; i++) {
            const decision = decisions[i]?.trim();
            if (!decision) continue;
            const itemNum = rows[i][0]?.trim() || String(i + 1);
            const itemName = rows[i][itemColIndex]?.trim() || '';
            lines.push(`${itemNum}. ${itemName} → ${decision}`);
        }
        return lines.join('\n');
    }, [rows, decisions, itemColIndex]);

    // Handle copy
    const [copied, setCopied] = useState(false);
    const handleCopy = useCallback(async () => {
        const text = buildCopyText();
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy review:', err);
        }
    }, [buildCopyText]);

    // The review column is the last one
    const reviewColIndex = headers.length - 1;
    // Columns to show in the table (all except the review column — we render it specially)
    const visibleHeaders = headers.slice(0, -1);

    return (
        <div className="review-table-container">
            {/* Progress Bar */}
            <div className="review-progress">
                <div className="review-progress-bar">
                    <div
                        className="review-progress-fill"
                        style={{ width: `${totalCount > 0 ? (reviewedCount / totalCount) * 100 : 0}%` }}
                    />
                </div>
                <span className="review-progress-text">
                    {reviewedCount}/{totalCount} تم المراجعة
                </span>
            </div>

            {/* Table */}
            <table className="review-table">
                <thead>
                    <tr>
                        {visibleHeaders.map((h, i) => (
                            <th key={i}>{h}</th>
                        ))}
                        <th>{headers[reviewColIndex]}</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className={decisions[rowIdx]?.trim() ? 'review-row-done' : ''}>
                            {/* Data columns */}
                            {visibleHeaders.map((_, colIdx) => (
                                <td key={colIdx}>{row[colIdx] || ''}</td>
                            ))}
                            {/* Review/Decision column */}
                            <td className="review-decision-cell">
                                <div className="review-decision-wrapper">
                                    <div className="review-quick-buttons">
                                        {QUICK_DECISIONS.map((btn) => (
                                            <button
                                                key={btn.value}
                                                className={`review-quick-btn ${decisions[rowIdx]?.startsWith(btn.value) ? 'active' : ''}`}
                                                onClick={() => handleQuickDecision(rowIdx, btn.value)}
                                                title={btn.title}
                                                type="button"
                                            >
                                                {btn.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="review-input-wrapper">
                                        <input
                                            type="text"
                                            className="review-input"
                                            value={decisions[rowIdx] || ''}
                                            onChange={(e) => handleInputChange(rowIdx, e.target.value)}
                                            placeholder="اكتب قرارك..."
                                            dir="rtl"
                                        />
                                        {decisions[rowIdx]?.trim() && (
                                            <button
                                                className="review-clear-btn"
                                                onClick={() => handleClear(rowIdx)}
                                                title="مسح الرد"
                                                type="button"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Copy Button */}
            <div className="review-copy-bar">
                <button
                    className={`review-copy-btn ${!someReviewed ? 'disabled' : allReviewed ? 'complete' : 'partial'
                        }`}
                    onClick={handleCopy}
                    disabled={!someReviewed}
                    type="button"
                >
                    {copied
                        ? '✅ تم النسخ!'
                        : allReviewed
                            ? `✅ نسخ الردود (${reviewedCount}/${totalCount})`
                            : someReviewed
                                ? `⚠️ نسخ الردود (${reviewedCount}/${totalCount})`
                                : `نسخ الردود (0/${totalCount})`}
                </button>
            </div>
        </div>
    );
};

export default ReviewTable;
