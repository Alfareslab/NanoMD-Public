import React, { useState } from 'react';
import { Share2, FileText, Code2, Printer, X } from 'lucide-react';
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
        const html = previewPane.innerHTML;
        const text = (previewPane as HTMLElement).innerText;
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

    const menuItems = [
        { label: 'نسخ منسق (Word)', icon: <FileText className="w-4 h-4" />, action: handleCopyRichText },
        { label: 'نسخ كـ Markdown',  icon: <FileText className="w-4 h-4" />, action: handleCopyMarkdown },
        { label: 'نسخ الـ HTML',     icon: <Code2 className="w-4 h-4" />,    action: handleCopyHtml },
        { label: 'حفظ PDF / طباعة', icon: <Printer className="w-4 h-4" />,  action: triggerPrint },
    ];

    return (
        <>
            {/* ─── Desktop FAB (hidden on mobile) ─── */}
            <div className="hidden sm:flex fixed bottom-8 right-8 z-40 print-hide flex-col items-end gap-2">
                {isOpen && (
                    <div className="flex flex-col gap-2 mb-2 animate-in fade-in slide-in-from-bottom-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={item.action}
                                className="flex items-center justify-between gap-3 w-52 px-4 py-2.5
                                           bg-bg-secondary text-text-primary rounded-xl shadow-md
                                           border border-border-default hover:bg-bg-primary
                                           transition-colors text-sm font-medium"
                            >
                                <span>{item.label}</span>
                                <span className="text-accent">{item.icon}</span>
                            </button>
                        ))}
                    </div>
                )}

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-12 h-12 bg-accent text-white rounded-full shadow-lg
                               flex items-center justify-center
                               hover:bg-accent/90 transition-all active:scale-95
                               shadow-accent/30"
                    aria-label="خيارات التصدير"
                >
                    {isOpen ? <X className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                </button>
            </div>

            {/* ─── Mobile Bottom Sheet (triggered externally via window event) ─── */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="sm:hidden fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                    {/* Sheet */}
                    <div className="sm:hidden fixed bottom-0 inset-x-0 z-[60] print-hide
                                    rounded-t-3xl border-t border-border-default
                                    bg-bg-primary/95 backdrop-blur-2xl
                                    shadow-[0_-8px_40px_-4px_rgba(0,0,0,0.18)]
                                    animate-in slide-in-from-bottom duration-300 pb-safe">
                        {/* Handle */}
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 rounded-full bg-border-default" />
                        </div>

                        <p className="text-center text-[11px] font-semibold text-text-muted uppercase tracking-widest pb-3">
                            خيارات التصدير
                        </p>

                        <div className="flex flex-col gap-1.5 px-4 pb-6">
                            {menuItems.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={item.action}
                                    className="flex items-center justify-between w-full px-4 py-3.5
                                               rounded-xl bg-bg-secondary/60 hover:bg-bg-secondary
                                               border border-border-default/50
                                               text-text-primary transition-colors active:scale-[0.98]"
                                >
                                    <span className="text-sm font-medium">{item.label}</span>
                                    <span className="text-accent p-1.5 rounded-lg bg-accent/10">{item.icon}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Global trigger: listen for custom event from MobileNav */}
            <OpenExportListener onOpen={() => setIsOpen(true)} />

            <Toast
                message={toastMessage}
                isVisible={!!toastMessage}
                onClose={() => setToastMessage('')}
            />
        </>
    );
};

// ─── Helper: listen for open-export-menu custom event ───
const OpenExportListener: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
    React.useEffect(() => {
        const handler = () => onOpen();
        window.addEventListener('open-export-menu', handler);
        return () => window.removeEventListener('open-export-menu', handler);
    }, [onOpen]);
    return null;
};
