import React from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Users,
  Compass,
} from 'lucide-react';

export default function ErrandsOfferCard({ offer, matchingRequestsCount = 0, onViewOffer }) {
  const {
    id,
    destination,
    destinationCategory,
    date,
    departureTime,
    estimatedReturnTime,
    itemsWillingToBring,
    maxRequests,
    currentBookings,
    traveler,
    vehicle,
    status,
  } = offer;

  const availableSlots = maxRequests - currentBookings;
  const isFull = status === 'Fully Booked' || availableSlots <= 0;

  return (
    <div className="group flex flex-col justify-between rounded-3xl bg-white border border-[#D5D1C9] p-5 sm:p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-[#171717]/40">
      <div>
        {/* Destination & Status */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#171717] text-xs font-semibold text-white">
            <Compass className="w-3.5 h-3.5" />
            {destinationCategory}
          </span>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              isFull
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {isFull ? 'Fully Booked' : 'Available'}
          </span>
        </div>

        {/* Destination Title */}
        <h3 className="text-lg font-bold text-[#171717] line-clamp-1 group-hover:text-black flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#171717] flex-shrink-0" />
          {destination}
        </h3>

        {/* Matching Requests Badge */}
        {matchingRequestsCount > 0 && (
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{matchingRequestsCount} student{matchingRequestsCount > 1 ? 's' : ''} need items from here!</span>
          </div>
        )}

        {/* Meta Timings & Vehicle */}
        <div className="mt-4 pt-3.5 border-t border-[#D5D1C9]/60 space-y-2 text-xs text-[#555555]">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#171717] flex-shrink-0" />
            <span>{date}</span>
            <span className="text-gray-300">•</span>
            <Clock className="w-3.5 h-3.5 text-[#171717] flex-shrink-0" />
            <span>Depart: {departureTime}</span>
          </div>

          <div className="text-[11px] text-[#777777]">
            Return around: <strong>{estimatedReturnTime}</strong> • {vehicle}
          </div>
        </div>

        {/* Items Willing to Bring Tags */}
        <div className="mt-4 pt-3 border-t border-[#D5D1C9]/60">
          <p className="text-[10px] font-bold uppercase text-[#777777] mb-1.5">
            Can Bring Items In:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {itemsWillingToBring.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-[#EDEBE6] text-[#292929] text-[11px] font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Capacity Meter */}
        <div className="mt-4 pt-3 border-t border-[#D5D1C9]/60">
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="text-[#171717] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              {currentBookings} / {maxRequests} Requests taken
            </span>
            <span className={isFull ? 'text-amber-600' : 'text-emerald-700'}>
              {isFull ? '0 slots' : `${availableSlots} slot${availableSlots > 1 ? 's' : ''} free`}
            </span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-[#EDEBE6] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isFull ? 'bg-amber-500' : 'bg-[#171717]'
              }`}
              style={{ width: `${Math.min(100, (currentBookings / maxRequests) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Traveler Bar & Action */}
      <div className="mt-5 pt-3.5 border-t border-[#D5D1C9]/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 truncate">
          <img
            src={traveler.avatar}
            alt={traveler.name}
            className="w-7 h-7 rounded-full object-cover border border-[#D5D1C9]"
          />
          <span className="text-xs font-semibold text-[#171717] truncate flex items-center gap-1">
            {traveler.name}
            {traveler.verified && <CheckCircle className="w-3 h-3 text-emerald-600 inline" />}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onViewOffer(id)}
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-xs font-semibold text-[#171717] bg-[#EDEBE6] hover:bg-[#171717] hover:text-white transition-all duration-200 cursor-pointer flex-shrink-0"
        >
          View Offer
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}