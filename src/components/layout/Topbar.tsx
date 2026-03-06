import { Bell } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';
import { UserMenu } from './UserMenu';

export const Topbar = () => {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center z-50">
            <div className="flex items-center justify-between w-full px-4 sm:px-6">
                {/* Left: hamburger placeholder + breadcrumb */}
                <div className="flex items-center gap-3">
                    {/* Hamburger — placeholder for mobile (non-goal in this version) */}
                    <div className="w-5" />
                    <Breadcrumb />
                </div>

                {/* Right: notifications bell (placeholder) + UserMenu */}
                <div className="flex items-center gap-2">
                    {/* Bell — placeholder for Layer 5 */}
                    <button
                        className="p-2 text-slate-300 cursor-not-allowed rounded-lg"
                        title="Notifications — Coming in Layer 5"
                        disabled
                    >
                        <Bell className="w-5 h-5" />
                    </button>

                    <UserMenu />
                </div>
            </div>
        </header>
    );
};
