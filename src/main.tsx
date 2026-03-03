import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme-provider';
import { store } from './store';
import { setupInterceptors } from './services/axiosInstance';
import App from './App';
import './index.css';
import './styles/premium.css';

// Initialize React Query Client
const queryClient = new QueryClient();

// Initialize axios interceptors with redux store access
setupInterceptors(store);

const rootElement = document.getElementById('root');
if (rootElement) {
    createRoot(rootElement).render(
        <React.StrictMode>
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider defaultTheme="dark" storageKey="calite-theme">
                        <App />
                    </ThemeProvider>
                </QueryClientProvider>
            </Provider>
        </React.StrictMode>
    );
}

