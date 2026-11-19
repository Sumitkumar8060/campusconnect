import React, { useState, useEffect, useCallback } from 'react';
import { Check, X, Loader2, Edit3, Trash2, RefreshCw } from 'lucide-react';
import { getMyActivities, handleRequestAction, cancelActivity, cancelJoinRequest } from '../api/companionsApi';

export default function MyActivitiesTab() {
  const [subTab, setSubTab] = useState('created');
  const [data, setData] = useState({ created: [], joined: [], incoming: [], outgoing: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // id of item being actioned

  const toast = (msg, isError = false) => {
    setFeedback({ msg, isError });
    setTimeout(() => setFeedback(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyActivities();
      if (res.success) {
        setData({
          created: res.created || [],
          joined: res.joined || [],
          incoming: res.incoming || [],
          outgoing: res.outgoing || [],
        });
      } else {
        setError(res.message || 'Failed to load your activities.');
      }
    } catch (err) {
      setError('Failed to load your activities. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCancelActivity = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this activity?')) return;
    setActionLoading(id);
    try {
      const res = await cancelActivity(id);
      if (res.success) {
        toast('Activity cancelled.');
        setData((prev) => ({
          ...prev,
          created: prev.created.map((a) => a.id === id ? { ...a, status: 'Cancelled' } : a),
        }));
      } else {
        toast(res.message || 'Failed to cancel activity.', true);
      }
    } catch (err) {
      toast(err?.response?.data?.message || 'Failed to cancel activity.', true);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAccept = async (requestId) => {
    setActionLoading(requestId);
    try {
      const res = await handleRequestAction(requestId, 'accepted');
      if (res.success) {
        toast('Request accepted!');
        setData((prev) => ({
          ...prev,
          incoming: prev.incoming.map((r) =>
            r.id === requestId ? { ...r, status: 'Accepted' } : r
          ),
        }));
      } else {
        toast(res.message || 'Failed to accept request.', true);
      }
    } catch (err) {
      toast(err?.response?.data?.message || 'Failed to accept request.', true);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId) => {
    setActionLoading(requestId);
    try {
      const res = await handleRequestAction(requestId, 'rejected');
      if (res.success) {
        toast('Request rejected.');
        setData((prev) => ({
          ...prev,
          incoming: prev.incoming.map((r) =>
            r.id === requestId ? { ...r, status: 'Rejected' } : r
          ),
        }));
      } else {
        toast(res.message || 'Failed to reject request.', true);
      }
    } catch (err) {
      toast(err?.response?.data?.message || 'Failed to reject.', true);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLeave = async (myRequestId) => {
    if (!myRequestId) { toast('Could not identify your request. Please refresh.', true); return; }
    if (!window.confirm('Are you sure you want to leave this activity?')) return;
    setActionLoading(myRequestId);
    try {
      const res = await cancelJoinRequest(myRequestId);
      if (res.success) {
        toast('You have left the activity.');
        setData((prev) => ({
          ...prev,
          joined: prev.joined.filter((a) => a.myRequestId !== myRequestId),
        }));
      } else {
        toast(res.message || 'Failed to leave activity.', true);
      }
    } catch (err) {
      toast(err?.response?.data?.message || 'Failed to leave activity.', true);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelOutgoing = async (requestId) => {
    setActionLoading(requestId);
    try {
      const res = await cancelJoinRequest(requestId);
      if (res.success) {
        toast('Request cancelled.');
        setData((prev) => ({
          ...prev,
          outgoing: prev.outgoing.filter((r) => r.id !== requestId),
        }));
      } else {
        toast(res.message || 'Failed to cancel request.', true);
      }
    } catch (err) {
      toast(err?.response?.data?.message || 'Failed to cancel.', true);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#171717]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 px-4 rounded-3xl bg-white border border-[#D5D1C9]">
        <p className="text-sm text-red-600 font-semibold">{error}</p>
        <button
          onClick={load}
          className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-[#171717] text-white cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  // Count pending incoming requests
  const pendingCount = data.incoming.filter((r) => r.status === 'Pending').length;
  // All requests (incoming + outgoing) for the "Requests" tab
  const allRequests = [...data.incoming, ...data.outgoing];

  return (
    <div className="space-y-6">

      {/* Feedback Toast */}
      {feedback && (
        <div className={`p-3.5 rounded-xl border text-xs font-semibold ${
          feedback.isError
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          {feedback.msg}
        </div>
      )}

      {/* Sub-tab Pills */}
      <div className="flex border-b border-[#D5D1C9] space-x-6">
        {[
          { key: 'created', label: `Created by Me (${data.created.length})` },
          {
            key: 'requests',
            label: `Requests (${allRequests.length})`,
            badge: pendingCount > 0 ? pendingCount : null,
          },
          { key: 'joined', label: `Joined Activities (${data.joined.length})` },
        ].map(({ key, label, badge }) => (
          <button
            key={key}
            type="button"
            onClick={() => setSubTab(key)}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-tight cursor-pointer transition-colors relative flex items-center gap-1.5 ${
              subTab === key
                ? 'text-[#171717] border-b-2 border-[#171717]'
                : 'text-[#666666] hover:text-[#171717]'
            }`}
          >
            {label}
            {badge && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold">
                {badge}
              </span>
            )}
          </button>
        ))}

        <button
          type="button"
          onClick={load}
          className="ml-auto pb-3 text-[#777777] hover:text-[#171717] transition-colors cursor-pointer"
          title="Refresh"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Tab 1: Created by Me ── */}
      {subTab === 'created' && (
        <div className="space-y-4">
          {data.created.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-[#D5D1C9]">
              <p className="text-sm text-[#555555]">You haven&apos;t posted any activities yet.</p>
            </div>
          ) : (
            data.created.map((act) => (
              <div
                key={act.id}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-[#D5D1C9] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-white bg-[#171717] px-2.5 py-0.5 rounded-full">
                      {act.category}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      act.status === 'Open' ? 'bg-emerald-100 text-emerald-800' :
                      act.status === 'Full' ? 'bg-amber-100 text-amber-800' :
                      act.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {act.status}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#171717] mt-2">{act.title}</h4>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#555555]">
                    <span>{act.date} at {act.time}</span>
                    <span>•</span>
                    <span>{act.location}</span>
                    <span>•</span>
                    <span className="font-semibold text-[#171717]">
                      {act.currentParticipants}/{act.maxParticipants} Joined
                    </span>
                  </div>
                </div>

                {act.status !== 'Cancelled' && (
                  <button
                    type="button"
                    disabled={actionLoading === act.id}
                    onClick={() => handleCancelActivity(act.id)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading === act.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    Cancel Activity
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Tab 2: Requests ── */}
      {subTab === 'requests' && (
        <div className="space-y-6">
          {/* Incoming */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#555555] mb-3">
              Incoming Requests (Received)
            </h3>
            {data.incoming.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-2xl border border-[#D5D1C9]">
                <p className="text-sm text-[#555555]">No incoming requests yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.incoming.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl bg-white border border-[#D5D1C9] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={req.requester.avatar}
                        alt={req.requester.name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-[#171717]">{req.requester.name}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            req.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' :
                            req.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#555555] mt-0.5">
                          For: <strong className="text-[#171717] font-semibold">{req.activityTitle}</strong>
                        </p>
                        {req.note && <p className="text-xs text-[#777777] italic mt-1">"{req.note}"</p>}
                      </div>
                    </div>

                    {req.status === 'Pending' && (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          disabled={actionLoading === req.id}
                          onClick={() => handleAccept(req.id)}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold bg-[#171717] text-white hover:bg-[#333333] cursor-pointer disabled:opacity-50"
                        >
                          {actionLoading === req.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                          Accept
                        </button>
                        <button
                          type="button"
                          disabled={actionLoading === req.id}
                          onClick={() => handleReject(req.id)}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer disabled:opacity-50"
                        >
                          {actionLoading === req.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Outgoing */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#555555] mb-3">
              Outgoing Requests (Sent)
            </h3>
            {data.outgoing.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-2xl border border-[#D5D1C9]">
                <p className="text-sm text-[#555555]">You haven&apos;t sent any requests yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.outgoing.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl bg-white border border-[#D5D1C9] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[#171717]">{req.activityTitle}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          req.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' :
                          req.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#555555] mt-0.5">Host: {req.host?.name}</p>
                      {req.note && <p className="text-xs text-[#777777] italic mt-1">"{req.note}"</p>}
                    </div>

                    {req.status === 'Pending' && (
                      <button
                        type="button"
                        disabled={actionLoading === req.id}
                        onClick={() => handleCancelOutgoing(req.id)}
                        className="h-9 px-4 rounded-xl text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                      >
                        {actionLoading === req.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                        Cancel Request
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tab 3: Joined Activities ── */}
      {subTab === 'joined' && (
        <div className="space-y-4">
          {data.joined.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-[#D5D1C9]">
              <p className="text-sm text-[#555555]">You haven&apos;t joined any activities yet.</p>
            </div>
          ) : (
            data.joined.map((act) => (
              <div
                key={act.id}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-[#D5D1C9] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[11px] font-bold text-[#171717] bg-[#EDEBE6] px-2.5 py-0.5 rounded-full">
                    {act.category}
                  </span>
                  <h4 className="text-base font-bold text-[#171717] mt-2">{act.title}</h4>
                  <p className="text-xs text-[#555555] mt-1">Host: {act.host?.name}</p>
                  <p className="text-xs text-[#777777] mt-1">{act.date} at {act.time} • {act.location}</p>
                </div>

                <button
                  type="button"
                  disabled={!!actionLoading}
                  onClick={() => handleLeave(act.myRequestId)}
                  className="h-9 px-4 rounded-xl text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 cursor-pointer disabled:opacity-50"
                >
                  Leave Activity
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
