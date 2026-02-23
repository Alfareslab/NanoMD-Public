import { useEffect } from 'react';

export const useSmartPaste = (onContentReceived: (text: string) => void) => {
    useEffect(() => {
        // 1. Paste Handler
        const handlePaste = (e: ClipboardEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) {
                return;
            }

            if (e.clipboardData) {
                const text = e.clipboardData.getData('text/plain');
                if (text) {
                    e.preventDefault();
                    onContentReceived(text);
                }
            }
        };

        // 2. Drag & Drop Handlers
        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
            if (e.dataTransfer) {
                e.dataTransfer.dropEffect = 'copy';
            }
        };

        const handleDrop = (e: DragEvent) => {
            e.preventDefault();

            const target = e.target as HTMLElement;
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) {
                return;
            }

            if (e.dataTransfer && e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                // Only accept text-based files
                if (file.type.startsWith('text/') || file.name.endsWith('.md')) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const text = event.target?.result as string;
                        if (text) onContentReceived(text);
                    };
                    reader.readAsText(file);
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        window.addEventListener('dragover', handleDragOver);
        window.addEventListener('drop', handleDrop);

        return () => {
            window.removeEventListener('paste', handlePaste);
            window.removeEventListener('dragover', handleDragOver);
            window.removeEventListener('drop', handleDrop);
        };
    }, [onContentReceived]);
};
