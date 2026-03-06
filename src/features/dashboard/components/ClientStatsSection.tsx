import { useMemo } from 'react';
import { Users, UserCheck, UserX } from 'lucide-react';
import { StatCard } from './StatCard';
import type { DashboardSummaryDTO } from '../../../services/dashboardService';

interface ClientStatsSectionProps {
    data?: DashboardSummaryDTO['clients'];
    isLoading: boolean;
}

export const ClientStatsSection = ({ data, isLoading }: ClientStatsSectionProps) => {
    const listData = useMemo(() => {
        if (!data?.byEntityType) return [];
        const sorted = [...data.byEntityType].sort((a, b) => b.count - a.count);
        const top4 = sorted.slice(0, 4);
        const othersCount = sorted.slice(4).reduce((sum, item) => sum + item.count, 0);
        if (othersCount > 0) {
            top4.push({ entityType: 'Others', count: othersCount });
        }
        return top4;
    }, [data?.byEntityType]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                title="Total Clients"
                value={data?.total ?? null}
                icon={<Users className="w-5 h-5" />}
                color="blue"
                isLoading={isLoading}
            />
            <StatCard
                title="Active Clients"
                value={data?.active ?? null}
                icon={<UserCheck className="w-5 h-5" />}
                color="green"
                isLoading={isLoading}
            />
            <StatCard
                title="Inactive Clients"
                value={data?.inactive ?? null}
                icon={<UserX className="w-5 h-5" />}
                color="gray"
                isLoading={isLoading}
            />

            {/* Entity Breakdown Card */}
            <div className="p-6 rounded-2xl glass-card bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-sm h-[130px] flex flex-col justify-between overflow-hidden">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Entity Types</h3>
                {isLoading ? (
                    <div className="space-y-2 animate-pulse">
                        <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                        <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
                        <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-700 rounded" />
                    </div>
                ) : (
                    <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 overflow-y-auto pr-1 thin-scrollbar">
                        {listData.length > 0 ? (
                            listData.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center group">
                                    <span className="truncate pr-2" title={item.entityType}>{item.entityType}</span>
                                    <span className="font-semibold">{item.count}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-slate-400 italic">No data</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
