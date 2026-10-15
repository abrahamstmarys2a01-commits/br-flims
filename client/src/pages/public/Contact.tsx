import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  ExternalLink,
  Building,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPublicSettings } from '../../api/settings';

export const Contact: React.FC = () => {
  const { data } = useQuery({
    queryKey: ['public-settings'],
    queryFn: getPublicSettings,
  });

  const settings = data?.data;
  const whatsappNumber = (settings?.whatsappBusinessNumber || '+919842416662').replace(/[^0-9]/g, '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-20">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-brand-red uppercase tracking-wider block">
          Corporate & Distribution Operations
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-text-main">
          Contact BR Films
        </h1>
        <p className="text-sm text-text-secondary max-w-xl mx-auto">
          Reach out to our theatrical desk for distribution rights, theatre booking, or commercial partnerships.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main info card */}
          <div className="bg-white p-8 rounded-2xl border border-border-subtle shadow-card space-y-6">
            <h2 className="font-display font-bold text-xl text-text-main border-l-3 border-brand-red pl-3">
              Trichy Head Office
            </h2>

            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-red-50 text-brand-red flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">
                    Headquarters
                  </span>
                  <p className="font-semibold text-text-main mt-0.5">
                    {settings?.officeAddress || 'No. 36, Block A 402, 4th Floor, Athreya Apartment, Williams Road, Cantonment'}
                  </p>
                  <p className="text-text-secondary text-xs">
                    {settings?.city || 'Trichy'}, {settings?.state || 'Tamil Nadu'} {settings?.postalCode || '620001'}, {settings?.country || 'India'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-brand-gold-dark flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">
                    Telephone
                  </span>
                  <a
                    href={`tel:${(settings?.contactPhone || '+919842416662').replace(/\s+/g, '')}`}
                    className="font-semibold text-text-main hover:text-brand-red mt-0.5 block"
                  >
                    {settings?.contactPhone || '+91 98424 16662'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-red-50 text-brand-red flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">
                    Official Email
                  </span>
                  <a
                    href={`mailto:${settings?.officialEmail || 'contact@brfilms.in'}`}
                    className="font-semibold text-text-main hover:text-brand-red mt-0.5 block"
                  >
                    {settings?.officialEmail || 'contact@brfilms.in'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-surface-light text-text-muted flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">
                    Office Hours
                  </span>
                  <p className="font-semibold text-text-main mt-0.5 text-xs">
                    {settings?.businessHours || 'Monday – Saturday: 9:30 AM – 7:00 PM IST'}
                  </p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Action */}
            <div className="pt-4 border-t border-border-subtle">
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hello%20BR%20Films%20Team,%20I%20would%20like%20to%20connect%20regarding%20theatrical%20distribution`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat via Official WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Quick Action & Google Maps */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Distribution Proposal Pitch Box */}
          <div className="bg-surface-warm border border-border-subtle rounded-2xl p-8 space-y-4">
            <span className="text-xs font-bold text-brand-red uppercase tracking-wider block">
              Direct Enquiry Channel
            </span>
            <h3 className="font-display font-bold text-2xl text-text-main">
              Have a Film Distribution or Theatrical Proposal?
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              For structured submissions with screen counts, circuit choices, and formal distributor follow-up, please utilize our formal Business Enquiry module.
            </p>
            <div>
              <Link
                to="/enquiry"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-brand-red text-white hover:bg-brand-red-hover shadow-cinema transition-all text-sm"
              >
                <span>Open Business Enquiry Form</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Location Map View */}
          <div className="bg-white p-4 rounded-2xl border border-border-subtle shadow-card">
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-xs font-bold text-text-main flex items-center gap-1.5 uppercase">
                <MapPin className="w-4 h-4 text-brand-red" />
                <span>Office Location</span>
              </span>

              {settings?.googleMapsUrl && (
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-brand-red hover:underline flex items-center gap-1"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Embedded interactive map iframe */}
            <div className="w-full h-72 rounded-xl overflow-hidden border border-border-subtle bg-surface-light">
              <iframe
                title="BR Films Office Map"
                src="https://maps.google.com/maps?q=Athreya+Apartment+Williams+Road+Cantonment+Trichy&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
