import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Film,
  Building,
  Target,
  Eye,
  Award,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { getPublicSettings } from '../../api/settings';

export const About: React.FC = () => {
  const { data } = useQuery({
    queryKey: ['public-settings'],
    queryFn: getPublicSettings,
  });

  const settings = data?.data;

  return (
    <div className="space-y-16 py-12 pb-20">
      {/* 1. Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface-warm border border-border-subtle rounded-2xl p-8 sm:p-12 lg:p-16 flex flex-col items-center text-center">
          <img
            src={settings?.officialLogoUrl || '/logo.png'}
            alt="BR Films Official Logo"
            className="h-28 sm:h-36 w-auto object-contain mb-8 drop-shadow-sm"
          />

          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold-dark block mb-2">
            Company Profile & Values
          </span>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-text-main max-w-3xl leading-tight">
            About {settings?.companyName || 'BR Films'}
          </h1>

          <p className="text-base sm:text-lg text-text-secondary mt-4 max-w-2xl leading-relaxed">
            {settings?.tagline ||
              'Premier Tamil Film Distribution & Theatrical Showcase connecting visionary storytellers with passionate cinema audiences.'}
          </p>
        </div>
      </section>

      {/* 2. Core Story & Identity */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-border-subtle shadow-card space-y-6">
          <h2 className="font-display font-bold text-2xl text-text-main border-l-4 border-brand-red pl-4">
            Who We Are
          </h2>
          <p className="text-base text-text-secondary leading-relaxed">
            {settings?.aboutDescription ||
              'BR Films is a dynamic film distribution banner headquartered in Trichy, Tamil Nadu. We specialize in acquiring, marketing, and theatrically releasing distinguished Tamil feature films across commercial multiplex chains and cherished single-screen theatres.'}
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            With direct exhibitor coordination across Chennai, Chengalpet, Coimbatore, Madurai, Trichy, Tirunelveli, and neighboring states, we bridge creative visions with commercially viable theatrical rollouts.
          </p>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl border border-border-subtle shadow-card space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-brand-red flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-text-main">Our Mission</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {settings?.mission ||
                'To maximize theatrical screen reach, maintain utmost collection transparency, and deliver memorable cinema experiences.'}
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-border-subtle shadow-card space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-brand-gold-dark flex items-center justify-center font-bold">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-text-main">Our Vision</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {settings?.vision ||
                'To stand as the most trusted, artist-friendly, and exhibitor-respected distribution banner in South Indian cinema.'}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Operational Integrity Principles */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display font-bold text-2xl text-text-main mb-6 text-center">
          Our Distribution Pillars
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-surface-light p-6 rounded-xl border border-border-subtle text-center">
            <ShieldCheck className="w-10 h-10 text-brand-red mx-auto mb-3" />
            <h4 className="font-bold text-base text-text-main mb-1.5">Collection Transparency</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Daily Computerized Box Office collection reports shared promptly with production partners.
            </p>
          </div>

          <div className="bg-surface-light p-6 rounded-xl border border-border-subtle text-center">
            <Building className="w-10 h-10 text-brand-gold mx-auto mb-3" />
            <h4 className="font-bold text-base text-text-main mb-1.5">Circuit Relationships</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Long-standing relationships with over 650+ screens across Tamil Nadu and Bangalore circles.
            </p>
          </div>

          <div className="bg-surface-light p-6 rounded-xl border border-border-subtle text-center">
            <Award className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
            <h4 className="font-bold text-base text-text-main mb-1.5">Honest Settlements</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Timely financial settlements and clear, auditable balance sheets for rights holders.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Contact CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface-warm border border-border-subtle rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-bold text-2xl text-text-main">
              Connect With Our Executive Team
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Have an inquiry or proposal? Get in touch with our office today.
            </p>
          </div>

          <Link
            to="/enquiry"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-brand-red text-white hover:bg-brand-red-hover shadow-cinema shrink-0"
          >
            <span>Distribution Enquiry</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
