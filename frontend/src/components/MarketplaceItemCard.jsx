// src/components/MarketplaceItemCard.jsx
import React from 'react';
import { 
  Bookmark, 
  MapPin, 
  CheckCircle2, 
  Tag, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const CONDITION_COLORS = {
  'New': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Like New': 'bg-blue-50 text-blue-700 border-blue-200',
  'Good': 'bg-amber-50 text-amber-700 border-amber-200',
  'Fair': 'bg-stone-100 text-stone-700 border-stone-200',
};

export default function MarketplaceItemCard({ item, onSelect, onToggleSave }) {
  const isRent = item.type === 'rent';

  return (
    <div 
      onClick={() => onSelect(item)}
      className="group relative flex flex-col bg-white border border-[#D5D1C9] rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#171717]/40 transition-all duration-200 cursor-pointer"
    >
      {/* Image Thumbnail with Badges */}
      <div className="relative w-full h-48 bg-stone-100 overflow-hidden">
        <img
          src={item.images[0]}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span 
            className={`px-2.5 py-1 text-xs font-semibold rounded-full border shadow-sm ${
              isRent 
                ? 'bg-amber-500 text-white border-amber-600' 
                : 'bg-[#171717] text-white border-black'
            }`}
          >
            {isRent ? 'For Rent' : 'For Sale'}
          </span>
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${CONDITION_COLORS[item.condition] || 'bg-stone-100 text-stone-700'}`}>
            {item.condition}
          </span>
        </div>

        {/* Bookmark Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(item.id);
          }}
          aria-label={item.isSaved ? 'Remove from saved' : 'Save item'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-150 ${
            item.isSaved
              ? 'bg-[#171717] text-amber-400 shadow-md'
              : 'bg-white/90 text-stone-600 hover:text-[#171717] hover:bg-white shadow'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${item.isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          {/* Price & Category */}
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <div className="text-lg font-bold text-[#171717]">
              {isRent ? (
                <>
                  ₹{item.rentalRate}
                  <span className="text-xs font-normal text-stone-500">/{item.rentalPeriod}</span>
                </>
              ) : (
                <>₹{item.price}</>
              )}
            </div>
            <span className="text-xs text-stone-500 uppercase tracking-wider font-medium">
              {item.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-stone-900 line-clamp-2 text-sm md:text-base group-hover:text-[#171717] leading-snug">
            {item.title}
          </h3>

          {/* Location */}
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-stone-500">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-stone-400" />
            <span className="truncate">{item.location}</span>
          </div>
        </div>

        {/* Seller Info & Card Footer */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={item.seller.avatar}
              alt={item.seller.name}
              className="w-7 h-7 rounded-full object-cover border border-stone-200"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-stone-800 truncate">
                  {item.seller.name}
                </span>
                {item.seller.isVerified && (
                  <ShieldCheck 
                    className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" 
                    title="Verified Student (Demo)" 
                  />
                )}
              </div>
              <p className="text-[10px] text-stone-400 truncate">
                {item.postedDate}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center text-xs font-medium text-stone-700 group-hover:translate-x-0.5 transition-transform">
            View <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </div>
      </div>
    </div>
  );
}