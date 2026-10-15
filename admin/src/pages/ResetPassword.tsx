import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { resetPassword } from '../api/auth';

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Token may have expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-surface-warm/50 flex flex-col justify-center py-12 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-border-subtle shadow-card space-y-4">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
          <h2 className="font-display font-bold text-xl text-text-main">Invalid Reset Link</h2>
          <p className="text-xs text-text-secondary">
            No password reset token was provided in the URL. Please request a new link.
          </p>
          <Link to="/forgot-password" className="text-xs font-bold text-brand-red hover:underline block">
            Request Password Reset Link →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-warm/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <img src="/logo.png" alt="BR Films" className="h-16 w-auto object-contain mx-auto" />
        <h2 className="mt-4 font-display font-bold text-2xl text-text-main">
          Create New Password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-card rounded-2xl border border-border-subtle">
          {success ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-lg text-emerald-950">Password Updated!</h3>
              <p className="text-xs text-text-secondary">
                Your password has been reset successfully. Redirecting you to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-brand-red hover:bg-brand-red-hover disabled:opacity-50 shadow-cinema transition-all"
              >
                {isSubmitting ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
