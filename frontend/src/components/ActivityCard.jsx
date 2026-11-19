import React from 'react';
import { Clock, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ActivityCard({
  category,
  title,
  author,
  location,
  time,
  href = '#',
}) {
  return (
    <div className="flex flex-col justify-between p-5 rounded-2xl bg-white border border-[#D5D1C9] hover:border-[#171717]/30 hover:shadow-sm transition-all duration-200">
      <div>
        <div className="flex items-center justify-between text-xs mb-2.5">
          <span className="font-semibold px-2.5 py-0.5 rounded-md bg-[#EDEBE6] text-[#171717]">
            {category}
          </span>
          <span className="flex items-center gap-1 text-[#777777] text-[11px]">
            <Clock className="w-3 h-3" />
            {time}
          </span>
        </div>

        <h4 className="text-sm font-bold text-[#171717] leading-snug line-clamp-2">
          {title}
        </h4>

        <div className="mt-3 flex items-center justify-between text-xs text-[#555555]">
          <span className="font-medium">{author}</span>
          {location && (
            <span className="flex items-center gap-1 text-[11px] text-[#777777]">
              <MapPin className="w-3 h-3" />
              {location}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#D5D1C9]/50 flex justify-end">
        <Link
          to={href}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#171717] hover:underline cursor-pointer"
        >
          View details
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}