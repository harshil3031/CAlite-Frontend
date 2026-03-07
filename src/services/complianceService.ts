import { axiosInstance } from './axiosInstance';

export interface ComplianceRecord {
    id: string;
    client_id: string;
    template_id: string;
    status: string;
    risk_level: string;
    assigned_to: string | null;
    period_label: string;
    period_start: string;
    period_end: string;
    due_date: string | null;
    due_date_overridden: boolean;
    is_locked: boolean;
    is_backfilled: boolean;
    filed_on_date: string | null;
    filed_by: string | null;
    ack_number: string | null;
    portal_reference: string | null;
    notes: string | null;
    updated_at: string;
    client?: {
        name: string;
    };
    template?: {
        name: string;
        short_code: string;
        authority: string;
    };
    assigned_user?: {
        name: string;
    };
    filed_by_user?: {
        name: string;
    };
}

export interface ComplianceTemplate {
    id: string;
    name: string;
    short_code: string;
    authority: string;
    frequency: string;
    is_active: boolean;
    due_day: number;
    due_month_offset: number;
    applicable_entity_types: string[];
    version: number;
}

export const listRecords = async (params: any) => {
    const response = await axiosInstance.get('/api/v1/compliance/records', { params });
    return response.data;
};

export const listByClient = async (clientId: string, params: any) => {
    const response = await axiosInstance.get(`/api/v1/clients/${clientId}/compliance`, { params });
    return response.data;
};

export const getRecord = async (id: string) => {
    const response = await axiosInstance.get(`/api/v1/compliance/records/${id}`);
    return response.data;
};

export const createManual = async (data: any) => {
    const response = await axiosInstance.post('/api/v1/compliance/records', data);
    return response.data;
};

export const updateStatus = async (id: string, data: any) => {
    const response = await axiosInstance.patch(`/api/v1/compliance/records/${id}/status`, data);
    return response.data;
};

export const overrideDueDate = async (id: string, data: { due_date: string; reason?: string }) => {
    const response = await axiosInstance.patch(`/api/v1/compliance/records/${id}/due-date`, data);
    return response.data;
};

export const assignRecord = async (id: string, data: { assigned_to: string | null }) => {
    const response = await axiosInstance.patch(`/api/v1/compliance/records/${id}/assign`, data);
    return response.data;
};

export const fileRecord = async (id: string, formData: FormData) => {
    const response = await axiosInstance.post(`/api/v1/compliance/records/${id}/file`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const waiveRecord = async (id: string, data: { reason: string }) => {
    const response = await axiosInstance.post(`/api/v1/compliance/records/${id}/waive`, data);
    return response.data;
};

export const unlockRecord = async (id: string, data: { reason: string }) => {
    const response = await axiosInstance.post(`/api/v1/compliance/records/${id}/unlock`, data);
    return response.data;
};

export const getEvidenceUrl = async (id: string) => {
    const response = await axiosInstance.get(`/api/v1/compliance/records/${id}/evidence-url`);
    return response.data;
};

export const listTemplates = async () => {
    const response = await axiosInstance.get('/api/v1/compliance/templates');
    return response.data;
};

export const getSubscriptions = async () => {
    const response = await axiosInstance.get('/api/v1/compliance/subscriptions');
    return response.data;
};

export const getLibrary = async () => {
    const response = await axiosInstance.get('/api/v1/compliance/library');
    return response.data;
};

export const subscribe = async (templateId: string) => {
    const response = await axiosInstance.post('/api/v1/compliance/subscriptions', { template_id: templateId });
    return response.data;
};

export const unsubscribe = async (templateId: string) => {
    const response = await axiosInstance.delete(`/api/v1/compliance/subscriptions/${templateId}`);
    return response.data;
};

export const getDashboardSummary = async () => {
    const response = await axiosInstance.get('/api/v1/dashboard/summary');
    return response.data;
};

export const getDashboardOverdue = async (params?: { page?: number; limit?: number }) => {
    const response = await axiosInstance.get('/api/v1/dashboard/overdue', { params });
    return response.data;
};

export const getDashboardCalendar = async (view: 'monthly' | 'weekly', date: string) => {
    const response = await axiosInstance.get('/api/v1/dashboard/calendar', { params: { view, date } });
    return response.data;
};
export const createTemplate = async (data: any) => {
    const response = await axiosInstance.post('/api/v1/compliance/templates', data);
    return response.data;
};

export const updateTemplate = async (id: string, data: any) => {
    const response = await axiosInstance.put(`/api/v1/compliance/templates/${id}`, data);
    return response.data;
};

export const getPlatformSummary = async () => {
    const response = await axiosInstance.get('/api/v1/compliance/platform/summary');
    return response.data;
};
