import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { AboutUsPage } from './pages/AboutUsPage';

// Placeholder Dashboard component
const DashboardPlaceholder = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center p-8 bg-white shadow-xl rounded-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
      <p className="text-gray-600">You are successfully authenticated!</p>
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

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
