import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirmSettings, useUpdateFirmSettings } from '../hooks/useSettings';
import { toastError } from '../../../lib/toast';

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
import { ShieldAlert } from 'lucide-react';
import { useAppSelector } from '../../../store';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const firmSettingsSchema = z.object({
    contact_email: z.string().email('Invalid email address').or(z.literal('')),
    phone: z.string().or(z.literal('')),
});

type FirmSettingsFormData = z.infer<typeof firmSettingsSchema>;

export const FirmSettingsPage = () => {
    const navigate = useNavigate();
    const userRole = useAppSelector((state) => state.auth.user?.role);
    const { data: firm, isLoading, error } = useFirmSettings();
    const updateFirmMutation = useUpdateFirmSettings();

    // Redirect staff members away from admin settings
    useEffect(() => {
        if (userRole !== 'admin') {
            navigate('/dashboard', { replace: true });
        }
    }, [userRole, navigate]);

    const form = useForm<FirmSettingsFormData>({
        resolver: zodResolver(firmSettingsSchema),
        defaultValues: {
            contact_email: '',
            phone: '',
        }
    });

    // Populate form when data loads
    useEffect(() => {
        if (firm) {
            form.reset({
                contact_email: firm.contact_email || '',
                phone: firm.phone || '',
            });
        }
    }, [firm, form]);

    const onSubmit = (data: FirmSettingsFormData) => {
        updateFirmMutation.mutate(
            {
                contact_email: data.contact_email || undefined,
                phone: data.phone || undefined,
            },
            {
                onError: (err: any) => {
                    toastError(err.message || 'Failed to update firm settings');
                }
            }
        );
    };

    if (userRole !== 'admin') return null;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !firm) {
        return (
            <div className="p-8 md:p-12 rounded-2xl glass-card bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/20 text-center animate-fade-up">
                <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-red-900 dark:text-white mb-2">Error Loading Settings</h2>
                <p className="text-red-700 dark:text-red-300">
                    Unable to load firm settings. Please try again.
                </p>
            </div>
        );
    }

    const renderTrialBadge = () => {
        if (firm.subscription_tier === 'trial' && firm.trial_ends_at) {
            const nowIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
            const endIST = new Date(new Date(firm.trial_ends_at).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
            const diffTime = endIST.getTime() - nowIST.getTime();
            const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

            return (
                <div className="inline-flex items-center px-3 py-1 bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 rounded-full text-sm font-semibold mt-2">
                    Trial: {daysRemaining} days remaining
                </div>
            );
        }

        // Safe fallback: subscription_tier may be null/undefined from DB
        const tier = firm.subscription_tier;
        const tierLabel = tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : 'Active';

        return (
            <div className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 rounded-full text-sm font-semibold mt-2">
                Active Tier: {tierLabel}
            </div>
        );
    };

    return (
        <div className="animate-fade-up">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Firm Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Firm Info Read Only Section */}
                <div className="col-span-1 p-8 rounded-2xl glass-card bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
                    <div>
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Firm Name</h3>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">{firm.name}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Subscription Status</h3>
                        {renderTrialBadge()}
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Invoice Prefix</h3>
                        <div className="inline-flex items-center px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-mono mt-1 text-sm border border-slate-200 dark:border-white/10">
                            {firm.invoice_prefix}
                        </div>
                    </div>
                </div>

                {/* Editable Settings Section */}
                <div className="col-span-1 md:col-span-2 p-8 rounded-2xl glass-card bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Contact Information</h2>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
                            <FormField
                                control={form.control}
                                name="contact_email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 dark:text-slate-300">Contact Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-slate-50 dark:bg-slate-900/50 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-blue-500 rounded-xl px-4"
                                                placeholder="firm@example.com"
                                                disabled={updateFirmMutation.isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 dark:text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 dark:text-slate-300">Phone Number (Optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-slate-50 dark:bg-slate-900/50 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-blue-500 rounded-xl px-4"
                                                placeholder="+91 9876543210"
                                                disabled={updateFirmMutation.isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 dark:text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    disabled={updateFirmMutation.isPending}
                                    className="btn-primary"
                                >
                                    {updateFirmMutation.isPending ? 'Saving...' : 'Save Settings'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
};
