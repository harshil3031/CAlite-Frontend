import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import type { ApiError } from '../../../services/authService';
import { authService } from '../../../services/authService';

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
import { toastError, toastSuccess } from '../../../lib/toast';

const acceptInviteSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
});

type AcceptInviteFormData = z.infer<typeof acceptInviteSchema>;

export const AcceptInvitePage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            toastError("Invalid or missing invitation token.");
            navigate('/login');
        }
    }, [token, navigate]);

    const form = useForm<AcceptInviteFormData>({
        resolver: zodResolver(acceptInviteSchema),
        defaultValues: {
            password: '',
            confirm_password: '',
        }
    });

    const onSubmit = async (data: AcceptInviteFormData) => {
        if (!token) return;

        try {
            setError(null);
            setIsLoading(true);

            const response = await authService.acceptInvite(token, data.password);

            // Backend does NOT auto-login - just returns success message
            toastSuccess(response.message || 'Account activated! Please log in.');
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err: unknown) {
            const apiErr = err as ApiError;
            if (apiErr.field) {
                form.setError(apiErr.field as keyof AcceptInviteFormData, { message: apiErr.message });
            } else {
                setError(apiErr.message || 'An unexpected error occurred while accepting invitation');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) return null; // Wait for redirect check

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white relative overflow-hidden">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-md w-full mx-auto p-8 glass-card bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 relative z-10 animate-fade-up shadow-xl dark:shadow-none">
                <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-6">Complete Registration</h2>
                <p className="text-center text-slate-500 dark:text-slate-400 mb-6">
                    Set a password to activate your account.
                </p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 dark:text-slate-300">New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="bg-slate-50 dark:bg-slate-900/50 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-blue-500 rounded-xl px-4 py-6"
                                            placeholder="••••••••"
                                            type="password"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 dark:text-red-400" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirm_password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 dark:text-slate-300">Confirm New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="bg-slate-50 dark:bg-slate-900/50 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-blue-500 rounded-xl px-4 py-6"
                                            placeholder="••••••••"
                                            type="password"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 dark:text-red-400" />
                                </FormItem>
                            )}
                        />

                        {error && (
                            <div className="p-4 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
                                <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-6 rounded-xl text-lg mt-2"
                        >
                            {isLoading ? 'Activating...' : 'Activate Account'}
                        </Button>

                        <div className="text-center mt-4">
                            <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                Return to Login
                            </Link>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};
