import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Film, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getUpcomingMovies } from '../../api/movies';
import { MovieCard } from '../../components/common/MovieCard';
import { SkeletonCard } from '../../components/common/SkeletonCard';

export const Upcoming: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies-upcoming-page'],
    queryFn: getUpcomingMovies,
  });

  const movies = data?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-border-subtle pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-gold-dark uppercase tracking-wider block mb-1">
            Coming to Theatres
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-text-main">
            Upcoming Theatrical Movies
          </h1>
          <p className="text-sm text-text-secondary mt-2 max-w-2xl">
            Preview our lineup of eagerly anticipated Tamil films heading to silver screens across Tamil Nadu and worldwide circuits.
          </p>
        </div>

        <Link
          to="/enquiry"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-brand-red text-white hover:bg-brand-red-hover shadow-cinema transition-all"
        >
          <span>Exhibitor Booking Enquiry</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-16 bg-surface-light rounded-xl border border-red-200">
          <p className="text-sm font-semibold text-red-600">Failed to load upcoming movies.</p>
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface-light rounded-xl border border-dashed border-border-subtle">
          <Film className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-text-main mb-1">No Upcoming Titles</h3>
          <p className="text-xs text-text-secondary">Announcements for upcoming releases will be published soon.</p>
        </div>
      )}
    </div>
  );
};
