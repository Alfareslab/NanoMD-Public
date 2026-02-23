import React from 'react';
import { Eye, Pencil, Menu } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

export const MobileNav: React.FC = () => {
    const { appState, setAppState } = useAppContext();

    const handleTabClick = (view: 'preview' | 'editor') => {
        setAppState(prev => ({ ...prev, viewMode: view }));
    };

    const NavItem = ({
        active, icon, label, onClick
    }: {
        active: boolean; icon: React.ReactNode; label: string; onClick: () => void
    }) => (
        <button
            onClick={onClick}
            className={`
        flex flex-col items-center justify-center w-full py-2 gap-1
        ${active ? 'text-accent' : 'text-muted hover:text-foreground'}
      `}
        >
            <div className={`p-1 rounded-full ${active ? 'bg-accent/10' : ''}`}>
                {icon}
            </div>
            <span className="text-[10px] font-medium">{label}</span>
        </button>
    );

    return (
        <nav className="md:hidden fixed bottom-0 z-40 w-full border-t border-border-default bg-bg-primary/95 backdrop-blur-xl pb-safe">
            <div className="flex items-center justify-around px-2 h-16">
                <NavItem
                    active={appState.viewMode === 'preview'}
                    onClick={() => handleTabClick('preview')}
                    icon={<Eye className="w-5 h-5" />}
                    label="عرض"
                />
                <NavItem
                    active={appState.viewMode === 'editor' || appState.viewMode === 'split'}
                    onClick={() => handleTabClick('editor')}
                    icon={<Pencil className="w-5 h-5" />}
                    label="تحرير"
                />
                <NavItem
                    active={appState.isBottomSheetOpen}
                    onClick={() => setAppState(prev => ({ ...prev, isBottomSheetOpen: !prev.isBottomSheetOpen }))}
                    icon={<Menu className="w-5 h-5" />}
                    label="أدوات"
                />
            </div>
        </nav>
    );
};
