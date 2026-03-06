import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white relative overflow-hidden">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 dark:bg-red-500/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="text-center p-12 glass-card bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-2xl rounded-3xl relative z-10 animate-fade-up max-w-lg w-full mx-4">
                <div className="mb-6 flex justify-center">
                    <span className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
                        404
                    </span>
                </div>
                <h1 className="text-3xl font-bold mb-4">Page not found</h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg mb-8">
                    The page you are looking for doesn't exist or has been moved.
                </p>

                <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full btn-primary py-4 text-lg"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};
