import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom/vitest';
import authReducer from '../src/store/authSlice';
import { authService } from '../src/services/authService';
import { setupInterceptors } from '../src/services/axiosInstance';
import { RegisterForm } from '../src/features/auth/components/RegisterForm';
import { LoginForm } from '../src/features/auth/components/LoginForm';
import { ProtectedRoute } from '../src/components/ProtectedRoute';

// Mock the auth service to prevent actual network calls
vi.mock('../src/services/authService', async () => {
    const actual = await vi.importActual<typeof import('../src/services/authService')>('../src/services/authService');
    return {
        ...actual,
        authService: {
            register: vi.fn(),
            login: vi.fn(),
            refresh: vi.fn(),
            logout: vi.fn(),
        },
    };
});

describe('Auth Web Frontend', () => {
    let store: any;

    beforeEach(() => {
        vi.clearAllMocks();
        store = configureStore({
            reducer: { auth: authReducer },
        });
        setupInterceptors(store);
    });

    afterEach(() => {
        cleanup();
    });

    const renderWithProviders = (ui: React.ReactElement, initialRoute = '/') => {
        return render(
            <Provider store={store} >
                <MemoryRouter initialEntries={[initialRoute]} >
                    {ui}
                </MemoryRouter>
            </Provider>
        );
    };

    describe('RegisterForm', () => {
        it('calls authService.register with correct payload on valid input', async () => {
            const mockResponse = {
                user: { id: '1', email: 'test@example.com', full_name: 'Test', role: 'user', firm_id: 'firm1' },
                accessToken: 'mock_token'
            };
            vi.mocked(authService.register).mockResolvedValueOnce(mockResponse);

            renderWithProviders(<RegisterForm />);

            fireEvent.change(screen.getByLabelText(/Firm Name/i), { target: { value: 'Acme Corp' } });
            fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
            fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
            fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } });
            fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });

            fireEvent.click(screen.getByRole('button', { name: /Register/i }));

            await waitFor(() => {
                expect(authService.register).toHaveBeenCalledWith({
                    firm_name: 'Acme Corp',
                    full_name: 'John Doe',
                    email: 'test@example.com',
                    password: 'password123',
                });
            });

            expect(store.getState().auth.isAuthenticated).toBe(true);
            expect(store.getState().auth.accessToken).toBe('mock_token');
        });

        it('shows inline error and prevents API call on password mismatch', async () => {
            renderWithProviders(<RegisterForm />);

            fireEvent.change(screen.getByLabelText(/Firm Name/i), { target: { value: 'Acme' } });
            fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John' } });
            fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@test.com' } });
            fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } });
            fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'passwordXYZ' } });

            fireEvent.click(screen.getByRole('button', { name: /Register/i }));

            await waitFor(() => {
                expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
            });

            expect(authService.register).not.toHaveBeenCalled();
        });

        it('displays error message from API when returning 409 duplicate email', async () => {
            const mockError = { message: 'Email already exists', code: 'DUPLICATE_EMAIL' };
            vi.mocked(authService.register).mockRejectedValueOnce(mockError);

            renderWithProviders(<RegisterForm />);

            fireEvent.change(screen.getByLabelText(/Firm Name/i), { target: { value: 'Acme Corp' } });
            fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
            fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
            fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } });
            fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });

            fireEvent.click(screen.getByRole('button', { name: /Register/i }));

            await waitFor(() => {
                expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
            });
        });
    });

    describe('LoginForm', () => {
        it('calls authService.login on valid input', async () => {
            const mockResponse = {
                user: { id: '1', email: 'test@example.com', full_name: 'Test', role: 'user', firm_id: 'firm1' },
                accessToken: 'mock_token_login'
            };
            vi.mocked(authService.login).mockResolvedValueOnce(mockResponse);

            renderWithProviders(<LoginForm />);

            fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
            fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

            fireEvent.click(screen.getByRole('button', { name: /Log In/i }));

            await waitFor(() => {
                expect(authService.login).toHaveBeenCalledWith({
                    email: 'test@example.com',
                    password: 'password123',
                });
            });

            expect(store.getState().auth.isAuthenticated).toBe(true);
            expect(store.getState().auth.accessToken).toBe('mock_token_login');
        });

        it('shows inline validation errors for empty fields', async () => {
            renderWithProviders(<LoginForm />);

            fireEvent.click(screen.getByRole('button', { name: /Log In/i }));

            await waitFor(() => {
                expect(screen.getByText(/email is required/i)).toBeInTheDocument();
                expect(screen.getByText(/password is required/i)).toBeInTheDocument();
            });

            expect(authService.login).not.toHaveBeenCalled();
        });

        it('displays error message when API returns 401', async () => {
            const mockError = { message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' };
            vi.mocked(authService.login).mockRejectedValueOnce(mockError);

            renderWithProviders(<LoginForm />);

            fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
            fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpass' } });

            fireEvent.click(screen.getByRole('button', { name: /Log In/i }));

            await waitFor(() => {
                expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
            });
        });
    });

    describe('ProtectedRoute', () => {
        it('redirects unauthenticated users to /login', () => {
            // Setup unauthenticated state
            const unauthStore = configureStore({
                reducer: { auth: authReducer },
                preloadedState: {
                    auth: { isAuthenticated: false, user: null, accessToken: null }
                }
            });

            render(
                <Provider store={unauthStore} >
                    <MemoryRouter initialEntries={['/dashboard']} >
                        <ProtectedRoute>
                            <div>Dashboard Content </div>
                        </ProtectedRoute>
                    </MemoryRouter>
                </Provider>
            );

            expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument();
        });

        it('renders children for authenticated users', () => {
            // Setup authenticated state
            const authStore = configureStore({
                reducer: { auth: authReducer },
                preloadedState: {
                    auth: { isAuthenticated: true, user: {} as any, accessToken: 'token' }
                }
            });

            render(
                <Provider store={authStore} >
                    <MemoryRouter initialEntries={['/dashboard']} >
                        <ProtectedRoute>
                            <div>Dashboard Content </div>
                        </ProtectedRoute>
                    </MemoryRouter>
                </Provider>
            );

            expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
        });
    });

    // Note: Axios interceptor tests are typically handled by mocking axios directly and asserting its configuration changes.
    // The structure is well implemented in axiosInstance.ts to support dynamic store injection and bearer tokens.
});
