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

export default function StorageOfferDetails({ offer, matchingRequests = [], onBack, onRequestStorage }) {
  const [bookingSent, setBookingSent] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  if (!offer) return null;

  const {
    title,
    category,
    description,
    capacity,
    location,
    pricePerDay,
    pricePerWeek,
    startDate,
    endDate,
    features = [],
    rules,
    provider,
    status,
    image,
  } = offer;

  const isAvailable = status === 'Available';

  const handleBooking = () => {
    setBookingSent(true);
    if (onRequestStorage) onRequestStorage(offer);
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

      <div className="rounded-3xl bg-white border border-[#D5D1C9] shadow-xl overflow-hidden">
        
        {/* Cover Image */}
        <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden bg-[#E5E2DC]">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-full bg-[#171717]/85 backdrop-blur-md text-xs font-semibold text-white">
              {category}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              isAvailable ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
            }`}>
              {status}
            </span>
          </div>

          <div className="absolute bottom-4 right-4 text-white text-right">
            <p className="text-2xl font-extrabold">₹{pricePerDay} <span className="text-xs font-normal">/ day</span></p>
            {pricePerWeek && <p className="text-xs text-white/90">₹{pricePerWeek} / week</p>}
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#EDEBE6]/40 border border-[#D5D1C9]">
            <div className="flex items-center gap-3">
              <Box className="w-5 h-5 text-[#171717]" />
              <div>
                <p className="text-[10px] font-semibold text-[#666666] uppercase">Capacity</p>
                <p className="text-xs font-bold text-[#171717]">{capacity}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#171717]" />
              <div>
                <p className="text-[10px] font-semibold text-[#666666] uppercase">Availability</p>
                <p className="text-xs font-bold text-[#171717]">{startDate} → {endDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#171717]" />
              <div className="truncate">
                <p className="text-[10px] font-semibold text-[#666666] uppercase">Location</p>
                <p className="text-xs font-bold text-[#171717] truncate">{location}</p>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div>
            <h3 className="text-sm font-bold text-[#171717] uppercase tracking-wider mb-2.5">
              Storage Features
            </h3>
            <div className="flex flex-wrap gap-2">
              {features.map((f) => (
                <span key={f} className="px-3 py-1 rounded-xl bg-[#EDEBE6] text-xs font-semibold text-[#171717]">
                  ✓ {f}
                </span>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div>
            <h3 className="text-sm font-bold text-[#171717] uppercase tracking-wider mb-2">
              Storage Rules & Conditions
            </h3>
            <p className="text-sm text-[#444444] p-4 rounded-xl bg-[#EDEBE6]/30 border border-[#D5D1C9]/60">
              {rules}
            </p>
          </div>

          {/* Provider Profile */}
          <div className="p-5 rounded-2xl bg-white border border-[#D5D1C9] flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <img
                src={provider.avatar}
                alt={provider.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#171717]"
              />
              <div>
                <p className="text-xs font-bold text-[#666666] uppercase">Space Provider</p>
                <p className="text-sm font-bold text-[#171717] flex items-center gap-1.5">
                  {provider.name}
                  {provider.verified && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                </p>
                <p className="text-xs text-[#555555]">{provider.course}</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Student
            </span>
          </div>

          {/* Matching Requests */}
          {matchingRequests.length > 0 && (
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-900">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Students Needing Storage in this Area ({matchingRequests.length})
              </span>
              <div className="space-y-2">
                {matchingRequests.map((req) => (
                  <div key={req.id} className="p-3.5 rounded-xl bg-white border border-emerald-200 flex items-center justify-between gap-3 shadow-xs">
                    <div>
                      <p className="text-xs font-bold text-[#171717]">{req.title}</p>
                      <p className="text-[11px] text-[#666666]">Budget: ₹{req.estimatedBudget} • by {req.requester.name}</p>
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
              Report listing
            </button>

            <div className="w-full sm:w-auto">
              {bookingSent ? (
                <div className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                  <Check className="w-4 h-4" />
                  Storage Request Sent to {provider.name}! (Demo confirmation)
                </div>
              ) : (
                <button
                  type="button"
                  disabled={!isAvailable}
                  onClick={handleBooking}
                  className={`w-full sm:w-auto h-11 px-8 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm cursor-pointer ${
                    !isAvailable
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#171717] text-white hover:bg-[#333333]'
                  }`}
                >
                  {isAvailable ? 'Request Storage Space' : 'Space Unavailable'}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}