import { useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { ContentVersion } from '../types';

export const useAutoSave = (content: string) => {
    const [history, setHistory] = useLocalStorage<ContentVersion[]>('nanomd_history', []);
    const [, setCurrentDraft] = useLocalStorage<string>('nanomd_current_draft', '');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    // Immediately save exact draft on changes to prevent tab close loss
    useEffect(() => {
        setCurrentDraft(content);
    }, [content, setCurrentDraft]);

    // Debounced history save (3s)
    useEffect(() => {
        if (!content) return;

        setSaveStatus('saving');

        const timer = setTimeout(() => {
            setHistory((prev) => {
                // Prevent duplicate saves if content hasn't changed since last version
                const lastVersion = prev[prev.length - 1];
                if (lastVersion && lastVersion.markdownString === content) {
                    setSaveStatus('saved');
                    return prev;
                }

                const newVersion: ContentVersion = {
                    id: crypto.randomUUID(),
                    timestamp: Date.now(),
                    markdownString: content,
                    charCount: content.length,
                };

                const nextHistory = [...prev, newVersion];
                // Keep only last 5
                if (nextHistory.length > 5) {
                    nextHistory.shift();
                }

                return nextHistory;
            });

            setSaveStatus('saved');
        }, 3000);

        return () => {
            clearTimeout(timer);
            setSaveStatus('idle');
        };
    }, [content, setHistory]);

    return { saveStatus, history };
};
