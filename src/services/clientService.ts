import { axiosInstance } from './axiosInstance';

// ─── DTOs ──────────────────────────────────────────────────────────────────

export interface ClientDTO {
    id: string;
    firm_id: string;
    pan: string;
    entity_type: string;
    gstin: string | null;
    full_name: string;
    mobile: string | null;
    email: string | null;
    address: string | null;
    risk_level?: string;
    is_active: boolean;
    created_by: string;
    created_at: string;
    updated_at: string;
}

export interface ClientListResult {
    clients: ClientDTO[];
    total: number;
    page: number;
    limit: number;
}

export interface ClientListParams {
    search?: string;
    entity_type?: string;
    is_active?: boolean;
    page?: number;
    limit?: number;
}

// ─── Error normaliser ──────────────────────────────────────────────────────

function normalise(error: unknown): never {
    const e = error as any;
    const msg =
        e?.response?.data?.error?.message ||
        e?.response?.data?.message ||
        e?.message ||
        'An unexpected error occurred';
    throw new Error(msg);
}

// ─── Service ──────────────────────────────────────────────────────────────

export const clientService = {
    // GET /api/v1/clients → { status, data: { clients, total, page, limit } }
    getClients: async (params: ClientListParams = {}): Promise<ClientListResult> => {
        try {
            const response = await axiosInstance.get('/api/v1/clients', { params });
            const data = response.data?.data;
            return {
                clients: Array.isArray(data?.clients) ? data.clients : [],
                total: data?.total ?? 0,
                page: data?.page ?? 1,
                limit: data?.limit ?? 20,
            };
        } catch (error) {
            normalise(error);
        }
    },

    // GET /api/v1/clients/:id → { status, data: ClientDTO }
    getClientById: async (id: string): Promise<ClientDTO> => {
        try {
            const response = await axiosInstance.get(`/api/v1/clients/${id}`);
            return response.data?.data;
        } catch (error) {
            normalise(error);
        }
    },

    // POST /api/v1/clients → { status, data: ClientDTO }
    createClient: async (data: Record<string, unknown>): Promise<ClientDTO> => {
        try {
            const response = await axiosInstance.post('/api/v1/clients', data);
            return response.data?.data;
        } catch (error) {
            normalise(error);
        }
    },

    // PATCH /api/v1/clients/:id → { status, data: ClientDTO }
    updateClient: async (id: string, data: Record<string, unknown>): Promise<ClientDTO> => {
        try {
            const response = await axiosInstance.patch(`/api/v1/clients/${id}`, data);
            return response.data?.data;
        } catch (error) {
            normalise(error);
        }
    },

    // DELETE /api/v1/clients/:id → { status, data: ClientDTO }
    deactivateClient: async (id: string): Promise<void> => {
        try {
            await axiosInstance.delete(`/api/v1/clients/${id}`);
        } catch (error) {
            normalise(error);
        }
    },

    // POST /api/v1/clients/:id/reactivate → { status, data: ClientDTO }
    reactivateClient: async (id: string): Promise<void> => {
        try {
            await axiosInstance.post(`/api/v1/clients/${id}/reactivate`);
        } catch (error) {
            normalise(error);
        }
    },
};
