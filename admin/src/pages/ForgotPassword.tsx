import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { forgotPassword } from '../api/auth';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ message: string; resetUrl?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const res = await forgotPassword(email);
      setResult({ message: res.message, resetUrl: res.resetUrl });
    } catch (err: any) {
      setResult({ message: err.message || 'Error processing request.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-warm/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <img src="/logo.png" alt="BR Films" className="h-16 w-auto object-contain mx-auto" />
        <h2 className="mt-4 font-display font-bold text-2xl text-text-main">
          Reset Administrator Password
        </h2>
        <p className="mt-1 text-xs text-text-secondary">
          Enter your registered administrator email to receive reset instructions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-card rounded-2xl border border-border-subtle">
          {result ? (
            <div className="space-y-4 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <p className="text-sm font-medium text-text-main">{result.message}</p>
              {result.resetUrl && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-left">
                  <span className="font-bold text-amber-900 block mb-1">Development Quick Link:</span>
                  <a href={result.resetUrl} className="text-brand-red font-mono break-all hover:underline">
                    {result.resetUrl}
                  </a>
                </div>
              )}
              <div className="pt-3">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-red hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@brfilms.in"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-brand-red hover:bg-brand-red-hover disabled:opacity-50 shadow-cinema transition-all"
              >
                {isSubmitting ? 'Dispatching...' : 'Request Password Reset Link'}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-text-secondary hover:text-brand-red inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
