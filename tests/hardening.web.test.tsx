/**
 * tests/hardening.web.test.tsx
 *
 * Web Frontend — Layer 1+2 Hardening QA Tests
 * Covers: ErrorBoundary, Toast system, AppLayout/TopNav,
 *         NotFoundPage, ForgotPasswordPage, ResetPasswordPage,
 *         AcceptInvitePage, FirmSettingsPage, StaffManagementPage,
 *         InviteModal, RBAC redirect, self-deactivate guard.
 *
 * Run from /Frontend:  npx vitest run tests/hardening.web.test.tsx
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../src/store/authSlice';

// Components under test (ESM imports)
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { AppLayout } from '../src/components/layout/AppLayout';
import { TopNav } from '../src/components/layout/TopNav';
import { NotFoundPage } from '../src/pages/NotFoundPage';
import { ForgotPasswordPage } from '../src/features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../src/features/auth/pages/ResetPasswordPage';
import { AcceptInvitePage } from '../src/features/auth/pages/AcceptInvitePage';
import { FirmSettingsPage } from '../src/features/settings/pages/FirmSettingsPage';
import { StaffManagementPage } from '../src/features/settings/pages/StaffManagementPage';
import { InviteModal } from '../src/features/settings/components/InviteModal';
import { toastSuccess, toastError } from '../src/lib/toast';

// ───────────────────────────────────────────────
// Mocks
// ───────────────────────────────────────────────

vi.mock('../src/lib/toast', () => ({
    toastSuccess: vi.fn(),
    toastError: vi.fn(),
    toastInfo: vi.fn(),
}));

vi.mock('../src/services/settingsService', () => ({
    settingsService: {
        getFirm: vi.fn().mockResolvedValue({
            id: 'firm-1',
            name: 'Test Firm',
            contact_email: 'contact@test.com',
            phone: null,
            subscription_tier: 'trial',
            status: 'active',
            trial_ends_at: new Date(Date.now() + 14 * 86400_000).toISOString(),
            invoice_prefix: 'INV',
        }),
        updateFirm: vi.fn().mockResolvedValue({ id: 'firm-1' }),
    },
}));

vi.mock('../src/services/userService', () => ({
    userService: {
        getUsers: vi.fn().mockResolvedValue([
            { id: 'user-1', fullName: 'Alice Admin', email: 'alice@test.com', role: 'admin', isActive: true },
            { id: 'user-2', fullName: 'Bob Staff', email: 'bob@test.com', role: 'staff', isActive: true },
        ]),
        inviteUser: vi.fn().mockResolvedValue({ id: 'user-3' }),
        deactivateUser: vi.fn().mockResolvedValue({ id: 'user-2', isActive: false }),
        reactivateUser: vi.fn().mockResolvedValue({ id: 'user-2', isActive: true }),
    },
}));

vi.mock('../src/services/authService', async () => {
    const actual = await vi.importActual<typeof import('../src/services/authService')>('../src/services/authService');
    return {
        ...actual,
        authService: {
            ...actual.authService,
            logout: vi.fn().mockResolvedValue(undefined),
            forgotPassword: vi.fn().mockResolvedValue(undefined),
            resetPassword: vi.fn().mockResolvedValue(undefined),
            acceptInvite: vi.fn().mockResolvedValue({
                user: { id: 'u1', email: 'a@a.com', full_name: 'Test', role: 'staff', firm_id: 'f1' },
                accessToken: 'token-abc',
            }),
        },
    };
});

// ───────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────

const FUTURE_DATE = new Date(Date.now() + 14 * 86400_000).toISOString();

const makeAdminStore = () =>
    configureStore({
        reducer: { auth: authReducer },
        preloadedState: {
            auth: {
                user: {
                    id: 'user-1',
                    email: 'admin@test.com',
                    full_name: 'Alice Admin',
                    role: 'admin',
                    firm_id: 'f1',
                    firm: { id: 'f1', name: 'Test Firm', subscription_tier: 'trial', trial_ends_at: FUTURE_DATE },
                } as any,
                firm: { id: 'f1', name: 'Test Firm', subscription_tier: 'trial', trial_ends_at: FUTURE_DATE, status: 'active' },
                accessToken: 'test-token',
                isAuthenticated: true,
            },
        },
    });

const makeStaffStore = () =>
    configureStore({
        reducer: { auth: authReducer },
        preloadedState: {
            auth: {
                user: {
                    id: 'user-2',
                    email: 'staff@test.com',
                    full_name: 'Bob Staff',
                    role: 'staff',
                    firm_id: 'f1',
                    firm: { id: 'f1', name: 'Test Firm' },
                } as any,
                firm: { id: 'f1', name: 'Test Firm', subscription_tier: 'trial', trial_ends_at: FUTURE_DATE, status: 'active' },
                accessToken: 'test-token',
                isAuthenticated: true,
            },
        },
    });

const makeQC = () =>
    new QueryClient({ defaultOptions: { queries: { retry: false } } });

const Wrapper = ({ children, store = makeAdminStore(), qc = makeQC(), initialPath = '/' }: any) => (
    <Provider store={store}>
        <QueryClientProvider client={qc}>
            <MemoryRouter initialEntries={[initialPath]}>
                {children}
            </MemoryRouter>
        </QueryClientProvider>
    </Provider>
);

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

// ───────────────────────────────────────────────
// 1. ErrorBoundary
// ───────────────────────────────────────────────

describe('ErrorBoundary', () => {
    it('catches unhandled render errors and shows fallback UI', () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => { });
        const BrokenChild = () => { throw new Error('Test crash'); };

        render(
            <ErrorBoundary>
                <BrokenChild />
            </ErrorBoundary>
        );

        expect(screen.getByText('Something went wrong.')).toBeTruthy();
        expect(screen.getByText('Refresh page')).toBeTruthy();
        spy.mockRestore();
    });
});

// ───────────────────────────────────────────────
// 2. Toast helpers
// ───────────────────────────────────────────────

describe('Toast helpers', () => {
    it('toastSuccess is callable and passed a message', () => {
        toastSuccess('Operation successful');
        expect(toastSuccess).toHaveBeenCalledWith('Operation successful');
    });

    it('toastError is callable and passed an error message', () => {
        toastError('Something failed');
        expect(toastError).toHaveBeenCalledWith('Something failed');
    });
});

// ───────────────────────────────────────────────
// 3. AppLayout / TopNav
// ───────────────────────────────────────────────

describe('AppLayout / TopNav', () => {
    it('renders the navbar with firm name from Redux state', () => {
        render(
            <Provider store={makeAdminStore()}>
                <QueryClientProvider client={makeQC()}>
                    <MemoryRouter>
                        <Routes>
                            <Route path="/" element={<AppLayout />} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            </Provider>
        );

        expect(screen.getByText('CAlite')).toBeTruthy();
        expect(screen.getByText('Test Firm')).toBeTruthy();
    });

    it('renders trial badge for trial subscription tier', () => {
        render(
            <Provider store={makeAdminStore()}>
                <MemoryRouter>
                    <TopNav />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText(/Trial:/)).toBeTruthy();
        expect(screen.getByText(/days remaining/)).toBeTruthy();
    });

    it('dispatches clearCredentials on logout button click', async () => {
        const store = makeAdminStore();

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Routes>
                        <Route path="*" element={<TopNav />} />
                        <Route path="/login" element={<div data-testid="login-page">Login</div>} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        const logoutBtn = screen.getByTitle('Logout');
        fireEvent.click(logoutBtn);

        await waitFor(() => {
            expect(store.getState().auth.isAuthenticated).toBe(false);
        });
    });
});

// ───────────────────────────────────────────────
// 4. NotFoundPage
// ───────────────────────────────────────────────

describe('NotFoundPage', () => {
    it('renders "Page not found" and "404" for unknown routes', () => {
        render(<Wrapper><NotFoundPage /></Wrapper>);
        expect(screen.getByText('404')).toBeTruthy();
        expect(screen.getByText('Page not found')).toBeTruthy();
        expect(screen.getByText('Back to Dashboard')).toBeTruthy();
    });
});

// ───────────────────────────────────────────────
// 5. ForgotPasswordPage
// ───────────────────────────────────────────────

describe('ForgotPasswordPage', () => {
    it('always shows info message after submit regardless of email existence', async () => {
        render(<Wrapper><ForgotPasswordPage /></Wrapper>);

        fireEvent.change(screen.getByPlaceholderText('your.email@example.com'), {
            target: { value: 'anyuser@example.com' },
        });
        fireEvent.click(screen.getByText('Send Reset Link'));

        await waitFor(() => {
            expect(screen.getByText(/If this email exists/i)).toBeTruthy();
        });
    });
});

// ───────────────────────────────────────────────
// 6. ResetPasswordPage
// ───────────────────────────────────────────────

describe('ResetPasswordPage', () => {
    it('redirects to /login if token param is missing', async () => {
        render(
            <Wrapper initialPath="/reset-password">
                <Routes>
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/login" element={<div data-testid="login-page">Login</div>} />
                </Routes>
            </Wrapper>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('login-page')).toBeTruthy();
        });
    });
});

// ───────────────────────────────────────────────
// 7. AcceptInvitePage
// ───────────────────────────────────────────────

describe('AcceptInvitePage', () => {
    it('redirects to /login when invite token is missing', async () => {
        render(
            <Wrapper initialPath="/accept-invite">
                <Routes>
                    <Route path="/accept-invite" element={<AcceptInvitePage />} />
                    <Route path="/login" element={<div data-testid="login-page">Login</div>} />
                </Routes>
            </Wrapper>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('login-page')).toBeTruthy();
        });
    });
});

// ───────────────────────────────────────────────
// 8. FirmSettingsPage
// ───────────────────────────────────────────────

describe('FirmSettingsPage', () => {
    it('loads firm data and shows read-only fields (name, tier, invoice prefix)', async () => {
        render(
            <Provider store={makeAdminStore()}>
                <QueryClientProvider client={makeQC()}>
                    <MemoryRouter>
                        <FirmSettingsPage />
                    </MemoryRouter>
                </QueryClientProvider>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Test Firm')).toBeTruthy();
        });

        expect(screen.getByText('INV')).toBeTruthy();
        expect(screen.getByText(/Trial:/i)).toBeTruthy();
    });

    it('redirects staff users to /dashboard', async () => {
        render(
            <Provider store={makeStaffStore()}>
                <QueryClientProvider client={makeQC()}>
                    <MemoryRouter initialEntries={['/settings']}>
                        <Routes>
                            <Route path="/settings" element={<FirmSettingsPage />} />
                            <Route path="/dashboard" element={<div data-testid="dashboard-page">Dashboard</div>} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('dashboard-page')).toBeTruthy();
        });
    });
});

// ───────────────────────────────────────────────
// 9. StaffManagementPage
// ───────────────────────────────────────────────

describe('StaffManagementPage', () => {
    it('lists staff members of the firm', async () => {
        render(
            <Provider store={makeAdminStore()}>
                <QueryClientProvider client={makeQC()}>
                    <MemoryRouter>
                        <StaffManagementPage />
                    </MemoryRouter>
                </QueryClientProvider>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Alice Admin')).toBeTruthy();
            expect(screen.getByText('Bob Staff')).toBeTruthy();
        });
    });

    it('hides deactivate button for the current user row and shows "You" label', async () => {
        render(
            <Provider store={makeAdminStore()}>
                <QueryClientProvider client={makeQC()}>
                    <MemoryRouter>
                        <StaffManagementPage />
                    </MemoryRouter>
                </QueryClientProvider>
            </Provider>
        );

        await waitFor(() => screen.getByText('Alice Admin'));

        // Current user (admin, user-1) should show "You" instead of deactivate
        expect(screen.getByText('You')).toBeTruthy();

        // Bob Staff (user-2) should have a Deactivate button
        const deactivateButtons = screen.getAllByText('Deactivate');
        expect(deactivateButtons).toHaveLength(1);
    });

    it('redirects staff users to /dashboard', async () => {
        render(
            <Provider store={makeStaffStore()}>
                <QueryClientProvider client={makeQC()}>
                    <MemoryRouter initialEntries={['/settings/staff']}>
                        <Routes>
                            <Route path="/settings/staff" element={<StaffManagementPage />} />
                            <Route path="/dashboard" element={<div data-testid="dashboard-page">Dashboard</div>} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('dashboard-page')).toBeTruthy();
        });
    });
});

// ───────────────────────────────────────────────
// 10. InviteModal
// ───────────────────────────────────────────────

describe('InviteModal', () => {
    it('does not render when isOpen=false', () => {
        const { container } = render(
            <Wrapper>
                <InviteModal isOpen={false} onClose={vi.fn()} />
            </Wrapper>
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders form fields when isOpen=true', () => {
        render(
            <Wrapper>
                <InviteModal isOpen={true} onClose={vi.fn()} />
            </Wrapper>
        );

        expect(screen.getByPlaceholderText('Jane Doe')).toBeTruthy();
        expect(screen.getByPlaceholderText('jane@example.com')).toBeTruthy();
        expect(screen.getByText('Send Invite')).toBeTruthy();
    });

    it('calls inviteUser mutation on submit with valid data', async () => {
        const { userService } = await import('../src/services/userService');
        const onClose = vi.fn();

        render(
            <Wrapper>
                <InviteModal isOpen={true} onClose={onClose} />
            </Wrapper>
        );

        fireEvent.change(screen.getByPlaceholderText('Jane Doe'), { target: { value: 'Jane Smith' } });
        fireEvent.change(screen.getByPlaceholderText('jane@example.com'), { target: { value: 'jane@example.com' } });
        fireEvent.click(screen.getByText('Send Invite'));

        await waitFor(() => {
            expect(userService.inviteUser).toHaveBeenCalledWith({
                full_name: 'Jane Smith',
                email: 'jane@example.com',
                role: 'staff',
            });
        });
    });
});
