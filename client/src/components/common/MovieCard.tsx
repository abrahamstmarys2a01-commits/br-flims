import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Film, Sparkles } from 'lucide-react';
import { IMovie } from '../../types/movie';
import { Badge } from './Badge';

interface MovieCardProps {
  movie: IMovie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const formattedDate = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : movie.releaseDateConfirmed
    ? 'TBA'
    : 'Coming Soon';

  return (
    <Link
      to={`/movies/${movie.slug}`}
      className="group flex flex-col bg-white rounded-xl overflow-hidden border border-border-subtle shadow-card hover:shadow-card-hover hover:border-brand-gold/50 transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* 2:3 Portrait Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-light">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            // Branded placeholder if image fails to load
            (e.target as HTMLImageElement).src = '/logo.png';
            (e.target as HTMLImageElement).className = 'w-full h-full object-contain p-8 bg-surface-warm';
          }}
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
          <span className="text-xs font-semibold text-brand-gold-light uppercase tracking-wider mb-1 flex items-center gap-1">
            <Film className="w-3.5 h-3.5" /> View Details & Showcase
          </span>
          <p className="text-sm font-medium line-clamp-2 text-gray-200">
            {movie.shortDescription || movie.synopsis || 'Theatrical distribution across Tamil Nadu & worldwide.'}
          </p>
        </div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          {movie.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-brand-gold text-white shadow-sm">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-black/70 text-white backdrop-blur-sm">
            {movie.language}
          </span>
        </div>

        {/* Status Pill on Poster bottom */}
        <div className="absolute bottom-2.5 right-2.5">
          <span
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold shadow-sm ${
              movie.releaseStatus === 'Released'
                ? 'bg-emerald-600 text-white'
                : 'bg-brand-red text-white'
            }`}
          >
            {movie.releaseStatus}
          </span>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          <h3 className="font-display font-bold text-lg text-text-main group-hover:text-brand-red transition-colors duration-200 line-clamp-1">
            {movie.title}
          </h3>

          {movie.genres && movie.genres.length > 0 && (
            <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">
              {movie.genres.join(' • ')}
            </p>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted">
          <span className="flex items-center gap-1 font-medium text-text-secondary">
            <Calendar className="w-3.5 h-3.5 text-brand-red" />
            {formattedDate}
          </span>

          <span className="text-brand-red font-semibold text-xs group-hover:underline">
            Explore →
          </span>
        </div>
      </div>
    </Link>
  );
};
