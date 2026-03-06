import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { ClientsPage } from '../src/features/clients/pages/ClientsPage';
import { clientService } from '../src/services/clientService';
import authReducer from '../src/store/authSlice';

// Mock Services
vi.mock('../src/services/clientService');
vi.mock('../src/services/importService');
vi.mock('../src/lib/toast');

const mockClients = [
    {
        id: '1',
        firm_id: 'f1',
        pan: 'ABCDE1234F',
        entity_type: 'individual',
        gstin: null,
        full_name: 'John Doe',
        mobile: '9876543210',
        email: 'john@example.com',
        address: null,
        is_active: true,
        created_by: 'u1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }
];

describe('ClientsPage', () => {
    let queryClient: QueryClient;
    let store: any;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } }
        });

        store = configureStore({
            reducer: { auth: authReducer },
            preloadedState: {
                auth: {
                    isAuthenticated: true,
                    user: { id: 'u1', role: 'admin', full_name: 'Admin' } as any,
                    accessToken: 'token',
                    firm: { id: 'f1', name: 'Test Firm' } as any,
                }
            }
        });

        vi.mocked(clientService.getClients).mockResolvedValue({
            clients: mockClients,
            total: 1,
            page: 1,
            limit: 20
        });
    });

    const renderPage = () => {
        return render(
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ClientsPage />
                    </MemoryRouter>
                </QueryClientProvider>
            </Provider>
        );
    };

    it('renders client list', async () => {
        renderPage();

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('ABCDE1234F')).toBeInTheDocument();
        });
    });

    it('opens add client modal on button click', async () => {
        renderPage();

        fireEvent.click(screen.getByText('Add Client'));

        expect(screen.getByText('Add New Client')).toBeInTheDocument();
    });

    it('filters by status', async () => {
        renderPage();

        fireEvent.click(screen.getByText('Active'));

        await waitFor(() => {
            expect(clientService.getClients).toHaveBeenCalledWith(expect.objectContaining({
                is_active: true
            }));
        });
    });

    it('searches for clients', async () => {
        renderPage();

        const input = screen.getByPlaceholderText('Search by name or PAN…');
        fireEvent.change(input, { target: { value: 'John' } });

        await waitFor(() => {
            expect(clientService.getClients).toHaveBeenCalledWith(expect.objectContaining({
                search: 'John'
            }));
        }, { timeout: 1000 }); // Account for debounce
    });
});
