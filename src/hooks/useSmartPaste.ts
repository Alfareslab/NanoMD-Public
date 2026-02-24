import { useEffect } from 'react';
import { htmlToMarkdown, plainTextSmartConvert } from '../utils/htmlToMarkdown';

export const useSmartPaste = (onContentReceived: (text: string) => void) => {
    useEffect(() => {
        // 1. Smart Paste Handler — prefers HTML for rich content conversion
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
                const html = e.clipboardData.getData('text/html');
                const plain = e.clipboardData.getData('text/plain');

                if (html) {
                    e.preventDefault();
                    const markdown = htmlToMarkdown(html);
                    onContentReceived(markdown);
                } else if (plain) {
                    e.preventDefault();
                    const converted = plainTextSmartConvert(plain);
                    onContentReceived(converted);
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
