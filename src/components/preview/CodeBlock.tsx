import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
    children?: React.ReactNode;
    className?: string;
    node?: any;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ children, className, ...props }) => {
    const [copied, setCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || '');
    const isInline = !match && !String(children).includes('\n');
    const lang = match ? match[1] : 'code';

    const handleCopy = () => {
        if (children) {
            const textToCopy = String(children).replace(/\n$/, '');
            navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (isInline) {
        return (
            <code className={`${className} bg-bg-secondary text-text-primary px-1.5 py-0.5 rounded-md font-mono text-[0.9em] border border-border-default`} {...props}>
                {children}
            </code>
        );
    }

    return (
        <div className="relative group my-8 overflow-hidden rounded-xl border border-border-default bg-bg-secondary shadow-sm transition-all duration-300 hover:shadow-md hover:border-border-hover">
            {/* Header: Fixed LTR for code metadata */}
            <div className="flex items-center justify-between px-4 py-2 bg-bg-tertiary/30 border-b border-border-default select-none" dir="ltr">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-accent-danger/20 border border-accent-danger/30"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-accent-success/20 border border-accent-success/30"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-accent-blue/20 border border-accent-blue/30"></div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-2">{lang}</span>
                </div>

                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md text-text-secondary hover:bg-bg-primary hover:text-accent border border-transparent hover:border-border-default transition-all duration-200"
                    title="Copy Code"
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5 text-accent-success" />
                            <span className="text-[11px] font-medium">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-medium">Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Content: Fixed LTR for code content */}
            <div className="p-5 overflow-auto text-left" dir="ltr" style={{ fontVariantLigatures: 'none' }}>
                <code className={`${className} font-mono text-[13px] leading-relaxed block text-text-primary highlight-custom`} {...props}>
                    {children}
                </code>
            </div>
        </div>
    );
};

