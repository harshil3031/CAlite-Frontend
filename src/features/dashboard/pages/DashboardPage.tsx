import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useDashboardSummary } from '../hooks/useDashboard';
import { DashboardGreeting } from '../components/DashboardGreeting';
import { ClientStatsSection } from '../components/ClientStatsSection';
import RiskSummarySection from '../components/RiskSummarySection';
import OverdueSection from '../components/OverdueSection';
import CalendarSection from '../components/CalendarSection';
import { ActivityPlaceholderSection } from '../components/ActivityPlaceholderSection';
import { useAppSelector } from '../../../store';
import SuperAdminDashboardPage from './SuperAdminDashboardPage';

export const DashboardPage = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { data: summaryData, isLoading, error } = useDashboardSummary();
    const user = useAppSelector((state) => state.auth.user);

    const handleRetry = () => {
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    };

    if (user?.role?.toLowerCase() === 'super_admin') {
        return <SuperAdminDashboardPage />;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <DashboardGreeting />

                {error && (
                    <div className="mb-8 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 flex justify-between items-center text-red-600 dark:text-red-400 font-medium animate-fade-up">
                        <span>Unable to load dashboard summary. Please refresh.</span>
                        <button
                            onClick={handleRetry}
                            className="bg-red-100 hover:bg-red-200 dark:bg-red-500/20 dark:hover:bg-red-500/30 px-4 py-2 rounded-lg transition-colors border border-red-200 flex items-center gap-2"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Empty State / Onboarding */}
                {!isLoading && !error && summaryData?.clients && summaryData.clients.total === 0 && (
                    <div className="mb-8 p-8 md:p-12 rounded-2xl glass-card bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/20 text-center animate-fade-up">
                        <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-2">Welcome to CAlite!</h2>
                        <p className="text-blue-700 dark:text-blue-300 mb-6 max-w-lg mx-auto">
                            Start by adding your first client to unlock the full potential of your compliance dashboard.
                        </p>
                        <button
                            onClick={() => navigate('/clients')}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition"
                        >
                            Add First Client
                        </button>
                    </div>
                )}

                {/* Main Stats Area */}
                <div className="space-y-8 animate-fade-up">

                    {/* Risk Summary */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Compliance Risk Summary</h2>
                        <RiskSummarySection isLoading={isLoading} summary={summaryData} />
                    </div>

                    {/* Overdue List */}
                    <div>
                        <OverdueSection />
                    </div>

                    {/* Calendar Section */}
                    <div>
                        <CalendarSection />
                    </div>

                    {/* Client Stats & Placeholders */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Client Summary</h2>
                            <ClientStatsSection
                                isLoading={isLoading}
                                data={summaryData?.clients}
                            />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Recent Activity</h2>
                            <ActivityPlaceholderSection />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
