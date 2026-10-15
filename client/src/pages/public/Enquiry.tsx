import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Send,
  CheckCircle2,
  MessageCircle,
  Film,
  Building,
  Mail,
  Phone,
  ShieldCheck,
  Copy,
  Check,
} from 'lucide-react';
import { submitEnquiry } from '../../api/enquiries';
import { EnquiryType } from '../../types/enquiry';

const enquirySchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters long').max(120),
  companyOrTheatre: z.string().max(150).optional(),
  email: z.string().email('Please provide a valid email address'),
  mobileNumber: z
    .string()
    .min(7, 'Please provide a valid contact number (at least 7 digits)')
    .max(25)
    .regex(/^[+0-9\s\-()]+$/, 'Please enter a valid phone number'),
  enquiryType: z.enum([
    'Theatre / Exhibitor Partnership',
    'Film Distribution Proposal',
    'Producer / Film Submission',
    'Business Partnership',
    'General Enquiry',
  ]),
  movieTitle: z.string().max(200).optional(),
  territory: z.string().max(100).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(4000),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the privacy terms to submit' }),
  }),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

export const Enquiry: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    referenceNumber: string;
    whatsappUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const initialMovie = searchParams.get('movie') || '';
  const initialType = (searchParams.get('type') as EnquiryType) || 'Theatre / Exhibitor Partnership';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      enquiryType: initialType,
      movieTitle: initialMovie,
      consent: true,
    },
  });

  useEffect(() => {
    if (initialMovie) {
      setValue('movieTitle', initialMovie);
    }
    if (initialType) {
      setValue('enquiryType', initialType);
    }
  }, [initialMovie, initialType, setValue]);

  const onSubmit = async (data: EnquiryFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await submitEnquiry({
        fullName: data.fullName,
        companyOrTheatre: data.companyOrTheatre,
        email: data.email,
        mobileNumber: data.mobileNumber,
        enquiryType: data.enquiryType,
        movieTitle: data.movieTitle,
        territory: data.territory,
        message: data.message,
      });

      if (res.success) {
        setSubmissionSuccess({
          referenceNumber: res.referenceNumber,
          whatsappUrl: res.whatsappUrl,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyRef = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Title */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-brand-red uppercase tracking-wider block">
          Partnership & Theatrical Bookings
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-text-main">
          Business Enquiry
        </h1>
        <p className="text-sm text-text-secondary max-w-xl mx-auto">
          Producers, theatre owners, multiplex operators, and distribution partners can submit proposals directly to the BR Films management desk.
        </p>
      </div>

      {/* Success State */}
      {submissionSuccess ? (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-sm animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display font-bold text-2xl text-emerald-950">
              Enquiry Submitted Successfully!
            </h2>
            <p className="text-sm text-emerald-800 max-w-md mx-auto">
              Your business proposal has been recorded in our system. Our distribution operations team will review your enquiry and contact you promptly.
            </p>
          </div>

          {/* Reference Badge */}
          <div className="bg-white border border-emerald-200 rounded-xl p-4 inline-flex items-center gap-3 shadow-2xs">
            <span className="text-xs font-bold text-text-muted uppercase">Your Reference:</span>
            <span className="font-mono font-bold text-lg text-brand-red">
              {submissionSuccess.referenceNumber}
            </span>
            <button
              onClick={() => copyRef(submissionSuccess.referenceNumber)}
              className="p-1 text-emerald-700 hover:text-emerald-900"
              title="Copy Reference Number"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* WhatsApp Direct Connect Action */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={submissionSuccess.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Connect via WhatsApp Now</span>
            </a>

            <button
              onClick={() => setSubmissionSuccess(null)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100/50 text-sm transition-colors"
            >
              Submit Another Enquiry
            </button>
          </div>
        </div>
      ) : (
        /* The Form */
        <div className="bg-white rounded-2xl border border-border-subtle shadow-card p-6 sm:p-10 space-y-6">
          {submitError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                  Full Name <span className="text-brand-red">*</span>
                </label>
                <input
                  type="text"
                  {...register('fullName')}
                  placeholder="e.g. S. Ramanathan"
                  className={`w-full px-4 py-2.5 rounded-lg text-sm bg-surface-light border ${
                    errors.fullName ? 'border-red-500' : 'border-border-subtle'
                  } focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red`}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-600">{errors.fullName.message}</p>
                )}
              </div>

              {/* Company / Theatre */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                  Company / Theatre Name
                </label>
                <input
                  type="text"
                  {...register('companyOrTheatre')}
                  placeholder="e.g. Sri Lakshmi Cinemas / Alpha Productions"
                  className="w-full px-4 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                  Email Address <span className="text-brand-red">*</span>
                </label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="name@company.com"
                  className={`w-full px-4 py-2.5 rounded-lg text-sm bg-surface-light border ${
                    errors.email ? 'border-red-500' : 'border-border-subtle'
                  } focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red`}
                />
                {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
              </div>

              {/* Mobile Phone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                  Mobile Number <span className="text-brand-red">*</span>
                </label>
                <input
                  type="tel"
                  {...register('mobileNumber')}
                  placeholder="+91 98400 12345"
                  className={`w-full px-4 py-2.5 rounded-lg text-sm bg-surface-light border ${
                    errors.mobileNumber ? 'border-red-500' : 'border-border-subtle'
                  } focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red`}
                />
                {errors.mobileNumber && (
                  <p className="text-xs text-red-600">{errors.mobileNumber.message}</p>
                )}
              </div>

              {/* Enquiry Type */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                  Enquiry Nature <span className="text-brand-red">*</span>
                </label>
                <select
                  {...register('enquiryType')}
                  className="w-full px-4 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red text-text-main"
                >
                  <option value="Theatre / Exhibitor Partnership">
                    Theatre / Exhibitor Partnership
                  </option>
                  <option value="Film Distribution Proposal">Film Distribution Proposal</option>
                  <option value="Producer / Film Submission">Producer / Film Submission</option>
                  <option value="Business Partnership">Business Partnership</option>
                  <option value="General Enquiry">General Enquiry</option>
                </select>
              </div>

              {/* Movie Title (optional) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                  Movie Title (If Applicable)
                </label>
                <input
                  type="text"
                  {...register('movieTitle')}
                  placeholder="e.g. Lenin Pandiyan / Train"
                  className="w-full px-4 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red"
                />
              </div>

              {/* Territory or Circuit */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                  Target Territory or Circuit Location
                </label>
                <input
                  type="text"
                  {...register('territory')}
                  placeholder="e.g. Chennai & Chengalpet, Coimbatore, Madurai, or Karnataka"
                  className="w-full px-4 py-2.5 rounded-lg text-sm bg-surface-light border border-border-subtle focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red"
                />
              </div>

              {/* Message */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                  Proposal or Message Details <span className="text-brand-red">*</span>
                </label>
                <textarea
                  rows={5}
                  {...register('message')}
                  placeholder="Please describe your screen counts, proposed release window, technical specs, or partnership proposal..."
                  className={`w-full px-4 py-3 rounded-lg text-sm bg-surface-light border ${
                    errors.message ? 'border-red-500' : 'border-border-subtle'
                  } focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red`}
                ></textarea>
                {errors.message && (
                  <p className="text-xs text-red-600">{errors.message.message}</p>
                )}
              </div>
            </div>

            {/* Privacy notice and consent */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('consent')}
                  className="mt-1 w-4 h-4 text-brand-red rounded border-border-subtle focus:ring-brand-red"
                />
                <span className="text-xs text-text-secondary leading-relaxed">
                  I agree that BR Films may process my submitted contact details to evaluate this distribution enquiry and communicate theatrical terms, in accordance with the{' '}
                  <Link to="/privacy-policy" className="text-brand-red hover:underline font-semibold">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {errors.consent && (
                <p className="text-xs text-red-600 mt-1">{errors.consent.message}</p>
              )}
            </div>

            {/* Submit CTA */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-brand-red hover:bg-brand-red-hover disabled:opacity-50 shadow-cinema transition-all"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Recording Enquiry in MongoDB...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Official Business Enquiry</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
