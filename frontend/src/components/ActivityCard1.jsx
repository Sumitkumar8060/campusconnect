import React from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle, ArrowRight } from 'lucide-react';

export default function ActivityCard({ activity, onViewDetails }) {
  const {
    id,
    title,
    description,
    category,
    host,
    date,
    time,
    location,
    maxParticipants,
    currentParticipants,
    status,
    image,
  } = activity;

  const availableSlots = maxParticipants - currentParticipants;
  const isFull = status === 'Full' || availableSlots <= 0;

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-[#D5D1C9] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-[#171717]/40">
      <div>
        {/* Cover Image & Category / Status Badges */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#E5E2DC]">
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
              status === 'Full'
                ? 'bg-amber-100 text-amber-800'
                : status === 'Completed'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {status}
          </span>

          {/* Host info banner overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2.5 text-white">
            <img
              src={host.avatar}
              alt={host.name}
              className="h-8 w-8 rounded-full border-2 border-white object-cover"
            />
            <div className="truncate">
              <p className="text-xs font-bold leading-none truncate flex items-center gap-1">
                {host.name}
                {host.verified && (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 inline" />
                )}
              </p>
              <p className="text-[10px] text-white/80 mt-0.5">{host.course || 'Verified Student'}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <h3 className="text-lg font-bold text-[#171717] line-clamp-1 group-hover:text-black">
            {title}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-[#555555] line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Meta Info */}
          <div className="mt-4 pt-3.5 border-t border-[#D5D1C9]/60 space-y-2 text-xs text-[#555555]">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#171717] flex-shrink-0" />
              <span>{date}</span>
              <span className="text-gray-300">•</span>
              <Clock className="w-3.5 h-3.5 text-[#171717] flex-shrink-0" />
              <span>{time}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#171717] flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>

          {/* Capacity Progress Bar */}
          <div className="mt-4 pt-3 border-t border-[#D5D1C9]/60">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-[#171717] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {currentParticipants} / {maxParticipants} Joined
              </span>
              <span className={isFull ? 'text-amber-600' : 'text-emerald-700'}>
                {isFull ? 'Full' : `${availableSlots} slot${availableSlots > 1 ? 's' : ''} left`}
              </span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-[#EDEBE6] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isFull ? 'bg-amber-500' : 'bg-[#171717]'
                }`}
                style={{ width: `${Math.min(100, (currentParticipants / maxParticipants) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 pb-5 pt-1 sm:px-6 sm:pb-6">
        <button
          type="button"
          onClick={() => onViewDetails(id)}
          className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-xl text-xs font-semibold text-[#171717] bg-[#EDEBE6] hover:bg-[#171717] hover:text-white transition-all duration-200 cursor-pointer"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}