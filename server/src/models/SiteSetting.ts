import mongoose, { Document, Schema } from 'mongoose';

export interface ISocialLink {
  platform: 'instagram' | 'facebook' | 'youtube' | 'linkedin' | 'x' | 'other';
  label: string;
  url: string;
  isEnabled: boolean;
}

export interface IServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  order: number;
  isEnabled: boolean;
}

export interface IWhyUsItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface ISiteSetting extends Document {
  companyName: string;
  officialLogoUrl: string;
  footerLogoUrl?: string;
  tagline: string;
  aboutDescription: string;
  mission: string;
  vision: string;
  officialEmail: string;
  contactPhone: string;
  whatsappBusinessNumber: string;
  officeAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  googleMapsUrl?: string;
  businessHours: string;
  copyrightText: string;
  
  // Hero settings
  heroTitle: string;
  heroSubtitle: string;
  heroBadgeText: string;
  heroBannerUrl?: string;
  heroPrimaryCtaText: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;

  // Social Links
  socialLinks: ISocialLink[];

  // Distribution services list
  services: IServiceItem[];

  // Why choose us
  whyChooseUs: IWhyUsItem[];

  // SEO Settings
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  ogImageUrl?: string;
  canonicalBaseUrl?: string;

  updatedAt: Date;
}

const SiteSettingSchema = new Schema<ISiteSetting>(
  {
    companyName: {
      type: String,
      default: 'BR Films',
      required: true,
      trim: true,
    },
    officialLogoUrl: {
      type: String,
      default: '/uploads/logos/br-films-logo.png',
      required: true,
    },
    footerLogoUrl: {
      type: String,
      default: '/uploads/logos/br-films-logo.png',
    },
    tagline: {
      type: String,
      default: 'Premier Tamil Film Distribution & Theatrical Showcase',
      trim: true,
    },
    aboutDescription: {
      type: String,
      default:
        'BR Films is a forward-thinking Tamil film distribution house dedicated to taking compelling cinematic stories to theatrical screens across Tamil Nadu and beyond. We build transparent, robust partnerships with visionary producers and premier theatre exhibitors.',
    },
    mission: {
      type: String,
      default:
        'To empower film creators by maximizing theatrical reach, maintaining utmost transparency in box-office collections, and delivering superior cinema experiences to moviegoers.',
    },
    vision: {
      type: String,
      default:
        'To stand as the most trusted, artist-friendly, and exhibitor-respected distribution banner in South Indian cinema.',
    },
    officialEmail: {
      type: String,
      default: 'contact@brfilms.in',
      trim: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      default: '+91 98424 16662',
      trim: true,
    },
    whatsappBusinessNumber: {
      type: String,
      default: '+91 98424 16662',
      trim: true,
    },
    officeAddress: {
      type: String,
      default: 'No. 36, Block A 402, 4th Floor, Athreya Apartment, Williams Road, Cantonment',
      trim: true,
    },
    city: {
      type: String,
      default: 'Trichy',
      trim: true,
    },
    state: {
      type: String,
      default: 'Tamil Nadu',
      trim: true,
    },
    postalCode: {
      type: String,
      default: '620001',
      trim: true,
    },
    country: {
      type: String,
      default: 'India',
      trim: true,
    },
    googleMapsUrl: {
      type: String,
      default: 'https://maps.google.com/?q=Athreya+Apartment+Williams+Road+Cantonment+Trichy',
    },
    businessHours: {
      type: String,
      default: 'Monday – Saturday: 9:30 AM – 7:00 PM IST',
    },
    copyrightText: {
      type: String,
      default: '© 2026 BR Films. All Rights Reserved. Dedicated to Tamil Cinema.',
    },
    heroTitle: {
      type: String,
      default: 'Empowering Cinema. Elevating Theatrical Reach.',
    },
    heroSubtitle: {
      type: String,
      default:
        'BR Films distributes prestigious Tamil feature films to premier screens across Tamil Nadu, Karnataka, and global circuits with state-of-the-art marketing and seamless theatre operations.',
    },
    heroBadgeText: {
      type: String,
      default: 'Tamil Nadu & Worldwide Theatrical Distribution',
    },
    heroBannerUrl: {
      type: String,
      default: '/uploads/movies/train.webp',
    },
    heroPrimaryCtaText: {
      type: String,
      default: 'Explore Movies',
    },
    heroPrimaryCtaLink: {
      type: String,
      default: '/movies',
    },
    heroSecondaryCtaText: {
      type: String,
      default: 'Distribution Enquiry',
    },
    heroSecondaryCtaLink: {
      type: String,
      default: '/enquiry',
    },
    socialLinks: [
      {
        platform: { type: String, required: true },
        label: { type: String, required: true },
        url: { type: String, required: true },
        isEnabled: { type: Boolean, default: true },
      },
    ],
    services: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        shortDescription: { type: String, required: true },
        fullDescription: { type: String, required: true },
        iconName: { type: String, default: 'Film' },
        order: { type: Number, default: 0 },
        isEnabled: { type: Boolean, default: true },
      },
    ],
    whyChooseUs: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        iconName: { type: String, default: 'Award' },
      },
    ],
    defaultSeoTitle: {
      type: String,
      default: 'BR Films | Premier Tamil Film Distribution & Cinema House',
    },
    defaultSeoDescription: {
      type: String,
      default:
        'BR Films is an established Tamil film distribution company connecting visionary producers, premier theatres, and cinema lovers across Tamil Nadu, Karnataka and overseas.',
    },
    ogImageUrl: {
      type: String,
      default: '/uploads/logos/br-films-logo.png',
    },
    canonicalBaseUrl: {
      type: String,
      default: 'https://brfilms.in',
    },
  },
  {
    timestamps: true,
  }
);

export const SiteSetting = mongoose.model<ISiteSetting>('SiteSetting', SiteSettingSchema);
