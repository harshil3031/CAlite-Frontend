import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import { useCreateClient } from '../hooks/useClients';
import { useEffect } from 'react';

const ENTITY_TYPES = [
    { value: 'individual', label: 'Individual' },
    { value: 'proprietorship', label: 'Proprietorship' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'llp', label: 'LLP' },
    { value: 'pvt_ltd', label: 'Pvt Ltd' },
    { value: 'public_ltd', label: 'Public Ltd' },
    { value: 'trust', label: 'Trust' },
    { value: 'huf', label: 'HUF' },
];

const createClientSchema = z.object({
    full_name: z.string().min(1, 'Full name is required'),
    pan: z.string().length(10, 'PAN must be exactly 10 characters').regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, 'Invalid PAN format'),
    entity_type: z.string().min(1, 'Entity type is required'),
    mobile: z.string().regex(/^[0-9]{10}$/, 'Mobile must be 10 digits').optional().or(z.literal('')),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    gstin: z.string().length(15, 'GSTIN must be 15 characters').regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i, 'Invalid GSTIN format').optional().or(z.literal('')),
    address: z.string().max(500, 'Address too long').optional().or(z.literal('')),
}).refine((data) => {
    if (data.gstin && data.gstin.length === 15) {
        const panFromGstin = data.gstin.substring(2, 12).toUpperCase();
        const pan = data.pan.toUpperCase();
        return panFromGstin === pan;
    }
    return true;
}, {
    message: 'GSTIN must match PAN (chars 3-12 must be the PAN)',
    path: ['gstin'],
});

type FormData = z.infer<typeof createClientSchema>;

interface AddClientModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddClientModal = ({ isOpen, onClose }: AddClientModalProps) => {
    const { mutate: createClient, isPending, error } = useCreateClient();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(createClientSchema),
        defaultValues: {
            entity_type: 'individual',
        },
    });

    useEffect(() => {
        if (isOpen) reset();
    }, [isOpen, reset]);

    const onSubmit = (data: FormData) => {
        // Normalize data (backend expects strings)
        const payload = {
            ...data,
            pan: data.pan.toUpperCase(),
            gstin: data.gstin ? data.gstin.toUpperCase() : null,
            mobile: data.mobile || null,
            email: data.email || null,
            address: data.address || null,
        };
        createClient(payload, {
            onSuccess: () => onClose(),
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Add New Client</h2>
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
                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Full Name *</label>
                            <input
                                {...register('full_name')}
                                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400"
                                placeholder="Client Name or Business Name"
                            />
                            {errors.full_name && <p className="text-xs text-red-500">{errors.full_name.message}</p>}
                        </div>

                        {/* PAN */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">PAN *</label>
                            <input
                                {...register('pan')}
                                onBlur={(e) => setValue('pan', e.target.value.toUpperCase())}
                                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400"
                                placeholder="ABCDE1234F"
                            />
                            {errors.pan && <p className="text-xs text-red-500">{errors.pan.message}</p>}
                        </div>

                        {/* Entity Type */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Entity Type *</label>
                            <select
                                {...register('entity_type')}
                                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 bg-white"
                            >
                                {ENTITY_TYPES.map((t) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                            {errors.entity_type && <p className="text-xs text-red-500">{errors.entity_type.message}</p>}
                        </div>

                        {/* GSTIN */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">GSTIN (Optional)</label>
                            <input
                                {...register('gstin')}
                                onBlur={(e) => setValue('gstin', e.target.value.toUpperCase())}
                                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400"
                                placeholder="27ABCDE1234F1Z5"
                            />
                            <p className="text-[10px] text-slate-400 px-1">Must match PAN (chars 3-12)</p>
                            {errors.gstin && <p className="text-xs text-red-500">{errors.gstin.message}</p>}
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
                            {isPending ? 'Creating...' : 'Create Client'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
