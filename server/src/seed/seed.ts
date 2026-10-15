import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../config/db.js';
import { AdminUser } from '../models/AdminUser.js';
import { Movie } from '../models/Movie.js';
import { SiteSetting } from '../models/SiteSetting.js';
import { WebsitePage } from '../models/WebsitePage.js';
import { INITIAL_ADMIN, INITIAL_MOVIES, INITIAL_PAGES } from './seedData.js';

export const runSeed = async () => {
  console.log('=== Starting BR Films Database Seed ===');
  await connectDB();

  // 1. Seed or preserve Super Admin
  const existingAdmin = await AdminUser.findOne({ email: INITIAL_ADMIN.email });
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(INITIAL_ADMIN.password, salt);
    await AdminUser.create({
      name: INITIAL_ADMIN.name,
      email: INITIAL_ADMIN.email,
      passwordHash,
      role: INITIAL_ADMIN.role,
      isActive: true,
    });
    console.log(`[Seed] Superadmin created: ${INITIAL_ADMIN.email} (Password: ${INITIAL_ADMIN.password})`);
  } else {
    console.log(`[Seed] Superadmin already exists (${existingAdmin.email}) - preserving existing account.`);
  }

  // 2. Seed Movies idempotently (only if not existing by slug)
  for (const movieData of INITIAL_MOVIES) {
    const existing = await Movie.findOne({ slug: movieData.slug });
    if (!existing) {
      await Movie.create(movieData);
      console.log(`[Seed] Created movie record: "${movieData.title}" (${movieData.slug})`);
    } else {
      console.log(`[Seed] Movie "${movieData.title}" already exists - preserving administrator edits.`);
    }
  }

  // 3. Seed Site Settings if not present
  const existingSettings = await SiteSetting.findOne();
  if (!existingSettings) {
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
      heroBannerUrl: '/uploads/movies/train.webp',
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
    console.log('[Seed] Default site settings initialized.');
  } else {
    console.log('[Seed] Site settings already exist - preserving settings.');
  }

  // 4. Seed Website Pages if not present
  for (const pageData of INITIAL_PAGES) {
    const existing = await WebsitePage.findOne({ slug: pageData.slug });
    if (!existing) {
      await WebsitePage.create(pageData);
      console.log(`[Seed] Created page template: "${pageData.title}" (${pageData.slug})`);
    } else {
      console.log(`[Seed] Page "${pageData.title}" already exists - preserving content.`);
    }
  }

  console.log('=== Database Seeding Completed Successfully ===');
};

// Allow direct execution
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  runSeed()
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('Seed execution error:', err);
      await disconnectDB();
      process.exit(1);
    });
}
