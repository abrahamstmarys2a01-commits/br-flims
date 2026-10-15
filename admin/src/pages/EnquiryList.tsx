import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Inbox,
  Search,
  Download,
  Filter,
  Eye,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertTriangle,
  User,
  Building,
  Phone,
  Mail,
  X,
  FileText,
} from 'lucide-react';
import {
  getAdminEnquiries,
  updateEnquiryStatus,
  addEnquiryNote,
  getExportCsvUrl,
} from '../api/enquiries';
import { IEnquiry, EnquiryStatus } from '../types/enquiry';

export const EnquiryList: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showSpam, setShowSpam] = useState(false);
  const [page, setPage] = useState(1);

  // Selected enquiry for detail modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<IEnquiry | null>(null);
  const [noteText, setNoteText] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-enquiries-list', page, searchTerm, statusFilter, typeFilter, showSpam],
    queryFn: () =>
      getAdminEnquiries({
        page,
        limit: 15,
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        enquiryType: typeFilter !== 'all' ? typeFilter : undefined,
        isSpam: showSpam,
      }),
  });

  const enquiries = data?.data || [];
  const pagination = data?.pagination;

  // Status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, isSpam }: { id: string; status?: EnquiryStatus; isSpam?: boolean }) =>
      updateEnquiryStatus(id, { status, isSpam }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-enquiries-list'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      if (selectedEnquiry && res.data) {
        setSelectedEnquiry(res.data);
      }
    },
  });

  // Note mutation
  const addNoteMutation = useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) => addEnquiryNote(id, text),
    onSuccess: (res) => {
      setNoteText('');
      queryClient.invalidateQueries({ queryKey: ['admin-enquiries-list'] });
      if (selectedEnquiry && res.data) {
        setSelectedEnquiry(res.data);
      }
    },
  });

  const handleExportCsv = () => {
    window.open(getExportCsvUrl(), '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <span className="text-xs font-bold text-brand-gold-dark uppercase tracking-wider block">
            Partner Inquiries
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-text-main">
            Manage Business Enquiries
          </h1>
        </div>

        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold bg-white border border-border-subtle hover:bg-surface-light text-text-main shadow-xs"
        >
          <Download className="w-4 h-4 text-brand-red" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-border-subtle shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search ref #, name, theatre, movie..."
            className="w-full pl-10 pr-4 py-2 rounded-lg text-xs sm:text-sm bg-surface-light border border-border-subtle focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 rounded-lg text-xs sm:text-sm bg-surface-light border border-border-subtle focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Contacted">Contacted</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 rounded-lg text-xs sm:text-sm bg-surface-light border border-border-subtle focus:outline-none"
          >
            <option value="all">All Enquiry Types</option>
            <option value="Theatre / Exhibitor Partnership">Theatre / Exhibitor Partnership</option>
            <option value="Film Distribution Proposal">Film Distribution Proposal</option>
            <option value="Producer / Film Submission">Producer / Film Submission</option>
            <option value="Business Partnership">Business Partnership</option>
            <option value="General Enquiry">General Enquiry</option>
          </select>
        </div>

        <div className="sm:col-span-1 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setShowSpam(!showSpam)}
            className={`w-full py-2 rounded-lg text-xs font-bold border ${
              showSpam
                ? 'bg-red-50 text-red-700 border-red-300'
                : 'bg-surface-light text-text-muted border-border-subtle'
            }`}
            title="Toggle Spam Inquiries"
          >
            {showSpam ? 'Spam' : 'Inbox'}
          </button>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-xl border border-border-subtle shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-text-muted">Loading inquiries...</div>
        ) : enquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-surface-light border-b border-border-subtle text-text-muted uppercase text-[11px] font-bold">
                <tr>
                  <th className="py-3 px-4">Ref Number</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Company / Theatre</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Movie / Territory</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {enquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-surface-warm/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-brand-red text-xs">
                      {enq.referenceNumber}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-text-main">{enq.fullName}</p>
                      <p className="text-[11px] text-text-muted">{enq.email}</p>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">
                      {enq.companyOrTheatre || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-semibold text-text-main block">
                        {enq.enquiryType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-secondary text-xs">
                      <span className="font-bold text-text-main block">
                        {enq.movieTitle || '—'}
                      </span>
                      <span className="text-[11px] text-text-muted">{enq.territory || ''}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          enq.status === 'New'
                            ? 'bg-red-50 text-brand-red border border-red-200'
                            : enq.status === 'In Progress'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : enq.status === 'Contacted'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-muted text-xs">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedEnquiry(enq)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-surface-light border border-border-subtle rounded hover:bg-surface-warm hover:text-brand-red"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-text-muted">
            <Inbox className="w-12 h-12 mx-auto mb-2 opacity-40" />
            <p className="font-semibold text-text-main">No inquiries recorded matching filter.</p>
          </div>
        )}
      </div>

      {/* Enquiry Detail Modal Drawer */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-xl border border-border-subtle animate-fadeIn">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-brand-red">
                  {selectedEnquiry.referenceNumber}
                </span>
                <h3 className="font-display font-bold text-xl text-text-main mt-0.5">
                  Enquiry Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 rounded text-text-muted hover:text-text-main"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Submitter Info Grid */}
            <div className="grid grid-cols-2 gap-4 bg-surface-light p-4 rounded-xl text-xs">
              <div>
                <span className="font-bold text-text-muted uppercase block">Contact Name</span>
                <span className="font-bold text-text-main text-sm">{selectedEnquiry.fullName}</span>
              </div>
              <div>
                <span className="font-bold text-text-muted uppercase block">Company / Theatre</span>
                <span className="font-bold text-text-main text-sm">
                  {selectedEnquiry.companyOrTheatre || 'N/A'}
                </span>
              </div>
              <div>
                <span className="font-bold text-text-muted uppercase block">Email Address</span>
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="font-medium text-brand-red hover:underline"
                >
                  {selectedEnquiry.email}
                </a>
              </div>
              <div>
                <span className="font-bold text-text-muted uppercase block">Mobile Phone</span>
                <a
                  href={`tel:${selectedEnquiry.mobileNumber}`}
                  className="font-medium text-text-main"
                >
                  {selectedEnquiry.mobileNumber}
                </a>
              </div>
              <div>
                <span className="font-bold text-text-muted uppercase block">Enquiry Type</span>
                <span className="font-semibold text-text-main">{selectedEnquiry.enquiryType}</span>
              </div>
              <div>
                <span className="font-bold text-text-muted uppercase block">Movie / Territory</span>
                <span className="font-semibold text-text-main">
                  {selectedEnquiry.movieTitle || 'General'} ({selectedEnquiry.territory || 'Unspecified'})
                </span>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-2">
                Enquiry Message
              </label>
              <div className="p-4 rounded-xl bg-surface-warm/40 border border-border-subtle text-xs sm:text-sm text-text-main whitespace-pre-wrap leading-relaxed">
                {selectedEnquiry.message}
              </div>
            </div>

            {/* Status Update Control */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border-subtle">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-main">Status:</span>
                {(['New', 'In Progress', 'Contacted', 'Closed'] as EnquiryStatus[]).map((st) => (
                  <button
                    key={st}
                    disabled={updateStatusMutation.isPending}
                    onClick={() =>
                      updateStatusMutation.mutate({ id: selectedEnquiry._id, status: st })
                    }
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      selectedEnquiry.status === st
                        ? 'bg-brand-red text-white shadow-xs'
                        : 'bg-surface-light text-text-secondary hover:bg-gray-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <button
                disabled={updateStatusMutation.isPending}
                onClick={() =>
                  updateStatusMutation.mutate({
                    id: selectedEnquiry._id,
                    isSpam: !selectedEnquiry.isSpam,
                  })
                }
                className="text-xs font-bold text-red-600 hover:underline"
              >
                {selectedEnquiry.isSpam ? 'Unmark Spam' : 'Mark as Spam'}
              </button>
            </div>

            {/* Internal Notes Section */}
            <div className="space-y-3 pt-4 border-t border-border-subtle">
              <h4 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-brand-gold-dark" />
                <span>Internal Notes (Private to Administrators)</span>
              </h4>

              {selectedEnquiry.internalNotes && selectedEnquiry.internalNotes.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedEnquiry.internalNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-surface-light border border-border-subtle text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px] text-text-muted">
                        <span className="font-semibold text-text-main">{note.authorEmail}</span>
                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-text-secondary">{note.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-text-muted">No internal notes added yet.</p>
              )}

              {/* Add Note Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add private operational follow-up note..."
                  className="flex-1 px-3 py-2 text-xs bg-surface-light border border-border-subtle rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-red"
                />
                <button
                  disabled={!noteText.trim() || addNoteMutation.isPending}
                  onClick={() =>
                    addNoteMutation.mutate({ id: selectedEnquiry._id, text: noteText })
                  }
                  className="px-4 py-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold rounded-lg disabled:opacity-40"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
