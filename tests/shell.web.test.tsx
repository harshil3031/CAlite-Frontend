/**
 * tests/shell.web.test.tsx
 *
 * Web Frontend — CRM Shell QA Tests
 * Covers: AppShell, Topbar, Sidebar, Breadcrumb,
 *         TrialBanner, UserMenu, NavItem, role-based nav.
 *
 * Run from /Frontend:  npx vitest run tests/shell.web.test.tsx
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import authReducer from '../src/store/authSlice';

import { AppShell } from '../src/components/layout/AppShell';
import { Sidebar } from '../src/components/layout/Sidebar';
import { TrialBanner } from '../src/components/layout/TrialBanner';
import { UserMenu } from '../src/components/layout/UserMenu';
import { Breadcrumb } from '../src/components/layout/Breadcrumb';
import { NavItem } from '../src/components/layout/NavItem';
import { LayoutDashboard } from 'lucide-react';

// ─── Mocks ────────────────────────────────────────────────────────────────

vi.mock('../src/services/authService', async () => {
    const actual = await vi.importActual<typeof import('../src/services/authService')>('../src/services/authService');
    return {
        ...actual,
        authService: { ...actual.authService, logout: vi.fn().mockResolvedValue(undefined) },
    };
});

vi.mock('../src/lib/toast', () => ({
    toastSuccess: vi.fn(),
    toastError: vi.fn(),
    toastInfo: vi.fn(),
}));

// ─── Helpers ──────────────────────────────────────────────────────────────

const FUTURE_DATE = new Date(Date.now() + 14 * 86400_000).toISOString();
const PAST_DATE = new Date(Date.now() - 2 * 86400_000).toISOString();
const NEAR_DATE = new Date(Date.now() + 2 * 86400_000).toISOString(); // < 3 days

const makeStore = (overrides: Partial<{
    role: string;
    subscription_tier: string | null;
    trial_ends_at: string | null;
}> = {}) => {
    const { role = 'admin', subscription_tier = 'trial', trial_ends_at = FUTURE_DATE } = overrides;
    return configureStore({
        reducer: { auth: authReducer },
        preloadedState: {
            auth: {
                user: {
                    id: 'u1',
                    email: 'admin@firm.com',
                    full_name: 'Alice Admin',
                    role,
                    firm_id: 'f1',
                    firm: { id: 'f1', name: 'Acme CA', subscription_tier, trial_ends_at, status: 'active' },
                } as any,
                firm: { id: 'f1', name: 'Acme CA', subscription_tier, trial_ends_at, status: 'active' },
                accessToken: 'token',
                isAuthenticated: true,
            },
        },
    });
};

const makeQC = () => new QueryClient({ defaultOptions: { queries: { retry: false } } });

const Wrapper = ({ children, store = makeStore(), path = '/' }: any) => (
    <Provider store={store}>
        <QueryClientProvider client={makeQC()}>
            <MemoryRouter initialEntries={[path]}>
                {children}
            </MemoryRouter>
        </QueryClientProvider>
    </Provider>
);

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

// ─── 1. AppShell ─────────────────────────────────────────────────────────

describe('AppShell', () => {
    it('renders topbar, sidebar, and content outlet area', () => {
        render(
            <Wrapper>
                <AppShell />
            </Wrapper>
        );
        // Topbar: contains CAlite logo text in sidebar
        expect(screen.getAllByText('CAlite').length).toBeGreaterThan(0);
        // Sidebar: contains main nav sections
        expect(screen.getByText('Dashboard')).toBeTruthy();
        expect(screen.getByText('Clients')).toBeTruthy();
        // Content area container
        expect(document.getElementById('app-content')).toBeTruthy();
    });
});

// ─── 2. Sidebar ──────────────────────────────────────────────────────────

describe('Sidebar — admin role', () => {
    it('shows firm name', () => {
        render(<Wrapper><Sidebar /></Wrapper>);
        expect(screen.getByText('Acme CA')).toBeTruthy();
    });

    it('shows Settings section for admin', () => {
        render(<Wrapper><Sidebar /></Wrapper>);
        expect(screen.getByText('Settings')).toBeTruthy();
    });

    it('renders Compliance as greyed/disabled link', () => {
        render(<Wrapper><Sidebar /></Wrapper>);
        const complianceEl = screen.getByText('Compliance');
        // Should be inside a disabled container, not an anchor
        const anchor = complianceEl.closest('a');
        expect(anchor).toBeNull();
    });

    it('renders subscription plan badge', () => {
        render(<Wrapper store={makeStore({ subscription_tier: 'professional' })}><Sidebar /></Wrapper>);
        expect(screen.getByText('Professional Plan')).toBeTruthy();
    });
});

describe('Sidebar — staff role', () => {
    it('does NOT show Settings section for staff', () => {
        render(<Wrapper store={makeStore({ role: 'staff' })}><Sidebar /></Wrapper>);
        expect(screen.queryByText('Settings')).toBeNull();
    });

    it('still shows Clients nav item for staff', () => {
        render(<Wrapper store={makeStore({ role: 'staff' })}><Sidebar /></Wrapper>);
        expect(screen.getByText('Clients')).toBeTruthy();
    });
});

// ─── 3. TrialBanner ──────────────────────────────────────────────────────

describe('TrialBanner', () => {
    it('shows amber/yellow banner for active trial with days remaining', () => {
        render(<Wrapper store={makeStore({ subscription_tier: 'trial', trial_ends_at: FUTURE_DATE })}><TrialBanner /></Wrapper>);
        expect(screen.getByText(/expires in/i)).toBeTruthy();
        // Banner element should NOT contain 'red' class
        const banner = screen.getByText(/expires in/i).closest('div');
        expect(banner?.className).not.toContain('red');
    });

    it('shows red banner when < 3 days remaining', () => {
        render(<Wrapper store={makeStore({ subscription_tier: 'trial', trial_ends_at: NEAR_DATE })}><TrialBanner /></Wrapper>);
        const banner = screen.getByText(/expires in/i).closest('div');
        expect(banner?.className).toContain('red');
    });

    it('shows red expired banner when trial is past', () => {
        render(<Wrapper store={makeStore({ subscription_tier: 'trial', trial_ends_at: PAST_DATE })}><TrialBanner /></Wrapper>);
        expect(screen.getByText(/expired/i)).toBeTruthy();
        const banner = screen.getByText(/expired/i).closest('div');
        expect(banner?.className).toContain('red');
    });

    it('does NOT render for non-trial subscriptions', () => {
        render(<Wrapper store={makeStore({ subscription_tier: 'professional' })}><TrialBanner /></Wrapper>);
        expect(screen.queryByText(/expires/i)).toBeNull();
    });
});

// ─── 4. Breadcrumb ───────────────────────────────────────────────────────

describe('Breadcrumb', () => {
    it('shows Dashboard label on /dashboard path', () => {
        render(
            <Provider store={makeStore()}>
                <MemoryRouter initialEntries={['/dashboard']}>
                    <Breadcrumb />
                </MemoryRouter>
            </Provider>
        );
        expect(screen.getByText('Dashboard')).toBeTruthy();
    });

    it('shows Settings > Staff on /settings/staff', () => {
        render(
            <Provider store={makeStore()}>
                <MemoryRouter initialEntries={['/settings/staff']}>
                    <Breadcrumb />
                </MemoryRouter>
            </Provider>
        );
        expect(screen.getByText('Settings')).toBeTruthy();
        expect(screen.getByText('Staff')).toBeTruthy();
    });
});

// ─── 5. UserMenu ─────────────────────────────────────────────────────────

describe('UserMenu', () => {
    it('shows user initials and full name', () => {
        render(<Wrapper><UserMenu /></Wrapper>);
        expect(screen.getByText('A')).toBeTruthy(); // initials
        expect(screen.getByText('Alice Admin')).toBeTruthy();
    });

    it('shows admin role badge', () => {
        render(<Wrapper><UserMenu /></Wrapper>);
        expect(screen.getByText('admin')).toBeTruthy();
    });

    it('opens dropdown on click and shows Firm Settings for admin', () => {
        render(<Wrapper><UserMenu /></Wrapper>);
        fireEvent.click(screen.getByText('Alice Admin'));
        expect(screen.getByText('Firm Settings')).toBeTruthy();
        expect(screen.getByText('Staff Management')).toBeTruthy();
    });

    it('does NOT show Firm Settings in dropdown for staff', () => {
        render(<Wrapper store={makeStore({ role: 'staff' })}><UserMenu /></Wrapper>);
        fireEvent.click(screen.getByText('Alice Admin'));
        expect(screen.queryByText('Firm Settings')).toBeNull();
    });

    it('shows confirm dialog before executing logout', async () => {
        const { authService } = await import('../src/services/authService');
        render(<Wrapper><UserMenu /></Wrapper>);
        fireEvent.click(screen.getByText('Alice Admin'));
        fireEvent.click(screen.getByText('Logout'));
        // Confirmation should appear
        await waitFor(() => expect(screen.getByText('Confirm logout?')).toBeTruthy());
        // authService.logout should NOT have been called yet
        expect(authService.logout).not.toHaveBeenCalled();
    });

    it('executes logout after confirm click', async () => {
        const { authService } = await import('../src/services/authService');
        const store = makeStore();
        render(<Wrapper store={store}><UserMenu /></Wrapper>);
        fireEvent.click(screen.getByText('Alice Admin'));
        fireEvent.click(screen.getByText('Logout'));
        await waitFor(() => screen.getByText('Yes, logout'));
        fireEvent.click(screen.getByText('Yes, logout'));
        await waitFor(() => expect(authService.logout).toHaveBeenCalled());
        await waitFor(() => expect(store.getState().auth.isAuthenticated).toBe(false));
    });
});

// ─── 6. NavItem ──────────────────────────────────────────────────────────

describe('NavItem', () => {
    it('renders a clickable link when not disabled', () => {
        render(
            <MemoryRouter>
                <NavItem label="Dashboard" to="/dashboard" icon={LayoutDashboard} />
            </MemoryRouter>
        );
        const link = screen.getByText('Dashboard').closest('a');
        expect(link).toBeTruthy();
        expect(link?.getAttribute('href')).toBe('/dashboard');
    });

    it('renders as non-link div when disabled', () => {
        render(
            <MemoryRouter>
                <NavItem label="Compliance" to="/compliance" icon={LayoutDashboard} isDisabled disabledTooltip="Coming in Layer 3" />
            </MemoryRouter>
        );
        const el = screen.getByText('Compliance');
        expect(el.closest('a')).toBeNull(); // NOT an anchor
    });
});
