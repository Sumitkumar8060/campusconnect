import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Check,
  X,
  Users,
} from 'lucide-react';

export default function OfferDetailsView({ offer, matchingRequests = [], onBack, onRequestItem }) {
  const [requestItemSent, setRequestItemSent] = useState(false);

  if (!offer) return null;

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
    notes,
    status,
    isMine,
  } = offer;

  const availableSlots = maxRequests - currentBookings;
  const isFull = status === 'Fully Booked' || availableSlots <= 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#555555] hover:text-[#171717] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Errands
      </button>

      <div className="rounded-3xl bg-white border border-[#D5D1C9] shadow-xl p-6 sm:p-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D5D1C9]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full bg-[#171717] text-xs font-semibold text-white">
                {destinationCategory}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isFull ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isFull ? 'Fully Booked' : 'Available'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] flex items-center gap-2">
              <MapPin className="w-6 h-6 text-[#171717]" />
              {destination}
            </h1>
            <p className="text-xs text-[#666666] mt-1">Vehicle: {vehicle}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EDEBE6]/60 border border-[#D5D1C9] text-left sm:text-right">
            <p className="text-[11px] font-semibold text-[#666666] uppercase">Available Capacity</p>
            <p className="text-xl font-bold text-[#171717]">{availableSlots} free slots</p>
            <p className="text-xs text-[#555555] mt-0.5">{currentBookings} of {maxRequests} taken</p>
          </div>
        </div>

        {/* Travel Schedule */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#EDEBE6]/40 border border-[#D5D1C9]">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#171717]" />
            <div>
              <p className="text-[10px] font-semibold text-[#666666] uppercase">Date</p>
              <p className="text-xs font-bold text-[#171717]">{date}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#171717]" />
            <div>
              <p className="text-[10px] font-semibold text-[#666666] uppercase">Departure</p>
              <p className="text-xs font-bold text-[#171717]">{departureTime}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#171717]" />
            <div>
              <p className="text-[10px] font-semibold text-[#666666] uppercase">Est. Return</p>
              <p className="text-xs font-bold text-[#171717]">{estimatedReturnTime}</p>
            </div>
          </div>
        </div>

        {/* Categories Willing to Bring */}
        <div>
          <h3 className="text-sm font-bold text-[#171717] uppercase tracking-wider mb-2.5">
            Categories Accepted on this Trip
          </h3>
          <div className="flex flex-wrap gap-2">
            {itemsWillingToBring.map((cat) => (
              <span key={cat} className="px-3 py-1 rounded-xl bg-[#EDEBE6] text-xs font-semibold text-[#171717]">
                ✓ {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <h3 className="text-sm font-bold text-[#171717] uppercase tracking-wider mb-2">
            Traveler Notes & Instructions
          </h3>
          <p className="text-sm text-[#444444] leading-relaxed p-4 rounded-xl bg-[#EDEBE6]/30 border border-[#D5D1C9]/60">
            {notes}
          </p>
        </div>

        {/* Traveler Profile */}
        <div className="p-5 rounded-2xl bg-white border border-[#D5D1C9] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <img
              src={traveler.avatar}
              alt={traveler.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#171717]"
            />
            <div>
              <p className="text-xs font-bold text-[#666666] uppercase">Student Traveler</p>
              <p className="text-sm font-bold text-[#171717] flex items-center gap-1.5">
                {traveler.name}
                {traveler.verified && <CheckCircle className="w-4 h-4 text-emerald-600" />}
              </p>
              <p className="text-xs text-[#555555]">{traveler.course}</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Student
          </span>
        </div>

        {/* Matching Requests from Students for this Destination */}
        {matchingRequests.length > 0 && (
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-900">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Students Needing Items from this Destination ({matchingRequests.length})
              </span>
            </div>

            <div className="space-y-2">
              {matchingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-xl bg-white border border-emerald-200 flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <img src={req.requester.avatar} alt={req.requester.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="text-xs font-bold text-[#171717]">{req.itemName}</p>
                      <p className="text-[11px] text-[#666666]">Budget: ₹{req.estimatedBudget} + ₹{req.deliveryTip} Tip • by {req.requester.name}</p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                    Matching Shop
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-6 border-t border-[#D5D1C9] flex items-center justify-end">
          {requestItemSent ? (
            <div className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <Check className="w-4 h-4" />
              Request Sent to {traveler.name}! (Demo confirmation)
            </div>
          ) : (
            <button
              type="button"
              disabled={isFull}
              onClick={() => {
                setRequestItemSent(true);
                if (onRequestItem) onRequestItem(offer);
              }}
              className={`h-11 px-8 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm cursor-pointer ${
                isFull
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#171717] text-white hover:bg-[#333333]'
              }`}
            >
              {isFull ? 'Trip Fully Booked' : 'Request an Item from this Trip'}
            </button>
          )}
        </div>

      </div>

    </div>
  );
}