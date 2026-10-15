import mongoose, { Document, Schema } from 'mongoose';

export interface ICastMember {
  name: string;
  role?: string;
  character?: string;
}

export interface ICrewMember {
  name: string;
  role: string;
}

export type ReleaseStatus = 'Draft' | 'Upcoming' | 'Released' | 'Postponed';
export type PublicationStatus = 'Draft' | 'Published' | 'Archived';

export interface IMovie extends Document {
  title: string;
  slug: string;
  shortDescription?: string;
  synopsis?: string;
  posterUrl: string;
  bannerUrl?: string;
  galleryImages: string[];
  trailerUrl?: string;
  language: string;
  genres: string[];
  cast: ICastMember[];
  crew: ICrewMember[];
  durationMinutes?: number;
  releaseDate?: Date;
  releaseDateConfirmed: boolean;
  releaseStatus: ReleaseStatus;
  distributionTerritories: string[];
  isFeatured: boolean;
  publicationStatus: PublicationStatus;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema = new Schema<IMovie>(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      maxlength: 250,
    },
    slug: {
      type: String,
      required: [true, 'Movie slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    synopsis: {
      type: String,
      trim: true,
    },
    posterUrl: {
      type: String,
      required: [true, 'Official poster URL is required'],
      trim: true,
    },
    bannerUrl: {
      type: String,
      trim: true,
    },
    galleryImages: {
      type: [String],
      default: [],
    },
    trailerUrl: {
      type: String,
      trim: true,
    },
    language: {
      type: String,
      required: true,
      default: 'Tamil',
      trim: true,
      index: true,
    },
    genres: {
      type: [String],
      default: [],
      index: true,
    },
    cast: [
      {
        name: { type: String, required: true, trim: true },
        role: { type: String, trim: true },
        character: { type: String, trim: true },
      },
    ],
    crew: [
      {
        name: { type: String, required: true, trim: true },
        role: { type: String, required: true, trim: true },
      },
    ],
    durationMinutes: {
      type: Number,
      min: 0,
    },
    releaseDate: {
      type: Date,
      index: true,
    },
    releaseDateConfirmed: {
      type: Boolean,
      default: true,
    },
    releaseStatus: {
      type: String,
      enum: ['Draft', 'Upcoming', 'Released', 'Postponed'],
      default: 'Upcoming',
      index: true,
    },
    distributionTerritories: {
      type: [String],
      default: ['Tamil Nadu'],
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    publicationStatus: {
      type: String,
      enum: ['Draft', 'Published', 'Archived'],
      default: 'Draft',
      index: true,
    },
    seoTitle: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    seoDescription: {
      type: String,
      trim: true,
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for optimal catalog performance
MovieSchema.index({ publicationStatus: 1, releaseStatus: 1, releaseDate: -1 });
MovieSchema.index({ publicationStatus: 1, isFeatured: 1 });

export const Movie = mongoose.model<IMovie>('Movie', MovieSchema);
