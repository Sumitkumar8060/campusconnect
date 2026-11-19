import React from 'react';
import {
  ShoppingBag,
  Store,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Tag,
} from 'lucide-react';

export default function ErrandsRequestCard({ request, matchingOffersCount = 0, onViewDetails }) {
  const {
    id,
    itemName,
    category,
    description,
    preferredShop,
    estimatedBudget,
    deliveryTip,
    preferredDate,
    preferredTime,
    requester,
    status,
  } = request;

  return (
    <div className="group flex flex-col justify-between rounded-3xl bg-white border border-[#D5D1C9] p-5 sm:p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-[#171717]/40">
      <div>
        {/* Top Header: Category & Status */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDEBE6] text-xs font-semibold text-[#171717]">
            <Tag className="w-3.5 h-3.5" />
            {category}
          </span>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              status === 'Open'
                ? 'bg-emerald-100 text-emerald-800'
                : status === 'Matched'
                ? 'bg-blue-100 text-blue-800'
                : status === 'In Progress'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {status}
          </span>
        </div>

        {/* Item Title & Description */}
        <h3 className="text-lg font-bold text-[#171717] line-clamp-1 group-hover:text-black">
          {itemName}
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-[#555555] line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Potential Match Highlight */}
        {matchingOffersCount > 0 && (
          <div className="mt-3.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{matchingOffersCount} matching traveler{matchingOffersCount > 1 ? 's' : ''} heading here!</span>
          </div>
        )}

        {/* Meta Info */}
        <div className="mt-4 pt-3.5 border-t border-[#D5D1C9]/60 space-y-2 text-xs text-[#555555]">
          <div className="flex items-center gap-2">
            <Store className="w-3.5 h-3.5 text-[#171717] flex-shrink-0" />
            <span className="truncate">Shop: <strong>{preferredShop}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#171717] flex-shrink-0" />
            <span>{preferredDate}</span>
            <span className="text-gray-300">•</span>
            <Clock className="w-3.5 h-3.5 text-[#171717] flex-shrink-0" />
            <span>{preferredTime}</span>
          </div>
        </div>

        {/* Budget & Tip Row */}
        <div className="mt-4 pt-3 border-t border-[#D5D1C9]/60 flex items-center justify-between text-xs">
          <div>
            <span className="text-[#777777] block text-[10px] uppercase font-semibold">Budget</span>
            <span className="font-bold text-[#171717] text-sm">₹{estimatedBudget}</span>
          </div>
          {deliveryTip > 0 && (
            <div className="text-right">
              <span className="text-[#777777] block text-[10px] uppercase font-semibold">Tip/Contribution</span>
              <span className="font-bold text-emerald-700 text-sm">+ ₹{deliveryTip}</span>
            </div>
          )}
        </div>
      </div>

      {/* Requester Bar & Action Button */}
      <div className="mt-5 pt-3.5 border-t border-[#D5D1C9]/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 truncate">
          <img
            src={requester.avatar}
            alt={requester.name}
            className="w-7 h-7 rounded-full object-cover border border-[#D5D1C9]"
          />
          <span className="text-xs font-semibold text-[#171717] truncate flex items-center gap-1">
            {requester.name}
            {requester.verified && <CheckCircle className="w-3 h-3 text-emerald-600 inline" />}
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