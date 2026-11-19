// src/components/ProfileListingsTab.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  ExternalLink, 
  Settings2, 
  Tag, 
  Calendar, 
  AlertCircle,
  Plus
} from 'lucide-react';

export default function ProfileListingsTab({ listings = [] }) {
  const navigate = useNavigate();
  const [serviceFilter, setServiceFilter] = useState('all');

  const filtered = listings.filter((item) => {
    if (serviceFilter === 'all') return true;
    return (item.service || '').toLowerCase().includes(serviceFilter.toLowerCase());
  });

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto bg-white p-3 rounded-2xl border border-[#D5D1C9]">
        {[
          { id: 'all', label: 'All Services' },
          { id: 'marketplace', label: 'Marketplace' },
          { id: 'errands', label: 'Errands' },
          { id: 'storage', label: 'Storage' },
          { id: 'rooms', label: 'Rooms & Flatmates' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setServiceFilter(tab.id)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition ${
              serviceFilter === tab.id
                ? 'bg-[#171717] text-white'
                : 'text-stone-600 hover:text-stone-900 bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Listings List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#D5D1C9] rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-stone-400 transition"
            >
              <div className="flex items-center gap-4 min-w-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center flex-shrink-0 text-stone-400">
                    <Tag className="w-6 h-6" />
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                      {item.service}
                    </span>
                    <span className="text-[11px] text-stone-400 font-medium">{item.category}</span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm md:text-base truncate mt-1">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                    <span className="font-extrabold text-[#171717]">{item.price}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3 text-stone-400" /> {item.date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    item.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#D5D1C9] rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm font-semibold text-stone-700">No listings found</p>
          <p className="text-xs text-stone-500">
            {serviceFilter === 'all'
              ? "You haven't posted any marketplace or campus service listings yet."
              : `No listings under the "${serviceFilter}" service.`}
          </p>
          <button
            onClick={() => navigate('/services/marketplace/create')}
            className="px-4 py-2 bg-[#171717] text-white text-xs font-bold rounded-xl hover:bg-[#333333] transition inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Post an Item
          </button>
        </div>
      )}
    </div>
  );
}
