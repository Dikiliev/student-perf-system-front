import { api } from './api';

export type EntityType = 'groups' | 'subjects' | 'students' | 'grades' | 'attendance' | 'predictions';
export type ImportMode = 'create_only' | 'update_only' | 'upsert';

export interface ImportSummary {
    total_rows: number;
    valid_rows: number;
    invalid_rows: number;
    created_candidates: number;
    update_candidates: number;
    row_errors: Array<{ row: number; field: string; message: string }>;
    row_warnings: Array<{ row: number; message: string }>;
    error?: string; // High-level error
    details?: any;  // Detail dict if failed hard
    predictions_recalculated?: number;
}

export const dataManagementApi = {
    /**
     * Download an empty template for an entity.
     */
    downloadTemplate: async (entity: EntityType, format: 'csv' | 'xlsx' = 'csv') => {
        const response = await api.get(`/data/templates/${entity}/download/`, {
            params: { format },
            responseType: 'blob', // Important for file downloads
        });
        return response.data;
    },

    /**
     * Download full database export for an entity.
     */
    exportData: async (entity: EntityType, format: 'csv' | 'xlsx' = 'csv') => {
        const response = await api.get(`/data/export/${entity}/`, {
            params: { format },
            responseType: 'blob',
        });
        return response.data;
    },

    /**
     * Preview an import without committing to DB.
     */
    previewImport: async (entity: EntityType, file: File, mode: ImportMode = 'upsert'): Promise<ImportSummary> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('mode', mode);

        const response = await api.post(`/data/import/${entity}/preview/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    /**
     * Commit an import after successful preview.
     */
    commitImport: async (entity: EntityType, file: File, mode: ImportMode = 'upsert'): Promise<ImportSummary> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('mode', mode);

        const response = await api.post(`/data/import/${entity}/commit/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
