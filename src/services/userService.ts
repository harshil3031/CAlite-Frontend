import { axiosInstance } from './axiosInstance';

export interface StaffMember {
    id: string;
    email: string;
    fullName: string;
    role: string;
    isActive: boolean;
}

export const userService = {
    getUsers: async (): Promise<StaffMember[]> => {
        try {
            const response = await axiosInstance.get('/api/v1/users');
            // Backend: { success, data: { users: [...] } }
            const users = response.data?.data?.users;
            if (!Array.isArray(users)) return [];
            return users;
        } catch (error: any) {
            if (error.response?.data?.error?.message) {
                throw new Error(error.response.data.error.message);
            }
            throw new Error('Failed to fetch staff members');
        }
    },
    inviteUser: async (data: { email: string; full_name: string; role: string }): Promise<StaffMember> => {
        try {
            const response = await axiosInstance.post('/api/v1/users/invite', data);
            // Backend: { success, message, data: { user: {...} } }
            return response.data?.data?.user;
        } catch (error: any) {
            if (error.response?.data?.error?.message) {
                throw new Error(error.response.data.error.message);
            }
            throw new Error('Failed to invite user');
        }
    },
    deactivateUser: async (id: string): Promise<void> => {
        try {
            // Backend: { success, message } – no data property
            await axiosInstance.patch(`/api/v1/users/${id}/deactivate`);
        } catch (error: any) {
            if (error.response?.data?.error?.message) {
                throw new Error(error.response.data.error.message);
            }
            throw new Error('Failed to deactivate user');
        }
    },
    reactivateUser: async (id: string): Promise<void> => {
        try {
            // Backend: { success, message } – no data property
            await axiosInstance.patch(`/api/v1/users/${id}/reactivate`);
        } catch (error: any) {
            if (error.response?.data?.error?.message) {
                throw new Error(error.response.data.error.message);
            }
            throw new Error('Failed to reactivate user');
        }
    }
};
