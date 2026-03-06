import { axiosInstance } from './axiosInstance';

// ─── DTOs ──────────────────────────────────────────────────────────────────

export interface ImportPreviewRow {
    row: number;
    field: string;
    message: string;
}

export interface ImportPreviewDTO {
    import_session_id: string;
    total_rows: number;
    valid_rows: number;
    skipped_rows: number;
    errors: ImportPreviewRow[];
    warnings: ImportPreviewRow[];
}

export interface ImportResultDTO {
    imported: number;
    skipped: number;
    async?: boolean;
    message?: string;
}

// ─── Error normaliser ──────────────────────────────────────────────────────

function normalise(error: unknown): never {
    const e = error as any;
    const msg =
        e?.response?.data?.error?.message ||
        e?.response?.data?.message ||
        e?.message ||
        'Import operation failed';
    throw new Error(msg);
}

// ─── Service ──────────────────────────────────────────────────────────────

export const importService = {
    // GET /api/v1/import/template → CSV blob → trigger browser download
    getTemplate: async (): Promise<void> => {
        try {
            const response = await axiosInstance.get('/api/v1/import/template', {
                responseType: 'blob',
            });
            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'client_import_template.csv';
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            normalise(error);
        }
    },

    // POST /api/v1/import/validate (multipart) → ImportPreviewDTO
    validateImport: async (file: File): Promise<ImportPreviewDTO> => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axiosInstance.post('/api/v1/import/validate', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data?.data;
        } catch (error) {
            normalise(error);
        }
    },

    // POST /api/v1/import/confirm → ImportResultDTO (200 = sync, 202 = async)
    confirmImport: async (sessionId: string): Promise<{ result: ImportResultDTO; status: number }> => {
        try {
            const response = await axiosInstance.post('/api/v1/import/confirm', {
                import_session_id: sessionId,
            });
            return { result: response.data?.data, status: response.status };
        } catch (error) {
            normalise(error);
        }
    },
};
