import { apiClient } from './client';
import { ISiteSetting } from '../types/settings';

export const getPublicSettings = async () => {
  return apiClient<{ success: boolean; data: ISiteSetting }>('/site-settings');
};

export const getAdminSettings = async () => {
  return apiClient<{ success: boolean; data: ISiteSetting }>('/admin/site-settings');
};

export const updateAdminSettings = async (data: Partial<ISiteSetting>) => {
  return apiClient<{ success: boolean; message: string; data: ISiteSetting }>(
    '/admin/site-settings',
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  );
};
