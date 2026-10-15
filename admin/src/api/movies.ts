import { apiClient } from './client';
import { IMovie, MovieFilterParams } from '../types/movie';

export const getPublicMovies = async (params: MovieFilterParams = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.set('page', params.page.toString());
  if (params.limit) query.set('limit', params.limit.toString());
  if (params.search) query.set('search', params.search);
  if (params.language) query.set('language', params.language);
  if (params.genre) query.set('genre', params.genre);
  if (params.status) query.set('status', params.status);

  return apiClient<{
    success: boolean;
    data: IMovie[];
    pagination: { total: number; page: number; limit: number; totalPages: number; hasMore: boolean };
  }>(`/movies?${query.toString()}`);
};

export const getFeaturedMovies = async () => {
  return apiClient<{ success: boolean; data: IMovie[] }>('/movies/featured');
};

export const getUpcomingMovies = async () => {
  return apiClient<{ success: boolean; data: IMovie[] }>('/movies/upcoming');
};

export const getReleasedMovies = async () => {
  return apiClient<{ success: boolean; data: IMovie[] }>('/movies/released');
};

export const getMovieBySlug = async (slug: string) => {
  return apiClient<{ success: boolean; data: IMovie; related: IMovie[] }>(`/movies/${slug}`);
};

// Admin endpoints
export const getAdminMovies = async (params: MovieFilterParams = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.set('page', params.page.toString());
  if (params.limit) query.set('limit', params.limit.toString());
  if (params.search) query.set('search', params.search);
  if (params.publicationStatus) query.set('publicationStatus', params.publicationStatus);
  if (params.status) query.set('releaseStatus', params.status);

  return apiClient<{
    success: boolean;
    data: IMovie[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }>(`/admin/movies?${query.toString()}`);
};

export const getAdminMovieById = async (id: string) => {
  return apiClient<{ success: boolean; data: IMovie }>(`/admin/movies/${id}`);
};

export const createMovie = async (data: Partial<IMovie>) => {
  return apiClient<{ success: boolean; message: string; data: IMovie }>('/admin/movies', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateMovie = async (id: string, data: Partial<IMovie>) => {
  return apiClient<{ success: boolean; message: string; data: IMovie }>(`/admin/movies/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const deleteMovie = async (id: string) => {
  return apiClient<{ success: boolean; message: string }>(`/admin/movies/${id}`, {
    method: 'DELETE',
  });
};
