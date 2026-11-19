// src/components/ProfileOverviewTab.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Tag, 
  Calendar, 
  MapPin, 
  Star, 
  ShoppingBag, 
  Clock 
} from 'lucide-react';

export default function ProfileOverviewTab({ user = {}, activities = [], listings = [], reviews = [] }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Interests Section */}
      <div className="bg-white border border-[#D5D1C9] rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" /> Interests &amp; Campus Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {user.interests && user.interests.length > 0 ? (
            user.interests.map((interest, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-stone-100 border border-stone-200 text-stone-800 text-xs font-semibold rounded-xl"
              >
                #{interest}
              </span>
            ))
          ) : (
            <p className="text-xs text-stone-400 italic">No interests listed yet.</p>
          )}
        </div>
      </div>

      {/* Grid: Recent Activities & Recent Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Activities */}
        <div className="bg-white border border-[#D5D1C9] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-[#171717]">Recent Activities</h3>
              <span className="text-xs text-stone-400">Find Companions</span>
            </div>
            <div className="space-y-3">
              {activities.length > 0 ? (
                activities.slice(0, 2).map((act) => (
                  <div key={act.id} className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-stone-900 truncate">{act.title}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        act.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {act.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-stone-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {act.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {act.location}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-stone-50 rounded-xl text-center text-xs text-stone-400">
                  No activities created yet.
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => navigate('/services/companions')}
            className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-stone-800 hover:text-black pt-2"
          >
            Explore Companions <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Recent Marketplace & Campus Posts */}
        <div className="bg-white border border-[#D5D1C9] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-[#171717]">Recent Marketplace Posts</h3>
              <span className="text-xs text-stone-400">Marketplace</span>
            </div>
            <div className="space-y-3">
              {listings.length > 0 ? (
                listings.slice(0, 2).map((item) => (
                  <div key={item.id} className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                        {item.service}
                      </span>
                      <h4 className="text-xs font-bold text-stone-900 truncate">{item.title}</h4>
                      <p className="text-xs font-extrabold text-emerald-700">{item.price}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 font-bold rounded-full bg-stone-200 text-stone-800 whitespace-nowrap">
                      {item.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-stone-50 rounded-xl text-center text-xs text-stone-400">
                  No marketplace listings created yet.
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => navigate('/services/marketplace')}
            className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-stone-800 hover:text-black pt-2"
          >
            Visit Student Marketplace <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Reviews Summary */}
      <div className="bg-white border border-[#D5D1C9] rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-base text-[#171717] mb-4">Latest Peer Reviews</h3>
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.slice(0, 2).map((rev) => (
              <div key={rev.id} className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={rev.reviewerAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'}
                      alt={rev.reviewerName}
                      className="w-7 h-7 rounded-full object-cover border"
                    />
                    <div>
                      <span className="text-xs font-bold text-stone-900">{rev.reviewerName}</span>
                      <p className="text-[10px] text-stone-400">{rev.reviewerDept || 'Student'}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-amber-500 text-xs">
                    {'★'.repeat(rev.rating || 5)}
                  </div>
                </div>
                <p className="text-xs text-stone-700 italic">"{rev.comment}"</p>
                <div className="text-[10px] text-stone-400 flex items-center justify-between pt-1">
                  <span>Service: {rev.service}</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-stone-50 rounded-xl text-center text-xs text-stone-400">
            No peer reviews received yet.
          </div>
        )}
      </div>
    </div>
  );
}
