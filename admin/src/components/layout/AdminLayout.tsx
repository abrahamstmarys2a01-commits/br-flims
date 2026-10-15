import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Film,
  PlusCircle,
  Inbox,
  Building,
  Globe,
  Share2,
  Search,
  Users,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const publicWebUrl = import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-light">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-text-secondary">Verifying administrator session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/login', { replace: true, state: { from: location } });
    return null;
  }

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out of the admin portal?')) {
      await logout();
      navigate('/login');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Movies Catalogue', path: '/movies', icon: Film, end: true },
    { name: 'Add New Movie', path: '/movies/new', icon: PlusCircle },
    { name: 'Enquiries', path: '/enquiries', icon: Inbox },
    { name: 'Company Profile', path: '/company-profile', icon: Building },
    { name: 'Website Content', path: '/website-content', icon: Globe },
    { name: 'Social Media', path: '/social-media', icon: Share2 },
    { name: 'SEO Settings', path: '/seo-settings', icon: Search },
    ...(user?.role === 'superadmin'
      ? [{ name: 'Admin Users', path: '/users', icon: Users }]
      : []),
    { name: 'Security Audit Logs', path: '/audit-logs', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen flex bg-surface-light text-text-main font-sans">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen z-50 w-64 bg-white border-r border-border-subtle flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo & Brand Header */}
          <div className="p-5 border-b border-border-subtle flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src="/logo.png" alt="BR Films" className="h-10 w-auto object-contain" />
              <div>
                <span className="font-display font-bold text-sm tracking-wide text-brand-red block">
                  BR FILMS
                </span>
                <span className="text-[10px] uppercase font-bold text-brand-gold tracking-widest block">
                  ADMIN CMS
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded md:hidden text-text-muted hover:text-text-main"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150 ${
                      isActive
                        ? 'bg-brand-red text-white shadow-sm'
                        : 'text-text-secondary hover:text-text-main hover:bg-surface-light'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-text-muted'}`} />
                        <span>{item.name}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-border-subtle bg-surface-warm/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-text-main truncate">{user?.name}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-brand-gold/15 text-brand-gold-dark rounded">
                    {user?.role}
                  </span>
                  <span className="text-[11px] text-text-muted truncate">{user?.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-border-subtle">
              <a
                href={publicWebUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-text-secondary hover:text-brand-red bg-white border border-border-subtle rounded-md hover:bg-surface-light transition-colors"
                title="View live public website in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live Site</span>
              </a>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                title="Sign out of Admin CMS"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-border-subtle px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-text-muted hover:text-text-main md:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-display font-bold text-lg text-text-main hidden sm:block">
              BR Films Management Console
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={publicWebUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-brand-red bg-brand-red-light border border-red-200 hover:bg-red-100 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Public Website</span>
            </a>

            <Link
              to="/movies/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-brand-red hover:bg-brand-red-hover transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Movie</span>
            </Link>
          </div>
        </header>

        {/* Page Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
