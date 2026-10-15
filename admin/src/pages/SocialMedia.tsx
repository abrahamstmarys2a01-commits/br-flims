import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { Share2, Save, CheckCircle2, Instagram, Facebook, Youtube, Linkedin, Twitter, Plus, Trash2 } from 'lucide-react';
import { getAdminSettings, updateAdminSettings } from '../api/settings';

export const SocialMedia: React.FC = () => {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings-social'],
    queryFn: getAdminSettings,
  });

  const { register, control, handleSubmit, reset } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: 'socialLinks' });

  useEffect(() => {
    if (data?.data) {
      reset({ socialLinks: data.data.socialLinks || [] });
    }
  }, [data, reset]);

  const updateMutation = useMutation({
    mutationFn: (formData: any) => updateAdminSettings(formData),
    onSuccess: () => {
      setSuccessMessage('Social media channels updated! Only enabled channels display publicly.');
      queryClient.invalidateQueries({ queryKey: ['admin-settings-social'] });
      queryClient.invalidateQueries({ queryKey: ['public-settings'] });
      setTimeout(() => setSuccessMessage(null), 4000);
    },
  });

  const onSubmit = (formData: any) => {
    updateMutation.mutate(formData);
  };

  const getIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="w-5 h-5 text-pink-600" />;
      case 'facebook': return <Facebook className="w-5 h-5 text-blue-600" />;
      case 'youtube': return <Youtube className="w-5 h-5 text-red-600" />;
      case 'linkedin': return <Linkedin className="w-5 h-5 text-blue-700" />;
      case 'x': return <Twitter className="w-5 h-5 text-gray-900" />;
      default: return <Share2 className="w-5 h-5 text-brand-gold" />;
    }
  };

  if (isLoading) {
    return <div className="p-8 text-xs text-text-muted">Loading social channels...</div>;
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="border-b border-border-subtle pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-brand-gold-dark uppercase tracking-wider block">
            Public Channels
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-text-main">
            Social Media Management
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Configure links to studio handles. Disabled channels are hidden from the public footer and navbar.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            append({ platform: 'other', label: 'New Platform', url: 'https://', isEnabled: true })
          }
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-white border border-border-subtle hover:bg-surface-light text-text-main"
        >
          <Plus className="w-3.5 h-3.5 text-brand-red" />
          <span>Add Custom Channel</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-2xl border border-border-subtle shadow-xs divide-y divide-border-subtle">
          {fields.map((field: any, index) => (
            <div key={field.id} className="p-5 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-3 w-full sm:w-48 shrink-0">
                <div className="p-2 rounded-lg bg-surface-light border border-border-subtle">
                  {getIcon(field.platform)}
                </div>
                <input
                  type="text"
                  {...register(`socialLinks.${index}.label`)}
                  placeholder="Platform Name"
                  className="w-full px-2.5 py-1.5 text-xs font-bold text-text-main bg-surface-light border border-border-subtle rounded-md"
                />
              </div>

              <div className="flex-1 w-full">
                <input
                  type="url"
                  {...register(`socialLinks.${index}.url`)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 text-xs bg-surface-light border border-border-subtle rounded-lg font-mono"
                />
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register(`socialLinks.${index}.isEnabled`)}
                    className="w-4 h-4 text-brand-red rounded border-border-subtle"
                  />
                  <span className="text-xs font-semibold text-text-main">Enabled</span>
                </label>

                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-1.5 text-red-500 hover:text-red-700"
                  title="Remove channel"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-brand-red hover:bg-brand-red-hover shadow-cinema transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{updateMutation.isPending ? 'Saving...' : 'Save Social Channels'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
