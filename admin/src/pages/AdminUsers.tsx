import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Users, UserPlus, Shield, ShieldCheck, Trash2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from '../api/admin';

const newAdminSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email address required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['superadmin', 'editor']),
});

type NewAdminFormData = z.infer<typeof newAdminSchema>;

export const AdminUsers: React.FC = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users-list'],
    queryFn: getAdminUsers,
  });

  const users = data?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewAdminFormData>({
    resolver: zodResolver(newAdminSchema),
    defaultValues: { role: 'editor' },
  });

  const createMutation = useMutation({
    mutationFn: (data: NewAdminFormData) => createAdminUser(data),
    onSuccess: () => {
      setSuccessMessage('Administrator account created successfully.');
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
      setModalOpen(false);
      reset();
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to create user account.');
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateAdminUser(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
    },
    onError: (err: any) => {
      alert(err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdminUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
    },
    onError: (err: any) => {
      alert(err.message);
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove administrator "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="border-b border-border-subtle pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-gold-dark uppercase tracking-wider block">
            Security & Access Control
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-text-main">
            Administrator Accounts
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Manage authorized console users and role permissions.
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMessage(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-brand-red hover:bg-brand-red-hover shadow-cinema"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Administrator</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-border-subtle shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-text-muted">Loading user accounts...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-surface-light border-b border-border-subtle text-text-muted uppercase text-[11px] font-bold">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Login</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {users.map((u: any) => (
                  <tr key={u._id} className="hover:bg-surface-warm/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-text-main">{u.name}</td>
                    <td className="py-3.5 px-4 text-text-secondary">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          u.role === 'superadmin'
                            ? 'bg-amber-50 text-brand-gold-dark border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {u.role === 'superadmin' ? <ShieldCheck className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          u.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-text-muted text-xs">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            toggleStatusMutation.mutate({ id: u._id, isActive: !u.isActive })
                          }
                          className="px-2.5 py-1 text-xs font-bold rounded border border-border-subtle hover:bg-surface-light"
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(u._id, u.name)}
                          className="p-1.5 text-text-muted hover:text-red-600 rounded"
                          title="Delete administrator"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Administrator Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-xl border border-border-subtle animate-fadeIn">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <h3 className="font-display font-bold text-xl text-text-main">
                New Administrator Account
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded text-text-muted hover:text-text-main"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-main uppercase">Full Name</label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2 text-xs bg-surface-light border border-border-subtle rounded-lg"
                />
                {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-main uppercase">Email Address</label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="admin@brfilms.in"
                  className="w-full px-3.5 py-2 text-xs bg-surface-light border border-border-subtle rounded-lg"
                />
                {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-main uppercase">Password</label>
                <input
                  type="password"
                  {...register('password')}
                  placeholder="At least 8 characters"
                  className="w-full px-3.5 py-2 text-xs bg-surface-light border border-border-subtle rounded-lg"
                />
                {errors.password && (
                  <p className="text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-main uppercase">Role Permission</label>
                <select
                  {...register('role')}
                  className="w-full px-3.5 py-2 text-xs bg-surface-light border border-border-subtle rounded-lg font-bold"
                >
                  <option value="editor">Editor (Can edit movies, settings, enquiries)</option>
                  <option value="superadmin">Super Admin (Full permissions + user admin)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border-subtle text-xs font-bold text-text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-brand-red text-white text-xs font-bold shadow-cinema disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
