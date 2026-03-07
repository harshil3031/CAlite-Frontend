import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../../services/userService';
import { toastSuccess, toastError } from '../../../lib/toast';

export const useStaff = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: () => userService.getUsers(),
    });
};

export const useDeactivateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => userService.deactivateUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toastSuccess('User account deactivated.');
        },
        onError: (err: any) => {
            toastError(err.message || 'Failed to deactivate user');
        },
    });
};

export const useReactivateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => userService.reactivateUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toastSuccess('User account reactivated.');
        },
        onError: (err: any) => {
            toastError(err.message || 'Failed to reactivate user');
        },
    });
};

export const useInviteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { email: string; fullName: string; role: string }) => 
            userService.inviteUser({ 
                email: data.email, 
                full_name: data.fullName, 
                role: data.role 
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toastSuccess('User invitation sent successfully');
        },
        onError: (err: any) => {
            toastError(err.message || 'Failed to invite user');
        },
    });
};
