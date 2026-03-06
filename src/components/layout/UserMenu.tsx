import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { clearCredentials } from '../../store/authSlice';
import { authService } from '../../services/authService';
import { toastSuccess } from '../../lib/toast';
import { Settings, Users, LogOut, ChevronDown } from 'lucide-react';

export const UserMenu = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);
    const [open, setOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const isAdmin = user?.role === 'admin';
    const initials = user?.full_name?.charAt(0).toUpperCase() ?? 'U';

    const roleBadgeClass =
        user?.role === 'admin'
            ? 'bg-indigo-100 text-indigo-700'
            : user?.role === 'staff'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-600';

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
                setShowConfirm(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogoutConfirm = async () => {
        try {
            setIsLoggingOut(true);
            await authService.logout();
        } catch {
            // Silent — logout anyway
        } finally {
            dispatch(clearCredentials());
            toastSuccess('Logged out successfully.');
            navigate('/login');
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            {/* Avatar trigger */}
            <button
                id="user-menu-trigger"
                onClick={() => { setOpen(!open); setShowConfirm(false); }}
                className="flex items-center gap-2 rounded-full px-2 py-1.5 hover:bg-slate-100 transition-colors"
            >
                {/* Avatar circle */}
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {initials}
                </div>
                <div className="hidden md:flex flex-col items-start min-w-0">
                    <span className="text-sm font-medium text-slate-800 leading-tight truncate max-w-[110px]">
                        {user?.full_name ?? 'User'}
                    </span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded capitalize ${roleBadgeClass}`}>
                        {user?.role ?? 'user'}
                    </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                    {!showConfirm ? (
                        <>
                            {isAdmin && (
                                <>
                                    <button
                                        onClick={() => { navigate('/settings'); setOpen(false); }}
                                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        <Settings className="w-4 h-4 text-slate-400" />
                                        Firm Settings
                                    </button>
                                    <button
                                        onClick={() => { navigate('/settings/staff'); setOpen(false); }}
                                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        <Users className="w-4 h-4 text-slate-400" />
                                        Staff Management
                                    </button>
                                    <div className="my-1 border-t border-slate-100" />
                                </>
                            )}
                            <button
                                id="logout-btn"
                                onClick={() => setShowConfirm(true)}
                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="px-4 py-3">
                            <p className="text-sm text-slate-700 font-medium mb-3">Confirm logout?</p>
                            <div className="flex gap-2">
                                <button
                                    id="logout-confirm-btn"
                                    onClick={handleLogoutConfirm}
                                    disabled={isLoggingOut}
                                    className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {isLoggingOut ? 'Logging out…' : 'Yes, logout'}
                                </button>
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
