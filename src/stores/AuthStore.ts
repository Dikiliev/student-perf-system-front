import { makeAutoObservable } from 'mobx';
import { api, setAuthToken } from '@/shared/api/api';
import type { User } from '@/shared/types';
import type { RootStore } from './RootStore';

export class AuthStore {
    rootStore: RootStore;

    user: User | null = null;
    accessToken: string | null = localStorage.getItem('access_token');
    refreshToken: string | null = localStorage.getItem('refresh_token');

    isLoading = false;
    isBootstrapping = true;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);

        // Set initial token if exists
        if (this.accessToken) {
            setAuthToken(this.accessToken);
        }
    }

    get isAuthenticated() {
        return !!this.user;
    }

    setTokens(access: string, refresh: string) {
        this.accessToken = access;
        this.refreshToken = refresh;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        setAuthToken(access);
    }

    clearTokens() {
        this.accessToken = null;
        this.refreshToken = null;
        this.user = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setAuthToken(null);
    }

    async login(username: string, password: string): Promise<void> {
        this.isLoading = true;
        try {
            const response = await api.post('/api/auth/token/', { username, password });
            this.setTokens(response.data.access, response.data.refresh);
            this.user = response.data.user;
        } finally {
            this.isLoading = false;
        }
    }

    async fetchMe() {
        try {
            const response = await api.get('/api/auth/me/');
            this.user = response.data;
        } catch (e) {
            this.clearTokens();
        }
    }

    async bootstrap() {
        this.isBootstrapping = true;
        try {
            if (this.accessToken) {
                await this.fetchMe();
            } else {
                this.clearTokens();
            }
        } finally {
            this.isBootstrapping = false;
        }
    }

    logout() {
        this.clearTokens();
        // In a real app we might also want to reset other stores here
        window.location.href = '/login';
    }
}
