// src/components/ReportUserModal.jsx
import React, { useState } from 'react';
import { X, Flag, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ReportUserModal({ userName, onClose }) {
  const [reason, setReason] = useState('inappropriate_behavior');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#D5D1C9] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-rose-600" />
            <h3 className="font-bold text-base text-[#171717]">Report Student Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-stone-900 text-lg">Report Submitted</h4>
            <p className="text-xs text-stone-600 mt-1 max-w-xs">
              Thank you for keeping CampusConnect safe. Campus student moderators will inspect this report within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-xs text-stone-600">
              You are reporting <strong>{userName}</strong>. All reports are strictly anonymous and kept confidential.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Reason for Report
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#171717]"
              >
                <option value="inappropriate_behavior">Harassment or Inappropriate Conduct</option>
                <option value="fake_account">Fake Student Identity / Impersonation</option>
                <option value="scam_listing">Suspicious or Scam Listing / Fraud</option>
                <option value="spam">Spamming / Promotional Messages</option>
                <option value="other">Other Campus Code Violation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Additional Details (Optional)
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe what occurred or paste relevant listing references..."
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#171717]"
              />
            </div>

            <div className="flex items-start gap-2 p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>Misuse of reports against fellow students violates the Campus Community Guidelines.</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}