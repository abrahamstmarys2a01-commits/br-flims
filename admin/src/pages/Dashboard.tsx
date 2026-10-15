import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Film,
  CheckCircle2,
  Calendar,
  Inbox,
  Clock,
  PlusCircle,
  Eye,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { getDashboardStats } from '../api/admin';

export const Dashboard: React.FC = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: getDashboardStats,
  });

  const stats = data?.data;
  const metrics = stats?.metrics;
  const recentAudits = stats?.recentAudits || [];
  const recentEnquiries = stats?.recentEnquiries || [];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
        <h3 className="text-base font-bold text-red-900">Failed to load dashboard metrics</h3>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-brand-red text-white text-xs font-bold rounded-lg"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Title & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <span className="text-xs font-bold text-brand-gold-dark uppercase tracking-wider block">
            Executive Overview
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-text-main">
            CMS Operations Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/movies/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-brand-red hover:bg-brand-red-hover shadow-cinema transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Movie</span>
          </Link>

          <Link
            to="/enquiries"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-text-main bg-white border border-border-subtle hover:bg-surface-light transition-all"
          >
            <Inbox className="w-4 h-4 text-brand-red" />
            <span>View All Enquiries</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Movies */}
        <div className="bg-white p-5 rounded-2xl border border-border-subtle shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Total Movies
            </span>
            <div className="font-display font-black text-3xl text-text-main mt-1">
              {metrics?.totalMovies ?? 0}
            </div>
            <span className="text-[11px] text-text-secondary mt-1 block">
              {metrics?.publishedMovies ?? 0} published publicly
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-brand-red flex items-center justify-center">
            <Film className="w-6 h-6" />
          </div>
        </div>

        {/* Upcoming Movies */}
        <div className="bg-white p-5 rounded-2xl border border-border-subtle shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Upcoming Movies
            </span>
            <div className="font-display font-black text-3xl text-brand-gold-dark mt-1">
              {metrics?.upcomingMovies ?? 0}
            </div>
            <span className="text-[11px] text-text-secondary mt-1 block">
              Scheduled theatrical rollouts
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-brand-gold-dark flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Released Movies */}
        <div className="bg-white p-5 rounded-2xl border border-border-subtle shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Released Movies
            </span>
            <div className="font-display font-black text-3xl text-emerald-700 mt-1">
              {metrics?.releasedMovies ?? 0}
            </div>
            <span className="text-[11px] text-text-secondary mt-1 block">
              Theatrical titles in circuit
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* New Enquiries */}
        <div className="bg-white p-5 rounded-2xl border border-border-subtle shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              New Enquiries
            </span>
            <div className="font-display font-black text-3xl text-brand-red mt-1">
              {metrics?.newEnquiries ?? 0}
            </div>
            <span className="text-[11px] text-text-secondary mt-1 block">
              {metrics?.totalEnquiries ?? 0} total enquiries logged
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-brand-red flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Enquiries & Recent Activity Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Recent Enquiries */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-border-subtle shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4">
            <h2 className="font-display font-bold text-lg text-text-main flex items-center gap-2">
              <Inbox className="w-5 h-5 text-brand-red" />
              <span>Recent Submissions & Partnership Enquiries</span>
            </h2>
            <Link
              to="/enquiries"
              className="text-xs font-bold text-brand-red hover:underline"
            >
              View All →
            </Link>
          </div>

          {recentEnquiries.length > 0 ? (
            <div className="divide-y divide-border-subtle">
              {recentEnquiries.map((enq: any) => (
                <div key={enq._id} className="py-3.5 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-brand-red">
                        {enq.referenceNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          enq.status === 'New'
                            ? 'bg-red-50 text-brand-red border border-red-200'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </div>
                    <p className="font-semibold text-sm text-text-main mt-0.5">{enq.fullName}</p>
                    <p className="text-xs text-text-secondary">
                      {enq.companyOrTheatre ? `${enq.companyOrTheatre} • ` : ''}
                      {enq.enquiryType}
                    </p>
                  </div>

                  <span className="text-[11px] text-text-muted shrink-0">
                    {new Date(enq.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted py-6 text-center">No enquiries recorded yet.</p>
          )}
        </div>

        {/* Right: Recent Audit Activities */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-border-subtle shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4">
            <h2 className="font-display font-bold text-lg text-text-main flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-gold-dark" />
              <span>Recent Administrative Changes</span>
            </h2>
            <Link
              to="/audit-logs"
              className="text-xs font-bold text-brand-gold-dark hover:underline"
            >
              All Logs →
            </Link>
          </div>

          {recentAudits.length > 0 ? (
            <div className="space-y-3">
              {recentAudits.map((log: any) => (
                <div
                  key={log._id}
                  className="p-3 rounded-xl bg-surface-light border border-border-subtle text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text-main font-mono text-[11px]">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-text-secondary">
                    By <span className="font-semibold text-text-main">{log.actorEmail}</span> on{' '}
                    <span className="font-semibold">{log.entityType}</span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted py-6 text-center">No recent activity logs.</p>
          )}
        </div>
      </div>
    </div>
  );
};
