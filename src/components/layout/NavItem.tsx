import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface NavItemProps {
    label: string;
    to: string;
    icon: LucideIcon;
    isDisabled?: boolean;
    disabledTooltip?: string;
    end?: boolean;
}

export const NavItem = ({ label, to, icon: Icon, isDisabled = false, disabledTooltip, end }: NavItemProps) => {
    if (isDisabled) {
        return (
            <div
                className="group relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-not-allowed"
                title={disabledTooltip}
            >
                <Icon className="w-5 h-5 text-slate-300" />
                <span className="text-sm font-medium text-slate-300">{label}</span>
                {disabledTooltip && (
                    <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block z-50 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
                        {disabledTooltip}
                    </span>
                )}
            </div>
        );
    }

    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative ${isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold border-l-[3px] border-indigo-600 pl-[9px]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                    <span className="text-sm">{label}</span>
                </>
            )}
        </NavLink>
    );
};
