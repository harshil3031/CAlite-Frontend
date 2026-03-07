import { axiosInstance } from './axiosInstance';

export interface DashboardSummaryDTO {
    clients: {
        total: number;
        active: number;
        inactive: number;
        byEntityType: Array<{ entityType: string; count: number }>;
    };
    compliance: {
        risk_summary: {
            critical: number;
            red: number;
            yellow: number;
            green: number;
        };
    } | null;
    tasks?: any;
    activity?: any;
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
    },
    getOverdue: async (params?: any) => {
        const response = await axiosInstance.get('/api/v1/dashboard/overdue', { params });
        return response.data.data;
    },
    getCalendar: async (params?: any) => {
        const response = await axiosInstance.get('/api/v1/dashboard/calendar', { params });
        return response.data.data;
    }
};
