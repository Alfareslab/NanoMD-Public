import React from 'react';
import { Sparkles } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

interface FeatureCardsGridProps {
    onReviewModeClick: () => void;
}

export const FeatureCardsGrid: React.FC<FeatureCardsGridProps> = ({ onReviewModeClick }) => {
    return (
        <div className="w-full max-w-4xl mx-auto mt-16 animate-in fade-in duration-1000 delay-500 px-4 sm:px-6 print-hide">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FeatureCard
                    icon={Sparkles}
                    title="وضع المراجعة التفاعلي"
                    description="حول جداول الـ AI لأزرار تفاعلية — وفر وقتك ورد بضغطة واحدة بكل سهولة."
                    onClick={onReviewModeClick}
                    delayMs={100}
                />
                {/* 
                  مستقبلاً يمكن إضافة كروت أخرى هنا:
                  <FeatureCard icon={...} title="..." description="..." onClick={...} delayMs={200} />
                */}
            </div>
        </div>
    );
};
