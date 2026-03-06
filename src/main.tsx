import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { ThemeProvider } from './components/theme-provider';
import { store } from './store';
import { setupInterceptors } from './services/axiosInstance';
import App from './App';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';
import './styles/premium.css';

// queryClient is imported from ./lib/queryClient with project-standard config

// Initialize axios interceptors with redux store access
setupInterceptors(store);

const rootElement = document.getElementById('root');
if (rootElement) {
    createRoot(rootElement).render(
        <React.StrictMode>
            <ErrorBoundary>
                <Provider store={store}>
                    <QueryClientProvider client={queryClient}>
                        <ThemeProvider defaultTheme="dark" storageKey="calite-theme">
                            <App />
                            <Toaster />
                        </ThemeProvider>
                    </QueryClientProvider>
                </Provider>
            </ErrorBoundary>
        </React.StrictMode>
    );
}

