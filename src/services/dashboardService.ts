import { axiosInstance } from './axiosInstance';

export interface DashboardSummaryDTO {
    clients: {
        total: number;
        active: number;
        inactive: number;
        byEntityType: Array<{ entityType: string; count: number }>;
    };
    compliance: {
        status: string;
        dueThisWeek: number | null;
        overdue: number | null;
        riskSummary: string | null;
    } | null;
    tasks: {
        pendingTasks: number | null;
    } | null;
    activity: {
        recentActivity: Array<any> | null;
    } | null;
}

export const dashboardService = {
    getSummary: async (): Promise<DashboardSummaryDTO> => {
        try {
            const response = await axiosInstance.get('/api/v1/dashboard/summary');
            return response.data.data;
        } catch (error: any) {
            if (error.response?.data?.error?.message) {
                throw new Error(error.response.data.error.message);
            }
            throw new Error('An error occurred while fetching dashboard summary');
        }
    }
};
