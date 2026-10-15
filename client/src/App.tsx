import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PublicLayout } from './components/layout/PublicLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { Movies } from './pages/public/Movies';
import { MovieDetails } from './pages/public/MovieDetails';
import { Upcoming } from './pages/public/Upcoming';
import { Released } from './pages/public/Released';
import { Services } from './pages/public/Services';
import { About } from './pages/public/About';
import { Enquiry } from './pages/public/Enquiry';
import { Contact } from './pages/public/Contact';
import { PrivacyPolicy } from './pages/public/PrivacyPolicy';
import { Terms } from './pages/public/Terms';
import { NotFound } from './pages/public/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true, // Auto-revalidates when returning to tab
      staleTime: 1000 * 30, // 30 seconds
      retry: 1,
    },
  },
});

// Redirect helper if user enters /admin directly on public web domain
const AdminRedirect: React.FC = () => {
  const adminUrl = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174';
  React.useEffect(() => {
    window.location.href = adminUrl;
  }, [adminUrl]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light">
      <div className="text-center p-8">
        <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-bold text-text-main">Redirecting to BR Films Admin CMS Portal...</p>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:slug" element={<MovieDetails />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/released" element={<Released />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Portal Redirect for separate deployment */}
        {/* <Route path="/admin" element={<AdminRedirect />} />
        <Route path="/admin/*" element={<AdminRedirect />} /> */}
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
