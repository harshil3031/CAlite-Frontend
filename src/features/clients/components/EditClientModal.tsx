import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import { useUpdateClient } from '../hooks/useClients';
import { useEffect } from 'react';
import type { ClientDTO } from '../../../services/clientService';

const editClientSchema = z.object({
    full_name: z.string().min(1, 'Full name is required'),
    mobile: z.string().regex(/^[0-9]{10}$/, 'Mobile must be 10 digits').optional().or(z.literal('')),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    address: z.string().max(500, 'Address too long').optional().or(z.literal('')),
});

type FormData = z.infer<typeof editClientSchema>;

interface EditClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    client: ClientDTO | null;
}

export const EditClientModal = ({ isOpen, onClose, client }: EditClientModalProps) => {
    const { mutate: updateClient, isPending, error } = useUpdateClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(editClientSchema),
    });

    useEffect(() => {
        if (isOpen && client) {
            reset({
                full_name: client.full_name,
                mobile: client.mobile || '',
                email: client.email || '',
                address: client.address || '',
            });
        }
    }, [isOpen, client, reset]);

    const onSubmit = (data: FormData) => {
        if (!client) return;

        // Normalize data
        const payload = {
            ...data,
            mobile: data.mobile || null,
            email: data.email || null,
            address: data.address || null,
        };

        updateClient({ id: client.id, data: payload }, {
            onSuccess: () => onClose(),
        });
    };

    if (!isOpen || !client) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Edit Client</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg">
                            {error.message}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* PAN (Read-only Info) */}
                        <div className="space-y-1.5 opacity-60">
                            <label className="text-sm font-semibold text-slate-500">PAN (Immutable)</label>
                            <div className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 font-mono text-slate-600">
                                {client.pan}
                            </div>
                        </div>

                        {/* Entity Type (Read-only Info) */}
                        <div className="space-y-1.5 opacity-60">
                            <label className="text-sm font-semibold text-slate-500">Entity Type (Immutable)</label>
                            <div className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 capitalize text-slate-600">
                                {client.entity_type.replace('_', ' ')}
                            </div>
                        </div>

                        {/* Full Name */}
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Full Name *</label>
                            <input
                                {...register('full_name')}
                                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400"
                                placeholder="Client Name or Business Name"
                            />
                            {errors.full_name && <p className="text-xs text-red-500">{errors.full_name.message}</p>}
                        </div>

                        {/* Mobile */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Mobile (Optional)</label>
                            <input
                                {...register('mobile')}
                                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400"
                                placeholder="9876543210"
                            />
                            {errors.mobile && <p className="text-xs text-red-500">{errors.mobile.message}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Email (Optional)</label>
                            <input
                                {...register('email')}
                                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400"
                                placeholder="client@example.com"
                            />
                            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Shop / Office Address (Optional)</label>
                        <textarea
                            {...register('address')}
                            rows={3}
                            className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400 resize-none"
                            placeholder="Full office address, Floor, Building, Area..."
                        />
                        {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
                    </div>

                    {/* Footer Action */}
                    <div className="pt-4 border-t border-slate-100 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isPending}
                            className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 border border-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {isPending ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
