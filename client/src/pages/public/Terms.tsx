import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText } from 'lucide-react';
import { getPublicPageBySlug } from '../../api/pages';

export const Terms: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['page-terms-of-use'],
    queryFn: () => getPublicPageBySlug('terms-of-use'),
  });

  const page = data?.data;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 pb-20">
      <div className="border-b border-border-subtle pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-red uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>Terms & Conditions</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-text-main">
          {page?.title || 'Terms of Use'}
        </h1>
        {page?.subtitle && (
          <p className="text-sm text-text-secondary">{page.subtitle}</p>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      ) : (
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-border-subtle shadow-card space-y-8 text-text-main">
          <p className="text-base text-text-secondary leading-relaxed">
            {page?.content}
          </p>

          {page?.sections && page.sections.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-border-subtle">
              {page.sections.map((section, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="font-display font-bold text-lg text-text-main">
                    {section.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
