import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../services/authService';

const AUTH_STORAGE_KEY = 'calite_auth';

// ─── Firm shape stored in Redux (read-only snapshot from login/register) ───
export interface AuthFirm {
    id: string;
    name: string;
    subscription_tier: string | null;
    trial_ends_at: string | null;
    status: string | null;
}

interface AuthState {
    user: User | null;
    firm: AuthFirm | null;
    accessToken: string | null;
    isAuthenticated: boolean;
}

// ─── Persistence helpers ────────────────────────────────────────────────────

function loadFromStorage(): AuthState {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return { user: null, firm: null, accessToken: null, isAuthenticated: false };
        const parsed = JSON.parse(raw) as AuthState;
        if (parsed.accessToken && parsed.user) return { ...parsed, isAuthenticated: true };
    } catch {
        // Corrupt storage — ignore
    }
    return { user: null, firm: null, accessToken: null, isAuthenticated: false };
}

function saveToStorage(state: AuthState) {
    try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
    } catch {
        // Storage full — ignore
    }
}

function clearStorage() {
    try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
        // ignore
    }
}

// ─── Extract firm from User object ─────────────────────────────────────────
function firmFromUser(user: User): AuthFirm | null {
    if (!user.firm) return null;
    return {
        id: user.firm.id,
        name: user.firm.name,
        subscription_tier: user.firm.subscription_tier ?? null,
        trial_ends_at: user.firm.trial_ends_at ?? null,
        status: user.firm.status ?? null,
    };
}

// ─── Slice ──────────────────────────────────────────────────────────────────

const initialState: AuthState = loadFromStorage();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; accessToken: string }>
        ) => {
            state.user = action.payload.user;
            state.firm = firmFromUser(action.payload.user);
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
            saveToStorage({
                user: state.user,
                firm: state.firm,
                accessToken: state.accessToken,
                isAuthenticated: true,
            });
        },
        clearCredentials: (state) => {
            state.user = null;
            state.firm = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            clearStorage();
        },
    },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
