import React from 'react';
import {
  Box,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle,
  ShieldCheck,
  Check,
} from 'lucide-react';

export default function StorageOfferCard({ offer, matchingRequestsCount = 0, onViewDetails }) {
  const {
    id,
    title,
    category,
    capacity,
    location,
    pricePerDay,
    pricePerWeek,
    startDate,
    endDate,
    features = [],
    provider,
    status,
    image,
  } = offer;

  const isAvailable = status === 'Available';

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-[#D5D1C9] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-[#171717]/40">
      <div>
        {/* Cover Photo & Status Badge */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E5E2DC]">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

          {/* Category Tag */}
          <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#171717]/85 backdrop-blur-md text-xs font-semibold text-white">
            {category}
          </span>

          {/* Status Badge */}
          <span
            className={`absolute top-3.5 right-3.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {status}
          </span>

          {/* Pricing Banner Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
            <div>
              <span className="text-base font-extrabold">₹{pricePerDay}</span>
              <span className="text-xs text-white/80"> / day</span>
            </div>
            {pricePerWeek && (
              <span className="text-xs font-semibold bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-md">
                ₹{pricePerWeek} / wk
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6">
          <h3 className="text-lg font-bold text-[#171717] line-clamp-1 group-hover:text-black">
            {title}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-[#555555] flex items-center gap-1.5 font-medium">
            <Box className="w-4 h-4 text-[#171717] flex-shrink-0" />
            <span className="truncate">Capacity: <strong>{capacity}</strong></span>
          </p>

          {/* Potential Matches Counter */}
          {matchingRequestsCount > 0 && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{matchingRequestsCount} student{matchingRequestsCount > 1 ? 's' : ''} looking for this space!</span>
            </div>
          )}

          {/* Location & Dates */}
          <div className="mt-4 pt-3.5 border-t border-[#D5D1C9]/60 space-y-2 text-xs text-[#555555]">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#171717] flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#171717] flex-shrink-0" />
              <span>Avail: {startDate} → {endDate}</span>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="mt-4 pt-3 border-t border-[#D5D1C9]/60 flex flex-wrap gap-1.5">
            {features.slice(0, 3).map((f) => (
              <span key={f} className="px-2 py-0.5 rounded-md bg-[#EDEBE6] text-[#292929] text-[11px] font-medium flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-700" />
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Provider Info & Action Footer */}
      <div className="px-5 pb-5 pt-1 sm:px-6 sm:pb-6 border-t border-[#D5D1C9]/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 truncate">
          <img
            src={provider.avatar}
            alt={provider.name}
            className="w-7 h-7 rounded-full object-cover border border-[#D5D1C9]"
          />
          <span className="text-xs font-semibold text-[#171717] truncate flex items-center gap-1">
            {provider.name}
            {provider.verified && <CheckCircle className="w-3 h-3 text-emerald-600 inline" />}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onViewDetails(id)}
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-xs font-semibold text-[#171717] bg-[#EDEBE6] hover:bg-[#171717] hover:text-white transition-all duration-200 cursor-pointer flex-shrink-0"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}