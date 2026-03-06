import { axiosInstance } from './axiosInstance';

export interface FirmSettings {
    id: string;
    name: string;
    contact_email: string | null;
    phone: string | null;
    subscription_tier: string | null;
    status: string | null;
    trial_ends_at: string | null;
    invoice_prefix: string | null;
}

export const settingsService = {
    getFirm: async (): Promise<FirmSettings> => {
        try {
            const response = await axiosInstance.get('/api/v1/firms/me');
            // Backend: { success, data: { firm: {...} } }
            return response.data?.data?.firm;
        } catch (error: any) {
            if (error.response?.data?.error?.message) {
                throw new Error(error.response.data.error.message);
            }
            throw new Error('Failed to fetch firm settings');
        }
    },
    updateFirm: async (data: { contact_email?: string; phone?: string }): Promise<FirmSettings> => {
        try {
            const response = await axiosInstance.patch('/api/v1/firms/me', data);
            // Backend: { success, data: { firm: {...} } }
            return response.data?.data?.firm;
        } catch (error: any) {
            if (error.response?.data?.error?.message) {
                throw new Error(error.response.data.error.message);
            }
            throw new Error('Failed to update firm settings');
        }
    }
};
