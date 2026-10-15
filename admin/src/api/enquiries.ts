import { apiClient } from './client';
import { IEnquiry, CreateEnquiryInput, EnquiryStatus } from '../types/enquiry';

export const submitEnquiry = async (data: CreateEnquiryInput) => {
  return apiClient<{
    success: boolean;
    message: string;
    referenceNumber: string;
    whatsappUrl: string;
    notificationStatus: string;
  }>('/enquiries', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getAdminEnquiries = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  enquiryType?: string;
  isSpam?: boolean;
} = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.set('page', params.page.toString());
  if (params.limit) query.set('limit', params.limit.toString());
  if (params.search) query.set('search', params.search);
  if (params.status) query.set('status', params.status);
  if (params.enquiryType) query.set('enquiryType', params.enquiryType);
  if (params.isSpam !== undefined) query.set('isSpam', params.isSpam.toString());

  return apiClient<{
    success: boolean;
    data: IEnquiry[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }>(`/admin/enquiries?${query.toString()}`);
};

export const getAdminEnquiryById = async (id: string) => {
  return apiClient<{ success: boolean; data: IEnquiry }>(`/admin/enquiries/${id}`);
};

export const updateEnquiryStatus = async (
  id: string,
  payload: { status?: EnquiryStatus; assignedTo?: string; isSpam?: boolean }
) => {
  return apiClient<{ success: boolean; message: string; data: IEnquiry }>(
    `/admin/enquiries/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }
  );
};

export const addEnquiryNote = async (id: string, text: string) => {
  return apiClient<{ success: boolean; message: string; data: IEnquiry }>(
    `/admin/enquiries/${id}/notes`,
    {
      method: 'POST',
      body: JSON.stringify({ text }),
    }
  );
};

export const getExportCsvUrl = () => {
  const token = localStorage.getItem('brfilms_admin_token');
  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api/v1';
  return `${apiBase}/admin/enquiries/export/csv?token=${token || ''}`;
};
