import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Film,
  MapPin,
  MonitorPlay,
  Handshake,
  ArrowRight,
  CheckCircle2,
  Building2,
  Calendar,
} from 'lucide-react';
import { getPublicSettings } from '../../api/settings';

export const Services: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['public-settings'],
    queryFn: getPublicSettings,
  });

  const settings = data?.data;
  const services = settings?.services || [];

  const iconMap: Record<string, React.ReactNode> = {
    Film: <Film className="w-8 h-8 text-brand-red" />,
    MapPin: <MapPin className="w-8 h-8 text-brand-gold-dark" />,
    MonitorPlay: <MonitorPlay className="w-8 h-8 text-brand-red" />,
    Handshake: <Handshake className="w-8 h-8 text-emerald-600" />,
  };

  const tnCircuits = [
    { name: 'Chennai City', screens: '95+ Screens', desc: 'Multiplex chains (PVR Inox, AGS, Rohini, Devi) & prime single screens.' },
    { name: 'Chengalpet Circuit', screens: '110+ Screens', desc: 'Suburban Chennai hubs, Tambaram, Kanchipuram, Chengalpattu.' },
    { name: 'Coimbatore & Erode', screens: '120+ Screens', desc: 'High grossing industrial belt: Coimbatore, Tiruppur, Erode, Pollachi.' },
    { name: 'Madurai & Ramnad', screens: '105+ Screens', desc: 'Passionate mass cinema territory: Madurai, Dindigul, Theni, Ramanathapuram.' },
    { name: 'Trichy & Thanjavur', screens: '80+ Screens', desc: 'Central Tamil Nadu circuit covering Trichy, Thanjavur, Karur, Pudukkottai.' },
    { name: 'Tirunelveli & Kanyakumari', screens: '75+ Screens', desc: 'Deep south theatrical circuit: Tirunelveli, Tuticorin, Nagercoil.' },
    { name: 'Salem & Dharmapuri', screens: '65+ Screens', desc: 'Salem, Namakkal, Dharmapuri, Krishnagiri theatre hubs.' },
    { name: 'Karnataka (Bangalore ROI)', screens: '80+ Screens', desc: 'Bangalore metro Tamil theatrical releases and premier showtimes.' },
  ];

  return (
    <div className="space-y-16 py-12 pb-20">
      {/* 1. Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-bold text-brand-red uppercase tracking-wider block mb-2">
          End-to-End Theatrical Solutions
        </span>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-text-main max-w-3xl mx-auto leading-tight">
          Distribution & Exhibitor Services
        </h1>
        <p className="text-base text-text-secondary mt-4 max-w-2xl mx-auto leading-relaxed">
          From screen planning and Digital Cinema server delivery to box-office collection accounting, BR Films delivers seamless theatrical execution.
        </p>
      </section>

      {/* 2. Core Configurable Services List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, idx) => (
            <div
              key={service.id || idx}
              className="bg-white p-8 rounded-2xl border border-border-subtle shadow-card hover:border-brand-gold/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 rounded-xl bg-surface-warm border border-brand-gold/20 flex items-center justify-center mb-6">
                  {iconMap[service.iconName] || <Film className="w-8 h-8 text-brand-red" />}
                </div>
                <h3 className="font-display font-bold text-2xl text-text-main mb-3">
                  {service.title}
                </h3>
                <p className="text-sm font-semibold text-brand-red mb-3">
                  {service.shortDescription}
                </p>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {service.fullDescription}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-border-subtle">
                <Link
                  to={`/enquiry?type=${encodeURIComponent('Film Distribution Proposal')}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-red hover:underline"
                >
                  <span>Enquire about this service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Tamil Nadu Territory Circuit Breakdown */}
      <section className="bg-surface-warm/50 border-y border-border-subtle py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-brand-gold-dark uppercase tracking-wider block mb-2">
              Circuit Infrastructure
            </span>
            <h2 className="font-display font-extrabold text-3xl text-text-main">
              Tamil Nadu Theatrical Circuit Network
            </h2>
            <p className="text-sm text-text-secondary mt-2">
              Optimized screen placement across all 8 major commercial circuits in Tamil Nadu and neighboring hubs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tnCircuits.map((c, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-border-subtle shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-base text-text-main">{c.name}</h4>
                  <span className="text-[11px] font-bold text-brand-red bg-red-50 px-2 py-0.5 rounded">
                    {c.screens}
                  </span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-surface-light border border-border-subtle rounded-2xl p-10 space-y-6">
          <h3 className="font-display font-black text-2xl sm:text-3xl text-text-main">
            Ready to Release Your Film With BR Films?
          </h3>
          <p className="text-sm text-text-secondary max-w-xl mx-auto leading-relaxed">
            Contact our distribution desk with your movie preview screener, rough cut, or theatrical release proposal.
          </p>
          <div>
            <Link
              to="/enquiry"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-brand-red text-white hover:bg-brand-red-hover shadow-cinema transition-all"
            >
              <span>Submit Distribution Proposal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
