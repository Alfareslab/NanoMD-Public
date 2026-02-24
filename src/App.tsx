import { useEffect } from 'react';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { EmptyState } from './components/ui/EmptyState';
import { PreviewPane } from './components/preview/PreviewPane';
import { EditorPane } from './components/editor/EditorPane';
import { SplitView } from './components/layout/SplitView';
import { FocusMode } from './components/layout/FocusMode';
import { CopyMenu } from './components/ui/CopyMenu';
import { SaveIndicator } from './components/ui/SaveIndicator';
import { useSmartPaste } from './hooks/useSmartPaste';
import { useKeyboard } from './hooks/useKeyboard';
import { useAppContext } from './contexts/AppContext';
import { useAutoSave } from './hooks/useAutoSave';

function App() {
    const { appState, setAppState } = useAppContext();

    // Load initial draft from localStorage if available
    useEffect(() => {
        try {
            const draft = window.localStorage.getItem('nanomd_current_draft');
            if (draft && draft.length > 0) {
                setAppState(prev => ({ ...prev, content: JSON.parse(draft) }));
            }
        } catch (e) {
            console.warn("Failed to load draft", e);
        }
    }, [setAppState]);

    // Handle template selection from EmptyState
    const handleSelectTemplate = (templateContent: string) => {
        setAppState(prev => ({
            ...prev,
            content: templateContent,
            viewMode: 'preview'
        }));
    };

    // Smart Paste & Drop Handler (Updates global context)
    useSmartPaste((pastedText) => {
        setAppState(prev => ({ ...prev, content: pastedText, viewMode: 'preview' }));
    });

    // Global Keyboard Shortcuts
    useKeyboard();

    // Auto-Save Mechanism
    const { saveStatus } = useAutoSave(appState.content);

    // Sync content emptiness
    const hasContent = appState.content.trim().length > 0;

    return (
        <div className="flex flex-col h-[100dvh] bg-bg-primary text-text-primary transition-all duration-300" dir="rtl">
            {appState.viewMode !== 'focus' && <Header />}

            <main className="flex-1 overflow-hidden relative flex flex-col">
                {appState.viewMode === 'focus' ? (
                    <FocusMode content={appState.content} />
                ) : hasContent ? (
                    <>
                        <SplitView
                            viewMode={appState.viewMode}
                            previewPane={<PreviewPane content={appState.content} />}
                            editorPane={
                                <EditorPane
                                    content={appState.content}
                                    onChange={(text) => setAppState(prev => ({ ...prev, content: text }))}
                                    autoFocus={appState.viewMode === 'editor' || appState.viewMode === 'split'}
                                />
                            }
                        />
                        <CopyMenu markdownContent={appState.content} />
                    </>
                ) : (
                    <EmptyState onSelectTemplate={handleSelectTemplate} />
                )}
            </main>

            <SaveIndicator status={saveStatus} />

            {appState.viewMode !== 'focus' && <MobileNav />}

            {appState.viewMode !== 'focus' && (
                <footer className="app-footer">
                    <span>v1.0.0</span>
                    <span>© {new Date().getFullYear()} DataCodex. All rights reserved.</span>
                </footer>
            )}
        </div>
    );
}

export default App;
