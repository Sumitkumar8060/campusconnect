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

export default function FlatmateProfileCard({ flatmate, onViewDetails }) {
  const {
    id,
    name,
    avatar,
    course,
    verified,
    title,
    intro,
    preferredLocation,
    monthlyBudget,
    preferredRoomType,
    moveInDate,
    roommatesNeeded,
    lifestyle = [],
  } = flatmate;

  return (
    <div className="group flex flex-col justify-between rounded-3xl bg-white border border-[#D5D1C9] p-5 sm:p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-[#171717]/40">
      <div>
        {/* Profile Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#D5D1C9]/60">
          <div className="flex items-center gap-3">
            <img
              src={avatar}
              alt={name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#171717]"
            />
            <div>
              <h3 className="text-base font-bold text-[#171717] flex items-center gap-1.5">
                {name}
                {verified && <CheckCircle className="w-4 h-4 text-emerald-600" />}
              </h3>
              <p className="text-xs text-[#555555]">{course}</p>
            </div>
          </div>

          <span className="text-[11px] font-bold text-[#171717] bg-[#EDEBE6] px-2.5 py-0.5 rounded-full">
            Seeking {roommatesNeeded} Roommate{roommatesNeeded > 1 ? 's' : ''}
          </span>
        </div>

        {/* Title & Intro */}
        <div className="mt-3.5">
          <h4 className="text-sm font-bold text-[#171717] line-clamp-1 group-hover:text-black">
            {title}
          </h4>
          <p className="mt-1.5 text-xs sm:text-sm text-[#555555] line-clamp-2 leading-relaxed">
            {intro}
          </p>
        </div>

        {/* Location & Move-in Info */}
        <div className="mt-4 pt-3.5 border-t border-[#D5D1C9]/60 space-y-2 text-xs text-[#555555]">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#171717] flex-shrink-0" />
            <span className="truncate">{preferredLocation}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#171717] flex-shrink-0" />
            <span>Move-in: <strong>{moveInDate}</strong></span>
          </div>
        </div>

        {/* Lifestyle Habits */}
        <div className="mt-4 pt-3 border-t border-[#D5D1C9]/60">
          <div className="flex flex-wrap gap-1.5">
            {lifestyle.map((habit) => (
              <span
                key={habit}
                className="px-2 py-0.5 rounded-md bg-[#EDEBE6] text-[#292929] text-[11px] font-medium flex items-center gap-1"
              >
                <Check className="w-3 h-3 text-emerald-700" />
                {habit}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Budget Footer & Action */}
      <div className="mt-5 pt-3.5 border-t border-[#D5D1C9]/60 flex items-center justify-between">
        <div>
          <span className="text-[#777777] block text-[10px] uppercase font-semibold">Budget</span>
          <span className="font-extrabold text-[#171717] text-sm sm:text-base">Up to ₹{monthlyBudget.toLocaleString()}</span>
        </div>

        <button
          type="button"
          onClick={() => onViewDetails(id)}
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold text-[#171717] bg-[#EDEBE6] hover:bg-[#171717] hover:text-white transition-all duration-200 cursor-pointer"
        >
          View Profile
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}