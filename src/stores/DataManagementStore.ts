import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';
import type { EntityType, ImportMode, ImportSummary } from '@/shared/api/dataManagementApi';
import { dataManagementApi } from '@/shared/api/dataManagementApi';
import { AxiosError } from 'axios';

export class DataManagementStore {
    rootStore: RootStore;

    // Loading states
    isLoading: boolean = false;
    isDownloading: boolean = false;

    // Importing states
    selectedEntity: EntityType = 'students';
    selectedFile: File | null = null;
    importMode: ImportMode = 'upsert';

    previewSummary: ImportSummary | null = null;
    commitSummary: ImportSummary | null = null;

    error: string | null = null;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    setEntity(entity: EntityType) {
        this.selectedEntity = entity;
        this.resetImportState();
    }

    setFile(file: File | null) {
        this.selectedFile = file;
        this.previewSummary = null;
        this.commitSummary = null;
        this.error = null;
    }

    setImportMode(mode: ImportMode) {
        this.importMode = mode;
        this.previewSummary = null;
        this.commitSummary = null;
    }

    resetImportState() {
        this.selectedFile = null;
        this.previewSummary = null;
        this.commitSummary = null;
        this.error = null;
        this.isLoading = false;
    }

    async downloadTemplate(entity: EntityType, format: 'csv' | 'xlsx') {
        this.isDownloading = true;
        this.error = null;
        try {
            const blob = await dataManagementApi.downloadTemplate(entity, format);
            this.triggerBrowserDownload(blob, `template_${entity}.${format}`);
        } catch (e: any) {
            runInAction(() => {
                this.error = 'Не удалось скачать шаблон';
            });
        } finally {
            runInAction(() => { this.isDownloading = false; });
        }
    }

    async exportData(entity: EntityType, format: 'csv' | 'xlsx') {
        this.isDownloading = true;
        this.error = null;
        try {
            const blob = await dataManagementApi.exportData(entity, format);
            this.triggerBrowserDownload(blob, `export_${entity}.${format}`);
        } catch (e: any) {
            runInAction(() => {
                this.error = 'Не удалось экспортировать данные';
            });
        } finally {
            runInAction(() => { this.isDownloading = false; });
        }
    }

    async previewImport() {
        if (!this.selectedFile) return;
        this.isLoading = true;
        this.error = null;
        this.previewSummary = null;
        this.commitSummary = null;

        try {
            const summary = await dataManagementApi.previewImport(this.selectedEntity, this.selectedFile, this.importMode);
            runInAction(() => {
                this.previewSummary = summary;
            });
        } catch (e: any) {
            runInAction(() => {
                if (e instanceof AxiosError && e.response?.data?.error) {
                    this.error = e.response.data.error;
                } else {
                    this.error = 'Во время проверки файла произошла ошибка. Проверьте формат файла.';
                }
            });
        } finally {
            runInAction(() => { this.isLoading = false; });
        }
    }

    async commitImport() {
        if (!this.selectedFile) return;
        this.isLoading = true;
        this.error = null;

        try {
            const summary = await dataManagementApi.commitImport(this.selectedEntity, this.selectedFile, this.importMode);
            runInAction(() => {
                this.commitSummary = summary;
            });
            // If we successfully imported things that affect predictions, we must tell stores to refresh
            if (['grades', 'attendance', 'students'].includes(this.selectedEntity)) {
                this.rootStore.studentsStore.fetchStudents();
                this.rootStore.predictionsStore.fetchPredictions();
            }
        } catch (e: any) {
            runInAction(() => {
                if (e instanceof AxiosError && e.response?.data?.error) {
                    this.error = e.response.data.error;
                    if (e.response.data.details) {
                        this.previewSummary = e.response.data.details;
                    }
                } else {
                    this.error = 'Ошибка при сохранении данных в базу.';
                }
                this.commitSummary = null; // Mark failure
            });
        } finally {
            runInAction(() => { this.isLoading = false; });
        }
    }

    private triggerBrowserDownload(blob: Blob, filename: string) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
}
