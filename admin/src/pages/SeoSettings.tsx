import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Search, Save, CheckCircle2, Globe, Share2 } from 'lucide-react';
import { getAdminSettings, updateAdminSettings } from '../api/settings';

export const SeoSettings: React.FC = () => {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings-seo'],
    queryFn: getAdminSettings,
  });

  const { register, handleSubmit, reset, watch } = useForm();

  const watchedTitle = watch('defaultSeoTitle');
  const watchedDesc = watch('defaultSeoDescription');
  const watchedOgImage = watch('ogImageUrl');
  const watchedCanonical = watch('canonicalBaseUrl');

  useEffect(() => {
    if (data?.data) {
      reset({
        defaultSeoTitle: data.data.defaultSeoTitle,
        defaultSeoDescription: data.data.defaultSeoDescription,
        ogImageUrl: data.data.ogImageUrl,
        canonicalBaseUrl: data.data.canonicalBaseUrl,
      });
    }
  }, [data, reset]);

  const updateMutation = useMutation({
    mutationFn: (formData: any) => updateAdminSettings(formData),
    onSuccess: () => {
      setSuccessMessage('SEO settings updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-settings-seo'] });
      queryClient.invalidateQueries({ queryKey: ['public-settings'] });
      setTimeout(() => setSuccessMessage(null), 4000);
    },
  });

  const onSubmit = (formData: any) => {
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="p-8 text-xs text-text-muted">Loading SEO configurations...</div>;
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="border-b border-border-subtle pb-6">
        <span className="text-xs font-bold text-brand-gold-dark uppercase tracking-wider block">
          Search Discovery & OpenGraph
        </span>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-text-main">
          SEO & Social Metadata
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Configure default search engine metadata, OpenGraph preview cards for WhatsApp and social sharing.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Default Meta Title
              </label>
              <input
                type="text"
                {...register('defaultSeoTitle')}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Default Meta Description
              </label>
              <textarea
                rows={4}
                {...register('defaultSeoDescription')}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              ></textarea>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                OpenGraph Share Image URL
              </label>
              <input
                type="text"
                {...register('ogImageUrl')}
                className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-surface-light border border-border-subtle font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Canonical Base URL
              </label>
              <input
                type="url"
                {...register('canonicalBaseUrl')}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-brand-red hover:bg-brand-red-hover shadow-cinema transition-all disabled:opacity-50 text-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save SEO Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Search & Social Preview Mockup */}
        <div className="lg:col-span-5 space-y-6">
          {/* Google Search Result Preview */}
          <div className="bg-white p-6 rounded-2xl border border-border-subtle shadow-xs space-y-2">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
              Google Search Snippet Preview
            </span>
            <div className="pt-2 space-y-1">
              <span className="text-xs text-text-muted block truncate font-mono">
                {watchedCanonical || 'https://brfilms.in'}
              </span>
              <h4 className="text-base text-blue-800 font-medium hover:underline cursor-pointer line-clamp-1">
                {watchedTitle || 'BR Films | Premier Tamil Film Distribution & Cinema House'}
              </h4>
              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                {watchedDesc ||
                  'BR Films is an established Tamil film distribution company connecting visionary producers, premier theatres, and cinema lovers across Tamil Nadu.'}
              </p>
            </div>
          </div>

          {/* Social Share Card Preview */}
          <div className="bg-white p-6 rounded-2xl border border-border-subtle shadow-xs space-y-3">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-brand-gold-dark" />
              <span>Social Share Card (WhatsApp / X / FB)</span>
            </span>

            <div className="rounded-xl overflow-hidden border border-border-subtle bg-surface-light">
              <div className="aspect-[1.91/1] w-full bg-surface-warm flex items-center justify-center p-4">
                <img
                  src={watchedOgImage || '/logo.png'}
                  alt="OG Preview"
                  className="max-h-24 object-contain"
                />
              </div>
              <div className="p-3 space-y-1 bg-white border-t border-border-subtle">
                <span className="text-[10px] text-text-muted uppercase font-mono block">
                  brfilms.in
                </span>
                <p className="font-bold text-xs text-text-main line-clamp-1">
                  {watchedTitle || 'BR Films Distribution'}
                </p>
                <p className="text-[11px] text-text-secondary line-clamp-2">
                  {watchedDesc || 'Tamil Film Distribution House'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
