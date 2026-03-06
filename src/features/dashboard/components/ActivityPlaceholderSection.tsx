import { Lock } from 'lucide-react';

export const ActivityPlaceholderSection = () => {
    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Recent Activity</h3>
            <div className="p-10 rounded-2xl glass-card bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 opacity-60 flex flex-col items-center justify-center text-center">
                <Lock className="w-8 h-8 text-slate-400 mb-4" />
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Activity timeline</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Available after compliance records are created</p>
            </div>
        </div>
    );
};
