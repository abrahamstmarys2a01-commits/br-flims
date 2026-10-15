import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, Search, Filter, Clock, User } from 'lucide-react';
import { getAuditLogs } from '../api/admin';

export const AuditLogs: React.FC = () => {
  const [page, setPage] = useState(1);
  const [entityFilter, setEntityFilter] = useState('all');
  const [actorEmail, setActorEmail] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-audit-logs', page, entityFilter, actorEmail],
    queryFn: () =>
      getAuditLogs({
        page,
        limit: 25,
        entityType: entityFilter !== 'all' ? entityFilter : undefined,
        actorEmail: actorEmail || undefined,
      }),
  });

  const logs = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6 pb-20">
      <div className="border-b border-border-subtle pb-6">
        <span className="text-xs font-bold text-brand-gold-dark uppercase tracking-wider block">
          Compliance & History
        </span>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-text-main">
          Security & Audit Logs
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Chronological record of administrative modifications, logins, and publishing events.
        </p>
      </div>

      {/* Filter and search */}
      <div className="bg-white p-4 rounded-xl border border-border-subtle shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={actorEmail}
            onChange={(e) => {
              setActorEmail(e.target.value);
              setPage(1);
            }}
            placeholder="Search by actor email..."
            className="w-full pl-10 pr-4 py-2 rounded-lg text-xs sm:text-sm bg-surface-light border border-border-subtle focus:outline-none"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={entityFilter}
            onChange={(e) => {
              setEntityFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 rounded-lg text-xs sm:text-sm bg-surface-light border border-border-subtle focus:outline-none"
          >
            <option value="all">All Entity Types</option>
            <option value="Movie">Movie Changes</option>
            <option value="Enquiry">Enquiries</option>
            <option value="SiteSetting">Site Settings</option>
            <option value="AdminUser">Admin User Logins & Accounts</option>
            <option value="Media">Media Uploads</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border-subtle shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-text-muted">Loading audit history...</div>
        ) : logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-surface-light border-b border-border-subtle text-text-muted uppercase text-[11px] font-bold">
                <tr>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-mono text-xs">
                {logs.map((log: any) => (
                  <tr key={log._id} className="hover:bg-surface-warm/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-brand-red">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-text-main font-semibold">
                      {log.entityType}
                    </td>
                    <td className="py-3 px-4 text-text-secondary font-sans">
                      {log.actorEmail}
                    </td>
                    <td className="py-3 px-4 text-text-muted font-sans text-[11px] max-w-xs truncate">
                      {JSON.stringify(log.details || {})}
                    </td>
                    <td className="py-3 px-4 text-text-muted text-[11px] font-sans">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-text-muted">
            <ShieldCheck className="w-12 h-12 mx-auto mb-2 opacity-40 text-brand-gold-dark" />
            <p className="font-semibold text-text-main">No audit logs matching query.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 rounded-lg border border-border-subtle text-xs font-bold disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-text-secondary px-2">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-lg border border-border-subtle text-xs font-bold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
