import { Link } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full mb-6 text-center">
                <img 
                    src="/brand/logo-primary.png" 
                    alt="CAlite Logo" 
                    className="h-32 w-auto mx-auto mb-6"
                />
                <p className="text-gray-600">Sign in to your account</p>
            </div>

            <LoginForm />

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};
