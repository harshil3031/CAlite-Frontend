import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store';
import { setCredentials, setLoading, setError } from '../../../store/authSlice';
import type { ApiError } from '../../../services/authService';
import { authService } from '../../../services/authService';

const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setError: setFieldError,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setApiError(null);
            setIsSubmitting(true);
            dispatch(setLoading(true));

            const response = await authService.login(data);

            if (response && response.user && response.accessToken) {
                dispatch(setCredentials({ user: response.user, accessToken: response.accessToken }));
                navigate('/dashboard');
            }
        } catch (err: unknown) {
            const error = err as ApiError;
            if (error.field) {
                setFieldError(error.field as keyof LoginFormData, { message: error.message });
            } else {
                setApiError(error.message || 'An unexpected error occurred during login');
                dispatch(setError(error.message));
            }
        } finally {
            setIsSubmitting(false);
            dispatch(setLoading(false));
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-100">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Log In</h2>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                <input
                    {...register('email')}
                    type="email"
                    id="email"
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="your.email@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
                <input
                    {...register('password')}
                    type="password"
                    id="password"
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="••••••••"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            {apiError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600 font-medium">{apiError}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isSubmitting ? 'Logging in...' : 'Log In'}
            </button>
        </form>
    );
};
