import { useAppSelector } from '../../store';
import { NavItem } from './NavItem';
import {
    LayoutDashboard,
    Users,
    CheckCircle,
    ClipboardList,
    Folder,
    Receipt,
    Settings,
    Building2,
    Database,
    Upload,
    UserCog,
} from 'lucide-react';

export const Sidebar = () => {
    const user = useAppSelector((state) => state.auth.user);
    const firm = useAppSelector((state) => state.auth.firm);
    const isAdmin = user?.role === 'admin';
    const isSuperAdmin = user?.role === 'super_admin';

    const tier = firm?.subscription_tier ?? 'trial';
    const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);

    const tierColor =
        tier === 'trial'
            ? 'bg-amber-100 text-amber-700 border-amber-200'
            : tier === 'professional'
                ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                : tier === 'growth'
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200';

    return (
        <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 flex flex-col z-40">
            {/* Firm Identity */}
            <div className="px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm leading-none">C</span>
                    </div>
                    <span className="font-bold text-slate-900 text-base">CAlite</span>
                </div>
                {firm?.name && !isSuperAdmin && (
                    <p className="text-xs text-slate-500 mt-1 truncate pl-0.5" title={firm.name}>
                        {firm.name}
                    </p>
                )}
                {isSuperAdmin && (
                    <p className="text-xs text-indigo-600 mt-1 truncate pl-0.5 font-semibold">
                        Global Administrator
                    </p>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
                {/* MAIN */}
                <div>
                    <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase px-3 mb-2">
                        Main
                    </p>
                    <div className="space-y-0.5">
                        <NavItem label="Dashboard" to="/dashboard" icon={LayoutDashboard} end />
                        {!isSuperAdmin && <NavItem label="Clients" to="/clients" icon={Users} />}
                        {!isSuperAdmin && isAdmin && (
                            <NavItem label="Import Clients" to="/clients/import" icon={Upload} />
                        )}
                    </div>
                </div>

                {/* COMPLIANCE & WORK */}
                {!isSuperAdmin && (
                    <div>
                        <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase px-3 mb-2">
                            Compliance & Work
                        </p>
                        <div className="space-y-0.5">
                            <NavItem
                                label="Compliance"
                                to="/compliance"
                                icon={CheckCircle}
                            />
                            <NavItem
                                label="Compliance Library"
                                to="/compliance/library"
                                icon={Database}
                            />
                            <NavItem
                                label="Tasks"
                                to="/tasks"
                                icon={ClipboardList}
                                isDisabled
                                disabledTooltip="Coming in Layer 5"
                            />
                            <NavItem
                                label="Documents"
                                to="/documents"
                                icon={Folder}
                                isDisabled
                                disabledTooltip="Coming in Layer 5"
                            />
                        </div>
                    </div>
                )}

                {/* BILLING */}
                {!isSuperAdmin && (
                    <div>
                        <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase px-3 mb-2">
                            Billing
                        </p>
                        <div className="space-y-0.5">
                            <NavItem
                                label="Billing"
                                to="/billing"
                                icon={Receipt}
                                isDisabled
                                disabledTooltip="Coming in Layer 5"
                            />
                        </div>
                    </div>
                )}

                {/* ADMIN — only visible to admins */}
                {isAdmin && (
                    <div>
                        <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase px-3 mb-2">
                            Firm Admin
                        </p>
                        <div className="space-y-0.5">
                            <NavItem label="Settings" to="/settings" icon={Settings} />
                            <NavItem label="Team Members" to="/settings/users" icon={UserCog} />
                        </div>
                    </div>
                )}

                {/* SUPER ADMIN */}
                {isSuperAdmin && (
                    <div>
                        <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase px-3 mb-2">
                            Platform
                        </p>
                        <div className="space-y-0.5">
                            <NavItem label="CA Firms" to="/platform/firms" icon={Building2} />
                            <NavItem label="Template Library" to="/platform/templates" icon={Database} />
                        </div>
                    </div>
                )}
            </nav>

            {/* Subscription Badge — bottom of sidebar */}
            {!isSuperAdmin && (
                <div className="px-4 py-3 border-t border-slate-100">
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${tierColor}`}>
                        {tierLabel} Plan
                    </div>
                </div>
            )}
        </aside>
    );
};
