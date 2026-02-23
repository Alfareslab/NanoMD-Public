import React, { useState } from 'react';
import { Share2, FileText, Code2, Printer } from 'lucide-react';
import { copyPlainText, copyRichText, triggerPrint } from '../../utils/clipboard';
import { Toast } from './Toast';

interface CopyMenuProps {
    markdownContent: string;
}

export const CopyMenu: React.FC<CopyMenuProps> = ({ markdownContent }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setIsOpen(false);
    };

    const handleCopyMarkdown = async () => {
        const success = await copyPlainText(markdownContent);
        if (success) showToast('تم نسخ الماركداون');
    };

    const handleCopyRichText = async () => {
        const previewPane = document.querySelector('.markdown-body');
        if (!previewPane) {
            showToast('خطأ: لم يتم العثور على محتوى');
            return;
        }

        // Create a clone to strip UI classes if necessary, or just copy the HTML inside
        const html = previewPane.innerHTML;
        const text = (previewPane as HTMLElement).innerText;

        // Add basic RTL div wrapper for proper rendering in target applications
        const rtfHtml = `<div dir="rtl" style="font-family: Arial, sans-serif; text-align: right;">${html}</div>`;

        const success = await copyRichText(rtfHtml, text);
        if (success) showToast('تم النسخ للتطبيقات المكتبية');
    };

    const handleCopyHtml = async () => {
        const previewPane = document.querySelector('.markdown-body');
        if (previewPane) {
            const success = await copyPlainText(previewPane.innerHTML);
            if (success) showToast('تم نسخ كود الـ HTML');
        }
    };

    return (
        <>
            <div className="fixed bottom-24 sm:bottom-8 right-4 sm:right-8 z-40 print-hide flex flex-col items-end gap-2">
                {isOpen && (
                    <div className="flex flex-col gap-2 mb-2 animate-in fade-in slide-in-from-bottom-2">
                        <button
                            onClick={handleCopyRichText}
                            className="flex items-center justify-between gap-3 w-48 px-4 py-2 bg-secondary text-foreground rounded-lg shadow border border-border hover:bg-background transition-colors"
                        >
                            <span className="text-sm font-medium">نسخ منسق (Word)</span>
                            <FileText className="w-4 h-4 text-primary" />
                        </button>
                        <button
                            onClick={handleCopyMarkdown}
                            className="flex items-center justify-between gap-3 w-48 px-4 py-2 bg-secondary text-foreground rounded-lg shadow border border-border hover:bg-background transition-colors"
                        >
                            <span className="text-sm font-medium">نسخ كـ Markdown</span>
                            <FileText className="w-4 h-4 text-primary" />
                        </button>
                        <button
                            onClick={handleCopyHtml}
                            className="flex items-center justify-between gap-3 w-48 px-4 py-2 bg-secondary text-foreground rounded-lg shadow border border-border hover:bg-background transition-colors"
                        >
                            <span className="text-sm font-medium">نسخ الـ HTML</span>
                            <Code2 className="w-4 h-4 text-primary" />
                        </button>
                        <button
                            onClick={triggerPrint}
                            className="flex items-center justify-between gap-3 w-48 px-4 py-2 bg-secondary text-foreground rounded-lg shadow border border-border hover:bg-background transition-colors"
                        >
                            <span className="text-sm font-medium">حفظ PDF / طباعة</span>
                            <Printer className="w-4 h-4 text-primary" />
                        </button>
                    </div>
                )}

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-transform active:scale-95"
                    style={{ color: 'white' }}
                    aria-label="خيارات التصدير"
                >
                    <Share2 className="w-5 h-5" />
                </button>
            </div>

            <Toast
                message={toastMessage}
                isVisible={!!toastMessage}
                onClose={() => setToastMessage('')}
            />
        </>
    );
};
