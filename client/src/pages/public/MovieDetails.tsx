import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  Clock,
  Globe2,
  Film,
  MapPin,
  Share2,
  Play,
  ArrowLeft,
  Sparkles,
  UserCheck,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { getMovieBySlug } from '../../api/movies';
import { MovieCard } from '../../components/common/MovieCard';

export const MovieDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movie-details', slug],
    queryFn: () => getMovieBySlug(slug!),
    enabled: !!slug,
  });

  const movie = data?.data;
  const related = data?.related || [];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-semibold text-text-secondary">Loading movie showcase...</p>
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Film className="w-16 h-16 text-text-muted mx-auto mb-4" />
        <h2 className="font-display font-bold text-2xl text-text-main mb-2">Movie Not Found</h2>
        <p className="text-sm text-text-secondary mb-6">
          The requested movie record could not be found or has not been published yet.
        </p>
        <Link
          to="/movies"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold bg-brand-red text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Catalogue
        </Link>
      </div>
    );
  }

  const formattedDate = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : movie.releaseDateConfirmed
    ? 'To Be Announced'
    : 'Coming Soon (Date Unconfirmed)';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${movie.title} | BR Films Theatrical Distribution`,
        text: movie.shortDescription || `Check out ${movie.title} distributed by BR Films`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Movie link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* 1. MOVIE BANNER & HEADER */}
      <section className="relative bg-surface-warm/80 border-b border-border-subtle pt-6 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back breadcrumb */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              to="/movies"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-brand-red transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Movies Catalogue
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-text-main bg-white border border-border-subtle hover:bg-surface-light shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5 text-brand-red" />
              <span>Share Movie</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: 2:3 Official Portrait Poster */}
            <div className="lg:col-span-4 max-w-sm mx-auto lg:max-w-none w-full">
              <div className="rounded-2xl overflow-hidden bg-white border border-border-subtle shadow-card-hover relative group">
                <div className="aspect-[2/3] w-full">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {movie.isFeatured && (
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-brand-gold text-white shadow-md">
                      <Sparkles className="w-3 h-3" /> Featured Studio Title
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Key Details & Booking / Enquiry Box */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      movie.releaseStatus === 'Released'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-brand-red text-white'
                    }`}
                  >
                    {movie.releaseStatus}
                  </span>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-text-secondary border border-border-subtle">
                    {movie.language}
                  </span>

                  {movie.genres &&
                    movie.genres.map((g) => (
                      <span
                        key={g}
                        className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-brand-gold-dark border border-amber-200"
                      >
                        {g}
                      </span>
                    ))}
                </div>

                <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-text-main tracking-tight leading-tight">
                  {movie.title}
                </h1>

                {movie.shortDescription && (
                  <p className="text-base text-text-secondary mt-3 leading-relaxed">
                    {movie.shortDescription}
                  </p>
                )}
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 rounded-xl bg-white border border-border-subtle shadow-xs">
                <div>
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                    Release Date
                  </span>
                  <span className="text-sm font-bold text-text-main mt-0.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-brand-red shrink-0" />
                    {formattedDate}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                    Runtime
                  </span>
                  <span className="text-sm font-bold text-text-main mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-brand-gold shrink-0" />
                    {movie.durationMinutes ? `${movie.durationMinutes} Minutes` : 'TBA'}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                    Language
                  </span>
                  <span className="text-sm font-bold text-text-main mt-0.5 flex items-center gap-1.5">
                    <Globe2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    {movie.language}
                  </span>
                </div>
              </div>

              {/* Distribution Circuit Badges */}
              {movie.distributionTerritories && movie.distributionTerritories.length > 0 && (
                <div className="p-4 rounded-xl bg-surface-light border border-border-subtle">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-text-main uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-brand-red" />
                    <span>Distribution Circuits & Territories</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {movie.distributionTerritories.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white border border-border-subtle text-text-secondary"
                      >
                        ✓ {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Business Partnership CTA Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <Link
                  to={`/enquiry?movie=${encodeURIComponent(movie.title)}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-brand-red hover:bg-brand-red-hover shadow-cinema transition-all"
                >
                  <Building className="w-4 h-4 text-brand-gold-light" />
                  <span>Submit Exhibitor Enquiry For This Film</span>
                </Link>

                {movie.trailerUrl && (
                  <a
                    href={movie.trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-text-main bg-white border border-border-subtle hover:bg-surface-light transition-colors"
                  >
                    <Play className="w-4 h-4 text-brand-red fill-current" />
                    <span>Watch Official Trailer</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SYNOPSIS & CREDITS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Synopsis */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2 className="font-display font-bold text-2xl text-text-main mb-3 border-l-3 border-brand-red pl-3">
                Synopsis & Narrative
              </h2>
              <div className="text-sm sm:text-base text-text-secondary leading-relaxed bg-white p-6 rounded-xl border border-border-subtle shadow-xs space-y-3">
                <p>{movie.synopsis || movie.shortDescription || 'Synopsis details will be updated shortly.'}</p>
              </div>
            </div>

            {/* Gallery Images */}
            {movie.galleryImages && movie.galleryImages.length > 1 && (
              <div>
                <h3 className="font-display font-bold text-xl text-text-main mb-3 border-l-3 border-brand-gold pl-3">
                  Promotional Artwork Gallery
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {movie.galleryImages.map((img, i) => (
                    <div key={i} className="aspect-[3/2] rounded-lg overflow-hidden border border-border-subtle bg-surface-light">
                      <img src={img} alt={`${movie.title} gallery ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cast & Crew Box */}
          <div className="lg:col-span-5 space-y-6">
            {/* Cast */}
            <div className="bg-white p-6 rounded-xl border border-border-subtle shadow-xs">
              <h3 className="font-display font-bold text-lg text-text-main mb-4 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-brand-red" />
                <span>Confirmed Cast</span>
              </h3>
              {movie.cast && movie.cast.length > 0 ? (
                <div className="divide-y divide-border-subtle">
                  {movie.cast.map((c, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-sm">
                      <span className="font-bold text-text-main">{c.name}</span>
                      <span className="text-xs text-text-muted">
                        {c.character ? `as ${c.character}` : c.role || 'Cast'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-text-muted">Cast details unconfirmed or to be announced.</p>
              )}
            </div>

            {/* Crew */}
            <div className="bg-white p-6 rounded-xl border border-border-subtle shadow-xs">
              <h3 className="font-display font-bold text-lg text-text-main mb-4 flex items-center gap-2">
                <Film className="w-5 h-5 text-brand-gold-dark" />
                <span>Creative Crew</span>
              </h3>
              {movie.crew && movie.crew.length > 0 ? (
                <div className="divide-y divide-border-subtle">
                  {movie.crew.map((cr, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-sm">
                      <span className="font-bold text-text-main">{cr.name}</span>
                      <span className="text-xs font-semibold text-brand-gold-dark bg-amber-50 px-2 py-0.5 rounded">
                        {cr.role}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-text-muted">Crew details to be announced.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. RELATED MOVIES SECTION */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border-subtle pt-12">
          <h2 className="font-display font-extrabold text-2xl text-text-main mb-6">
            Other Prominent Titles in Catalogue
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {related.map((relMovie) => (
              <MovieCard key={relMovie._id} movie={relMovie} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
