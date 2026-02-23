import React from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
    const { cycleTheme } = useTheme();

    return (
        <button
            onClick={cycleTheme}
            className="p-2 rounded-md hover:bg-secondary text-foreground transition-colors flex items-center justify-center"
            title="تغيير المظهر"
            aria-label="تغيير المظهر"
        >
            <Palette className="w-5 h-5" />
        </button>
    );
};
