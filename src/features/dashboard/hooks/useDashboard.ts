import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../../services/dashboardService';

export const useDashboardSummary = () => {
    return useQuery({
        queryKey: ['dashboard', 'summary'],
        queryFn: () => dashboardService.getSummary(),
        staleTime: 30_000,
        refetchOnWindowFocus: true,
    });
};
