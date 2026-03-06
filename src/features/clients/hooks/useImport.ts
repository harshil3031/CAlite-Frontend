import { useMutation, useQueryClient } from '@tanstack/react-query';
import { importService } from '../../../services/importService';
import { toastSuccess, toastError } from '../../../lib/toast';

// ─── useValidateImport ─────────────────────────────────────────────────────

export const useValidateImport = () => {
    return useMutation({
        mutationFn: (file: File) => importService.validateImport(file),
        onError: (err: any) => {
            toastError(err.message || 'Failed to validate CSV file.');
        },
    });
};

// ─── useConfirmImport ──────────────────────────────────────────────────────

export const useConfirmImport = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (sessionId: string) => importService.confirmImport(sessionId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['clients'] });
        },
        onError: (err: any) => {
            toastError(err.message || 'Failed to confirm import.');
        },
    });
};
