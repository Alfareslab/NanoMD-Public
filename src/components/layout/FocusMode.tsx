import React from 'react';
import { X } from 'lucide-react';
import { PreviewPane } from '../preview/PreviewPane';
import { useAppContext } from '../../contexts/AppContext';

interface FocusModeProps {
    content: string;
}

export const FocusMode: React.FC<FocusModeProps> = ({ content }) => {
    const { setAppState } = useAppContext();

    const exitFocusMode = () => {
        setAppState((prev) => ({ ...prev, viewMode: 'preview' }));
    };

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-background animate-in fade-in duration-300" style={{ backgroundColor: 'var(--focus-bg)' }}>
            {/* Floating Exit Button */}
            <button
                onClick={exitFocusMode}
                className="fixed top-6 left-6 p-2 rounded-full bg-secondary text-muted hover:text-foreground hover:bg-border transition-colors z-50 shadow-sm"
                title="الخروج من وضع التركيز (Esc)"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Content Container */}
            <div className="max-w-3xl mx-auto w-full pt-16 pb-32 px-4 sm:px-6">
                <PreviewPane content={content} />
            </div>
        </div>
    );
};
