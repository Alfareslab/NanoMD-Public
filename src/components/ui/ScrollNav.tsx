import { useEffect, useState, useCallback } from 'react';
import { ChevronsUp, ChevronUp, ChevronDown, ChevronsDown, Undo2, Loader2 } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

export const ScrollNav = () => {
    const { appState, setAppState } = useAppContext();
    const [showTop, setShowTop] = useState(false);
    const [showUp, setShowUp] = useState(false);
    const [showDown, setShowDown] = useState(false);
    const [showBottom, setShowBottom] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    
    // Translation States
    const [isTranslating, setIsTranslating] = useState(false);
    const [translateError, setTranslateError] = useState<string | null>(null);
    const [undoHistory, setUndoHistory] = useState<string | null>(null);

    const handleScroll = useCallback(() => {
        const container = document.getElementById('print-area');
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        
        // If content fits without scrolling, hide everything
        if (scrollHeight <= clientHeight + 10) {
            setIsVisible(false);
            setProgress(0);
            return;
        }

        setIsVisible(true);

        const maxScroll = scrollHeight - clientHeight;
        const scrollPct = (scrollTop / maxScroll) * 100;
        setProgress(Math.max(0, Math.min(100, scrollPct)));

        const isPastOnePage = scrollTop > clientHeight;
        const isPastThreePages = scrollTop > clientHeight * 3;
        
        const isAtBottom = scrollTop >= maxScroll - 50;
        const isNearBottom = scrollTop >= maxScroll - clientHeight;

        setShowTop(isPastThreePages);
        setShowUp(isPastOnePage);
        setShowDown(!isAtBottom);
        setShowBottom(!isNearBottom);

    }, []);

    useEffect(() => {
        const container = document.getElementById('print-area');
        if (container) {
            container.addEventListener('scroll', handleScroll);
            handleScroll();
            
            const resizeObserver = new ResizeObserver(() => handleScroll());
            resizeObserver.observe(container);

            return () => {
                container.removeEventListener('scroll', handleScroll);
                resizeObserver.disconnect();
            };
        }
    }, [handleScroll]);

    const scrollByAmount = (amount: number) => {
        const container = document.getElementById('print-area');
        if (container) {
            container.scrollBy({ top: amount, behavior: 'smooth' });
        }
    };

    const scrollToTop = () => {
        const container = document.getElementById('print-area');
        if (container) {
            container.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const scrollToBottom = () => {
        const container = document.getElementById('print-area');
        if (container) {
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        }
    };

    const handlePageUp = () => {
        const container = document.getElementById('print-area');
        if (container) scrollByAmount(-(container.clientHeight * 0.8));
    };

    const handlePageDown = () => {
        const container = document.getElementById('print-area');
        if (container) scrollByAmount(container.clientHeight * 0.8);
    };

    // Translation Handlers
    const handleTranslate = async (targetLang: 'ar' | 'en') => {
        const selection = window.getSelection()?.toString();
        const textToTranslate = selection || appState.content;
        
        if (!textToTranslate.trim()) return;

        setIsTranslating(true);
        setTranslateError(null);

        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textToTranslate, targetLang })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'حدث خطأ أثناء الترجمة');
            }

            // Save for undo
            setUndoHistory(appState.content);

            if (selection) {
                setAppState(prev => ({
                    ...prev,
                    content: prev.content.replace(selection, data.translated)
                }));
            } else {
                setAppState(prev => ({
                    ...prev,
                    content: data.translated
                }));
            }
        } catch (error: any) {
            setTranslateError(error.message || 'حدث خطأ غير متوقع');
            setTimeout(() => setTranslateError(null), 3000);
        } finally {
            setIsTranslating(false);
        }
    };

    const handleUndo = () => {
        if (undoHistory) {
            setAppState(prev => ({ ...prev, content: undoHistory }));
            setUndoHistory(null);
        }
    };

    // Make ScrollNav always visible if there's undo history or we're translating so user can see the buttons
    const showControls = isVisible || undoHistory || isTranslating;
    if (!showControls) return null;

    return (
        <>
            <div className="scroll-nav-wrapper">
                {/* Toast Error Message */}
                {translateError && (
                    <div className="absolute top-0 right-full mr-4 whitespace-nowrap bg-red-500/90 text-white px-3 py-1.5 rounded text-sm backdrop-blur-sm border border-red-400 animate-toast shadow-lg">
                        {translateError}
                    </div>
                )}
                
                <div className="scroll-progress-container-vertical">
                    <div 
                        className="scroll-progress-bar-vertical" 
                        style={{ height: `${progress}%` }} 
                    />
                </div>
                <div className="scroll-nav">
                    {/* Translation Controls */}
                    <div className="flex flex-col gap-2 pb-2 mb-2 border-b border-border-default">
                        <button 
                            className="scroll-nav-btn visible"
                            onClick={() => handleTranslate('ar')}
                            disabled={isTranslating}
                            title="ترجم للعربية"
                            aria-label="Translate to Arabic"
                        >
                            {isTranslating ? <Loader2 size={16} className="animate-spin" /> : <span className="font-bold text-xs">AR</span>}
                        </button>
                        <button 
                            className="scroll-nav-btn visible"
                            onClick={() => handleTranslate('en')}
                            disabled={isTranslating}
                            title="ترجم للإنجليزية"
                            aria-label="Translate to English"
                        >
                            {isTranslating ? <Loader2 size={16} className="animate-spin" /> : <span className="font-bold text-xs">EN</span>}
                        </button>
                        {undoHistory && (
                            <button 
                                className="scroll-nav-btn visible text-amber-500 dark:text-amber-400 border-amber-500/50 hover:bg-amber-500 hover:text-white animate-undo-btn"
                                onClick={handleUndo}
                                title="تراجع عن الترجمة"
                                aria-label="Undo translation"
                            >
                                <Undo2 size={16} />
                            </button>
                        )}
                    </div>

                    {/* Navigation Controls */}
                    <button 
                        className={`scroll-nav-btn ${showTop ? 'visible' : ''}`}
                        onClick={scrollToTop}
                        title="أعلى الملف"
                        aria-label="Scroll to top"
                    >
                        <ChevronsUp size={20} />
                    </button>
                    
                    <button 
                        className={`scroll-nav-btn ${showUp ? 'visible' : ''}`}
                        onClick={handlePageUp}
                        title="صفحة لأعلى"
                        aria-label="Page up"
                    >
                        <ChevronUp size={20} />
                    </button>
                    
                    <button 
                        className={`scroll-nav-btn ${showDown ? 'visible' : ''}`}
                        onClick={handlePageDown}
                        title="صفحة لأسفل"
                        aria-label="Page down"
                    >
                        <ChevronDown size={20} />
                    </button>
                    
                    <button 
                        className={`scroll-nav-btn ${showBottom ? 'visible' : ''}`}
                        onClick={scrollToBottom}
                        title="أسفل الملف"
                        aria-label="Scroll to bottom"
                    >
                        <ChevronsDown size={20} />
                    </button>
                </div>
            </div>
        </>
    );
};
