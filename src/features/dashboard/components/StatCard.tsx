import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Lock } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: number | string | null;
    icon?: ReactNode;
    color?: string; // e.g. 'blue', 'green', 'gray'
    isLoading?: boolean;
    isPlaceholder?: boolean;
}

const colorMaps: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    gray: 'bg-slate-50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400',
};

export const StatCard = ({ title, value, icon, color = 'gray', isLoading, isPlaceholder }: StatCardProps) => {
    const [displayValue, setDisplayValue] = useState<number | string>(0);
    const badgeClass = colorMaps[color] || colorMaps.gray;

    useEffect(() => {
        if (!isLoading && !isPlaceholder && typeof value === 'number') {
            const duration = 1000; // 1 second
            const startTime = performance.now();

            const animateValue = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // ease out quad
                const easeOut = progress * (2 - progress);

                setDisplayValue(Math.floor(easeOut * value));

                if (progress < 1) {
                    requestAnimationFrame(animateValue);
                } else {
                    setDisplayValue(value);
                }
            };
            requestAnimationFrame(animateValue);
        } else if (typeof value === 'string') {
            setDisplayValue(value);
        }
    }, [value, isLoading, isPlaceholder]);

    if (isLoading) {
        return (
            <div className="p-6 rounded-2xl glass-card bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 shadow-sm animate-pulse h-[130px]">
                <div className="flex justify-between items-start mb-4">
                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                </div>
                <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
        );
    }

    if (isPlaceholder) {
        return (
            <div className="p-6 rounded-2xl glass-card bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 opacity-60 h-[130px] flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-slate-400" />
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h3>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Available after compliance setup</p>
            </div>
        );
    }

    return (
        <div className="p-6 rounded-2xl glass-card bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow h-[130px] flex flex-col justify-between group">
            <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h3>
                {icon && (
                    <div className={`p-2.5 rounded-xl transition-transform group-hover:scale-110 ${badgeClass}`}>
                        {icon}
                    </div>
                )}
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {displayValue}
            </div>
        </div>
    );
};
