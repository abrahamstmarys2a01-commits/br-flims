import { apiClient } from './client';
import { IWebsitePage } from '../types/settings';

export const getPublicPageBySlug = async (slug: string) => {
  return apiClient<{ success: boolean; data: IWebsitePage }>(`/pages/${slug}`);
};

export const getAdminPages = async () => {
  return apiClient<{ success: boolean; data: IWebsitePage[] }>('/admin/pages');
};

export const getAdminPageById = async (id: string) => {
  return apiClient<{ success: boolean; data: IWebsitePage }>(`/admin/pages/${id}`);
};

export const updateAdminPage = async (id: string, data: Partial<IWebsitePage>) => {
  return apiClient<{ success: boolean; message: string; data: IWebsitePage }>(
    `/admin/pages/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  );
};
