import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../../../services/settingsService';
import { toastSuccess } from '../../../lib/toast';

export const useFirmSettings = () => {
    return useQuery({
        queryKey: ['firm', 'settings'],
        queryFn: () => settingsService.getFirm()
    });
};

export const useUpdateFirmSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { contact_email?: string; phone?: string }) => settingsService.updateFirm(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['firm', 'settings'] });
            toastSuccess('Firm settings updated successfully.');
        }
    });
};
