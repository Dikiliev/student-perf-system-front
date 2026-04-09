import axios, { AxiosError } from 'axios';
import type { RootStore } from '@/stores/RootStore';

export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const api = axios.create({
    baseURL: API_URL,
});

export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export const setupInterceptors = (store: RootStore) => {
    api.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as any;

            if (error.response?.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise(function (resolve, reject) {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers['Authorization'] = 'Bearer ' + token;
                            return api(originalRequest);
                        })
                        .catch((err) => {
                            return Promise.reject(err);
                        });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const refreshToken = store.authStore.refreshToken;
                    if (!refreshToken) throw new Error('No refresh token');

                    const response = await axios.post(`${API_URL}/api/auth/token/refresh/`, {
                        refresh: refreshToken,
                    });

                    const newAccess = response.data.access;
                    store.authStore.setTokens(newAccess, refreshToken);

                    processQueue(null, newAccess);
                    originalRequest.headers['Authorization'] = 'Bearer ' + newAccess;
                    return api(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError as Error, null);
                    store.authStore.logout();
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        }
    );
};
