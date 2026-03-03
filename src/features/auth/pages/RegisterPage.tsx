import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';

export const RegisterPage = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full mb-6 text-center">
                <img 
                    src="/brand/logo-primary.png" 
                    alt="CAlite Logo" 
                    className="h-32 w-auto mx-auto mb-6"
                />
                <p className="text-gray-600">Register a new firm account</p>
            </div>

            <RegisterForm />

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                        Log in here
                    </Link>
                </p>
            </div>
        </div>
    );
};
