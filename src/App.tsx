import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Auth / Public
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from './features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from './features/auth/pages/ResetPasswordPage';
import { AcceptInvitePage } from './features/auth/pages/AcceptInvitePage';

// Marketing
import { LandingPage } from './pages/LandingPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { PricingPage } from './pages/PricingPage';
import { SecurityPage } from './pages/SecurityPage';
import { ContactPage } from './pages/ContactPage';
import { ChangelogPage } from './pages/ChangelogPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// App shell + auth guard
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';

// Authenticated pages
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { FirmSettingsPage } from './features/settings/pages/FirmSettingsPage';
import { StaffManagementPage } from './features/settings/pages/StaffManagementPage';
import UsersPage from './features/settings/pages/UsersPage';
import { ClientsPage } from './features/clients/pages/ClientsPage';
import { ClientDetailPage } from './features/clients/pages/ClientDetailPage';
import ImportPage from './features/clients/pages/ImportPage';
import CompliancePage from './features/compliance/pages/CompliancePage';
import ComplianceLibraryPage from './features/compliance/pages/ComplianceLibraryPage';

// Platform pages
import FirmsPage from './features/platform/pages/FirmsPage';
import TemplatesPage from './features/platform/pages/TemplatesPage';

// Placeholder pages for Layer 3 routes
const ComingSoonPage = ({ name }: { name: string }) => (
  <div className="flex flex-col items-center justify-center h-64 text-slate-400">
    <p className="text-2xl font-bold mb-2">{name}</p>
    <p className="text-sm">Coming soon — under active development</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── AUTH ROUTES (no shell) ──────────────────────────── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/accept-invite" element={<AcceptInvitePage />} />

        {/* ── PROTECTED APP ROUTES (AppShell) ────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/import" element={<ImportPage />} />
            <Route path="/clients/:id" element={<ClientDetailPage />} />
            <Route path="/settings" element={<FirmSettingsPage />} />
            <Route path="/settings/staff" element={<StaffManagementPage />} />
            <Route path="/settings/users" element={<UsersPage />} />

            {/* Future Layers */}
            <Route path="/compliance" element={<CompliancePage />} />
            <Route path="/compliance/library" element={<ComplianceLibraryPage />} />

            {/* Platform Super Admin Layer 3+ */}
            <Route path="/platform/firms" element={<FirmsPage />} />
            <Route path="/platform/templates" element={<TemplatesPage />} />

            <Route path="/tasks" element={<ComingSoonPage name="Tasks" />} />
            <Route path="/documents" element={<ComingSoonPage name="Documents" />} />
            <Route path="/billing" element={<ComingSoonPage name="Billing" />} />
          </Route>
        </Route>

        {/* ── ROOT REDIRECT ───────────────────────────────────── */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* ── MARKETING PAGES ─────────────────────────────────── */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* ── CATCH-ALL 404 ───────────────────────────────────── */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
