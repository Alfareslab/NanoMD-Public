import React from 'react';
import { ViewMode } from '../../types';

interface SplitViewProps {
    viewMode: ViewMode;
    previewPane: React.ReactNode;
    editorPane: React.ReactNode;
}

export const SplitView: React.FC<SplitViewProps> = ({ viewMode, previewPane, editorPane }) => {
    if (viewMode === 'preview' || viewMode === 'focus') {
        return <div className="w-full h-full">{previewPane}</div>;
    }

    if (viewMode === 'editor') {
        return <div className="w-full h-full max-w-4xl mx-auto">{editorPane}</div>;
    }

    // Split mode: Desktop only logic (handled via CSS/Tailwind usually, but let's assume valid state)
    // RTL layout: Preview on Right (visual left if LTR, visual right if RTL? Actually RTL flex places first item on right).
    // The spec says: Split Mode: Editor on Right (1/3), Preview on Left (2/3).
    // In RTL, the physical Right is the start of the `flex-row`. So Editor should be first.

    return (
        <div className="w-full h-full flex flex-col sm:flex-row overflow-hidden">
            {/* Editor Pane: 1/3 width on desktop */}
            <div className="w-full sm:w-1/3 h-1/2 sm:h-full border-b sm:border-b-0 sm:border-l border-border-default flex-shrink-0">
                {editorPane}
            </div>

            {/* Preview Pane: 2/3 width on desktop */}
            <div className="w-full sm:w-2/3 h-1/2 sm:h-full flex-grow">
                {previewPane}
            </div>
        </div>
    );
};
