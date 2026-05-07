import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppState } from '../types';

interface TranslationState {
    isTranslating: boolean;
    error: string | null;
    canUndo: boolean;
}

interface AppContextType {
    appState: AppState;
    setAppState: React.Dispatch<React.SetStateAction<AppState>>;
    translationState: TranslationState;
    translateContent: (targetLang: 'ar' | 'en') => Promise<void>;
    undoTranslation: () => void;
    toggleContextTranslation: () => void;
}

const defaultState: AppState = {
    content: '',
    theme: 'cream',
    viewMode: 'preview',
    isFocusMode: false,
    isDrawerOpen: false,
    isBottomSheetOpen: false,
    isCopyMenuOpen: false,
    lastSaved: null,
    hasUnsavedChanges: false,
    isEmpty: true,
    lastActive: new Date().toISOString(),
    isSharedView: false,
    useContextTranslation: true,
    editorSelection: null
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [appState, setAppState] = useState<AppState>(defaultState);
    const [isTranslating, setIsTranslating] = useState(false);
    const [translateError, setTranslateError] = useState<string | null>(null);
    const [undoHistory, setUndoHistory] = useState<string | null>(null);

    const translateContent = async (targetLang: 'ar' | 'en') => {
        const selection = appState.editorSelection;
        const canUseEditorSelection = appState.viewMode === 'editor' || appState.viewMode === 'split';
        const hasEditorSelection = Boolean(canUseEditorSelection && selection && selection.end > selection.start && selection.text.trim());
        const textToTranslate = hasEditorSelection ? selection!.text : appState.content;

        if (!textToTranslate.trim()) return;

        setIsTranslating(true);
        setTranslateError(null);

        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: textToTranslate,
                    targetLang,
                    useContextTranslation: appState.useContextTranslation
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Translation failed');
            }

            setUndoHistory(appState.content);
            setAppState(prev => {
                if (hasEditorSelection && selection) {
                    return {
                        ...prev,
                        content: prev.content.slice(0, selection.start) + data.translated + prev.content.slice(selection.end),
                        editorSelection: null
                    };
                }

                return {
                    ...prev,
                    content: data.translated,
                    editorSelection: null
                };
            });
        } catch (error: any) {
            const message = error?.message || 'Translation failed';
            setTranslateError(message);
            setTimeout(() => setTranslateError(null), 3000);
            console.error('Translation error:', error);
        } finally {
            setIsTranslating(false);
        }
    };

    const undoTranslation = () => {
        if (!undoHistory) return;
        setAppState(prev => ({ ...prev, content: undoHistory, editorSelection: null }));
        setUndoHistory(null);
    };

    const toggleContextTranslation = () => {
        setAppState(prev => ({
            ...prev,
            useContextTranslation: !prev.useContextTranslation
        }));
    };

    return (
        <AppContext.Provider
            value={{
                appState,
                setAppState,
                translationState: {
                    isTranslating,
                    error: translateError,
                    canUndo: Boolean(undoHistory)
                },
                translateContent,
                undoTranslation,
                toggleContextTranslation
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
