import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Film, RefreshCw, X } from 'lucide-react';
import { getPublicMovies } from '../../api/movies';
import { MovieCard } from '../../components/common/MovieCard';
import { SkeletonCard } from '../../components/common/SkeletonCard';

export const Movies: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'Upcoming' | 'Released'>('all');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [page, setPage] = useState(1);

  // TanStack Query with live refetch capability
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['movies-catalog', page, searchTerm, selectedStatus, selectedGenre, selectedLanguage],
    queryFn: () =>
      getPublicMovies({
        page,
        limit: 12,
        search: searchTerm || undefined,
        status: selectedStatus,
        genre: selectedGenre !== 'all' ? selectedGenre : undefined,
        language: selectedLanguage !== 'all' ? selectedLanguage : undefined,
      }),
  });

  const movies = data?.data || [];
  const pagination = data?.pagination;

  const genresList = ['Action', 'Thriller', 'Drama', 'Crime', 'Comedy', 'Romance'];
  const languagesList = ['Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Hindi'];

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedGenre('all');
    setSelectedLanguage('all');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-border-subtle pb-6">
        <span className="text-xs font-bold text-brand-red uppercase tracking-wider block mb-1">
          Cinema Catalogue
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-text-main">
          Movie Distribution Showcase
        </h1>
        <p className="text-sm text-text-secondary mt-2 max-w-2xl">
          Discover all published theatrical films under BR Films. Browse upcoming release schedules, star cast, official promotional artwork, and theatrical circuits.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-warm/40 border border-border-subtle rounded-xl p-4 sm:p-5 space-y-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-4">
          <div className="flex items-center gap-2">
            {(['all', 'Upcoming', 'Released'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => {
                  setSelectedStatus(status);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  selectedStatus === status
                    ? 'bg-brand-red text-white shadow-xs'
                    : 'bg-white text-text-secondary hover:text-text-main border border-border-subtle'
                }`}
              >
                {status === 'all' ? 'All Titles' : `${status} Movies`}
              </button>
            ))}
          </div>

          {(searchTerm || selectedGenre !== 'all' || selectedLanguage !== 'all' || selectedStatus !== 'all') && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-red hover:underline"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Search & Dropdown Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search by movie title..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-white border border-border-subtle focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red"
            />
          </div>

          {/* Genre Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedGenre}
              onChange={(e) => {
                setSelectedGenre(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 rounded-lg text-sm bg-white border border-border-subtle focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red text-text-main"
            >
              <option value="all">All Genres</option>
              {genresList.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 rounded-lg text-sm bg-white border border-border-subtle focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red text-text-main"
            >
              <option value="all">All Languages</option>
              {languagesList.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-16 bg-surface-light rounded-xl border border-red-200">
          <p className="text-sm font-semibold text-red-600 mb-3">
            Failed to load movies catalogue.
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-brand-red text-white"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      ) : movies.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-border-subtle">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-lg text-xs font-bold border border-border-subtle bg-white disabled:opacity-40 hover:bg-surface-light"
              >
                Previous
              </button>
              <span className="text-xs font-semibold text-text-secondary px-3">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-lg text-xs font-bold border border-border-subtle bg-white disabled:opacity-40 hover:bg-surface-light"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface-light rounded-xl border border-dashed border-border-subtle">
          <Film className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-text-main mb-1">
            No Movies Matching Criteria
          </h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto mb-4">
            Try adjusting your search keywords, release status, or genre selections.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-brand-red text-white hover:bg-brand-red-hover"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
