import { Link } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-md w-full mb-6 text-center relative z-10 animate-fade-up">
                <img
                    src="/brand/logo-rectangle-200-header:navbar.png"
                    alt="CAlite Logo"
                    className="h-16 w-auto mx-auto mb-6 dark:invert-0"
                />
                <p className="text-slate-600 dark:text-slate-400 text-lg">Sign in to your account</p>
            </div>

            <LoginForm />

            <div className="mt-6 text-center relative z-10 animate-fade-up delay-100">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};
