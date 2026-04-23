import React, { useState, useEffect, useRef } from 'react';
import { Eye, Pencil, Columns2, Focus, ClipboardPaste, Copy, Trash2, Sun, Moon, HelpCircle, Upload, Printer, Share2, Loader2, History, Save } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { htmlToMarkdown, plainTextSmartConvert } from '../../utils/htmlToMarkdown';
import { ViewMode } from '../../types';
import { ShareHistory } from '../ui/ShareHistory';

interface HeaderProps {
    hasContent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ hasContent = false }) => {
    const { appState, setAppState } = useAppContext();
    const { theme, cycleTheme } = useTheme();
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [selectedText, setSelectedText] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSharing, setIsSharing] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);

    const handleLocalSave = () => {
        if (!appState.content.trim()) return;
        
        const title = appState.content.split('\n').find(line => line.trim().length > 0)?.substring(0, 50).replace(/[#*]/g, '').trim() || 'مسودة غير مسماة';
        const contentPreview = appState.content.substring(0, 100);
        const history = JSON.parse(localStorage.getItem('nano_share_history') || '[]');
        
        const newHistory = [{ 
            id: 'local-' + Math.random().toString(36).substring(2, 10), 
            url: '', 
            title, 
            timestamp: Date.now(),
            contentPreview,
            type: 'local',
            fullContent: appState.content
        }, ...history].slice(0, 20);
        
        localStorage.setItem('nano_share_history', JSON.stringify(newHistory));
        
        alert('تم حفظ المسودة محلياً في السجل بنجاح! 💾');
    };

    const handleShare = async () => {
        if (!appState.content.trim()) return;
        setIsSharing(true);
        try {
            const res = await fetch('/api/share', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: appState.content })
            });
            const data = await res.json();
            if (data.id) {
                const shareUrl = `${window.location.origin}/?share=${data.id}`;
                await navigator.clipboard.writeText(shareUrl);
                
                const title = appState.content.split('\n').find(line => line.trim().length > 0)?.substring(0, 50).replace(/[#*]/g, '').trim() || 'وثيقة غير مسماة';
                const contentPreview = appState.content.substring(0, 100);
                const history = JSON.parse(localStorage.getItem('nano_share_history') || '[]');
                const newHistory = [{ 
                    id: data.id, 
                    url: shareUrl, 
                    title, 
                    timestamp: Date.now(),
                    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
                    contentPreview
                }, ...history].slice(0, 10);
                localStorage.setItem('nano_share_history', JSON.stringify(newHistory));
                
                alert('تم إنشاء رابط المشاركة ونسخه للحافظة بنجاح! 🔗');
            } else {
                alert(data.error || 'فشل إنشاء رابط المشاركة ❌');
            }
        } catch (err) {
            console.error('Share error:', err);
            alert('حدث خطأ أثناء الاتصال بالخادم ❌');
        } finally {
            setIsSharing(false);
        }
    };

    // Handle file upload from disk
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            if (text) {
                setAppState(prev => ({ ...prev, content: text, viewMode: 'preview' }));
            }
        };
        reader.readAsText(file, 'UTF-8');
        // Reset input so re-uploading same file triggers onChange
        e.target.value = '';
    };

    useEffect(() => {
        const handleSelectionChange = () => {
            const selection = window.getSelection();
            if (selection) {
                setSelectedText(selection.toString());
            }
        };

        document.addEventListener('selectionchange', handleSelectionChange);
        return () => document.removeEventListener('selectionchange', handleSelectionChange);
    }, []);

    const handleCopySelected = async () => {
        if (selectedText) {
            try {
                await navigator.clipboard.writeText(selectedText);
                // Optional: show a small toast or visual feedback here
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        }
    };

    const handleModeChange = (mode: ViewMode) => {
        setAppState((prev) => ({ ...prev, viewMode: mode }));
    };

    const handlePaste = async () => {
        try {
            // Try to read rich clipboard (HTML) first
            const clipboardItems = await navigator.clipboard.read();
            for (const item of clipboardItems) {
                // Check for HTML content first
                if (item.types.includes('text/html')) {
                    const htmlBlob = await item.getType('text/html');
                    const html = await htmlBlob.text();
                    if (html) {
                        const markdown = htmlToMarkdown(html);
                        setAppState((prev) => ({ ...prev, content: markdown, viewMode: 'preview' }));
                        return;
                    }
                }
                // Fall back to plain text with smart conversion
                if (item.types.includes('text/plain')) {
                    const textBlob = await item.getType('text/plain');
                    const text = await textBlob.text();
                    if (text) {
                        const converted = plainTextSmartConvert(text);
                        setAppState((prev) => ({ ...prev, content: converted, viewMode: 'preview' }));
                        return;
                    }
                }
            }
        } catch {
            // Fallback: if clipboard.read() is not supported, use readText
            try {
                const text = await navigator.clipboard.readText();
                if (text) {
                    const converted = plainTextSmartConvert(text);
                    setAppState((prev) => ({ ...prev, content: converted, viewMode: 'preview' }));
                }
            } catch (err) {
                console.error('Failed to read clipboard contents: ', err);
            }
        }
    };

    const handleHelp = () => {
        const helpMarkdown = `# 👋 مرحباً بك في NanoMD

**NanoMD** هو محرر نصوص (Markdown) خفيف، سريع، ومصمم خصيصاً لراحتك. لا يحتاج لإنترنت، ويعمل بالكامل داخل متصفحك!

## ✨ الميزات الأساسية:
- 🔄 **تحديث مباشر:** اكتب الكود هنا وشاهده يتحول لتنسيق جميل فوراً.
- 🌓 **وضع التركيز (Focus Mode):** إخفاء كل المشتتات والتركيز فقط على الكتابة.
- 💾 **حفظ تلقائي:** لا تقلق، كل ما تكتبه يُحفظ تلقائياً في متصفحك.
- 🔀 **دعم كامل للغتين:** يعمل بكفاءة مع العربية (من اليمين لليسار) والإنجليزية.
- 🎨 **ثيمات متعددة:** اختر الألوان التي تريح عينك من قائمة الثيمات.

## 🚀 كيف تبدأ؟
جرب كتابة بعض النصوص الآن! يمكنك استخدام العناوين بوضع \`#\` قبل النص، أو القوائم بوضع \`-\`، وسيتم تحويلها فوراً.

---
*صُنع بحب للإنتاجية والسرعة ⚡*`;

        setAppState(prev => ({ ...prev, content: helpMarkdown, viewMode: 'split' }));
    };

    const handleClear = () => {
        if (showClearConfirm) {
            setAppState((prev) => ({ ...prev, content: '', viewMode: 'preview' }));
            setShowClearConfirm(false);
        } else {
            setShowClearConfirm(true);
            setTimeout(() => setShowClearConfirm(false), 3000); // Reset confirm after 3s
        }
    };

    const getThemeIcon = () => {
        switch (theme) {
            case 'noir':
                return <Moon className="w-4 h-4" />;
            case 'slate':
                return <Focus className="w-4 h-4" />;
            case 'cream':
                return <Sun className="w-4 h-4 text-accent" />;
            default:
                return <Sun className="w-4 h-4" />;
        }
    };

    const getThemeLabel = (t: string) => {
        const labels: Record<string, string> = {
            noir: 'أسود (Noir)',
            slate: 'رمادي (Slate)',
            cream: 'كريمي (Cream)',
        };
        return labels[t] || t;
    };

    const NavButton = ({
        active, icon, label, onClick, variant = 'default', hideMobile = false, disabled = false
    }: {
        active?: boolean; icon: React.ReactNode; label: string; onClick: () => void; variant?: 'default' | 'danger' | 'highlight'; hideMobile?: boolean; disabled?: boolean
    }) => (
        <button
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            title={label}
            className={`
        flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl text-[13px] font-semibold transition-all duration-300
        ${hideMobile ? 'hidden sm:flex' : 'flex'}
        ${disabled ? 'opacity-30 cursor-not-allowed' :
                    active
                        ? 'bg-accent text-white shadow-lg shadow-accent/20 scale-105 active:scale-95'
                        : variant === 'danger'
                            ? 'hover:bg-accent-danger/10 text-accent-danger border border-transparent hover:border-accent-danger/20'
                            : variant === 'highlight'
                                ? 'bg-accent/10 text-accent hover:bg-accent/20 border border-accent/10 hover:border-accent/30 shadow-sm'
                                : 'hover:bg-bg-tertiary/50 text-text-secondary hover:text-text-primary border border-transparent hover:border-border-default'
                }
      `}
        >
            {icon}
            <span className="hidden lg:inline">{label}</span>
            {/* Show labels on tablet for the top row only via CSS if needed, but spec says icon only on tablet. The hidden lg:inline achieves icon only on <1024px */}
        </button>
    );

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border-default bg-bg-primary/70 backdrop-blur-[20px] transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-auto min-h-[60px] py-3 flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Logo */}
                <div className="flex items-center gap-2 flex-shrink-0 w-full md:w-auto justify-between md:justify-start">
                    <button
                        onClick={() => setAppState(prev => ({ ...prev, content: '', viewMode: 'preview' }))}
                        className="flex items-center focus:outline-none group flex-shrink-0"
                        title="العودة للصفحة الرئيسية"
                    >
                        <div className="flex items-center gap-1 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-xl md:rounded-2xl bg-accent/5 border border-accent/20 hover:border-accent/40 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-accent/10">
                            {/* SVG Icon - hidden on mobile to save space */}
                            <div className="hidden md:flex items-center justify-center text-accent">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-700 group-hover:scale-110">
                                    {/* Notebook Body */}
                                    <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2.5" />
                                    {/* Binding/Spine Detail */}
                                    <path d="M7 3V21" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
                                    {/* Integrated Digital 'N' (Stylized as data/lines) */}
                                    <path d="M10 16V8L16 16V8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm" />
                                    {/* Aesthetic Dot */}
                                    <circle cx="18" cy="6" r="1" fill="currentColor" />
                                </svg>
                            </div>

                            {/* Text Logo: 'NMD' on mobile, 'NanoMD' on desktop */}
                            <span className="font-display font-black text-xl md:text-2xl tracking-tighter uppercase flex items-center leading-none" dir="ltr">
                                <span className="md:hidden text-accent">NMD</span>
                                <span className="hidden md:flex">
                                    <span className="text-accent">Nano</span>
                                    <span className="text-accent/90 ml-0.5">MD</span>
                                </span>
                            </span>
                        </div>
                    </button>

                    {/* Mobile Only Quick Actions — fluid icon sizing, auto-distributed */}
                    <div className="flex md:hidden items-center flex-1 justify-evenly">
                        {/* Paste */}
                        {!appState.isSharedView && (
                            <button
                                onClick={handlePaste}
                                title="لصق"
                                className="mobile-icon-btn text-accent hover:bg-accent/10"
                            >
                                <ClipboardPaste className="mobile-icon" />
                            </button>
                        )}

                        {/* Upload File */}
                        {!appState.isSharedView && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                title="رفع ملف"
                                className="mobile-icon-btn text-text-muted hover:text-text-primary hover:bg-bg-secondary"
                            >
                                <Upload className="mobile-icon" />
                            </button>
                        )}

                        {/* History */}
                        {!appState.isSharedView && (
                            <button
                                onClick={() => setShowHistoryModal(true)}
                                title="السجل"
                                className="mobile-icon-btn text-text-muted hover:text-text-primary hover:bg-bg-secondary"
                            >
                                <History className="mobile-icon" />
                            </button>
                        )}

                        {/* Save Draft (only when has content) */}
                        {hasContent && !appState.isSharedView && (
                            <button
                                onClick={handleLocalSave}
                                title="حفظ مسودة"
                                className="mobile-icon-btn text-text-muted hover:text-text-primary hover:bg-bg-secondary"
                            >
                                <Save className="mobile-icon" />
                            </button>
                        )}

                        {/* Share (only when has content) */}
                        {hasContent && !appState.isSharedView && (
                            <button
                                onClick={handleShare}
                                disabled={isSharing}
                                title="مشاركة"
                                className="mobile-icon-btn text-text-muted hover:text-text-primary hover:bg-bg-secondary disabled:opacity-40"
                            >
                                {isSharing
                                    ? <Loader2 className="mobile-icon animate-spin" />
                                    : <Share2 className="mobile-icon" />
                                }
                            </button>
                        )}

                        {/* Copy Selected */}
                        <button
                            onClick={selectedText ? handleCopySelected : undefined}
                            disabled={!selectedText}
                            title="نسخ المحدد"
                            className={`mobile-icon-btn transition-colors ${selectedText ? 'text-accent hover:bg-accent/10' : 'text-text-muted opacity-30 cursor-not-allowed'}`}
                        >
                            <Copy className="mobile-icon" />
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={cycleTheme}
                            title="تغيير الثيم"
                            className="mobile-icon-btn text-text-muted hover:text-text-primary hover:bg-bg-secondary"
                        >
                            {getThemeIcon()}
                        </button>
                    </div>
                </div>

                {/* Desktop / Tablet Controls & Mobile Action Bar Container */}
                <div className="flex flex-col lg:flex-row items-center justify-between lg:justify-end gap-2 lg:gap-6 w-full md:w-auto">

                    {/* Row 1: View Modes (Desktop Only) */}
                    {!appState.isSharedView && (
                        <div className="hidden md:flex bg-secondary/30 p-1 rounded-xl border border-border">
                            <NavButton active={appState.viewMode === 'preview'} onClick={() => handleModeChange('preview')} icon={<Eye className="w-4 h-4" />} label="عرض" />
                            <NavButton active={appState.viewMode === 'editor'} onClick={() => handleModeChange('editor')} icon={<Pencil className="w-4 h-4" />} label="تحرير" />
                            <NavButton active={appState.viewMode === 'split'} onClick={() => handleModeChange('split')} icon={<Columns2 className="w-4 h-4" />} label="مقسوم" hideMobile />
                            <NavButton active={appState.viewMode === 'focus'} onClick={() => handleModeChange('focus')} icon={<Focus className="w-4 h-4" />} label="تركيز" />
                        </div>
                    )}

                    {/* Row 2: Actions (Becomes Bottom Bar on Mobile) */}
                    <div className="mobile-action-bar flex flex-wrap justify-center items-center gap-1 w-full md:w-auto mt-2 md:mt-0">
                        {!appState.isSharedView && (
                            <>
                                <NavButton onClick={handlePaste} icon={<ClipboardPaste className="w-4 h-4" />} label="لصق" variant="highlight" />

                                {/* File Upload */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".md,.txt,.markdown"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <NavButton onClick={() => fileInputRef.current?.click()} icon={<Upload className="w-4 h-4" />} label="رفع ملف" />
                            </>
                        )}

                        {/* Minimal Copy trigger for desktop header */}
                        <NavButton
                            onClick={handleCopySelected}
                            icon={<Copy className="w-4 h-4" />}
                            label="نسخ المحدد"
                            disabled={!selectedText}
                            hideMobile
                        />

                        {hasContent && !appState.isSharedView && (
                            <>
                                <NavButton
                                    onClick={handleLocalSave}
                                    icon={<Save className="w-4 h-4" />}
                                    label="حفظ مسودة"
                                />
                                <NavButton
                                    onClick={handleShare}
                                    icon={isSharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                                    label="مشاركة"
                                    variant="highlight"
                                    disabled={isSharing}
                                />
                                <NavButton
                                    onClick={() => window.print()}
                                    icon={<Printer className="w-4 h-4" />}
                                    label="طباعة"
                                    variant="highlight"
                                />
                            </>
                        )}

                        {!appState.isSharedView && (
                            <NavButton
                                onClick={() => setShowHistoryModal(true)}
                                icon={<History className="w-4 h-4" />}
                                label="السجل"
                            />
                        )}

                        {!appState.isSharedView && (
                            <NavButton
                                onClick={handleClear}
                                icon={<Trash2 className={`w-4 h-4 ${showClearConfirm ? 'text-red-600' : ''}`} />}
                                label={showClearConfirm ? "تأكيد مسح؟" : "مسح"}
                                variant="danger"
                            />
                        )}

                        <div className="w-px h-6 bg-border mx-1 hidden lg:block"></div>

                        <NavButton onClick={cycleTheme} icon={getThemeIcon()} label={getThemeLabel(theme)} hideMobile />
                        <NavButton onClick={handleHelp} icon={<HelpCircle className="w-4 h-4" />} label="مساعدة" hideMobile />
                    </div>

                </div>
            </div>

            {/* Share History Modal */}
            {showHistoryModal && (
                <ShareHistory 
                    onClose={() => setShowHistoryModal(false)} 
                    onRestore={(content) => {
                        setAppState(prev => ({ ...prev, content, viewMode: 'preview' }));
                        setShowHistoryModal(false);
                    }}
                />
            )}
        </header>
    );
};
