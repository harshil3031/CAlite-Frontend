import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

const forgotPasswordSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        }
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            setIsLoading(true);
            await authService.forgotPassword(data.email);
            setIsSuccess(true);
        } catch (err: unknown) {
            // Never expose actual user existence - always show success
            setIsSuccess(true);
            // We can optionally log the error to Sentry here, but user side needs to be opaque
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white relative overflow-hidden">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-md w-full mx-auto p-8 glass-card bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 relative z-10 animate-fade-up shadow-xl dark:shadow-none">
                <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-2">Reset Password</h2>
                <p className="text-center text-slate-500 dark:text-slate-400 mb-6">
                    Enter your email to receive a password reset link.
                </p>

                {isSuccess ? (
                    <div className="text-center space-y-6">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-xl">
                            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                                If this email exists, a reset link has been sent. Please check your inbox.
                            </p>
                        </div>
                        <Button
                            onClick={() => navigate('/login')}
                            className="w-full btn-primary py-6 rounded-xl text-lg"
                        >
                            Back to Login
                        </Button>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 dark:text-slate-300">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-slate-50 dark:bg-slate-900/50 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-blue-500 rounded-xl px-4 py-6"
                                                placeholder="your.email@example.com"
                                                type="email"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 dark:text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full btn-primary py-6 rounded-xl text-lg mt-2"
                            >
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </Button>

                            <div className="text-center mt-4">
                                <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                    Return to Login
                                </Link>
                            </div>
                        </form>
                    </Form>
                )}
            </div>
        </div>
    );
};
