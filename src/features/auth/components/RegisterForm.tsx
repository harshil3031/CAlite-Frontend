import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store';
import { setCredentials, setLoading, setError } from '../../../store/authSlice';
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

const registerSchema = z.object({
    firm_name: z.string().min(1, 'Firm Name is required'),
    full_name: z.string().min(1, 'Full Name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firm_name: '',
            full_name: '',
            email: '',
            password: '',
            confirm_password: '',
        }
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setApiError(null);
            setIsSubmitting(true);
            dispatch(setLoading(true));

            const payload = {
                firm_name: data.firm_name,
                full_name: data.full_name,
                email: data.email,
                password: data.password,
            };

            const response = await authService.register(payload);

            if (response && response.user && response.accessToken) {
                dispatch(setCredentials({ user: response.user, accessToken: response.accessToken }));
                navigate('/dashboard');
            }
        } catch (err: unknown) {
            const error = err as ApiError;
            if (error.field) {
                form.setError(error.field as keyof RegisterFormData, { message: error.message });
            } else {
                setApiError(error.message || 'An unexpected error occurred during registration');
                dispatch(setError(error.message));
            }
        } finally {
            setIsSubmitting(false);
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="max-w-md w-full mx-auto p-8 glass-card bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 relative z-10 animate-fade-up shadow-xl dark:shadow-none">
            <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-6">Create an Account</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="firm_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 dark:text-slate-300">Firm Name</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-slate-50 dark:bg-slate-900/50 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-blue-500 rounded-xl px-4 py-5"
                                        placeholder="Acme Corp"
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500 dark:text-red-400" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 dark:text-slate-300">Full Name</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-slate-50 dark:bg-slate-900/50 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-blue-500 rounded-xl px-4 py-5"
                                        placeholder="John Doe"
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500 dark:text-red-400" />
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
                                        className="bg-slate-50 dark:bg-slate-900/50 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-blue-500 rounded-xl px-4 py-5"
                                        placeholder="your.email@example.com"
                                        type="email"
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500 dark:text-red-400" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-700 dark:text-slate-300">Password</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-slate-50 dark:bg-slate-900/50 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-blue-500 rounded-xl px-4 py-5"
                                        placeholder="••••••••"
                                        type="password"
                                        disabled={isSubmitting}
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
                                <FormLabel className="text-slate-700 dark:text-slate-300">Confirm Password</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-slate-50 dark:bg-slate-900/50 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-blue-500 rounded-xl px-4 py-5"
                                        placeholder="••••••••"
                                        type="password"
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500 dark:text-red-400" />
                            </FormItem>
                        )}
                    />

                    {apiError && (
                        <div className="p-4 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
                            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{apiError}</p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary py-6 rounded-xl text-lg mt-4"
                    >
                        {isSubmitting ? 'Registering...' : 'Register'}
                    </Button>
                </form>
            </Form>
        </div>
    );
};
