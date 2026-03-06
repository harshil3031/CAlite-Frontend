import { useAppSelector } from '../../../store';
import { useMemo } from 'react';

export const DashboardGreeting = () => {
    const user = useAppSelector((state) => state.auth.user);

    const greeting = useMemo(() => {
        const istTimeStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour12: false });
        const dateObjInIST = new Date(istTimeStr);
        const hour = dateObjInIST.getHours();

        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    }, []);

    // Fallback gracefully since User type may vary
    const fullName = user?.full_name || (user as any)?.fullName || 'User';
    const firmName = (user as any)?.firm_name || (user as any)?.firm?.name || 'Your Firm';

    return (
        <div className="mb-8 p-8 rounded-3xl glass-card bg-slate-900/60 dark:bg-slate-900/40 border border-white/10 shadow-xl relative overflow-hidden animate-fade-up">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        {greeting}, <span className="text-blue-400">{fullName}</span>
                    </h1>
                    <p className="text-slate-400 text-lg">{firmName}</p>
                </div>
            </div>
        </div>
    );
};
