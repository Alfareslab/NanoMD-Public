import React, { useRef, useEffect } from 'react';

interface EditorPaneProps {
    content: string;
    onChange: (value: string) => void;
    autoFocus?: boolean;
}

export const EditorPane: React.FC<EditorPaneProps> = ({ content, onChange, autoFocus }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (autoFocus && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [autoFocus]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className="w-full h-full flex flex-col bg-background/50 border-l border-border transition-colors">
            <div className="flex items-center justify-between px-4 py-2 bg-secondary/30 border-b border-border text-xs font-semibold text-muted">
                <span>المحرر (Markdown)</span>
                <span>{content.length} حرف</span>
            </div>
            <textarea
                ref={textareaRef}
                value={content}
                onChange={handleChange}
                className="flex-1 w-full p-4 sm:p-6 bg-transparent resize-none outline-none text-foreground font-mono leading-relaxed"
                placeholder="اكتب أو الصق نص الماركداون هنا..."
                dir="rtl"
                spellCheck={false}
            />
        </div>
    );
};
