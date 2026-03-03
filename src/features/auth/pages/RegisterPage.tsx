import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';

export const RegisterPage = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-md w-full mb-6 text-center relative z-10 animate-fade-up">
                <img
                    src="/brand/logo-rectangle-200-header:navbar.png"
                    alt="CAlite Logo"
                    className="h-16 w-auto mx-auto mb-6 dark:invert-0"
                />
                <p className="text-slate-600 dark:text-slate-400 text-lg">Register a new firm account</p>
            </div>

            <RegisterForm />

            <div className="mt-6 text-center relative z-10 animate-fade-up delay-100">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
                        Log in here
                    </Link>
                </p>
            </div>
        </div>
    );
};
