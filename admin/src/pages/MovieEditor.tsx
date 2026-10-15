import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Film,
  UploadCloud,
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles,
} from 'lucide-react';
import { getAdminMovieById, createMovie, updateMovie } from '../api/movies';
import { uploadMediaFile } from '../api/admin';

const movieFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(250),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  shortDescription: z.string().max(500).optional(),
  synopsis: z.string().optional(),
  posterUrl: z.string().min(1, 'Poster URL is required'),
  bannerUrl: z.string().optional(),
  trailerUrl: z.string().optional(),
  language: z.string().min(1, 'Language is required'),
  genres: z.string().optional(), // Comma separated for editing convenience
  cast: z.array(
    z.object({
      name: z.string().min(1, 'Name is required'),
      role: z.string().optional(),
      character: z.string().optional(),
    })
  ),
  crew: z.array(
    z.object({
      name: z.string().min(1, 'Name is required'),
      role: z.string().min(1, 'Role is required'),
    })
  ),
  durationMinutes: z.coerce.number().min(0).optional().nullable(),
  releaseDate: z.string().optional(),
  releaseDateConfirmed: z.boolean(),
  releaseStatus: z.enum(['Draft', 'Upcoming', 'Released', 'Postponed']),
  publicationStatus: z.enum(['Draft', 'Published', 'Archived']),
  distributionTerritories: z.string().optional(), // Comma separated
  isFeatured: z.boolean(),
  seoTitle: z.string().max(120).optional(),
  seoDescription: z.string().max(300).optional(),
});

type MovieFormData = z.infer<typeof movieFormSchema>;

