import { useEffect, useState, useCallback } from 'react';
import { ChevronsUp, ChevronUp, ChevronDown, ChevronsDown } from 'lucide-react';

export const ScrollNav = () => {
    const [showTop, setShowTop] = useState(false);
    const [showUp, setShowUp] = useState(false);
    const [showDown, setShowDown] = useState(false);
    const [showBottom, setShowBottom] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

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

        // Logic based on the spec
        // At very top: Top=hide, Up=hide, Down=show, Bottom=show
        // After 1 page: Top=hide, Up=show, Down=show, Bottom=show
        // After 3 pages: Top=show, Up=show, Down=show, Bottom=show
        // Near bottom (1 page left): Top=show, Up=show, Down=show, Bottom=hide
        // At very bottom: Top=show, Up=show, Down=hide, Bottom=hide

        const isAtTop = scrollTop < 50;
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
            // Initial check
            handleScroll();
            
            // Add resize observer to catch height changes
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
        if (container) scrollByAmount(-(container.clientHeight * 0.8)); // scroll 80% of page
    };

    const handlePageDown = () => {
        const container = document.getElementById('print-area');
        if (container) scrollByAmount(container.clientHeight * 0.8);
    };

    if (!isVisible) return null;

    return (
        <>
            {/* Smart Scroll Navigation Buttons */}
            <div className="scroll-nav-wrapper">
                <div className="scroll-progress-container-vertical">
                    <div 
                        className="scroll-progress-bar-vertical" 
                        style={{ height: `${progress}%` }} 
                    />
                </div>
                <div className="scroll-nav">
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
