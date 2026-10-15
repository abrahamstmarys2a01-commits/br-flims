import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Film,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Banknote,
  MapPin,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Play,
} from 'lucide-react';
import { getPublicMovies, getFeaturedMovies, getUpcomingMovies, getReleasedMovies } from '../../api/movies';
import { getPublicSettings } from '../../api/settings';
import { MovieCard } from '../../components/common/MovieCard';
import { SkeletonCard } from '../../components/common/SkeletonCard';

export const Home: React.FC = () => {
  // Queries
  const { data: settingsData } = useQuery({
    queryKey: ['public-settings'],
    queryFn: getPublicSettings,
  });

  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['movies-featured'],
    queryFn: getFeaturedMovies,
  });

  const { data: upcomingData, isLoading: upcomingLoading } = useQuery({
    queryKey: ['movies-upcoming'],
    queryFn: getUpcomingMovies,
  });

  const { data: releasedData, isLoading: releasedLoading } = useQuery({
    queryKey: ['movies-released'],
    queryFn: getReleasedMovies,
  });

  // Query most recently uploaded published movie for Hero spotlight
  const { data: recentMoviesData } = useQuery({
    queryKey: ['movies-recent-hero'],
    queryFn: () => getPublicMovies({ page: 1, limit: 1, sort: 'recent' }),
  });

  const settings = settingsData?.data;
  const featuredMovies = featuredData?.data || [];
  const upcomingMovies = upcomingData?.data || [];
  const releasedMovies = releasedData?.data || [];

  // Determine latest dynamic movie for spotlight
  const latestMovie =
    recentMoviesData?.data?.[0] || featuredMovies[0] || upcomingMovies[0] || releasedMovies[0];

  const heroImage =
    latestMovie?.bannerUrl ||
    latestMovie?.posterUrl ||
    settings?.heroBannerUrl ||
    '/logo.png';

  const heroTitle = latestMovie?.title || settings?.companyName || 'BR Films Distribution';

  const heroSubtitle =
    latestMovie?.shortDescription ||
    latestMovie?.synopsis ||
    settings?.heroSubtitle ||
    'High-impact cinematic distribution across premier multiplexes and single screens.';

  const heroBadge = latestMovie
    ? latestMovie.releaseStatus === 'Upcoming'
      ? 'Upcoming Theatrical Release'
      : 'Now In Theatres'
    : 'Studio Showcase';

  const heroLink = latestMovie ? `/movies/${latestMovie.slug}` : '/movies';

  // Priority: featured movies -> all published recent movies -> upcoming / released
  const displayFeaturedMovies =
    featuredMovies.length > 0
      ? featuredMovies
      : (recentMoviesData?.data && recentMoviesData.data.length > 0)
        ? recentMoviesData.data
        : upcomingMovies.length > 0
          ? upcomingMovies
          : releasedMovies;

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION (Light Cinematic Elegance) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface-warm via-white to-surface-light border-b border-border-subtle pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-brand-gold/40 text-brand-gold-dark text-xs font-bold tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                <span>{settings?.heroBadgeText || 'Tamil Nadu & Worldwide Theatrical Distribution'}</span>
              </div>

              {/* Heading */}
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-text-main tracking-tight leading-[1.12]">
                {settings?.heroTitle || 'Empowering Cinema. Elevating Theatrical Reach.'}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {settings?.heroSubtitle ||
                  'BR Films distributes prestigious Tamil feature films to premier screens across Tamil Nadu, Karnataka, and global circuits with transparent accounting and powerful theatrical promotions.'}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to={settings?.heroPrimaryCtaLink || '/movies'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-white bg-brand-red hover:bg-brand-red-hover shadow-cinema transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Film className="w-4 h-4 text-brand-gold-light" />
                  <span>{settings?.heroPrimaryCtaText || 'Explore Movies'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to={settings?.heroSecondaryCtaLink || '/enquiry'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-text-main bg-white hover:bg-surface-light border border-border-subtle shadow-xs hover:border-brand-gold/50 transition-all duration-200"
                >
                  <span>{settings?.heroSecondaryCtaText || 'Distribution Enquiry'}</span>
                </Link>
              </div>

              {/* Trust Metric Highlights */}
              <div className="pt-6 border-t border-border-subtle grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <span className="font-display font-black text-2xl text-brand-red block">10+</span>
                  <span className="text-xs text-text-muted font-medium">Screens Network</span>
                </div>
                <div>
                  <span className="font-display font-black text-2xl text-brand-gold-dark block">8+</span>
                  <span className="text-xs text-text-muted font-medium">TN Circuits</span>
                </div>
                <div>
                  <span className="font-display font-black text-2xl text-text-main block">100%</span>
                  <span className="text-xs text-text-muted font-medium">DCR Transparency</span>
                </div>
              </div>
            </div>

            {/* Right Hero Showcase (Dynamic Recent Movie Spotlight) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                {/* Background decorative gold frame glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-brand-gold/20 via-brand-red/10 to-brand-gold/30 rounded-2xl blur-lg"></div>

                <div className="relative rounded-2xl overflow-hidden bg-white border border-border-subtle shadow-card-hover group">
                  <Link to={heroLink} className="block relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-surface-dark">
                    <img
                      src={heroImage}
                      alt={heroTitle}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/logo.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-6 sm:p-7 text-white">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-gold text-brand-black text-[10px] font-black uppercase tracking-wider shadow-xs">
                          <Sparkles className="w-3 h-3" />
                          {heroBadge}
                        </span>
                        {latestMovie?.language && (
                          <span className="text-[11px] font-bold text-gray-200 bg-white/20 px-2 py-0.5 rounded backdrop-blur-xs">
                            {latestMovie.language}
                          </span>
                        )}
                        {latestMovie?.genres?.[0] && (
                          <span className="text-[11px] font-medium text-gray-300">
                            • {latestMovie.genres[0]}
                          </span>
                        )}
                      </div>

                      <h3 className="font-display font-black text-2xl sm:text-3xl mb-1.5 text-white line-clamp-2 leading-tight group-hover:text-brand-gold-light transition-colors">
                        {heroTitle}
                      </h3>

                      <p className="text-xs text-gray-300 line-clamp-2 mb-4 leading-relaxed font-light">
                        {heroSubtitle}
                      </p>

                      <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-gold-light group-hover:underline">
                        <span>{latestMovie ? 'Explore Movie Details' : 'View Complete Catalogue'}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED MOVIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-border-subtle pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-red uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studio Spotlight</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-text-main">
              Featured Theatrical Titles
            </h2>
          </div>
          <Link
            to="/movies"
            className="text-sm font-bold text-brand-red hover:text-brand-red-hover inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View Complete Catalogue</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : displayFeaturedMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayFeaturedMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-surface-light rounded-xl border border-dashed border-border-subtle">
            <Film className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <p className="font-medium text-text-secondary">No published theatrical movies in catalogue yet.</p>
          </div>
        )}
      </section>

      {/* 3. UPCOMING MOVIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-border-subtle pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold-dark uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5 text-brand-gold" />
              <span>Arriving Soon</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-text-main">
              Upcoming Theatrical Releases
            </h2>
          </div>
          <Link
            to="/upcoming"
            className="text-sm font-bold text-brand-red hover:text-brand-red-hover inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>See All Upcoming</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {upcomingLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : upcomingMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {upcomingMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-surface-light rounded-xl border border-dashed border-border-subtle">
            <p className="font-medium text-text-secondary">Check back soon for upcoming distribution announcements.</p>
          </div>
        )}
      </section>

      {/* 4. ABOUT BR FILMS PREVIEW SECTION */}
      <section className="bg-surface-warm/60 border-y border-border-subtle py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 text-center lg:text-left">
              <img
                src={settings?.officialLogoUrl || '/logo.png'}
                alt="BR Films"
                className="h-28 w-auto object-contain mx-auto lg:mx-0 mb-6 drop-shadow-sm"
              />
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gold-dark block mb-2">
                Tamil Film Distribution
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-text-main tracking-tight leading-snug">
                Passionate About Cinema. Dedicated to Theatrical Integrity.
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-6 text-text-secondary">
              <p className="text-base sm:text-lg leading-relaxed text-text-main font-medium">
                {settings?.aboutDescription ||
                  'BR Films is an established Tamil film distribution company connecting visionary producers, premier theatres, and cinema lovers across Tamil Nadu, Karnataka and global circuits.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white p-4 rounded-xl border border-border-subtle shadow-xs">
                  <h4 className="font-bold text-text-main text-sm flex items-center gap-2 mb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Our Mission</span>
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {settings?.mission ||
                      'To maximize theatrical screen reach, maintain utmost collection transparency, and deliver memorable cinema experiences.'}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-border-subtle shadow-xs">
                  <h4 className="font-bold text-text-main text-sm flex items-center gap-2 mb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                    <span>Our Vision</span>
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {settings?.vision ||
                      'To stand as the most trusted, artist-friendly, and exhibitor-respected distribution banner in South Indian cinema.'}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-red hover:text-brand-red-hover"
                >
                  <span>Learn more about our company profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DISTRIBUTION SERVICES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-brand-red uppercase tracking-wider block mb-2">
            Professional Cinema Services
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-text-main">
            Comprehensive Theatrical Distribution
          </h2>
          <p className="text-sm text-text-secondary mt-3">
            Tailored distribution strategies for single-screens, multiplexes, and international theatrical circuits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(settings?.services || []).map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl p-6 border border-border-subtle shadow-card hover:shadow-card-hover hover:border-brand-gold transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-surface-warm border border-brand-gold/30 flex items-center justify-center text-brand-gold-dark mb-4">
                  <Film className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-text-main mb-2">
                  {service.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {service.shortDescription}
                </p>
              </div>

              <Link
                to="/services"
                className="mt-5 pt-3 border-t border-border-subtle text-xs font-bold text-brand-red hover:text-brand-red-hover inline-flex items-center gap-1"
              >
                <span>Read Service Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6. WHY WORK WITH BR FILMS */}
      <section className="bg-surface-light py-16 border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-brand-gold-dark uppercase tracking-wider block mb-2">
              Why Filmmakers & Exhibitors Choose Us
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-text-main">
              The BR Films Difference
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(settings?.whyChooseUs || []).map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-xl border border-border-subtle shadow-xs"
              >
                <div className="w-10 h-10 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center font-bold mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-text-main mb-2">{item.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BUSINESS PARTNERSHIP CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-brand-red via-brand-red-hover to-[#821323] text-white p-8 sm:p-12 lg:p-16 shadow-cinema">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold-light block mb-2">
              Collaborate With BR Films
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight mb-4">
              Have a Film to Distribute or Screens to Partner?
            </h2>
            <p className="text-sm sm:text-base text-red-100 mb-8 leading-relaxed">
              We welcome film producers, theatre managers, single-screen exhibitors, and multiplex chains to partner with us for upcoming cinematic ventures across Tamil Nadu and global circuits.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/enquiry"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-brand-red bg-white hover:bg-surface-warm transition-all shadow-md transform hover:-translate-y-0.5"
              >
                <span>Submit Distribution Proposal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white border border-white/30 hover:bg-white/10 transition-colors"
              >
                <span>Contact Official Desk</span>
              </Link>
            </div>
          </div>

          {/* Decorative Film Reel Silhouette */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
            <img src="/logo.png" alt="" className="w-96 h-96 object-contain" />
          </div>
        </div>
      </section>
    </div>
  );
};
