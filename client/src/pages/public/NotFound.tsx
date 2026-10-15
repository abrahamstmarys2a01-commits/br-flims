import React from 'react';
import { Link } from 'react-router-dom';
import { Film, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-surface-warm border border-brand-gold/30 flex items-center justify-center text-brand-gold mx-auto">
          <Film className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="font-display font-black text-6xl text-brand-red block">404</span>
          <h1 className="font-display font-bold text-2xl text-text-main">
            Scene Not Found
          </h1>
          <p className="text-sm text-text-secondary">
            The page or movie record you are looking for does not exist, has been archived, or moved.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-brand-red text-white hover:bg-brand-red-hover shadow-cinema transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
