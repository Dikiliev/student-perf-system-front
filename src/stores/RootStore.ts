import { AuthStore } from './AuthStore';
import { UiStore } from './UiStore';
import { StudentsStore } from './StudentsStore';
import { GroupsStore } from './GroupsStore';
import { PredictionsStore } from './PredictionsStore';
import { DataManagementStore } from './DataManagementStore';
import { setupInterceptors } from '@/shared/api/api';

export class RootStore {
    authStore: AuthStore;
    uiStore: UiStore;
    studentsStore: StudentsStore;
    groupsStore: GroupsStore;
    predictionsStore: PredictionsStore;
    dataManagementStore: DataManagementStore;

    constructor() {
        this.authStore = new AuthStore(this);
        this.uiStore = new UiStore(this);
        this.studentsStore = new StudentsStore(this);
        this.groupsStore = new GroupsStore(this);
        this.predictionsStore = new PredictionsStore(this);
        this.dataManagementStore = new DataManagementStore(this);

        // Setup API interceptors after stores are created
        setupInterceptors(this);
    }
}

export const rootStore = new RootStore();
