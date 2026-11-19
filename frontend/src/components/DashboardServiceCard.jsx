import React from 'react';
import { ArrowRight, ShoppingBag, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardServiceCard({
  title,
  description,
  image,
  tag,
  actionText = 'Explore service',
  href = '#',
  isErrandsCard = false,
}) {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-[#D5D1C9] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-[#171717]/40">
      <div>
        {/* Card Lifestyle Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#E5E2DC]">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
          
          {tag && (
            <span className="absolute top-4 left-4 inline-flex items-center rounded-full bg-[#171717]/85 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white">
              {tag}
            </span>
          )}
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-7">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#171717]">
            {title}
          </h3>
          <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[#555555]">
            {description}
          </p>

          {/* DUAL OPTIONS FOR CAMPUS ERRANDS */}
          {isErrandsCard && (
            <div className="mt-6 pt-6 border-t border-[#D5D1C9]/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Option 1: I Need Something */}
              <div className="p-4 rounded-2xl bg-[#EDEBE6]/60 border border-[#D5D1C9] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#171717]">
                    <ShoppingBag className="w-4 h-4" />
                    I Need Something
                  </div>
                  <p className="mt-2 text-xs text-[#555555] leading-relaxed">
                    Find students who are going outside and can bring items for you.
                  </p>
                </div>
                <Link
                  to="/services/errands?type=request"
                  className="mt-4 w-full inline-flex items-center justify-center h-9 px-4 rounded-xl text-xs font-semibold text-white bg-[#171717] hover:bg-[#333333] transition-colors duration-200 cursor-pointer shadow-xs"
                >
                  Find Someone
                </Link>
              </div>

              {/* Option 2: I'm Going Outside */}
              <div className="p-4 rounded-2xl bg-white border border-[#171717]/20 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#171717]">
                    <Send className="w-4 h-4" />
                    I'm Going Outside
                  </div>
                  <p className="mt-2 text-xs text-[#555555] leading-relaxed">
                    Let other students know you're going outside and can bring items for them.
                  </p>
                </div>
                <Link
                  to="/services/errands?type=offer"
                  className="mt-4 w-full inline-flex items-center justify-center h-9 px-4 rounded-xl text-xs font-semibold text-[#171717] bg-[#EDEBE6] hover:bg-[#DCD9D2] border border-[#D5D1C9] transition-colors duration-200 cursor-pointer"
                >
                  Offer Help
                </Link>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Standard Card Footer (for non-errands cards) */}
      {!isErrandsCard && (
        <div className="px-6 pb-6 pt-1 sm:px-7 sm:pb-7 flex items-center justify-between">
          <Link
            to={href}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#171717] hover:underline underline-offset-4 cursor-pointer"
          >
            {actionText}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="text-xs text-[#777777] font-medium">Campus Verified</span>
        </div>
      )}
    </div>
  );
}