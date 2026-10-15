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

export interface ISiteSetting {
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
  
  heroTitle: string;
  heroSubtitle: string;
  heroBadgeText: string;
  heroBannerUrl?: string;
  heroPrimaryCtaText: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;

  socialLinks: ISocialLink[];
  services: IServiceItem[];
  whyChooseUs: IWhyUsItem[];

  defaultSeoTitle: string;
  defaultSeoDescription: string;
  ogImageUrl?: string;
  canonicalBaseUrl?: string;
}

export interface IPageSection {
  title: string;
  content: string;
}

export interface IWebsitePage {
  _id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  sections?: IPageSection[];
  isPublished: boolean;
  lastUpdatedBy?: string;
  updatedAt: string;
}
