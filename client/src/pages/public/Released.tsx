import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Film } from 'lucide-react';
import { getReleasedMovies } from '../../api/movies';
import { MovieCard } from '../../components/common/MovieCard';
import { SkeletonCard } from '../../components/common/SkeletonCard';

export const Released: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies-released-page'],
    queryFn: getReleasedMovies,
  });

  const movies = data?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-border-subtle pb-6">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
          In Theatres & Archival Releases
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-text-main">
          Released Movies
        </h1>
        <p className="text-sm text-text-secondary mt-2 max-w-2xl">
          Explore films successfully brought to theatrical audiences across Tamil Nadu screens through BR Films distribution.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-16 bg-surface-light rounded-xl border border-red-200">
          <p className="text-sm font-semibold text-red-600">Failed to load released movies.</p>
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
          <h3 className="font-display font-bold text-lg text-text-main mb-1">No Past Releases Displayed</h3>
          <p className="text-xs text-text-secondary">Released records will be showcased as titles conclude theatrical runs.</p>
        </div>
      )}
    </div>
  );
};
