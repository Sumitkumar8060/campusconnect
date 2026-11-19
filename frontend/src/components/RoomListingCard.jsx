import React from 'react';
import {
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

export default function RoomListingCard({ room, onViewDetails }) {
  const {
    id,
    title,
    roomType,
    monthlyRent,
    location,
    furnishing,
    availableSpaces,
    availableFrom,
    amenities = [],
    owner,
    status,
    image,
  } = room;

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-[#D5D1C9] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-[#171717]/40">
      <div>
        {/* Cover Image & Rent Overlay */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E5E2DC]">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3.5 left-3.5 flex gap-2">
            <span className="px-3 py-1 rounded-full bg-[#171717]/85 backdrop-blur-md text-xs font-semibold text-white">
              {roomType}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-semibold text-[#171717]">
              {furnishing}
            </span>
          </div>

          {/* Rent Box */}
          <div className="absolute bottom-3 left-3 text-white">
            <span className="text-xl font-extrabold tracking-tight">₹{monthlyRent.toLocaleString()}</span>
            <span className="text-xs text-white/80"> / month</span>
          </div>

          <div className="absolute bottom-3 right-3">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
              {availableSpaces} space{availableSpaces > 1 ? 's' : ''} left
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6">
          <h3 className="text-lg font-bold text-[#171717] line-clamp-1 group-hover:text-black">
            {title}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-[#555555] flex items-center gap-1.5 font-medium">
            <MapPin className="w-4 h-4 text-[#171717] flex-shrink-0" />
            <span className="truncate">{location}</span>
          </p>

          <p className="mt-1 text-xs text-[#777777] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#171717] flex-shrink-0" />
            <span>Available from: <strong>{availableFrom}</strong></span>
          </p>

          {/* Amenities Pills */}
          <div className="mt-4 pt-3.5 border-t border-[#D5D1C9]/60 flex flex-wrap gap-1.5">
            {amenities.slice(0, 4).map((amenity) => (
              <span
                key={amenity}
                className="px-2 py-0.5 rounded-md bg-[#EDEBE6] text-[#292929] text-[11px] font-medium flex items-center gap-1"
              >
                <Check className="w-3 h-3 text-emerald-700" />
                {amenity}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Owner Info & Details Action */}
      <div className="px-5 pb-5 pt-1 sm:px-6 sm:pb-6 border-t border-[#D5D1C9]/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 truncate">
          <img
            src={owner.avatar}
            alt={owner.name}
            className="w-7 h-7 rounded-full object-cover border border-[#D5D1C9]"
          />
          <span className="text-xs font-semibold text-[#171717] truncate flex items-center gap-1">
            {owner.name}
            {owner.verified && <CheckCircle className="w-3 h-3 text-emerald-600 inline" />}
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