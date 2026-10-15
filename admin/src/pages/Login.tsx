import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Mail, ArrowRight, AlertCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const publicWebUrl = import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173';

  const fromState = (location.state as any)?.from?.pathname;
  const targetPath =
    !fromState || fromState === '/login' || fromState.startsWith('/admin')
      ? '/dashboard'
      : fromState;

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await login(data.email, data.password);
      navigate(targetPath, { replace: true });
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid administrator credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-warm/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <img
          src="/logo.png"
          alt="BR Films"
          className="h-20 w-auto object-contain mx-auto drop-shadow-sm"
        />
        <h2 className="mt-4 font-display font-black text-2xl sm:text-3xl text-text-main tracking-tight">
          Admin CMS Portal
        </h2>
        <p className="mt-1 text-xs text-text-secondary">
          Secure content management & distribution operations console
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-card rounded-2xl border border-border-subtle">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="admin@brfilms.in"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-surface-light border ${
                    errors.email ? 'border-red-500' : 'border-border-subtle'
                  } focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-brand-red hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  {...register('password')}
                  placeholder="••••••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-surface-light border ${
                    errors.password ? 'border-red-500' : 'border-border-subtle'
                  } focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-brand-red hover:bg-brand-red-hover disabled:opacity-50 shadow-cinema transition-all"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-border-subtle text-center">
            <a
              href={publicWebUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-text-secondary hover:text-brand-red inline-flex items-center gap-1.5"
            >
              <span>View Public Distribution Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
