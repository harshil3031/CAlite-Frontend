import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../../services/dashboardService';
import { getPlatformSummary } from '../../../services/complianceService';

export const useDashboardSummary = () => {
    return useQuery({
        queryKey: ['dashboard', 'summary'],
        queryFn: () => dashboardService.getSummary(),
        staleTime: 30_000,
        refetchOnWindowFocus: true,
    });
};

export const usePlatformSummary = () => {
    return useQuery({
        queryKey: ['platform', 'summary'],
        queryFn: getPlatformSummary,
        staleTime: 60_000,
    });
};

export const useDashboardOverdue = (params: any) => {
    return useQuery({
        queryKey: ['dashboard', 'overdue', params],
        queryFn: () => dashboardService.getOverdue(params),
        staleTime: 30_000,
    });
};

export const useDashboardCalendar = (view: 'monthly' | 'weekly', date: string) => {
    return useQuery({
        queryKey: ['dashboard', 'calendar', view, date],
        queryFn: () => dashboardService.getCalendar({ view, date }),
        staleTime: 30_000,
    });
};
