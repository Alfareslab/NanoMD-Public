export type Theme = 'noir' | 'slate' | 'cream';
export type ViewMode = 'preview' | 'editor' | 'split' | 'focus';

export interface AppState {
    content: string;
    theme: Theme;
    viewMode: ViewMode;
    isFocusMode: boolean;
    isDrawerOpen: boolean;
    isBottomSheetOpen: boolean;
    isCopyMenuOpen: boolean;
    lastSaved: number | null;
    hasUnsavedChanges: boolean;
    isEmpty: boolean;
    lastActive: string;
    isSharedView?: boolean;
}

export interface ContentVersion {
    id: string;
    timestamp: number;
    markdownString: string;
    charCount?: number;
}

export interface Template {
    id: string;
    name: string;
    icon: string;
    content: string;
}
