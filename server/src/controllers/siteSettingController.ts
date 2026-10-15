import { Request, Response } from 'express';
import { SiteSetting, ISiteSetting } from '../models/SiteSetting.js';
import { AuthRequest } from '../middlewares/auth.js';
import { recordAuditLog } from '../services/auditService.js';

// Get or initialize singleton settings document
export const getOrCreateSettings = async (): Promise<ISiteSetting> => {
  let settings = await SiteSetting.findOne();
  if (!settings) {
    settings = await SiteSetting.create({
      socialLinks: [
        { platform: 'instagram', label: 'Instagram', url: 'https://instagram.com/brfilms', isEnabled: true },
        { platform: 'facebook', label: 'Facebook', url: 'https://facebook.com/brfilms', isEnabled: true },
        { platform: 'youtube', label: 'YouTube', url: 'https://youtube.com/@brfilms', isEnabled: true },
        { platform: 'x', label: 'X (Twitter)', url: 'https://x.com/brfilms', isEnabled: true },
      ],
      services: [
        {
          id: 'theatrical-distribution',
          title: 'Theatrical Film Distribution',
          shortDescription: 'Extensive theater network covering main cities and tier-2/3 circuits across Tamil Nadu and South India.',
          fullDescription: 'We maximize box office velocity through strategically planned screen counts, prime show allocations, and high-impact theater lobby branding.',
          iconName: 'Film',
          order: 1,
          isEnabled: true,
        },
        {
          id: 'territory-distribution',
          title: 'Territory-Based Distribution',
          shortDescription: 'Specialized distribution across key TN circuits: Chennai, Chengalpet, Coimbatore, Madurai, Trichy, TT & Salem.',
          fullDescription: 'Our deep local relationships with single-screen owners and multiplex chains guarantee optimized screen share in every circuit.',
          iconName: 'MapPin',
          order: 2,
          isEnabled: true,
        },
        {
          id: 'theatre-coordination',
          title: 'Theatre & Exhibitor Coordination',
          shortDescription: 'Seamless DCI server delivery, KDM management, daily collection reporting, and rapid settlement.',
          fullDescription: 'We provide prompt operational support, ensuring glitch-free digital cinema delivery (Qube, UFO, PXD) and timely settlement reports.',
          iconName: 'MonitorPlay',
          order: 3,
          isEnabled: true,
        },
        {
          id: 'film-acquisition',
          title: 'Film Acquisition & Producer Partnership',
          shortDescription: 'Fair, transparent commercial models and collaborative marketing campaigns with film producers.',
          fullDescription: 'Partnering with passionate filmmakers from script-level or rough-cut stages to curate bespoke distribution and promotional roadmaps.',
          iconName: 'Handshake',
          order: 4,
          isEnabled: true,
        },
      ],
      whyChooseUs: [
        {
          id: 'transparent-reporting',
          title: '100% Collection Transparency',
          description: 'Accurate, day-by-day DCR (Daily Collection Report) tracking and computerized accounting for every partner theater.',
          iconName: 'ShieldCheck',
        },
        {
          id: 'extensive-network',
          title: 'Vast Theatre Footprint',
          description: 'Direct exhibitor relationships spanning over 650+ screens across Tamil Nadu and neighboring circuits.',
          iconName: 'Building2',
        },
        {
          id: 'strategic-marketing',
          title: 'Impactful Theatrical Rollouts',
          description: 'Data-driven release scheduling, theater standees, promotional events, and high-visibility outdoor presence.',
          iconName: 'Sparkles',
        },
        {
          id: 'rapid-settlement',
          title: 'Dependable Financial Settlement',
          description: 'Prompt exhibitor dues recovery and swift weekly payout cycles to producers and rights owners.',
          iconName: 'Banknote',
        },
      ],
    });
  }
  return settings;
};

// ================= PUBLIC =================

export const getPublicSettings = async (_req: Request, res: Response): Promise<void> => {
  const settings = await getOrCreateSettings();

  // Public serializer: filter disabled social links and disabled services
  const publicData = {
    companyName: settings.companyName,
    officialLogoUrl: settings.officialLogoUrl,
    footerLogoUrl: settings.footerLogoUrl,
    tagline: settings.tagline,
    aboutDescription: settings.aboutDescription,
    mission: settings.mission,
    vision: settings.vision,
    officialEmail: settings.officialEmail,
    contactPhone: settings.contactPhone,
    whatsappBusinessNumber: settings.whatsappBusinessNumber,
    officeAddress: settings.officeAddress,
    city: settings.city,
    state: settings.state,
    postalCode: settings.postalCode,
    country: settings.country,
    googleMapsUrl: settings.googleMapsUrl,
    businessHours: settings.businessHours,
    copyrightText: settings.copyrightText,
    heroTitle: settings.heroTitle,
    heroSubtitle: settings.heroSubtitle,
    heroBadgeText: settings.heroBadgeText,
    heroBannerUrl: settings.heroBannerUrl,
    heroPrimaryCtaText: settings.heroPrimaryCtaText,
    heroPrimaryCtaLink: settings.heroPrimaryCtaLink,
    heroSecondaryCtaText: settings.heroSecondaryCtaText,
    heroSecondaryCtaLink: settings.heroSecondaryCtaLink,
    socialLinks: (settings.socialLinks || []).filter((s) => s.isEnabled),
    services: (settings.services || []).filter((s) => s.isEnabled).sort((a, b) => a.order - b.order),
    whyChooseUs: settings.whyChooseUs || [],
    defaultSeoTitle: settings.defaultSeoTitle,
    defaultSeoDescription: settings.defaultSeoDescription,
    ogImageUrl: settings.ogImageUrl,
    canonicalBaseUrl: settings.canonicalBaseUrl,
  };

  res.status(200).json({
    success: true,
    data: publicData,
  });
};

// ================= ADMIN =================

export const getAdminSettings = async (_req: AuthRequest, res: Response): Promise<void> => {
  const settings = await getOrCreateSettings();
  res.status(200).json({
    success: true,
    data: settings,
  });
};

export const updateAdminSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  const settings = await SiteSetting.findOneAndUpdate(
    {},
    { $set: req.body },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  await recordAuditLog({
    actorId: req.user?._id.toString(),
    actorEmail: req.user?.email || 'admin',
    action: 'SITE_SETTINGS_UPDATED',
    entityType: 'SiteSetting',
    entityId: settings._id.toString(),
    details: { updatedFields: Object.keys(req.body) },
    ipAddress: req.ip,
  });

  res.status(200).json({
    success: true,
    message: 'Company profile and website settings updated successfully in database.',
    data: settings,
  });
};
