import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Film,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Eye,
  Archive,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import { getAdminMovies, deleteMovie, updateMovie } from '../api/movies';
import { IMovie } from '../types/movie';

export const MovieList: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pubFilter, setPubFilter] = useState('all');
  const [page, setPage] = useState(1);

  // Modal delete confirmation state
  const [movieToDelete, setMovieToDelete] = useState<IMovie | null>(null);

  // Fetch admin movies
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-movies-list', page, searchTerm, statusFilter, pubFilter],
    queryFn: () =>
      getAdminMovies({
        page,
        limit: 15,
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        publicationStatus: pubFilter !== 'all' ? pubFilter : undefined,
      }),
  });

  const movies = data?.data || [];
  const pagination = data?.pagination;

  // Toggle publish mutation
  const togglePublishMutation = useMutation({
    mutationFn: ({ id, publicationStatus }: { id: string; publicationStatus: 'Published' | 'Draft' }) =>
      updateMovie(id, { publicationStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-movies-list'] });
      queryClient.invalidateQueries({ queryKey: ['movies-catalog'] });
      queryClient.invalidateQueries({ queryKey: ['movies-featured'] });
      queryClient.invalidateQueries({ queryKey: ['movies-upcoming'] });
      queryClient.invalidateQueries({ queryKey: ['movies-released'] });
    },
  });

  // Toggle featured mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      updateMovie(id, { isFeatured }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-movies-list'] });
      queryClient.invalidateQueries({ queryKey: ['movies-featured'] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMovie(id),
    onSuccess: () => {
      setMovieToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['admin-movies-list'] });
      queryClient.invalidateQueries({ queryKey: ['movies-catalog'] });
    },
  });

  const publicWebUrl = import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173';

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <span className="text-xs font-bold text-brand-gold-dark uppercase tracking-wider block">
            Theatrical Catalogue
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-text-main">
            Manage Movies
          </h1>
        </div>

        <Link
          to="/movies/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-brand-red hover:bg-brand-red-hover shadow-cinema transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Movie</span>
        </Link>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-border-subtle shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title or slug..."
            className="w-full pl-10 pr-4 py-2 rounded-lg text-xs sm:text-sm bg-surface-light border border-border-subtle focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={pubFilter}
            onChange={(e) => {
              setPubFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 rounded-lg text-xs sm:text-sm bg-surface-light border border-border-subtle focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red"
          >
            <option value="all">All Visibility (Draft & Published)</option>
            <option value="Published">Published Only</option>
            <option value="Draft">Drafts Only</option>
            <option value="Archived">Archived Only</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 rounded-lg text-xs sm:text-sm bg-surface-light border border-border-subtle focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red"
          >
            <option value="all">All Release Statuses</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Released">Released</option>
            <option value="Postponed">Postponed</option>
          </select>
        </div>
      </div>

      {/* Movie Table */}
      <div className="bg-white rounded-xl border border-border-subtle shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs font-semibold text-text-secondary">Loading movie records...</p>
          </div>
        ) : movies.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-surface-light border-b border-border-subtle text-text-muted uppercase text-[11px] font-bold">
                <tr>
                  <th className="py-3 px-4">Poster</th>
                  <th className="py-3 px-4">Title & Slug</th>
                  <th className="py-3 px-4">Language / Genre</th>
                  <th className="py-3 px-4">Release Status</th>
                  <th className="py-3 px-4">Publication</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {movies.map((movie) => (
                  <tr key={movie._id} className="hover:bg-surface-warm/30 transition-colors">
                    {/* Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="w-12 h-16 rounded-md overflow-hidden bg-surface-light border border-border-subtle shrink-0">
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/logo.png';
                          }}
                        />
                      </div>
                    </td>

                    {/* Title */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-text-main line-clamp-1">{movie.title}</p>
                      <span className="font-mono text-[11px] text-text-muted">{movie.slug}</span>
                    </td>

                    {/* Language / Genre */}
                    <td className="py-3 px-4 text-text-secondary">
                      <p className="font-semibold text-text-main">{movie.language}</p>
                      <p className="text-[11px] text-text-muted truncate max-w-[150px]">
                        {movie.genres?.join(', ') || 'N/A'}
                      </p>
                    </td>

                    {/* Release Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          movie.releaseStatus === 'Released'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : movie.releaseStatus === 'Upcoming'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {movie.releaseStatus}
                      </span>
                    </td>

                    {/* Publication Status */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() =>
                          togglePublishMutation.mutate({
                            id: movie._id,
                            publicationStatus:
                              movie.publicationStatus === 'Published' ? 'Draft' : 'Published',
                          })
                        }
                        className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                          movie.publicationStatus === 'Published'
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        title="Click to toggle between Published and Draft"
                      >
                        {movie.publicationStatus}
                      </button>
                    </td>

                    {/* Featured toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() =>
                          toggleFeaturedMutation.mutate({
                            id: movie._id,
                            isFeatured: !movie.isFeatured,
                          })
                        }
                        className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                          movie.isFeatured
                            ? 'text-amber-600 bg-amber-50 border border-amber-200'
                            : 'text-gray-400 hover:text-amber-500'
                        }`}
                        title="Toggle Featured on Homepage"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {movie.publicationStatus === 'Published' && (
                          <a
                            href={`${publicWebUrl}/movies/${movie.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-text-muted hover:text-brand-red rounded"
                            title="Preview on Public Website"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}

                        <Link
                          to={`/movies/${movie._id}/edit`}
                          className="p-1.5 text-text-muted hover:text-brand-red rounded"
                          title="Edit Movie"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => setMovieToDelete(movie)}
                          className="p-1.5 text-text-muted hover:text-red-600 rounded"
                          title="Delete Movie"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-text-muted">
            <Film className="w-12 h-12 mx-auto mb-2 opacity-40" />
            <p className="font-semibold text-text-main">No movies found matching criteria.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {movieToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-border-subtle animate-fadeIn">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-display font-bold text-xl text-text-main">
                Delete Movie Record?
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-text-main">"{movieToDelete.title}"</span>? This will permanently remove the movie and its promotional metadata from MongoDB.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMovieToDelete(null)}
                className="flex-1 py-2.5 rounded-lg border border-border-subtle text-xs font-bold text-text-secondary hover:bg-surface-light"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(movieToDelete._id)}
                className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
