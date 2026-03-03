import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { PricingPage } from './pages/PricingPage';
import { SecurityPage } from './pages/SecurityPage';
import { ContactPage } from './pages/ContactPage';
import { ChangelogPage } from './pages/ChangelogPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';

// Placeholder Dashboard component
const DashboardPlaceholder = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white relative overflow-hidden">
    {/* Background Blob */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

    <div className="text-center p-12 glass-card bg-slate-900/60 border border-white/10 shadow-2xl rounded-3xl relative z-10 animate-fade-up">
      <h1 className="text-4xl font-bold text-gradient mb-4">Dashboard</h1>
      <p className="text-slate-400 text-lg">You are successfully authenticated!</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPlaceholder />
            </ProtectedRoute>
          }
        />

        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
