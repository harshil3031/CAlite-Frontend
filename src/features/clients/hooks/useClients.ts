import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { clientService, type ClientListParams } from '../../../services/clientService';
import { toastSuccess, toastError } from '../../../lib/toast';

// ─── useClients ────────────────────────────────────────────────────────────

export const useClients = (params: ClientListParams = {}) => {
    // Memoize params object to avoid recreating on every render (AD-13)
    const stableParams = useMemo(() => params, [
        params.search,
        params.entity_type,
        params.is_active,
        params.page,
        params.limit,
    ]);

    return useQuery({
        queryKey: ['clients', stableParams],
        queryFn: () => clientService.getClients(stableParams),
        staleTime: 30_000,
    });
};

// ─── useClientById ─────────────────────────────────────────────────────────

export const useClientById = (id: string) => {
    return useQuery({
        queryKey: ['clients', id],
        queryFn: () => clientService.getClientById(id),
        enabled: !!id,
        staleTime: 30_000,
    });
};

// ─── useCreateClient ───────────────────────────────────────────────────────

export const useCreateClient = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => clientService.createClient(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['clients'] });
            toastSuccess('Client created successfully.');
        },
        onError: (err: any) => {
            toastError(err.message || 'Failed to create client.');
        },
    });
};

// ─── useUpdateClient ───────────────────────────────────────────────────────

export const useUpdateClient = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
            clientService.updateClient(id, data),
        onSuccess: (_result, { id }) => {
            qc.invalidateQueries({ queryKey: ['clients'] });
            qc.invalidateQueries({ queryKey: ['clients', id] });
            toastSuccess('Client updated successfully.');
        },
        onError: (err: any) => {
            toastError(err.message || 'Failed to update client.');
        },
    });
};

// ─── useDeactivateClient ───────────────────────────────────────────────────

export const useDeactivateClient = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => clientService.deactivateClient(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['clients'] });
            toastSuccess('Client deactivated.');
        },
        onError: (err: any) => {
            toastError(err.message || 'Failed to deactivate client.');
        },
    });
};

// ─── useReactivateClient ───────────────────────────────────────────────────

export const useReactivateClient = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => clientService.reactivateClient(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['clients'] });
            toastSuccess('Client reactivated.');
        },
        onError: (err: any) => {
            toastError(err.message || 'Failed to reactivate client.');
        },
    });
};
