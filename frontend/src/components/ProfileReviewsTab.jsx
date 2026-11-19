// src/components/ProfileReviewsTab.jsx
import React from 'react';
import { Star, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ProfileReviewsTab({ reviews = [] }) {
  const total = reviews.length;
  const avgRating = total > 0
    ? (reviews.reduce((acc, r) => acc + Number(r.rating || 5), 0) / total).toFixed(1)
    : '5.0';

  return (
    <div className="space-y-6">
      {/* Rating Summary Card */}
      <div className="bg-white border border-[#D5D1C9] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl sm:text-5xl font-black text-[#171717] flex items-baseline">
            {avgRating}
            <span className="text-sm font-normal text-stone-400"> / 5.0</span>
          </div>
          <div>
            <div className="flex items-center text-amber-500 text-lg">
              {'★★★★★'}
            </div>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Based on {total} verified campus transactions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>All reviews are left by authenticated students after verified meetups or handoffs.</span>
        </div>
      </div>

      {/* Individual Reviews */}
      {reviews.length > 0 ? (
        <div className="space-y-3">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-[#D5D1C9] rounded-2xl p-5 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.reviewerAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'}
                    alt={rev.reviewerName}
                    className="w-10 h-10 rounded-full object-cover border border-stone-200"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-stone-900 text-sm">{rev.reviewerName}</span>
                      <span className="text-[10px] text-stone-400 font-medium">({rev.reviewerDept || 'Student'})</span>
                    </div>
                    <span className="text-[11px] text-stone-400">Transaction: {rev.service}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center text-amber-500 text-xs">
                    {'★'.repeat(rev.rating || 5)}
                  </div>
                  <span className="text-[10px] text-stone-400">{rev.date}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-100">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#D5D1C9] rounded-2xl p-8 text-center text-xs text-stone-400">
          No peer reviews received yet. Reviews will appear here after campus interactions.
        </div>
      )}
    </div>
  );
}
