import { makeAutoObservable, runInAction } from 'mobx';
import { api } from '@/shared/api/api';
import type { Group, GroupRiskSummary } from '@/shared/types';
import type { RootStore } from './RootStore';

export class GroupsStore {
    rootStore: RootStore;

    groups: Group[] = [];
    selectedGroup: Group | null = null;
    summaries: Record<number, GroupRiskSummary> = {};

    isLoading = false;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    async fetchGroups() {
        this.isLoading = true;
        try {
            const response = await api.get('/api/groups/');
            runInAction(() => {
                this.groups = response.data;
            });
        } catch (e) {
            console.error(e);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async fetchGroupSummary(id: number) {
        try {
            const response = await api.get(`/api/groups/${id}/risk-summary/`);
            runInAction(() => {
                this.summaries[id] = response.data;
            });
        } catch (e) {
            console.error(e);
        }
    }

    async fetchAllSummaries() {
        this.isLoading = true;
        try {
            await this.fetchGroups();
            await Promise.all(this.groups.map(g => this.fetchGroupSummary(g.id)));
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }
}
