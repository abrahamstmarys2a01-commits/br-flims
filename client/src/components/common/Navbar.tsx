import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Film, Shield, PhoneCall } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'Upcoming', path: '/upcoming' },
    { name: 'Released', path: '/released' },
    { name: 'Services', path: '/services' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const adminUrl = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border-subtle shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-brand-gold rounded-lg p-1">
            <img
              src="/logo.png"
              alt="BR Films Distribution"
              className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                    active
                      ? 'text-brand-red bg-brand-red-light font-bold'
                      : 'text-text-main hover:text-brand-red hover:bg-surface-light'
                  }`}
                >
                  {link.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {/* <a
              href={adminUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-gold-dark bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
              title="Access Admin CMS Portal"
            >
              <Shield className="w-3.5 h-3.5" /> Admin CMS
            </a> */}

            <Link
              to="/enquiry"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-brand-red hover:bg-brand-red-hover transition-all duration-200 shadow-cinema hover:shadow-lg transform active:scale-95"
            >
              <Film className="w-4 h-4 text-brand-gold-light" />
              <span>Business Enquiry</span>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-text-main hover:text-brand-red hover:bg-surface-light focus:outline-none focus:ring-2 focus:ring-brand-red"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border-subtle bg-white px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-base font-semibold ${
                  active
                    ? 'text-brand-red bg-brand-red-light font-bold'
                    : 'text-text-main hover:text-brand-red hover:bg-surface-light'
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-border-subtle flex flex-col gap-2">
            <Link
              to="/enquiry"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-base font-bold text-white bg-brand-red hover:bg-brand-red-hover shadow-cinema"
            >
              <Film className="w-4 h-4" />
              <span>Submit Business Enquiry</span>
            </Link>

            <a
              href={adminUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold text-text-muted hover:text-text-main"
            >
              <Shield className="w-4 h-4" /> Administrator CMS Portal
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
