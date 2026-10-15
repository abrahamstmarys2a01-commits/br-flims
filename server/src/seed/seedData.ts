export const INITIAL_ADMIN = {
  name: 'BR Films Administrator',
  email: 'admin@brfilms.in',
  password: 'Admin@BRFilms2026',
  role: 'superadmin' as const,
};

export const INITIAL_MOVIES = [
  {
    title: 'Lenin Pandiyan',
    slug: 'lenin-pandiyan',
    shortDescription:
      'High-impact Tamil action drama directed by D.D. Balachandran featuring musical maestro Ilaiyaraaja and starring Natty.',
    synopsis:
      'Lenin Pandiyan is an emotionally charged socio-political drama directed by D.D. Balachandran. Starring Natty (Natraj Subramaniam) as a fiercely committed law enforcer navigating complex agrarian struggles and administrative battles in rural Tamil Nadu. With an evocative original musical score composed by Isaignani Ilaiyaraaja and presented by Sathya Jyothi Films, this theatrical release promises pulse-racing tension and resonant social commentary.',
    posterUrl: '/uploads/movies/lenin-pandiyan.webp',
    bannerUrl: '/uploads/movies/lenin-pandiyan.webp',
    galleryImages: ['/uploads/movies/lenin-pandiyan.webp'],
    trailerUrl: '',
    language: 'Tamil',
    genres: ['Action', 'Drama', 'Thriller'],
    cast: [
      { name: 'Natty (Natraj Subramaniam)', role: 'Lead Actor', character: 'Lenin Pandiyan' },
      { name: 'Saravanan', role: 'Supporting Cast' },
    ],
    crew: [
      { name: 'D.D. Balachandran', role: 'Writer & Director' },
      { name: 'Isaignani Ilaiyaraaja', role: 'Music Composer' },
      { name: 'A.M. Edwin Sakay', role: 'Director of Photography (DOP)' },
      { name: 'Nagooran Ramachandran', role: 'Editor' },
      { name: 'Sendhil Thyagarajan & Arjun Thyagarajan', role: 'Producers' },
      { name: 'T.G. Thyagarajan', role: 'Presenter (Sathya Jyothi Films)' },
    ],
    durationMinutes: 142,
    releaseDate: new Date('2026-09-25T00:00:00.000Z'),
    releaseDateConfirmed: true,
    releaseStatus: 'Upcoming' as const,
    distributionTerritories: ['Tamil Nadu', 'Karnataka', 'Worldwide'],
    isFeatured: true,
    publicationStatus: 'Published' as const,
    seoTitle: 'Lenin Pandiyan Movie - Theatrical Release | BR Films',
    seoDescription:
      'Official distribution details and theatrical release dates for Lenin Pandiyan directed by D.D. Balachandran with music by Ilaiyaraaja.',
  },
  {
    title: 'Train',
    slug: 'train',
    shortDescription:
      'Upcoming high-octane edge-of-the-seat crime thriller starring Vijay Sethupathi, directed by acclaimed auteur Mysskin.',
    synopsis:
      'Train is an upcoming high-intensity crime action thriller crafted by visionary filmmaker Mysskin. Powerhouse performer Vijay Sethupathi stars in a raw, commanding role amidst a perilous locomotive journey filled with relentless adversaries and suspense. Presented by veteran producer Kalaippuli S. Thanu under V Creations and Street Light.',
    posterUrl: '/uploads/movies/train.webp',
    bannerUrl: '/uploads/movies/train.webp',
    galleryImages: ['/uploads/movies/train.webp'],
    trailerUrl: '',
    language: 'Tamil',
    genres: ['Action', 'Thriller', 'Crime'],
    cast: [
      { name: 'Vijay Sethupathi', role: 'Lead Actor' },
      { name: 'Fowzia Fathima', role: 'Cast & Crew' },
    ],
    crew: [
      { name: 'Mysskin', role: 'Writer & Director' },
      { name: 'Kalaippuli S. Thanu', role: 'Producer (V Creations)' },
    ],
    durationMinutes: undefined,
    releaseDate: undefined,
    releaseDateConfirmed: false,
    releaseStatus: 'Upcoming' as const,
    distributionTerritories: ['Tamil Nadu', 'Worldwide'],
    isFeatured: true,
    publicationStatus: 'Published' as const,
    seoTitle: 'Train (Vijay Sethupathi - Mysskin) | BR Films Distribution',
    seoDescription:
      'Upcoming Vijay Sethupathi starrer Train directed by Mysskin. Official updates and theatrical distribution information by BR Films.',
  },
];

export const INITIAL_PAGES = [
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    subtitle: 'How BR Films collects, uses, and protects your information',
    content:
      'BR Films is committed to safeguarding the privacy and confidentiality of our website visitors, theater partners, film producers, and exhibitors. This Privacy Policy details the types of information we collect, how it is processed, and your rights.',
    sections: [
      {
        title: '1. Information We Collect',
        content:
          'When you interact with our website or submit a business enquiry, we may collect your full name, theatre or company name, email address, mobile phone number, location or territorial interest, and project details.',
      },
      {
        title: '2. Purpose of Processing',
        content:
          'We use the collected information exclusively to evaluate film distribution proposals, coordinate theater screening schedules, respond to partnership enquiries, and communicate critical theatrical updates.',
      },
      {
        title: '3. Data Security and Confidentiality',
        content:
          'BR Films implements robust industry-standard technical measures to prevent unauthorized data access, leakage, or alteration. We do not sell, rent, or trade your personal or commercial enquiry details to third parties.',
      },
      {
        title: '4. Contact for Privacy Inquiries',
        content:
          'If you have questions regarding this Privacy Policy or wish to request data updates, please contact our team at contact@brfilms.in.',
      },
    ],
    isPublished: true,
  },
  {
    slug: 'terms-of-use',
    title: 'Terms of Use',
    subtitle: 'Terms governing the access and use of the BR Films distribution platform',
    content:
      'Welcome to BR Films. By accessing or using this website, you agree to comply with and be bound by the following terms and conditions of use.',
    sections: [
      {
        title: '1. Intellectual Property Rights',
        content:
          'All film posters, trailers, trademarks, logos, audio-visual materials, and written content displayed on this website are the property of BR Films, partner production houses, or respective licensors and are protected under Indian and international copyright laws.',
      },
      {
        title: '2. Permitted Use',
        content:
          'Visitors and industry partners may view and share authorized promotional materials for discovery purposes. Reproduction, unauthorized distribution, or modification of intellectual property without written consent is strictly prohibited.',
      },
      {
        title: '3. Business Proposals & Submissions',
        content:
          'Submitting an enquiry or script proposal through this portal does not constitute a binding distribution contract until formal legal agreements are executed by authorized representatives.',
      },
      {
        title: '4. Governing Law and Jurisdiction',
        content:
          'These Terms of Use are governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of the website shall be subject to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu.',
      },
    ],
    isPublished: true,
  },
];
