import { axiosInstance } from './axiosInstance';

import axios from 'axios';

export interface User {
    id: string;
    email: string;
    full_name: string;
    role: string;
    firm_id: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
}

export interface ApiError {
    message: string;
    field?: string;
    code?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: null;
}

const handleApiError = (error: unknown): never => {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errData = error.response.data.error as any;
        throw { message: errData.message || 'An error occurred', field: errData.field, code: errData.code } as ApiError;
    }
    const err = error as Error;
    throw { message: err.message || 'An unknown error occurred' } as ApiError;
};

export const authService = {
    register: async (data: Record<string, unknown>): Promise<AuthResponse> => {
        try {
            const response = await axiosInstance.post<ApiResponse<AuthResponse>>('/api/v1/auth/register', data);
            return response.data.data;
        } catch (error) {
            return handleApiError(error);
        }
    },
    login: async (data: Record<string, unknown>): Promise<AuthResponse> => {
        try {
            const response = await axiosInstance.post<ApiResponse<AuthResponse>>('/api/v1/auth/login', data);
            return response.data.data;
        } catch (error) {
            return handleApiError(error);
        }
    },
    refresh: async (): Promise<AuthResponse> => {
        try {
            const response = await axiosInstance.post<ApiResponse<AuthResponse>>('/api/v1/auth/refresh');
            return response.data.data;
        } catch (error) {
            return handleApiError(error);
        }
    },
    logout: async (): Promise<void> => {
        try {
            await axiosInstance.post('/api/v1/auth/logout');
        } catch (error) {
            return handleApiError(error);
        }
    },
};
