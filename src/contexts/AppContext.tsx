import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppState } from '../types';

interface AppContextType {
    appState: AppState;
    setAppState: React.Dispatch<React.SetStateAction<AppState>>;
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
    isSharedView: false
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [appState, setAppState] = useState<AppState>(defaultState);

    return (
        <AppContext.Provider value={{ appState, setAppState }}>
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
