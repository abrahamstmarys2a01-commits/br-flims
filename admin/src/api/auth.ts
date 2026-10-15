import { apiClient } from './client';

export interface AdminUserResponse {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'editor';
  lastLoginAt?: string;
}

export const login = async (email: string, password: string) => {
  const res = await apiClient<{
    success: boolean;
    message: string;
    token: string;
    user: AdminUserResponse;
  }>('/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (res.token) {
    localStorage.setItem('brfilms_admin_token', res.token);
  }
  return res;
};

export const logout = async () => {
  try {
    await apiClient('/admin/auth/logout', { method: 'POST' });
  } finally {
    localStorage.removeItem('brfilms_admin_token');
  }
};

export const getMe = async () => {
  return apiClient<{ success: boolean; user: AdminUserResponse }>('/admin/auth/me');
};

export const forgotPassword = async (email: string) => {
  return apiClient<{
    success: boolean;
    message: string;
    resetToken?: string;
    resetUrl?: string;
  }>('/admin/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const resetPassword = async (token: string, newPassword: string) => {
  return apiClient<{ success: boolean; message: string }>('/admin/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
};
