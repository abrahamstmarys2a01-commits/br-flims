import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  ExternalLink,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getPublicSettings } from '../../api/settings';

export const Footer: React.FC = () => {
  const { data } = useQuery({
    queryKey: ['public-settings'],
    queryFn: getPublicSettings,
    staleTime: 1000 * 60 * 5, // 5 mins
  });

  const settings = data?.data;

  const socialIconMap: Record<string, React.ReactNode> = {
    instagram: <Instagram className="w-5 h-5" />,
    facebook: <Facebook className="w-5 h-5" />,
    youtube: <Youtube className="w-5 h-5" />,
    linkedin: <Linkedin className="w-5 h-5" />,
    x: <Twitter className="w-5 h-5" />,
  };

  const whatsappNumber = (settings?.whatsappBusinessNumber || '+919842416662').replace(/[^0-9]/g, '');

  return (
    <footer className="bg-surface-warm border-t border-border-subtle pt-16 pb-10 text-text-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img
                src={settings?.officialLogoUrl || '/logo.png'}
                alt={settings?.companyName || 'BR Films'}
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed">
              {settings?.tagline || 'Premier Tamil Film Distribution & Theatrical Showcase across Tamil Nadu, Karnataka and Worldwide.'}
            </p>
            <p className="text-xs text-text-muted">
              {settings?.aboutDescription?.slice(0, 150)}...
            </p>

            {/* Social Channels */}
            {settings?.socialLinks && settings.socialLinks.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-2">
                  Follow Our Releases
                </span>
                <div className="flex items-center gap-2">
                  {settings.socialLinks.map((social) => (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white border border-border-subtle text-text-secondary hover:text-brand-red hover:border-brand-red transition-all"
                      aria-label={social.label}
                    >
                      {socialIconMap[social.platform] || <ExternalLink className="w-5 h-5" />}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="font-display font-bold text-base text-text-main uppercase tracking-wider mb-4 border-l-2 border-brand-red pl-2.5">
              Explore Cinema
            </h4>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              <li>
                <Link to="/movies" className="hover:text-brand-red transition-colors flex items-center gap-1.5">
                  • Film Catalogue
                </Link>
              </li>
              <li>
                <Link to="/upcoming" className="hover:text-brand-red transition-colors flex items-center gap-1.5">
                  • Upcoming Theatrical Releases
                </Link>
              </li>
              <li>
                <Link to="/released" className="hover:text-brand-red transition-colors flex items-center gap-1.5">
                  • Latest Released Movies
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-brand-red transition-colors flex items-center gap-1.5">
                  • Distribution & Circuit Coverage
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-red transition-colors flex items-center gap-1.5">
                  • About BR Films
                </Link>
              </li>
              <li>
                <Link to="/enquiry" className="hover:text-brand-red transition-colors font-semibold text-brand-red flex items-center gap-1.5">
                  • Exhibitor / Producer Enquiry →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Distribution Circuits */}
          <div>
            <h4 className="font-display font-bold text-base text-text-main uppercase tracking-wider mb-4 border-l-2 border-brand-gold pl-2.5">
              Tamil Nadu Circuits
            </h4>
            <ul className="space-y-1.5 text-xs text-text-secondary">
              <li>• Chennai City Multiplexes & Single Screens</li>
              <li>• Chengalpet Circuit & Kanchipuram</li>
              <li>• Coimbatore, Tirupur, Erode, Nilgiris</li>
              <li>• Madurai, Ramanathapuram, Dindigul</li>
              <li>• Trichy, Thanjavur & Central Circuits</li>
              <li>• Tirunelveli, Kanyakumari & South Circuits</li>
              <li>• Salem & Dharmapuri Theatres</li>
              <li>• Karnataka, Bangalore & ROI Theatricals</li>
            </ul>

            <div className="mt-4 pt-3 border-t border-border-subtle">
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hello%20BR%20Films,%20I%20would%20like%20to%20enquire%20about%20theatrical%20distribution`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Theatrical Desk</span>
              </a>
            </div>
          </div>

          {/* Col 4: Corporate Office */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-base text-text-main uppercase tracking-wider mb-4 border-l-2 border-brand-red pl-2.5">
              Contact Desk
            </h4>

            <div className="flex items-start gap-2.5 text-xs text-text-secondary">
              <MapPin className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
              <span>
                {settings?.officeAddress || 'No.36 block A,402,4th Floor,Athreya Apartment,Williams Road,Contonment'}, {settings?.city || 'Trichy'}, {settings?.state || 'Tamil Nadu'} {settings?.postalCode || '620001'}
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-text-secondary">
              <Phone className="w-4 h-4 text-brand-red shrink-0" />
              <a href={`tel:${(settings?.contactPhone || '+919842416662').replace(/\s+/g, '')}`} className="hover:text-brand-red">
                {settings?.contactPhone || '+91 98424 16662'}
              </a>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-text-secondary">
              <Mail className="w-4 h-4 text-brand-red shrink-0" />
              <a href={`mailto:${settings?.officialEmail || 'contact@brfilms.in'}`} className="hover:text-brand-red">
                {settings?.officialEmail || 'contact@brfilms.in'}
              </a>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-text-muted pt-1">
              <Clock className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
              <span>{settings?.businessHours || 'Monday – Saturday: 9:30 AM – 7:00 PM IST'}</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright & legal bar */}
        <div className="mt-12 pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>{settings?.copyrightText || '© 2026 BR Films. All Rights Reserved.'}</p>

          <div className="flex items-center space-x-4">
            <Link to="/privacy-policy" className="hover:text-text-main transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-text-main transition-colors">
              Terms of Use
            </Link>
            <span>•</span>
            <a
              href={import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174'}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-red transition-colors font-medium"
            >
              Admin CMS
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
