import { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ViewMode } from '../types';

export const useKeyboard = () => {
    const { setAppState } = useAppContext();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Must use Ctrl (Windows) or Cmd (Mac)
            if (!e.ctrlKey && !e.metaKey) return;

            let newMode: ViewMode | null = null;

            switch (e.key) {
                case '1':
                    newMode = 'preview';
                    break;
                case '2':
                    newMode = 'editor';
                    break;
                case '3':
                    newMode = 'split';
                    break;
                case '4':
                    newMode = 'focus';
                    break;
                default:
                    break;
            }

            if (newMode) {
                e.preventDefault();
                setAppState(prev => ({ ...prev, viewMode: newMode as ViewMode }));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [setAppState]);
};
