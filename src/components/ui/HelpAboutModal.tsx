import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import presentationContent from '../../../docs/presentation-ar.md?raw';

interface HelpAboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HelpAboutModal: React.FC<HelpAboutModalProps> = ({ isOpen, onClose }) => {
    const [isRendered, setIsRendered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => setIsRendered(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isRendered) return null;

    const bgPrimary = 'var(--bg-primary)';
    const bgSecondary = 'var(--bg-secondary)';
    const borderColor = 'var(--border-default)';
    const textPrimary = 'var(--text-primary)';
    const textMuted = 'var(--text-muted)';
    const accent = 'var(--accent-primary)';

    return createPortal(
        <div
            dir="rtl"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
            }}
        >
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    transition: 'opacity 0.3s',
                    opacity: isVisible ? 1 : 0,
                }}
            />

            {/* Modal */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '720px',
                    height: '88dvh',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    border: `1px solid ${borderColor}`,
                    boxShadow: '0 25px 50px rgba(0,0,0,0.35)',
                    backgroundColor: bgPrimary,
                    transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(2rem) scale(0.96)',
                    opacity: isVisible ? 1 : 0,
                    transition: 'transform 0.3s ease, opacity 0.3s ease',
                }}
            >
                {/* Header */}
                <div style={{
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    borderBottom: `1px solid ${borderColor}`,
                    backgroundColor: bgSecondary,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: 40, height: 40,
                            borderRadius: '0.625rem',
                            backgroundColor: 'rgba(59,130,246,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: accent,
                        }}>
                            <BookOpen size={20} />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: textPrimary }}>
                                عن المنصة
                            </h2>
                            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: textMuted }}>
                                الدليل الشامل لمنصة NanoMD
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        title="إغلاق"
                        style={{
                            padding: '0.5rem', border: 'none', cursor: 'pointer',
                            borderRadius: '0.5rem', color: textMuted,
                            backgroundColor: 'transparent', display: 'flex',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable content */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '1.5rem 2rem',
                    backgroundColor: bgPrimary,
                    color: textPrimary,
                }}>
                    {/* Inline styles for markdown rendering — theme-aware */}
                    <style>{`
                        .help-md h1 { font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.5rem; }
                        .help-md h2 { font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: 1.5rem 0 0.5rem; border-bottom: 1px solid var(--border-default); padding-bottom: 0.4rem; }
                        .help-md h3 { font-size: 1rem; font-weight: 600; color: var(--text-primary); margin: 1rem 0 0.35rem; }
                        .help-md p { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.75; margin: 0.4rem 0 0.75rem; }
                        .help-md ul, .help-md ol { padding-right: 1.25rem; margin: 0.5rem 0; }
                        .help-md li { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 0.3rem; }
                        .help-md strong { color: var(--text-primary); font-weight: 600; }
                        .help-md em { color: var(--text-muted); }
                        .help-md code { 
                            background-color: var(--bg-tertiary); 
                            color: var(--accent-primary);
                            padding: 0.1rem 0.4rem; 
                            border-radius: 0.3rem; 
                            font-size: 0.8rem; 
                            font-family: monospace;
                        }
                        .help-md blockquote { 
                            border-right: 3px solid var(--accent-primary); 
                            border-left: none;
                            padding: 0.5rem 0.75rem; 
                            margin: 0.75rem 0; 
                            background-color: var(--bg-secondary); 
                            border-radius: 0 0.375rem 0.375rem 0;
                        }
                        .help-md blockquote p { color: var(--text-secondary); margin: 0; }
                        .help-md hr { border: none; border-top: 1px solid var(--border-default); margin: 1.25rem 0; }
                        .help-md a { color: var(--accent-primary); text-decoration: none; }
                        .help-md table { width: 100%; border-collapse: collapse; font-size: 0.85rem; margin: 0.75rem 0; }
                        .help-md th { background-color: var(--bg-tertiary); color: var(--text-primary); padding: 0.5rem 0.75rem; text-align: right; border: 1px solid var(--border-default); font-weight: 600; }
                        .help-md td { padding: 0.4rem 0.75rem; border: 1px solid var(--border-default); color: var(--text-secondary); }
                        .help-md tr:nth-child(even) td { background-color: var(--bg-secondary); }
                    `}</style>
                    <div className="help-md">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeSanitize]}
                        >
                            {presentationContent}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    flexShrink: 0,
                    padding: '0.875rem 1.25rem',
                    borderTop: `1px solid ${borderColor}`,
                    backgroundColor: bgSecondary,
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '0.5rem 1.5rem',
                            backgroundColor: accent,
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '0.625rem',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                        إغلاق
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
