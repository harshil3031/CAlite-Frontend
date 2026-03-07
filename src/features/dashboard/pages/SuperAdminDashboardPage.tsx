import { useAppSelector } from '../../../store';
import { Database, Building2, Users2, Shield, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePlatformSummary } from '../hooks/useDashboard';

export const SuperAdminDashboardPage = () => {
    const user = useAppSelector((state) => state.auth.user);
    const { data: summaryResponse, isLoading } = usePlatformSummary();
    const summary = summaryResponse?.data;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Good afternoon, {user?.full_name}
                    </h1>
                    <p className="text-slate-500 text-sm">
                        CAlite Platform Administrator
                    </p>
                </div>

                {/* Main Stats Area */}
                <div className="space-y-8 animate-fade-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Link to="/platform/firms" className="p-6 rounded-2xl glass-card bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-500/20 hover:shadow-lg transition">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                                    <Building2 className="w-6 h-6" />
                                </div>
                            </div>
                            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total CA Firms</h3>
                            <p className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">
                                {isLoading ? '...' : (summary?.firms?.total ?? '0')}
                            </p>
                        </Link>

                        <div className="p-6 rounded-2xl glass-card bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/20">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400">
                                    <Users2 className="w-6 h-6" />
                                </div>
                            </div>
                            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Platform Clients</h3>
                            <p className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">
                                {isLoading ? '...' : (summary?.clients?.total ?? '0')}
                            </p>
                        </div>

                        <Link to="/platform/templates" className="p-6 rounded-2xl glass-card bg-purple-50/50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-500/20 hover:shadow-lg transition">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-purple-100 dark:bg-purple-500/20 rounded-xl text-purple-600 dark:text-purple-400">
                                    <Database className="w-6 h-6" />
                                </div>
                            </div>
                            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Compliance Templates</h3>
                            <p className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">
                                {isLoading ? '...' : (summary?.templates?.total ?? '0')}
                            </p>
                        </Link>

                        <div className="p-6 rounded-2xl glass-card bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-slate-200 dark:bg-slate-700/50 rounded-xl text-slate-600 dark:text-slate-400">
                                    <Shield className="w-6 h-6" />
                                </div>
                            </div>
                            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">System Status</h3>
                            <p className="text-3xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">Healthy</p>
                        </div>
                    </div>

                    <div className="mt-8 p-8 md:p-12 rounded-2xl glass-card bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-center animate-fade-up">
                        <Settings2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Platform Administration</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-lg mx-auto">
                            The full Super Admin control panel for managing cross-firm analytics, compliance template propagation, and platform-level configurations is not yet deployed in this environment.
                        </p>
                        <p className="text-sm text-slate-400">
                            Note: Per the current SRS framework (FR-FIRM-001), CA Firms register themselves via the self-service flow. Global endpoints for explicit firm insertion are planned for the upcoming administrative modules.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboardPage;
