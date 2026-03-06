import { useAppDispatch, useAppSelector } from '../../store';
import { clearCredentials } from '../../store/authSlice';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { LogOut, Shield, ShieldCheck, User } from 'lucide-react';
import { toastSuccess, toastError } from '../../lib/toast';
import { useState } from 'react';

export const TopNav = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await authService.logout();
            dispatch(clearCredentials());
            toastSuccess('Logged out successfully.');
            navigate('/login');
        } catch (error) {
            toastError('Failed to logout cleanly. Proceeding to logout anyway.');
            dispatch(clearCredentials());
            navigate('/login');
        } finally {
            setIsLoggingOut(false);
        }
    };

    const getRoleIcon = () => {
        if (!user) return <User className="w-4 h-4" />;
        if (user.role === 'admin') return <ShieldCheck className="w-4 h-4 text-purple-400" />;
        if (user.role === 'staff') return <Shield className="w-4 h-4 text-blue-400" />;
        return <User className="w-4 h-4 text-slate-400" />;
    };

    const renderTrialBadge = () => {
        if (user?.firm?.subscription_tier === 'trial' && user.firm.trial_ends_at) {
            const endDateString = user.firm.trial_ends_at; // it might be ISO string
            const nowIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
            const endIST = new Date(new Date(endDateString).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

            const diffTime = endIST.getTime() - nowIST.getTime();
            const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

            return (
                <div className="hidden md:flex items-center px-3 py-1 bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 rounded-full text-xs font-semibold animate-pulse-slow">
                    Trial: {daysRemaining} days remaining
                </div>
            );
        }
        return null;
    };

    return (
        <nav className="h-16 border-b border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                {/* Left Side: Logo & Firm Name */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold text-xl leading-none">C</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight hidden sm:block">CAlite</span>
                    </div>
                    {user?.firm?.name && (
                        <>
                            <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />
                            <span className="text-slate-600 dark:text-slate-300 font-medium hidden sm:block">
                                {user.firm.name}
                            </span>
                        </>
                    )}
                </div>

                {/* Right Side: Trial Badge, User Info & Logout */}
                <div className="flex items-center gap-4">
                    {renderTrialBadge()}

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5">
                        {getRoleIcon()}
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:block max-w-[120px] truncate">
                            {user?.full_name || 'User'}
                        </span>
                    </div>

                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </nav>
    );
};
