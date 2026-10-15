export type ReleaseStatus = 'Draft' | 'Upcoming' | 'Released' | 'Postponed';
export type PublicationStatus = 'Draft' | 'Published' | 'Archived';

export interface ICastMember {
  name: string;
  role?: string;
  character?: string;
}

export interface ICrewMember {
  name: string;
  role: string;
}

export interface IMovie {
  _id: string;
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
  durationMinutes?: number | null;
  releaseDate?: string;
  releaseDateConfirmed: boolean;
  releaseStatus: ReleaseStatus;
  distributionTerritories: string[];
  isFeatured: boolean;
  publicationStatus: PublicationStatus;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MovieFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  language?: string;
  genre?: string;
  status?: string;
  publicationStatus?: string;
}
