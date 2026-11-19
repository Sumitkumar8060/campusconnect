import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Box,
  CheckCircle,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Check,
} from 'lucide-react';

export default function StorageRequestDetails({ request, matchingOffers = [], onBack, onOfferStorage }) {
  const [offerSent, setOfferSent] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  if (!request) return null;

  const {
    title,
    category,
    description,
    belongingsSize,
    preferredLocation,
    startDate,
    endDate,
    estimatedBudget,
    specialRequirements,
    requester,
    status,
  } = request;

  const handleOfferStorage = () => {
    setOfferSent(true);
    if (onOfferStorage) onOfferStorage(request);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#555555] hover:text-[#171717] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Storage Options
      </button>

      <div className="rounded-3xl bg-white border border-[#D5D1C9] shadow-xl p-6 sm:p-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D5D1C9]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full bg-[#171717] text-xs font-semibold text-white">
                {category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
              {title}
            </h1>
            <p className="text-xs text-[#666666] mt-1">Belongings: <strong>{belongingsSize}</strong></p>
          </div>

          <div className="text-left sm:text-right p-4 rounded-2xl bg-[#EDEBE6]/60 border border-[#D5D1C9]">
            <p className="text-[11px] font-semibold text-[#666666] uppercase">Total Budget</p>
            <p className="text-2xl font-bold text-[#171717]">₹{estimatedBudget}</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-sm font-bold text-[#171717] uppercase tracking-wider mb-2">
            Description of Items
          </h3>
          <p className="text-sm sm:text-base text-[#444444] leading-relaxed">
            {description}
          </p>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#EDEBE6]/40 border border-[#D5D1C9]">
          <div className="flex items-center gap-3">
            <Box className="w-5 h-5 text-[#171717]" />
            <div>
              <p className="text-[10px] font-semibold text-[#666666] uppercase">Required Space</p>
              <p className="text-xs font-bold text-[#171717]">{belongingsSize}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#171717]" />
            <div>
              <p className="text-[10px] font-semibold text-[#666666] uppercase">Dates</p>
              <p className="text-xs font-bold text-[#171717]">{startDate} → {endDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#171717]" />
            <div className="truncate">
              <p className="text-[10px] font-semibold text-[#666666] uppercase">Location</p>
              <p className="text-xs font-bold text-[#171717] truncate">{preferredLocation}</p>
            </div>
          </div>
        </div>

        {/* Special Requirements */}
        <div>
          <h3 className="text-sm font-bold text-[#171717] uppercase tracking-wider mb-2">
            Special Storage Requirements
          </h3>
          <p className="text-sm text-[#444444] p-4 rounded-xl bg-[#EDEBE6]/30 border border-[#D5D1C9]/60">
            {specialRequirements}
          </p>
        </div>

        {/* Requester Profile */}
        <div className="p-5 rounded-2xl bg-white border border-[#D5D1C9] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <img
              src={requester.avatar}
              alt={requester.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#171717]"
            />
            <div>
              <p className="text-xs font-bold text-[#666666] uppercase">Requested by</p>
              <p className="text-sm font-bold text-[#171717] flex items-center gap-1.5">
                {requester.name}
                {requester.verified && <CheckCircle className="w-4 h-4 text-emerald-600" />}
              </p>
              <p className="text-xs text-[#555555]">{requester.course}</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Student
          </span>
        </div>

        {/* Matching Storage Offers */}
        {matchingOffers.length > 0 && (
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Available Storage Spaces in {preferredLocation} ({matchingOffers.length})
            </span>
            <div className="space-y-2">
              {matchingOffers.map((off) => (
                <div key={off.id} className="p-3.5 rounded-xl bg-white border border-emerald-200 flex items-center justify-between gap-3 shadow-xs">
                  <div>
                    <p className="text-xs font-bold text-[#171717]">{off.title}</p>
                    <p className="text-[11px] text-[#666666]">₹{off.pricePerDay}/day • by {off.provider.name}</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                    Matching Area
                  </span>
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
            <AlertTriangle className="w-3.5 h-3.5" />
            Report request
          </button>

          <div className="w-full sm:w-auto">
            {offerSent ? (
              <div className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                <Check className="w-4 h-4" />
                Storage Offer Sent to {requester.name}! (Demo confirmation)
              </div>
            ) : (
              <button
                type="button"
                onClick={handleOfferStorage}
                className="w-full sm:w-auto h-11 px-8 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#171717] hover:bg-[#333333] transition-all duration-200 shadow-sm cursor-pointer"
              >
                I Can Offer Storage for This Request
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Demo Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 border border-[#D5D1C9] shadow-xl">
            <h4 className="text-base font-bold text-[#171717]">Report Storage Request</h4>
            <p className="text-xs text-[#555555] mt-1.5">
              Select reason for reporting this listing:
            </p>
            <div className="mt-3 space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="reason" defaultChecked className="accent-[#171717]" />
                Inappropriate items or suspicious request
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="reason" className="accent-[#171717]" />
                Spam or unrealistic budget
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#D5D1C9]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Report submitted for review (Demo action).');
                  setReportModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}