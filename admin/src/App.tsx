import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { AdminLayout } from './components/layout/AdminLayout';

// Admin Auth Pages
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';

// Admin CMS Modules
import { Dashboard } from './pages/Dashboard';
import { MovieList } from './pages/MovieList';
import { MovieEditor } from './pages/MovieEditor';
import { EnquiryList } from './pages/EnquiryList';
import { CompanyProfile } from './pages/CompanyProfile';
import { WebsiteContent } from './pages/WebsiteContent';
import { SocialMedia } from './pages/SocialMedia';
import { SeoSettings } from './pages/SeoSettings';
import { AdminUsers } from './pages/AdminUsers';
import { AuditLogs } from './pages/AuditLogs';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 1000 * 30, // 30 seconds
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Legacy /admin redirect helpers if accessed via old links */}
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />
          <Route path="/admin/forgot-password" element={<Navigate to="/forgot-password" replace />} />
          <Route path="/admin/reset-password" element={<Navigate to="/reset-password" replace />} />
          <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
          <Route path="/admin/*" element={<Navigate to="/dashboard" replace />} />

          {/* Protected Admin CMS Area */}
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/movies" element={<MovieList />} />
            <Route path="/movies/new" element={<MovieEditor />} />
            <Route path="/movies/:id/edit" element={<MovieEditor />} />
            <Route path="/enquiries" element={<EnquiryList />} />
            <Route path="/company-profile" element={<CompanyProfile />} />
            <Route path="/website-content" element={<WebsiteContent />} />
            <Route path="/social-media" element={<SocialMedia />} />
            <Route path="/seo-settings" element={<SeoSettings />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
