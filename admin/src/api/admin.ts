import { apiClient } from './client';

export interface DashboardMetrics {
  totalMovies: number;
  publishedMovies: number;
  draftMovies: number;
  upcomingMovies: number;
  releasedMovies: number;
  newEnquiries: number;
  totalEnquiries: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentAudits: any[];
  recentEnquiries: any[];
}

export const getDashboardStats = async () => {
  return apiClient<{ success: boolean; data: DashboardData }>('/admin/dashboard');
};

export const getAdminUsers = async () => {
  return apiClient<{ success: boolean; data: any[] }>('/admin/users');
};

export const createAdminUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: 'superadmin' | 'editor';
}) => {
  return apiClient<{ success: boolean; message: string; data: any }>('/admin/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateAdminUser = async (
  id: string,
  data: { name?: string; role?: string; isActive?: boolean; password?: string }
) => {
  return apiClient<{ success: boolean; message: string; data: any }>(`/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const deleteAdminUser = async (id: string) => {
  return apiClient<{ success: boolean; message: string }>(`/admin/users/${id}`, {
    method: 'DELETE',
  });
};

export const getAuditLogs = async (params: { page?: number; limit?: number; entityType?: string; actorEmail?: string } = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.set('page', params.page.toString());
  if (params.limit) query.set('limit', params.limit.toString());
  if (params.entityType) query.set('entityType', params.entityType);
  if (params.actorEmail) query.set('actorEmail', params.actorEmail);

  return apiClient<{
    success: boolean;
    data: any[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }>(`/admin/audit?${query.toString()}`);
};

export const uploadMediaFile = async (file: File, folder: string = 'movies') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api/v1';
  const res = await fetch(`${apiBase}/admin/uploads`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('brfilms_admin_token') || ''}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'File upload failed');
  }
  return data;
};
