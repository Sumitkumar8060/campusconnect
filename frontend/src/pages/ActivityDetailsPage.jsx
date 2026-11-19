import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Calendar, Clock, MapPin, Users, CheckCircle, ShieldCheck,
  AlertTriangle, Send, Check, Loader2, X,
} from 'lucide-react';
import { getActivityById, requestToJoin } from '../api/companionsApi';

export default function ActivityDetailsPage({ activityId, onBack, onJoinRequested }) {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  useEffect(() => {
    if (!activityId) return;
    setLoading(true);
    setError(null);
    getActivityById(activityId)
      .then((data) => {
        if (data.success) setActivity(data.activity);
        else setError(data.message || 'Failed to load activity.');
      })
      .catch(() => setError('Failed to load activity.'))
      .finally(() => setLoading(false));
  }, [activityId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#171717]" />
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <p className="text-base text-red-600">{error || 'Activity not found.'}</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 rounded-xl bg-[#171717] text-white text-xs font-semibold cursor-pointer"
        >
          Back to Activities
        </button>
      </div>
    );
  }

  const {
    id, title, description, category, host, date, time, location,
    maxParticipants, currentParticipants, availableSlots, status,
    requirements, participants = [], image, isCreatedByMe,
    hasRequested, userRequestStatus,
  } = activity;

  const isFull = status === 'Full' || availableSlots <= 0;
  const isCancelled = status === 'Cancelled';
  const isCompleted = status === 'Completed';
  const canRequest = !isFull && !isCancelled && !isCompleted && !isCreatedByMe && !hasRequested;

  const handleRequestJoin = async () => {
    setJoining(true);
    setJoinError(null);
    try {
      const data = await requestToJoin(id);
      if (data.success) {
        setActivity((prev) => ({ ...prev, hasRequested: true, userRequestStatus: 'Pending' }));
        if (onJoinRequested) onJoinRequested(id);
      } else {
        setJoinError(data.message || 'Failed to send request.');
      }
    } catch (err) {
      setJoinError(err?.response?.data?.message || 'Failed to send request.');
    } finally {
      setJoining(false);
    }
  };

  const getJoinButtonContent = () => {
    if (joining) return <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>;
    if (hasRequested) {
      if (userRequestStatus === 'Accepted')
        return <><CheckCircle className="w-4 h-4" /> You&apos;re In!</>;
      if (userRequestStatus === 'Rejected')
        return <><X className="w-4 h-4" /> Request Rejected</>;
      return <><Check className="w-4 h-4" /> Request Sent — Pending</>;
    }
    if (isFull) return 'Activity is Full';
    if (isCancelled) return 'Activity Cancelled';
    if (isCompleted) return 'Activity Completed';
    return <><Send className="w-4 h-4" /> Request to Join</>;
  };

  const isButtonDisabled =
    joining || hasRequested || isFull || isCancelled || isCompleted || isCreatedByMe;

  const buttonClass = (() => {
    if (hasRequested && userRequestStatus === 'Accepted')
      return 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default';
    if (hasRequested && userRequestStatus === 'Rejected')
      return 'bg-red-50 text-red-700 border border-red-200 cursor-default';
    if (hasRequested)
      return 'bg-amber-50 text-amber-800 border border-amber-200 cursor-default';
    if (isCreatedByMe)
      return 'bg-[#EDEBE6] text-[#555555] border border-[#D5D1C9] cursor-default';
    if (isButtonDisabled)
      return 'bg-gray-300 text-gray-500 cursor-not-allowed';
    return 'bg-[#171717] text-white hover:bg-[#333333] hover:scale-[1.02] active:scale-[0.98] cursor-pointer';
  })();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">

      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#555555] hover:text-[#171717] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Activities
      </button>

      <div className="rounded-3xl bg-white border border-[#D5D1C9] shadow-xl overflow-hidden">

        {/* Cover */}
        <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden bg-[#E5E2DC]">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-full bg-[#171717]/85 backdrop-blur-md text-xs font-semibold text-white">
              {category}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              isFull ? 'bg-amber-100 text-amber-900' :
              isCancelled ? 'bg-red-100 text-red-900' :
              isCompleted ? 'bg-gray-100 text-gray-800' :
              'bg-emerald-100 text-emerald-900'
            }`}>
              {isFull ? 'Full' : `${availableSlots} Slots Available`}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-10 space-y-8">

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">{title}</h1>
            <p className="mt-3 text-sm sm:text-base text-[#444444] leading-relaxed">{description}</p>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#EDEBE6]/50 border border-[#D5D1C9]">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#171717]" />
              <div>
                <p className="text-[11px] font-semibold text-[#666666] uppercase">Date & Time</p>
                <p className="text-xs font-bold text-[#171717]">{date} at {time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#171717]" />
              <div className="truncate">
                <p className="text-[11px] font-semibold text-[#666666] uppercase">Location</p>
                <p className="text-xs font-bold text-[#171717] truncate">{location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[#171717]" />
              <div>
                <p className="text-[11px] font-semibold text-[#666666] uppercase">Capacity</p>
                <p className="text-xs font-bold text-[#171717]">{currentParticipants} / {maxParticipants} students</p>
              </div>
            </div>
          </div>

          {/* Host */}
          <div className="p-5 rounded-2xl bg-white border border-[#D5D1C9] flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <img
                src={host.avatar}
                alt={host.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#171717]"
              />
              <div>
                <p className="text-xs font-bold text-[#666666] uppercase">Activity Host</p>
                <p className="text-sm font-bold text-[#171717] flex items-center gap-1.5">
                  {host.name}
                  {host.verified && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                </p>
                <p className="text-xs text-[#555555]">{host.course || 'Student Peer'}</p>
              </div>
            </div>
            {isCreatedByMe && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#171717] text-xs font-semibold text-white">
                Your Activity
              </span>
            )}
            {!isCreatedByMe && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Student
              </span>
            )}
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-sm font-bold text-[#171717] uppercase tracking-wider mb-2">
              Requirements & Notes
            </h3>
            <p className="text-xs sm:text-sm text-[#555555] leading-relaxed p-4 rounded-xl bg-[#EDEBE6]/40 border border-[#D5D1C9]/60">
              {requirements}
            </p>
          </div>

          {/* Participants */}
          {participants.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-[#171717] uppercase tracking-wider mb-3">
                Confirmed Participants ({participants.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {participants.map((person, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#D5D1C9]">
                    <img src={person.avatar} alt={person.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-xs font-bold text-[#171717]">{person.name}</p>
                      <p className="text-[10px] text-[#777777]">{person.role || 'Member'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-6 border-t border-[#D5D1C9] flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="text-xs text-red-600 hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Report this activity
            </button>

            <div className="w-full sm:w-auto flex flex-col items-end gap-2">
              {joinError && (
                <p className="text-xs text-red-600 font-medium">{joinError}</p>
              )}
              {isCreatedByMe ? (
                <div className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-[#EDEBE6] text-[#555555] text-xs font-semibold border border-[#D5D1C9]">
                  You are the host
                </div>
              ) : (
                <button
                  type="button"
                  disabled={isButtonDisabled}
                  onClick={canRequest ? handleRequestJoin : undefined}
                  className={`w-full sm:w-auto h-11 px-8 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm inline-flex items-center justify-center gap-2 ${buttonClass}`}
                >
                  {getJoinButtonContent()}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 border border-[#D5D1C9] shadow-xl">
            <h4 className="text-base font-bold text-[#171717]">Report Activity</h4>
            <p className="text-xs text-[#555555] mt-2">Please select a reason for reporting:</p>
            <div className="mt-3 space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="reason" defaultChecked className="accent-[#171717]" />
                Inappropriate content or spam
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="reason" className="accent-[#171717]" />
                Suspicious or non-student activity
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#D5D1C9] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setReportSent(true);
                  setTimeout(() => { setReportModalOpen(false); setReportSent(false); }, 800);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white cursor-pointer"
              >
                {reportSent ? 'Reported!' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
