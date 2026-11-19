// src/components/ProfileActivitiesTab.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Plus
} from 'lucide-react';

export default function ProfileActivitiesTab({ activities = [] }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // 'all' | 'created' | 'joined' | 'completed'

  const filtered = activities.filter((act) => {
    if (filter === 'created') return (act.role || '').toLowerCase().includes('created');
    if (filter === 'joined') return (act.role || '').toLowerCase().includes('joined');
    if (filter === 'completed') return act.status === 'Completed';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Sub-filters & Create Activity CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#D5D1C9]">
        <div className="flex items-center gap-2 overflow-x-auto">
          {['all', 'created', 'joined', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl capitalize transition ${
                filter === tab
                  ? 'bg-[#171717] text-white'
                  : 'text-stone-600 hover:text-stone-900 bg-stone-100'
              }`}
            >
              {tab === 'all' ? `All (${activities.length})` : tab}
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate('/services/companions')}
          className="px-3.5 py-1.5 bg-[#171717] text-white text-xs font-bold rounded-xl hover:bg-[#333333] transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Find Companions
        </button>
      </div>

      {/* Activities Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((act) => (
            <div
              key={act.id}
              className="bg-white border border-[#D5D1C9] rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-stone-400 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                    {act.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      act.status === 'Completed'
                        ? 'bg-stone-200 text-stone-700'
                        : act.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {act.status}
                  </span>
                </div>

                <h4 className="font-bold text-[#171717] text-sm md:text-base leading-snug">
                  {act.title}
                </h4>

                <div className="mt-3 space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{act.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span className="truncate">{act.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-stone-400" />
                    <span>{act.companionsCount ?? 0} companions registered</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-400 text-[11px] font-medium">{act.role || 'Member'}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#D5D1C9] rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm font-semibold text-stone-700">No activities found</p>
          <p className="text-xs text-stone-500">
            {filter === 'all'
              ? "You haven't participated in or created any campus activities yet."
              : `No activities found in the "${filter}" category.`}
          </p>
          <button
            onClick={() => navigate('/services/companions')}
            className="px-4 py-2 bg-[#171717] text-white text-xs font-bold rounded-xl hover:bg-[#333333] transition inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Explore Companions
          </button>
        </div>
      )}
    </div>
  );
}
