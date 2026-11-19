import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Home,
  CheckCircle,
  ShieldCheck,
  AlertTriangle,
  Check,
} from 'lucide-react';

export default function RoomDetailsView({ room, onBack, onSendEnquiry }) {
  const [enquirySent, setEnquirySent] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  if (!room) return null;

  const {
    title,
    roomType,
    propertyType,
    monthlyRent,
    securityDeposit,
    location,
    description,
    availableSpaces,
    furnishing,
    bathroom,
    availableFrom,
    amenities = [],
    rules,
    image,
    owner,
  } = room;

  const handleEnquiry = () => {
    setEnquirySent(true);
    if (onSendEnquiry) onSendEnquiry(room);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#555555] hover:text-[#171717] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Listings
      </button>

      <div className="rounded-3xl bg-white border border-[#D5D1C9] shadow-xl overflow-hidden">
        
        {/* Cover Photo Gallery */}
        <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden bg-[#E5E2DC]">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-full bg-[#171717]/85 backdrop-blur-md text-xs font-semibold text-white">
              {roomType}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-semibold text-[#171717]">
              {furnishing}
            </span>
          </div>

          <div className="absolute bottom-4 right-4 text-white text-right">
            <p className="text-2xl font-extrabold">₹{monthlyRent.toLocaleString()} <span className="text-xs font-normal">/ month</span></p>
            <p className="text-xs text-white/90">Deposit: ₹{securityDeposit.toLocaleString()}</p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-8">
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
              {title}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#444444] leading-relaxed">
              {description}
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#EDEBE6]/40 border border-[#D5D1C9]">
            <div>
              <p className="text-[10px] font-semibold text-[#666666] uppercase">Location</p>
              <p className="text-xs font-bold text-[#171717] truncate">{location}</p>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-[#666666] uppercase">Bathroom</p>
              <p className="text-xs font-bold text-[#171717]">{bathroom}</p>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-[#666666] uppercase">Spaces</p>
              <p className="text-xs font-bold text-[#171717]">{availableSpaces} available</p>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-[#666666] uppercase">Available From</p>
              <p className="text-xs font-bold text-[#171717]">{availableFrom}</p>
            </div>
          </div>

          {/* Facilities & Amenities */}
          <div>
            <h3 className="text-sm font-bold text-[#171717] uppercase tracking-wider mb-2.5">
              Facilities & Amenities
            </h3>
            <div className="flex flex-wrap gap-2">
              {amenities.map((item) => (
                <span key={item} className="px-3 py-1 rounded-xl bg-[#EDEBE6] text-xs font-semibold text-[#171717]">
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>

          {/* House Rules */}
          <div>
            <h3 className="text-sm font-bold text-[#171717] uppercase tracking-wider mb-2">
              House Rules
            </h3>
            <p className="text-sm text-[#444444] p-4 rounded-xl bg-[#EDEBE6]/30 border border-[#D5D1C9]/60">
              {rules}
            </p>
          </div>

          {/* Owner Profile */}
          <div className="p-5 rounded-2xl bg-white border border-[#D5D1C9] flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <img
                src={owner.avatar}
                alt={owner.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#171717]"
              />
              <div>
                <p className="text-xs font-bold text-[#666666] uppercase">Listed by Student</p>
                <p className="text-sm font-bold text-[#171717] flex items-center gap-1.5">
                  {owner.name}
                  {owner.verified && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                </p>
                <p className="text-xs text-[#555555]">{owner.course}</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Student
            </span>
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-[#D5D1C9] flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="text-xs text-red-600 hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Report listing
            </button>

            <div className="w-full sm:w-auto">
              {enquirySent ? (
                <div className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                  <Check className="w-4 h-4" />
                  Enquiry Sent to {owner.name}! (Demo confirmation)
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleEnquiry}
                  className="w-full sm:w-auto h-11 px-8 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#171717] hover:bg-[#333333] transition-all duration-200 shadow-sm cursor-pointer"
                >
                  Send Enquiry
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Demo Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 border border-[#D5D1C9] shadow-xl">
            <h4 className="text-base font-bold text-[#171717]">Report Property Listing</h4>
            <p className="text-xs text-[#555555] mt-1.5">
              Select reason for reporting this room:
            </p>
            <div className="mt-3 space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="reason" defaultChecked className="accent-[#171717]" />
                Inaccurate details, rent mismatch or fake photo
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="reason" className="accent-[#171717]" />
                Suspicious or unauthorized listing
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