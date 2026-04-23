import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    onClick: () => void;
    delayMs?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, onClick, delayMs = 0 }) => {
    return (
        <button
            onClick={onClick}
            className="group text-right flex flex-col items-start w-full p-6 rounded-2xl bg-secondary/30 backdrop-blur-md border border-border/50 hover:border-accent/50 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-500 animate-in fade-in slide-in-from-bottom-6 fill-mode-both"
            style={{ animationDelay: `${delayMs}ms`, willChange: 'transform, opacity' }}
            type="button"
        >
            <div className="mb-4 p-3 rounded-xl bg-background/50 border border-border/50 group-hover:bg-accent/10 group-hover:border-accent/30 transition-colors duration-300">
                <Icon className="w-6 h-6 text-foreground group-hover:text-accent transition-all duration-500 group-hover:scale-110" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-300 font-outfit">
                {title}
            </h3>
            <p className="text-sm text-muted leading-relaxed mb-4 flex-1">
                {description}
            </p>
            <div className="flex items-center text-sm font-bold text-accent mt-auto gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                اكتشف المزيد
                <span className="transform transition-transform duration-300 group-hover:-translate-x-1.5 inline-block mr-1">←</span>
            </div>
        </button>
    );
};
