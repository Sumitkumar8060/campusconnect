import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  ShieldCheck,
  AlertTriangle,
  Check,
} from 'lucide-react';

export default function FlatmateDetailsView({ flatmate, onBack, onConnect }) {
  const [connectSent, setConnectSent] = useState(false);

  if (!flatmate) return null;

  const {
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
    requirements,
  } = flatmate;

  const handleConnect = () => {
    setConnectSent(true);
    if (onConnect) onConnect(flatmate);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#555555] hover:text-[#171717] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Flatmates
      </button>

      <div className="rounded-3xl bg-white border border-[#D5D1C9] shadow-xl p-6 sm:p-10 space-y-8">
        
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D5D1C9]">
          <div className="flex items-center gap-4">
            <img
              src={avatar}
              alt={name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#171717]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-[#171717] flex items-center gap-1.5">
                  {name}
                  {verified && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                </h1>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Verified Student
                </span>
              </div>
              <p className="text-xs text-[#555555] mt-1">{course}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#EDEBE6]/60 border border-[#D5D1C9] text-left sm:text-right">
            <p className="text-[11px] font-semibold text-[#666666] uppercase">Monthly Budget</p>
            <p className="text-2xl font-extrabold text-[#171717]">Up to ₹{monthlyBudget.toLocaleString()}</p>
          </div>
        </div>

        {/* Bio */}
        <div>
          <h2 className="text-lg font-bold text-[#171717]">{title}</h2>
          <p className="mt-2 text-sm sm:text-base text-[#444444] leading-relaxed">
            {intro}
          </p>
        </div>

        {/* Accommodation Preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#EDEBE6]/40 border border-[#D5D1C9]">
          <div>
            <p className="text-[10px] font-semibold text-[#666666] uppercase">Preferred Location</p>
            <p className="text-xs font-bold text-[#171717]">{preferredLocation}</p>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-[#666666] uppercase">Target Move-in</p>
            <p className="text-xs font-bold text-[#171717]">{moveInDate}</p>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-[#666666] uppercase">Room Type</p>
            <p className="text-xs font-bold text-[#171717]">{preferredRoomType}</p>
          </div>
        </div>

        {/* Lifestyle & Habits */}
        <div>
          <h3 className="text-sm font-bold text-[#171717] uppercase tracking-wider mb-2.5">
            Lifestyle & Habits
          </h3>
          <div className="flex flex-wrap gap-2">
            {lifestyle.map((habit) => (
              <span key={habit} className="px-3 py-1 rounded-xl bg-[#EDEBE6] text-xs font-semibold text-[#171717]">
                ✓ {habit}
              </span>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div>
          <h3 className="text-sm font-bold text-[#171717] uppercase tracking-wider mb-2">
            Preferences & Expectations
          </h3>
          <p className="text-sm text-[#444444] p-4 rounded-xl bg-[#EDEBE6]/30 border border-[#D5D1C9]/60">
            {requirements}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-6 border-t border-[#D5D1C9] flex items-center justify-end">
          {connectSent ? (
            <div className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <Check className="w-4 h-4" />
              Connection Request Sent to {name}! (Demo confirmation)
            </div>
          ) : (
            <button
              type="button"
              onClick={handleConnect}
              className="h-11 px-8 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#171717] hover:bg-[#333333] transition-all duration-200 shadow-sm cursor-pointer"
            >
              Connect with Student
            </button>
          )}
        </div>

      </div>

    </div>
  );
}