import { z } from 'zod';

const socialLinkSchema = z.object({
  platform: z.enum(['instagram', 'facebook', 'youtube', 'linkedin', 'x', 'other']),
  label: z.string().min(1).trim(),
  url: z.string().url('Must be a valid URL').trim(),
  isEnabled: z.boolean(),
});

const serviceItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).trim(),
  shortDescription: z.string().min(1).trim(),
  fullDescription: z.string().min(1).trim(),
  iconName: z.string().default('Film'),
  order: z.number().default(0),
  isEnabled: z.boolean().default(true),
});

const whyUsItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).trim(),
  description: z.string().min(1).trim(),
  iconName: z.string().default('Award'),
});

export const updateSiteSettingSchema = z.object({
  companyName: z.string().min(1).max(100).optional(),
  officialLogoUrl: z.string().min(1).optional(),
  footerLogoUrl: z.string().optional(),
  tagline: z.string().max(250).optional(),
  aboutDescription: z.string().max(2500).optional(),
  mission: z.string().max(1000).optional(),
  vision: z.string().max(1000).optional(),
  officialEmail: z.string().email().optional(),
  contactPhone: z.string().max(30).optional(),
  whatsappBusinessNumber: z.string().max(30).optional(),
  officeAddress: z.string().max(300).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().max(100).optional(),
  googleMapsUrl: z.string().url().optional().or(z.literal('')),
  businessHours: z.string().max(150).optional(),
  copyrightText: z.string().max(250).optional(),
  
  heroTitle: z.string().max(250).optional(),
  heroSubtitle: z.string().max(1000).optional(),
  heroBadgeText: z.string().max(150).optional(),
  heroBannerUrl: z.string().optional(),
  heroPrimaryCtaText: z.string().max(50).optional(),
  heroPrimaryCtaLink: z.string().max(100).optional(),
  heroSecondaryCtaText: z.string().max(50).optional(),
  heroSecondaryCtaLink: z.string().max(100).optional(),

  socialLinks: z.array(socialLinkSchema).optional(),
  services: z.array(serviceItemSchema).optional(),
  whyChooseUs: z.array(whyUsItemSchema).optional(),

  defaultSeoTitle: z.string().max(120).optional(),
  defaultSeoDescription: z.string().max(300).optional(),
  ogImageUrl: z.string().optional(),
  canonicalBaseUrl: z.string().url().optional(),
});
