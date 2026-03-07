import { axiosInstance } from './axiosInstance';

export interface FirmData {
    id: string;
    name: string;
    contactEmail: string | null;
    phone: string | null;
    subscriptionTier: string;
    status: string;
    trialEndsAt: string | null;
    createdAt: string;
}

export const platformService = {
    getAllFirms: async (): Promise<FirmData[]> => {
        const response = await axiosInstance.get('/api/v1/firms');
        return response.data.data.firms;
    },

    getAllTemplates: async () => {
        const response = await axiosInstance.get('/api/v1/compliance/templates');
        return response.data.data;
    },

    createTemplate: async (data: any) => {
        const response = await axiosInstance.post('/api/v1/compliance/templates', data);
        return response.data.data;
    },

    updateTemplate: async (id: string, data: any) => {
        const response = await axiosInstance.put(`/api/v1/compliance/templates/${id}`, data);
        return response.data.data;
    }
};
