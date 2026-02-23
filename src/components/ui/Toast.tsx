import React, { useEffect } from 'react';
// Using standard Tailwind string concatenation actually for simplicity.

// If `class-variance-authority` (cva) isn't installed, let's just use raw strings.
interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-foreground text-background px-4 py-2 rounded-full shadow-lg text-sm font-medium flex items-center gap-2">
                {message}
            </div>
        </div>
    );
};
