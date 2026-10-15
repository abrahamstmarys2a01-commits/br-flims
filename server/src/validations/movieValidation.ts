import { z } from 'zod';

const castMemberSchema = z.object({
  name: z.string().min(1, 'Cast member name is required').trim(),
  role: z.string().trim().optional(),
  character: z.string().trim().optional(),
});

const crewMemberSchema = z.object({
  name: z.string().min(1, 'Crew member name is required').trim(),
  role: z.string().min(1, 'Crew role is required').trim(),
});

export const createMovieSchema = z.object({
  title: z.string().min(1, 'Movie title is required').max(250).trim(),
  slug: z
    .string()
    .min(1, 'Movie slug is required')
    .max(250)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens')
    .trim(),
  shortDescription: z.string().max(500).trim().optional(),
  synopsis: z.string().trim().optional(),
  posterUrl: z.string().min(1, 'Official poster URL is required').trim(),
  bannerUrl: z.string().trim().optional(),
  galleryImages: z.array(z.string().trim()).default([]),
  trailerUrl: z.string().trim().optional(),
  language: z.string().trim().default('Tamil'),
  genres: z.array(z.string().trim()).default([]),
  cast: z.array(castMemberSchema).default([]),
  crew: z.array(crewMemberSchema).default([]),
  durationMinutes: z.number().min(0).optional().nullable(),
  releaseDate: z.string().datetime({ offset: true }).optional().nullable().or(z.string().optional().nullable()),
  releaseDateConfirmed: z.boolean().default(true),
  releaseStatus: z.enum(['Draft', 'Upcoming', 'Released', 'Postponed']).default('Upcoming'),
  distributionTerritories: z.array(z.string().trim()).default(['Tamil Nadu']),
  isFeatured: z.boolean().default(false),
  publicationStatus: z.enum(['Draft', 'Published', 'Archived']).default('Draft'),
  seoTitle: z.string().max(120).trim().optional(),
  seoDescription: z.string().max(300).trim().optional(),
});

export const updateMovieSchema = createMovieSchema.partial();
