import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as api from '../../../services/complianceService';

export const useComplianceRecords = (params: any) => {
    return useQuery({
        queryKey: ['compliance', 'records', params],
        queryFn: () => api.listRecords(params),
        staleTime: 30_000,
    });
};

export const useClientCompliance = (clientId: string, params: any) => {
    return useQuery({
        queryKey: ['compliance', 'client', clientId, params],
        queryFn: () => api.listByClient(clientId, params),
        staleTime: 30_000,
        enabled: !!clientId,
    });
};

export const useComplianceRecord = (id: string) => {
    return useQuery({
        queryKey: ['compliance', 'record', id],
        queryFn: () => api.getRecord(id),
        staleTime: 30_000,
        enabled: !!id,
    });
};

export const useComplianceTemplates = () => {
    return useQuery({
        queryKey: ['compliance', 'templates'],
        queryFn: () => api.listTemplates(),
        staleTime: 60_000,
    });
};

export const useComplianceSubscriptions = () => {
    return useQuery({
        queryKey: ['compliance', 'subscriptions'],
        queryFn: () => api.getSubscriptions(),
        staleTime: 30_000,
    });
};

export const useUpdateStatus = (clientId?: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => api.updateStatus(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['compliance', 'records'] });
            if (clientId) {
                queryClient.invalidateQueries({ queryKey: ['compliance', 'client', clientId] });
            }
            queryClient.invalidateQueries({ queryKey: ['compliance', 'record', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['dashboard', 'summary'] });
            toast.success('Status updated.');
        },
        onError: (error: any, variables) => {
            if (error.status === 409 || error?.response?.status === 409) {
                toast.error('This record was updated by someone else. Refreshing...');
                queryClient.invalidateQueries({ queryKey: ['compliance', 'record', variables.id] });
            } else if (error.status === 422 || error?.response?.status === 422) {
                toast.error(error?.response?.data?.message || error.message);
            } else {
                toast.error(error?.response?.data?.message || error.message);
            }
        },
    });
};

export const useFileRecord = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, formData }: { id: string; formData: FormData }) => api.fileRecord(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['compliance'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success('Record filed and locked.');
        },
        onError: (error: any) => {
            if (error.status !== 422 && error?.response?.status !== 422) {
                toast.error(error?.response?.data?.message || error.message);
            }
            // 422 is handled in the modal component
        },
    });
};

export const useWaiveRecord = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { reason: string } }) => api.waiveRecord(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['compliance'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success('Record waived.');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || error.message);
        },
    });
};

export const useUnlockRecord = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { reason: string } }) => api.unlockRecord(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['compliance'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success('Record unlocked. Status reset to Under Review.');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || error.message);
        },
    });
};

export const useOverrideDueDate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { due_date: string; reason?: string } }) => api.overrideDueDate(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['compliance'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success('Due date updated. Risk level will recompute.');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || error.message);
        },
    });
};

export const useAssignRecord = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { assigned_to: string | null } }) => api.assignRecord(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['compliance'] });
            toast.success('Record assigned.');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || error.message);
        },
    });
};

export const useSubscribe = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (templateId: string) => api.subscribe(templateId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['compliance', 'subscriptions'] });
            toast.success('Subscribed successfully.');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || error.message);
        },
    });
};

export const useUnsubscribe = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (templateId: string) => api.unsubscribe(templateId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['compliance', 'subscriptions'] });
            toast.success('Unsubscribed successfully.');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || error.message);
        },
    });
};

export const useDashboardSummary = () => {
    return useQuery({
        queryKey: ['dashboard', 'summary'],
        queryFn: () => api.getDashboardSummary(),
        staleTime: 30_000,
    });
};

export const useDashboardOverdue = (params?: { page?: number; limit?: number }) => {
    return useQuery({
        queryKey: ['dashboard', 'overdue', params],
        queryFn: () => api.getDashboardOverdue(params),
        staleTime: 30_000,
    });
};

export const useDashboardCalendar = (view: 'monthly' | 'weekly', date: string) => {
    return useQuery({
        queryKey: ['dashboard', 'calendar', view, date],
        queryFn: () => api.getDashboardCalendar(view, date),
        staleTime: 30_000,
    });
};
