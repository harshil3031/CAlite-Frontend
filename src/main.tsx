import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { setupInterceptors } from './services/axiosInstance';
import App from './App';
import './index.css';

// Initialize axios interceptors with redux store access
setupInterceptors(store);

const rootElement = document.getElementById('root');
if (rootElement) {
    createRoot(rootElement).render(
        <React.StrictMode>
            <Provider store={store}>
                <App />
            </Provider>
        </React.StrictMode>
    );
}