export const MovieEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: movieData, isLoading: loadingMovie } = useQuery({
    queryKey: ['admin-movie-single', id],
    queryFn: () => getAdminMovieById(id!),
    enabled: isEditing,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MovieFormData>({
    resolver: zodResolver(movieFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      shortDescription: '',
      synopsis: '',
      posterUrl: '',
      bannerUrl: '',
      trailerUrl: '',
      language: 'Tamil',
      genres: 'Action, Thriller',
      cast: [{ name: '', role: '', character: '' }],
      crew: [{ name: '', role: 'Director' }],
      durationMinutes: null,
      releaseDate: '',
      releaseDateConfirmed: true,
      releaseStatus: 'Upcoming',
      publicationStatus: 'Draft',
      distributionTerritories: 'Tamil Nadu, Worldwide',
      isFeatured: false,
      seoTitle: '',
      seoDescription: '',
    },
  });

  const {
    fields: castFields,
    append: appendCast,
    remove: removeCast,
  } = useFieldArray({ control, name: 'cast' });

  const {
    fields: crewFields,
    append: appendCrew,
    remove: removeCrew,
  } = useFieldArray({ control, name: 'crew' });

  const watchedPosterUrl = watch('posterUrl');
  const watchedBannerUrl = watch('bannerUrl');
  const watchedTitle = watch('title');

  // Auto-generate slug from title if creating new
  const handleAutoSlug = () => {
    if (!watchedTitle) return;
    const generated = watchedTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    setValue('slug', generated, { shouldValidate: true });
  };

  // Populate data when editing
  useEffect(() => {
    if (movieData?.data) {
      const m = movieData.data;
      reset({
        title: m.title,
        slug: m.slug,
        shortDescription: m.shortDescription || '',
        synopsis: m.synopsis || '',
        posterUrl: m.posterUrl,
        bannerUrl: m.bannerUrl || '',
        trailerUrl: m.trailerUrl || '',
        language: m.language,
        genres: (m.genres || []).join(', '),
        cast: m.cast && m.cast.length > 0 ? m.cast : [{ name: '', role: '', character: '' }],
        crew: m.crew && m.crew.length > 0 ? m.crew : [{ name: '', role: '' }],
        durationMinutes: m.durationMinutes ?? null,
        releaseDate: m.releaseDate ? new Date(m.releaseDate).toISOString().slice(0, 10) : '',
        releaseDateConfirmed: m.releaseDateConfirmed,
        releaseStatus: m.releaseStatus,
        publicationStatus: m.publicationStatus,
        distributionTerritories: (m.distributionTerritories || []).join(', '),
        isFeatured: m.isFeatured,
        seoTitle: m.seoTitle || '',
        seoDescription: m.seoDescription || '',
      });
    }
  }, [movieData, reset]);

  // Handle poster upload
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'poster' | 'banner'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'poster') setUploadingPoster(true);
    if (type === 'banner') setUploadingBanner(true);

    try {
      const res = await uploadMediaFile(file, type === 'poster' ? 'movies' : 'banners');
      if (res.data?.url) {
        if (type === 'poster') {
          setValue('posterUrl', res.data.url, { shouldValidate: true });
        } else {
          setValue('bannerUrl', res.data.url, { shouldValidate: true });
        }
      }
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      if (type === 'poster') setUploadingPoster(false);
      if (type === 'banner') setUploadingBanner(false);
    }
  };

  const onSubmit = async (formData: MovieFormData) => {
    setServerError(null);

    const payload = {
      ...formData,
      genres: formData.genres
        ? formData.genres.split(',').map((g) => g.trim()).filter(Boolean)
        : [],
      distributionTerritories: formData.distributionTerritories
        ? formData.distributionTerritories.split(',').map((t) => t.trim()).filter(Boolean)
        : ['Tamil Nadu'],
      durationMinutes: formData.durationMinutes ?? undefined,
      releaseDate: formData.releaseDate ? new Date(formData.releaseDate).toISOString() : undefined,
    };

    try {
      if (isEditing) {
        await updateMovie(id!, payload);
      } else {
        await createMovie(payload);
      }

      queryClient.invalidateQueries({ queryKey: ['admin-movies-list'] });
      queryClient.invalidateQueries({ queryKey: ['movies-catalog'] });
      queryClient.invalidateQueries({ queryKey: ['movies-featured'] });
      queryClient.invalidateQueries({ queryKey: ['movies-upcoming'] });
      queryClient.invalidateQueries({ queryKey: ['movies-released'] });

      navigate('/movies');
    } catch (err: any) {
      setServerError(err.message || 'Failed to save movie record.');
    }
  };

  if (isEditing && loadingMovie) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-3 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs font-semibold text-text-secondary">Loading movie details for edit...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-6">
        <div>
          <Link
            to="/movies"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-brand-red mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Movies List
          </Link>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-text-main">
            {isEditing ? `Edit: ${movieData?.data?.title || 'Movie'}` : 'Add New Theatrical Movie'}
          </h1>
        </div>
      </div>

      {serverError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Section 1: Basic Identifiers */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-6">
          <h2 className="font-display font-bold text-lg text-text-main border-l-3 border-brand-red pl-3">
            1. Title & URL Slug
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Movie Title <span className="text-brand-red">*</span>
              </label>
              <input
                type="text"
                {...register('title')}
                placeholder="e.g. Lenin Pandiyan"
                className="w-full px-4 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red"
              />
              {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                  Unique Slug <span className="text-brand-red">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAutoSlug}
                  className="text-xs font-bold text-brand-gold-dark hover:underline"
                >
                  Auto-generate from Title
                </button>
              </div>
              <input
                type="text"
                {...register('slug')}
                placeholder="e.g. lenin-pandiyan"
                className="w-full px-4 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle font-mono focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red"
              />
              {errors.slug && <p className="text-xs text-red-600">{errors.slug.message}</p>}
            </div>
          </div>
        </div>

        {/* Section 2: Media Assets & Posters */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-6">
          <h2 className="font-display font-bold text-lg text-text-main border-l-3 border-brand-gold pl-3">
            2. Promotional Artwork & Posters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Official Poster */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Official Portrait Poster (2:3 Ratio) <span className="text-brand-red">*</span>
              </label>

              <div className="flex items-start gap-4">
                <div className="w-28 aspect-[2/3] rounded-xl overflow-hidden bg-surface-light border border-border-subtle shrink-0">
                  {watchedPosterUrl ? (
                    <img
                      src={watchedPosterUrl}
                      alt="Poster Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted text-xs p-2 text-center">
                      No poster
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    {...register('posterUrl')}
                    placeholder="/uploads/movies/... or https://..."
                    className="w-full px-3 py-2 text-xs bg-surface-light border border-border-subtle rounded-lg font-mono"
                  />

                  <div className="relative">
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-white border border-border-subtle hover:bg-surface-light cursor-pointer shadow-xs">
                      <UploadCloud className="w-4 h-4 text-brand-red" />
                      <span>{uploadingPoster ? 'Uploading Image...' : 'Upload / Replace File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'poster')}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-[11px] text-text-muted">
                    Supports JPEG, PNG, WEBP up to 10MB.
                  </p>
                </div>
              </div>
              {errors.posterUrl && (
                <p className="text-xs text-red-600">{errors.posterUrl.message}</p>
              )}
            </div>

            {/* Banner & Trailer */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                  Wide Banner Image URL (Optional)
                </label>
                <input
                  type="text"
                  {...register('bannerUrl')}
                  placeholder="/uploads/banners/..."
                  className="w-full px-3 py-2 text-xs bg-surface-light border border-border-subtle rounded-lg font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                  Official Trailer URL (YouTube / Vimeo)
                </label>
                <input
                  type="url"
                  {...register('trailerUrl')}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 text-xs bg-surface-light border border-border-subtle rounded-lg font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Movie Details, Synopsis & Attributes */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-6">
          <h2 className="font-display font-bold text-lg text-text-main border-l-3 border-brand-red pl-3">
            3. Details, Language & Theatrical Status
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Language <span className="text-brand-red">*</span>
              </label>
              <input
                type="text"
                {...register('language')}
                placeholder="e.g. Tamil"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Genres (Comma Separated)
              </label>
              <input
                type="text"
                {...register('genres')}
                placeholder="e.g. Action, Crime, Thriller"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Duration (Minutes)
              </label>
              <input
                type="number"
                {...register('durationMinutes')}
                placeholder="e.g. 142"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Release Date
              </label>
              <input
                type="date"
                {...register('releaseDate')}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Release Status
              </label>
              <select
                {...register('releaseStatus')}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Released">Released</option>
                <option value="Draft">Draft</option>
                <option value="Postponed">Postponed</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Website Publication Status
              </label>
              <select
                {...register('publicationStatus')}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle font-bold text-brand-red"
              >
                <option value="Draft">Draft (Hidden from public)</option>
                <option value="Published">Published (Live on website)</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-3 p-3.5 rounded-xl border border-border-subtle bg-surface-light cursor-pointer">
              <input
                type="checkbox"
                {...register('releaseDateConfirmed')}
                className="w-4 h-4 text-brand-red rounded border-border-subtle"
              />
              <span className="text-xs font-semibold text-text-main">
                Release Date is Confirmed (Uncheck for "Coming Soon")
              </span>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-xl border border-border-subtle bg-surface-light cursor-pointer">
              <input
                type="checkbox"
                {...register('isFeatured')}
                className="w-4 h-4 text-brand-gold rounded border-border-subtle"
              />
              <span className="text-xs font-semibold text-text-main flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                Featured on Homepage Showcase
              </span>
            </label>
          </div>

          {/* Descriptions */}
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Short Description (Card Teaser)
              </label>
              <input
                type="text"
                {...register('shortDescription')}
                placeholder="Brief one-line teaser for cards..."
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Full Synopsis & Narrative
              </label>
              <textarea
                rows={4}
                {...register('synopsis')}
                placeholder="Comprehensive storyline, theme, and cinematic highlights..."
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              ></textarea>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Distribution Territories (Comma Separated)
              </label>
              <input
                type="text"
                {...register('distributionTerritories')}
                placeholder="e.g. Tamil Nadu, Karnataka, Overseas, Worldwide"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Cast and Crew Arrays */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-6">
          <h2 className="font-display font-bold text-lg text-text-main border-l-3 border-brand-red pl-3">
            4. Cast & Creative Crew
          </h2>

          {/* Cast */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Star Cast
              </label>
              <button
                type="button"
                onClick={() => appendCast({ name: '', role: '', character: '' })}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-red hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Cast Member
              </button>
            </div>

            <div className="space-y-2">
              {castFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    {...register(`cast.${index}.name`)}
                    placeholder="Actor Name (e.g. Vijay Sethupathi)"
                    className="flex-1 px-3 py-2 text-xs bg-surface-light border border-border-subtle rounded-lg"
                  />
                  <input
                    type="text"
                    {...register(`cast.${index}.character`)}
                    placeholder="Character (optional)"
                    className="w-40 px-3 py-2 text-xs bg-surface-light border border-border-subtle rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeCast(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Crew */}
          <div className="space-y-3 pt-4 border-t border-border-subtle">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Creative Crew
              </label>
              <button
                type="button"
                onClick={() => appendCrew({ name: '', role: '' })}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-gold-dark hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Crew Member
              </button>
            </div>

            <div className="space-y-2">
              {crewFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    {...register(`crew.${index}.name`)}
                    placeholder="Technician Name (e.g. Mysskin)"
                    className="flex-1 px-3 py-2 text-xs bg-surface-light border border-border-subtle rounded-lg"
                  />
                  <input
                    type="text"
                    {...register(`crew.${index}.role`)}
                    placeholder="Role (e.g. Writer & Director, Music)"
                    className="w-48 px-3 py-2 text-xs bg-surface-light border border-border-subtle rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeCrew(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: SEO Metadata */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-4">
          <h2 className="font-display font-bold text-lg text-text-main border-l-3 border-brand-gold pl-3">
            5. Search Engine Optimization (SEO)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Custom SEO Title (Max 120 chars)
              </label>
              <input
                type="text"
                {...register('seoTitle')}
                placeholder="e.g. Lenin Pandiyan Movie - Theatrical Release | BR Films"
                className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-surface-light border border-border-subtle"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                Custom SEO Description (Max 300 chars)
              </label>
              <input
                type="text"
                {...register('seoDescription')}
                placeholder="Meta description for search engines and social cards..."
                className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-surface-light border border-border-subtle"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
          <Link
            to="/movies"
            className="px-6 py-3 rounded-xl border border-border-subtle text-xs font-bold text-text-secondary hover:bg-surface-light"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-brand-red hover:bg-brand-red-hover shadow-cinema transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving to Database...' : isEditing ? 'Update Movie Record' : 'Create Movie Record'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
