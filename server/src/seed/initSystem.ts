import bcrypt from 'bcryptjs';
import { AdminUser } from '../models/AdminUser.js';
import { SiteSetting } from '../models/SiteSetting.js';
import { WebsitePage } from '../models/WebsitePage.js';
import { INITIAL_ADMIN, INITIAL_PAGES } from './seedData.js';
import { syncDefaultAssetsToCluster } from '../services/clusterStorageService.js';

/**
 * Initializes minimal operational requirements (Admin account and baseline settings).
 * DOES NOT populate mock movies. Movie catalog is 100% driven by database entries.
 */
export const initSystem = async () => {
  console.log('[System Init] Checking baseline database requirements in MongoDB Atlas...');

  // 1. Ensure Super Admin account exists for admin dashboard access
  const adminCount = await AdminUser.countDocuments();
  if (adminCount === 0) {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(INITIAL_ADMIN.password, salt);
    await AdminUser.create({
      name: INITIAL_ADMIN.name,
      email: INITIAL_ADMIN.email,
      passwordHash,
      role: 'superadmin',
      isActive: true,
    });
    console.log(`[System Init] Created initial superadmin in MongoDB Atlas: ${INITIAL_ADMIN.email}`);
  } else {
    console.log(`[System Init] Admin accounts verified (${adminCount} registered in MongoDB Atlas).`);
  }

  // 2. Ensure baseline Site Settings exist if empty
  const settingsCount = await SiteSetting.countDocuments();
  if (settingsCount === 0) {
    await SiteSetting.create({
      companyName: 'BR Films',
      officialLogoUrl: '/uploads/logos/br-films-logo.png',
      footerLogoUrl: '/uploads/logos/br-films-logo.png',
      tagline: 'Premier Tamil Film Distribution & Theatrical Showcase',
      officialEmail: 'contact@brfilms.in',
      contactPhone: '+91 98424 16662',
      whatsappBusinessNumber: '+91 98424 16662',
      officeAddress: 'No. 36, Block A 402, 4th Floor, Athreya Apartment, Williams Road, Cantonment',
      city: 'Trichy',
      state: 'Tamil Nadu',
      postalCode: '620001',
      country: 'India',
      googleMapsUrl: 'https://maps.google.com/?q=Athreya+Apartment+Williams+Road+Cantonment+Trichy',
      businessHours: 'Monday – Saturday: 9:30 AM – 7:00 PM IST',
      copyrightText: '© 2026 BR Films. All Rights Reserved. Dedicated to Tamil Cinema.',
      heroTitle: 'Empowering Cinema. Elevating Theatrical Reach.',
      heroSubtitle: 'BR Films distributes prestigious Tamil feature films to premier screens across Tamil Nadu, Karnataka, and global circuits.',
      heroBadgeText: 'Tamil Nadu & Worldwide Theatrical Distribution',
      heroPrimaryCtaText: 'Explore Movies',
      heroPrimaryCtaLink: '/movies',
      heroSecondaryCtaText: 'Distribution Enquiry',
      heroSecondaryCtaLink: '/enquiry',
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
          shortDescription: 'Extensive theatre network covering prime cities and tier-2/3 circuits across Tamil Nadu and South India.',
          fullDescription: 'We maximize box office velocity through strategically planned screen counts, prime show allocations, and high-impact theatre lobby branding.',
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
          description: 'Data-driven release scheduling, theatre standees, promotional events, and high-visibility outdoor presence.',
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
    console.log('[System Init] Baseline site settings created in MongoDB Atlas.');
  }

  // 3. Ensure baseline Website Pages exist if empty
  const pagesCount = await WebsitePage.countDocuments();
  if (pagesCount === 0) {
    for (const pageData of INITIAL_PAGES) {
      await WebsitePage.create(pageData);
    }
    console.log('[System Init] Baseline legal & policy pages created in MongoDB Atlas.');
  }

  // 4. Synchronize default brand assets (e.g. logo) to MongoDB Atlas GridFS Cluster
  await syncDefaultAssetsToCluster();

  console.log('[System Init] Ready. No mock movies seeded. Catalog is purely managed via Database.');
};
