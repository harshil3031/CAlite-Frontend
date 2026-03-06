import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../../services/userService';
import { toastSuccess, toastError } from '../../../lib/toast';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const inviteSchema = z.object({
    full_name: z.string().min(1, 'Full Name is required'),
    email: z.string().email('Invalid email address'),
    role: z.string().min(1, 'Role is required'),
});

type InviteFormData = z.infer<typeof inviteSchema>;

interface InviteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const InviteModal = ({ isOpen, onClose }: InviteModalProps) => {
    const queryClient = useQueryClient();

    const form = useForm<InviteFormData>({
        resolver: zodResolver(inviteSchema),
        defaultValues: {
            full_name: '',
            email: '',
            role: 'staff',
        }
    });

    const inviteMutation = useMutation({
        mutationFn: (data: InviteFormData) => userService.inviteUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toastSuccess('Invitation sent successfully.');
            form.reset();
            onClose();
        },
        onError: (error: any) => {
            toastError(error.message || 'Failed to send invitation.');
        }
    });

    const onSubmit = (data: InviteFormData) => {
        inviteMutation.mutate(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Invite Staff</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="full_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 dark:text-slate-300">Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-slate-50 dark:bg-slate-900/50"
                                                placeholder="Jane Doe"
                                                disabled={inviteMutation.isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 dark:text-slate-300">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-slate-50 dark:bg-slate-900/50"
                                                placeholder="jane@example.com"
                                                type="email"
                                                disabled={inviteMutation.isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 dark:text-slate-300">Role</FormLabel>
                                        <FormControl>
                                            <select
                                                className="w-full h-10 px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-white/10 rounded-md text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                                {...field}
                                                disabled={inviteMutation.isPending}
                                            >
                                                <option value="staff">Staff</option>
                                                {/* Admin invites Admin handled later or omitted; staff default */}
                                            </select>
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <div className="pt-4 flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={inviteMutation.isPending}
                                    className="border-slate-300 dark:border-slate-600"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={inviteMutation.isPending}
                                    className="btn-primary"
                                >
                                    {inviteMutation.isPending ? 'Sending...' : 'Send Invite'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
};
