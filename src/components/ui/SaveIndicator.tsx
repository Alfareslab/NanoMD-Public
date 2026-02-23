import React, { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';

interface SaveIndicatorProps {
    status: 'idle' | 'saving' | 'saved';
}

export const SaveIndicator: React.FC<SaveIndicatorProps> = ({ status }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (status === 'saved') {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 2000); // Hide after 2 seconds
            return () => clearTimeout(timer);
        } else if (status === 'saving') {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [status]);

    if (!visible) return null;

    return (
        <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 print-hide z-50">
            <div className="flex items-center gap-2 bg-secondary/80 backdrop-blur text-xs px-3 py-1.5 rounded-full border border-border text-muted">
                {status === 'saving' && (
                    <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>يتم الحفظ...</span>
                    </>
                )}
                {status === 'saved' && (
                    <>
                        <Check className="w-3 h-3 text-green-500" />
                        <span>تم الحفظ</span>
                    </>
                )}
            </div>
        </div>
    );
};
