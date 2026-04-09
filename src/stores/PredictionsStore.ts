import { makeAutoObservable, runInAction } from 'mobx';
import { api } from '@/shared/api/api';
import type { Prediction } from '@/shared/types';
import type { RootStore } from './RootStore';

export class PredictionsStore {
    rootStore: RootStore;

    predictions: Prediction[] = [];
    isLoading = false;

    filters = {
        group: '',
        risk_level: '',
    };

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    setFilters(filters: Partial<typeof this.filters>) {
        this.filters = { ...this.filters, ...filters };
    }

    clearFilters() {
        this.filters = { group: '', risk_level: '' };
    }

    async fetchPredictions() {
        this.isLoading = true;
        try {
            const params = new URLSearchParams();
            if (this.filters.group) params.append('group', this.filters.group);
            if (this.filters.risk_level) params.append('risk_level', this.filters.risk_level);

            const response = await api.get(`/api/predictions/?${params.toString()}`);
            runInAction(() => {
                this.predictions = response.data;
            });
        } catch (e) {
            console.error(e);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }
}
