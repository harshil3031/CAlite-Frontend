import axios from 'axios';
import type { Store } from '@reduxjs/toolkit';
import type { RootState } from '../store/index';
import { clearCredentials, setCredentials } from '../store/authSlice';
import type { User } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

let store: Store<RootState>;

export const setupInterceptors = (_store: Store<RootState>) => {
    store = _store;

    axiosInstance.interceptors.request.use((config) => {
        const token = store.getState().auth.accessToken;
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (
                error.response?.status === 401 &&
                error.response?.data?.error?.code === 'TOKEN_EXPIRED' &&
                !originalRequest._retry
            ) {
                originalRequest._retry = true;
                try {
                    // Direct axios call to avoid interceptor loops if refresh fails
                    const response = await axios.post<{ data: { user: User, accessToken: string } }>(
                        `${API_URL}/api/v1/auth/refresh`,
                        {},
                        { withCredentials: true }
                    );

                    const { user, accessToken } = response.data.data;

                    store.dispatch(setCredentials({ user, accessToken }));

                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    }
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    store.dispatch(clearCredentials());
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );
};
