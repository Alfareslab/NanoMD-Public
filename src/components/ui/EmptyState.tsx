import React, { useState } from 'react';

interface EmptyStateProps {
    onSelectTemplate: (content: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectTemplate }) => {
    const [isDragOver, setIsDragOver] = useState(false);

    // Drag and drop handlers specific to EmptyState bounds
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        if (e.dataTransfer && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('text/') || file.name.endsWith('.md')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const text = event.target?.result as string;
                    if (text) onSelectTemplate(text);
                };
                reader.readAsText(file);
            }
        }
    };

    return (
        <div
            className={`flex-1 flex flex-col items-center justify-center p-6 transition-colors duration-200 ${isDragOver ? 'bg-secondary/50 border-2 border-dashed border-accent m-4 rounded-xl' : ''
                }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center space-y-10">

                {/* Hero Section */}
                <button
                    onClick={async () => {
                        try {
                            const text = await navigator.clipboard.readText();
                            if (text) onSelectTemplate(text);
                        } catch (e) {
                            console.error('Failed to read clipboard', e);
                            alert('عفواً، يرجى إعطاء صلاحية لصق المحتوى أو استخدام Ctrl+V');
                        }
                    }}
                    className="relative group flex flex-col items-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 hover:scale-[1.02] transition-all cursor-pointer focus:outline-none select-none"
                    aria-label="ألصق نص الـ AI هنا"
                >
                    <div className="text-6xl sm:text-7xl mb-6 group-hover:drop-shadow-xl group-hover:-translate-y-2 transition-all duration-300">🍌</div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground group-hover:text-accent transition-colors duration-300">
                        ألصق نص الـ AI هنا
                    </h1>
                    <p className="text-muted text-lg sm:text-xl font-medium">
                        اضغط <span className="text-foreground border-b border-dashed border-accent">هنا</span> أو استخدم <kbd className="font-mono bg-secondary px-2 py-1 rounded-md text-sm border border-border text-foreground">Ctrl+V</kbd>
                    </p>

                    {/* Tooltip (Lollipop) */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:-translate-y-2 bg-accent text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg pointer-events-none whitespace-nowrap">
                        اضغط للصق المحتوى ✨
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-accent rotate-45 rounded-sm"></div>
                    </div>
                </button>

                {/* Templates Section Removed per user request */}

                {/* Drag Drop Hint */}
                <div className="text-sm text-muted animate-in fade-in duration-1000 delay-300">
                    <p>أو اسحب ملف <span className="font-mono text-xs bg-secondary px-1 outline outline-1 outline-border rounded">.md</span> هنا</p>
                </div>

            </div>
        </div>
    );
};
