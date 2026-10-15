import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { Globe, Save, CheckCircle2, Plus, Trash2, Sparkles, UploadCloud } from 'lucide-react';
import { getAdminSettings, updateAdminSettings } from '../api/settings';
import { uploadMediaFile } from '../api/admin';

export const WebsiteContent: React.FC = () => {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings-content'],
    queryFn: getAdminSettings,
  });

  const { register, control, handleSubmit, reset, setValue, watch } = useForm();

  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService,
  } = useFieldArray({ control, name: 'services' });

  const {
    fields: whyUsFields,
    append: appendWhyUs,
    remove: removeWhyUs,
  } = useFieldArray({ control, name: 'whyChooseUs' });

  const watchedBanner = watch('heroBannerUrl');

  useEffect(() => {
    if (data?.data) {
      reset(data.data);
    }
  }, [data, reset]);

  const updateMutation = useMutation({
    mutationFn: (formData: any) => updateAdminSettings(formData),
    onSuccess: () => {
      setSuccessMessage('Website content updated! Live public site reflects new copy immediately.');
      queryClient.invalidateQueries({ queryKey: ['admin-settings-content'] });
      queryClient.invalidateQueries({ queryKey: ['public-settings'] });
      setTimeout(() => setSuccessMessage(null), 4000);
    },
  });

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    try {
      const res = await uploadMediaFile(file, 'banners');
      if (res.data?.url) {
        setValue('heroBannerUrl', res.data.url, { shouldDirty: true });
      }
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingBanner(false);
    }
  };

  const onSubmit = (formData: any) => {
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="p-8 text-xs text-text-muted">Loading website content...</div>;
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="border-b border-border-subtle pb-6">
        <span className="text-xs font-bold text-brand-gold-dark uppercase tracking-wider block">
          Editorial & Hero Copy
        </span>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-text-main">
          Website Content Management
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Edit homepage hero banners, CTAs, distribution service offerings, and trust highlights.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Hero Section Copy */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-6">
          <h2 className="font-display font-bold text-lg text-text-main border-l-3 border-brand-red pl-3">
            Homepage Hero Banner
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Hero Badge Tag
              </label>
              <input
                type="text"
                {...register('heroBadgeText')}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Hero Main Headline (H1)
              </label>
              <input
                type="text"
                {...register('heroTitle')}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle font-bold"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Hero Supporting Paragraph
              </label>
              <textarea
                rows={3}
                {...register('heroSubtitle')}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              ></textarea>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Primary Button Text
              </label>
              <input
                type="text"
                {...register('heroPrimaryCtaText')}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Primary Button Destination Link
              </label>
              <input
                type="text"
                {...register('heroPrimaryCtaLink')}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Secondary Button Text
              </label>
              <input
                type="text"
                {...register('heroSecondaryCtaText')}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Secondary Button Destination Link
              </label>
              <input
                type="text"
                {...register('heroSecondaryCtaLink')}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              />
            </div>

            {/* Hero Banner Image */}
            <div className="sm:col-span-2 space-y-2 pt-2">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Hero Showcase Banner Image
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  {...register('heroBannerUrl')}
                  className="flex-1 px-3 py-2 text-xs bg-surface-light border border-border-subtle rounded-lg font-mono"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-white border border-border-subtle hover:bg-surface-light cursor-pointer shadow-xs shrink-0">
                  <UploadCloud className="w-4 h-4 text-brand-red" />
                  <span>{uploadingBanner ? 'Uploading...' : 'Upload Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Distribution Services Sections Manager */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4">
            <h2 className="font-display font-bold text-lg text-text-main border-l-3 border-brand-gold pl-3">
              Distribution Services Offerings
            </h2>
            <button
              type="button"
              onClick={() =>
                appendService({
                  id: `service-${Date.now()}`,
                  title: 'New Service',
                  shortDescription: '',
                  fullDescription: '',
                  iconName: 'Film',
                  order: serviceFields.length + 1,
                  isEnabled: true,
                })
              }
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-red hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> Add Service
            </button>
          </div>

          <div className="space-y-4">
            {serviceFields.map((field, index) => (
              <div
                key={field.id}
                className="p-5 rounded-xl bg-surface-light border border-border-subtle space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-main">
                    Service #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="text-xs text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-text-muted uppercase">Title</label>
                    <input
                      type="text"
                      {...register(`services.${index}.title`)}
                      className="w-full px-3 py-2 text-xs bg-white border border-border-subtle rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-text-muted uppercase">Short Summary</label>
                    <input
                      type="text"
                      {...register(`services.${index}.shortDescription`)}
                      className="w-full px-3 py-2 text-xs bg-white border border-border-subtle rounded-lg"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-bold text-text-muted uppercase">Comprehensive Description</label>
                    <textarea
                      rows={2}
                      {...register(`services.${index}.fullDescription`)}
                      className="w-full px-3 py-2 text-xs bg-white border border-border-subtle rounded-lg"
                    ></textarea>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us Section Manager */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4">
            <h2 className="font-display font-bold text-lg text-text-main border-l-3 border-brand-red pl-3">
              Why Work With Us Highlights
            </h2>
            <button
              type="button"
              onClick={() =>
                appendWhyUs({
                  id: `why-${Date.now()}`,
                  title: 'New Highlight',
                  description: '',
                  iconName: 'Award',
                })
              }
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-red hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> Add Highlight
            </button>
          </div>

          <div className="space-y-4">
            {whyUsFields.map((field, index) => (
              <div
                key={field.id}
                className="p-5 rounded-xl bg-surface-light border border-border-subtle space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-main">
                    Highlight #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeWhyUs(index)}
                    className="text-xs text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-text-muted uppercase">Headline</label>
                    <input
                      type="text"
                      {...register(`whyChooseUs.${index}.title`)}
                      className="w-full px-3 py-2 text-xs bg-white border border-border-subtle rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-text-muted uppercase">Explanation</label>
                    <input
                      type="text"
                      {...register(`whyChooseUs.${index}.description`)}
                      className="w-full px-3 py-2 text-xs bg-white border border-border-subtle rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-brand-red hover:bg-brand-red-hover shadow-cinema transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{updateMutation.isPending ? 'Publishing Changes...' : 'Save & Publish Website Copy'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
