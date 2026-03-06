import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // You can also log the error to an error reporting service here (e.g. Sentry in V2)
        console.error('Unhandled Rejection/Error caught by ErrorBoundary:', error, errorInfo);
    }

    handleRefresh = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-12">
                    <div className="p-8 md:p-12 rounded-2xl glass-card bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/20 text-center animate-fade-up">
                        <h2 className="text-2xl font-bold text-red-900 dark:text-white mb-2">Something went wrong.</h2>
                        <p className="text-red-700 dark:text-red-300 mb-6 max-w-lg mx-auto">
                            An unexpected error has crashed the display of this page.
                        </p>
                        <button
                            onClick={this.handleRefresh}
                            className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-500 font-medium py-3 px-6 rounded-lg transition-colors border-none cursor-pointer"
                        >
                            Refresh page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
