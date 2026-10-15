import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Building, Save, CheckCircle2, UploadCloud, MapPin, Phone, Mail } from 'lucide-react';
import { getAdminSettings, updateAdminSettings } from '../api/settings';
import { uploadMediaFile } from '../api/admin';

export const CompanyProfile: React.FC = () => {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings-profile'],
    queryFn: getAdminSettings,
  });

  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const watchedLogo = watch('officialLogoUrl');

  useEffect(() => {
    if (data?.data) {
      reset(data.data);
    }
  }, [data, reset]);

  const updateMutation = useMutation({
    mutationFn: (formData: any) => updateAdminSettings(formData),
    onSuccess: () => {
      setSuccessMessage('Company profile updated successfully! Changes are live on the website.');
      queryClient.invalidateQueries({ queryKey: ['admin-settings-profile'] });
      queryClient.invalidateQueries({ queryKey: ['public-settings'] });
      setTimeout(() => setSuccessMessage(null), 4000);
    },
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const res = await uploadMediaFile(file, 'logos');
      if (res.data?.url) {
        setValue('officialLogoUrl', res.data.url, { shouldDirty: true });
      }
    } catch (err: any) {
      alert(`Logo upload failed: ${err.message}`);
    } finally {
      setUploadingLogo(false);
    }
  };

  const onSubmit = (formData: any) => {
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="p-8 text-xs text-text-muted">Loading company profile...</div>;
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="border-b border-border-subtle pb-6">
        <span className="text-xs font-bold text-brand-gold-dark uppercase tracking-wider block">
          Corporate Identity
        </span>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-text-main">
          Company Profile & Branding
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Manage official company details, logos, registered office address, and contact points.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Brand identity */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-6">
          <h2 className="font-display font-bold text-lg text-text-main border-l-3 border-brand-red pl-3">
            Official Brand & Logo
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Company Name
              </label>
              <input
                type="text"
                {...register('companyName')}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Corporate Tagline
              </label>
              <input
                type="text"
                {...register('tagline')}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              />
            </div>

            {/* Official Logo */}
            <div className="sm:col-span-2 space-y-3 pt-2">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Official Company Gold Logo
              </label>

              <div className="flex items-center gap-6">
                <div className="p-3 rounded-xl bg-surface-warm border border-brand-gold/30 shrink-0">
                  <img
                    src={watchedLogo || '/logo.png'}
                    alt="Logo preview"
                    className="h-16 w-auto object-contain"
                  />
                </div>

                <div className="space-y-2 flex-1">
                  <input
                    type="text"
                    {...register('officialLogoUrl')}
                    className="w-full px-3 py-2 text-xs bg-surface-light border border-border-subtle rounded-lg font-mono"
                  />
                  <div>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-border-subtle hover:bg-surface-light cursor-pointer shadow-xs">
                      <UploadCloud className="w-3.5 h-3.5 text-brand-red" />
                      <span>{uploadingLogo ? 'Uploading...' : 'Upload New Logo File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative & Vision */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-6">
          <h2 className="font-display font-bold text-lg text-text-main border-l-3 border-brand-gold pl-3">
            Company Narrative & Mission
          </h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                About Description
              </label>
              <textarea
                rows={3}
                {...register('aboutDescription')}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                  Mission Statement
                </label>
                <textarea
                  rows={3}
                  {...register('mission')}
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
                ></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                  Vision Statement
                </label>
                <textarea
                  rows={3}
                  {...register('vision')}
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Desk & Location */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-6">
          <h2 className="font-display font-bold text-lg text-text-main border-l-3 border-brand-red pl-3">
            Office Contacts & Operational Desk
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Official Email
              </label>
              <input
                type="email"
                {...register('officialEmail')}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Contact Phone
              </label>
              <input
                type="text"
                {...register('contactPhone')}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                WhatsApp Business Number
              </label>
              <input
                type="text"
                {...register('whatsappBusinessNumber')}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Office Street Address
              </label>
              <input
                type="text"
                {...register('officeAddress')}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                City
              </label>
              <input
                type="text"
                {...register('city')}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                State & Postal Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  {...register('state')}
                  className="flex-1 px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
                />
                <input
                  type="text"
                  {...register('postalCode')}
                  className="w-28 px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Google Maps URL
              </label>
              <input
                type="url"
                {...register('googleMapsUrl')}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Business Hours
              </label>
              <input
                type="text"
                {...register('businessHours')}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              />
            </div>

            <div className="sm:col-span-3 space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Copyright Footer Notice
              </label>
              <input
                type="text"
                {...register('copyrightText')}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              />
            </div>
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
            <span>{updateMutation.isPending ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
