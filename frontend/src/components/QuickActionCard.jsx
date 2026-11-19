import React from 'react';
import { Link } from 'react-router-dom';

export default function QuickActionCard({ icon: Icon, title, href = '#' }) {
  return (
    <Link
      to={href}
      className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-[#D5D1C9] transition-all duration-200 hover:-translate-y-1 hover:border-[#171717]/50 hover:shadow-md cursor-pointer text-center"
    >
      <div className="h-12 w-12 rounded-xl bg-[#EDEBE6] text-[#171717] flex items-center justify-center transition-all duration-200 group-hover:bg-[#171717] group-hover:text-white shadow-xs">
        <Icon className="w-5 h-5" strokeWidth={2.2} />
      </div>
      <span className="mt-3 text-xs sm:text-sm font-bold text-[#171717] group-hover:underline underline-offset-2">
        {title}
      </span>
    </Link>
  );
}