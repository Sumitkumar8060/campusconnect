// src/pages/MyMarketplaceListingsPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  CheckCircle, 
  RotateCcw, 
  Edit3, 
  Layers, 
  Eye, 
  ShoppingBag,
  Inbox
} from 'lucide-react';
import { INITIAL_MARKETPLACE_ITEMS } from '../data/marketplaceData';

export default function MyMarketplaceListingsPage() {
  const navigate = useNavigate();

  // Seed my listings from Rohan Sharma & Aditya Verma demo listings
  const [myItems, setMyItems] = useState([
    INITIAL_MARKETPLACE_ITEMS[0], // Calculus book
    INITIAL_MARKETPLACE_ITEMS[2], // Firefox cycle
    INITIAL_MARKETPLACE_ITEMS[8], // Dell monitor
  ]);

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'sold' | 'rented' | 'drafts'

  // Item status controls
  const handleMarkStatus = (itemId, newStatus) => {
    setMyItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status: newStatus } : item))
    );
  };

  const handleDelete = (itemId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      setMyItems((prev) => prev.filter((item) => item.id !== itemId));
    }
  };

  const filteredListings = myItems.filter((item) => {
    if (activeTab === 'active') return item.status === 'active';
    if (activeTab === 'sold') return item.status === 'sold';
    if (activeTab === 'rented') return item.status === 'rented';
    return false;
  });

  return (
    <div className="min-h-screen bg-[#EDEBE6] py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate('/marketplace')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-2 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Marketplace
            </button>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#171717] tracking-tight">
              My Marketplace Listings
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/marketplace/enquiries')}
              className="px-4 py-2.5 bg-white border border-[#D5D1C9] text-stone-800 text-xs md:text-sm font-semibold rounded-xl hover:bg-stone-50 transition flex items-center gap-2"
            >
              <Inbox className="w-4 h-4 text-amber-500" />
              <span>View Enquiries</span>
            </button>
            <button
              onClick={() => navigate('/marketplace/create')}
              className="px-5 py-2.5 bg-[#171717] text-white text-xs md:text-sm font-bold rounded-xl hover:bg-[#333333] transition flex items-center gap-2 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Item</span>
            </button>
          </div>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <div className="bg-white border border-[#D5D1C9] rounded-2xl p-4 shadow-sm text-center">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Active</span>
            <div className="text-2xl font-black text-[#171717] mt-0.5">
              {myItems.filter((i) => i.status === 'active').length}
            </div>
          </div>
          <div className="bg-white border border-[#D5D1C9] rounded-2xl p-4 shadow-sm text-center">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Completed</span>
            <div className="text-2xl font-black text-emerald-700 mt-0.5">
              {myItems.filter((i) => i.status === 'sold' || i.status === 'rented').length}
            </div>
          </div>
          <div className="bg-white border border-[#D5D1C9] rounded-2xl p-4 shadow-sm text-center">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Total Enquiries</span>
            <div className="text-2xl font-black text-blue-700 mt-0.5">
              2
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-300 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl transition ${
              activeTab === 'active'
                ? 'bg-[#171717] text-white'
                : 'text-stone-600 hover:text-stone-900 bg-white/60'
            }`}
          >
            Active Listings ({myItems.filter((i) => i.status === 'active').length})
          </button>
          <button
            onClick={() => setActiveTab('sold')}
            className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl transition ${
              activeTab === 'sold'
                ? 'bg-[#171717] text-white'
                : 'text-stone-600 hover:text-stone-900 bg-white/60'
            }`}
          >
            Sold Items ({myItems.filter((i) => i.status === 'sold').length})
          </button>
          <button
            onClick={() => setActiveTab('rented')}
            className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl transition ${
              activeTab === 'rented'
                ? 'bg-[#171717] text-white'
                : 'text-stone-600 hover:text-stone-900 bg-white/60'
            }`}
          >
            Rented Items ({myItems.filter((i) => i.status === 'rented').length})
          </button>
        </div>

        {/* Listings List */}
        {filteredListings.length > 0 ? (
          <div className="space-y-4">
            {filteredListings.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#D5D1C9] rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-20 h-20 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                        {item.type === 'rent' ? 'Rental' : 'Sale'}
                      </span>
                      <span className="text-xs text-stone-400">{item.location}</span>
                    </div>
                    <h3 className="font-bold text-[#171717] text-sm md:text-base truncate mt-1">
                      {item.title}
                    </h3>
                    <div className="font-extrabold text-sm text-stone-900 mt-1">
                      {item.type === 'rent' ? `₹${item.rentalRate}/${item.rentalPeriod}` : `₹${item.price}`}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                  {item.status === 'active' && (
                    <>
                      {item.type === 'sale' ? (
                        <button
                          onClick={() => handleMarkStatus(item.id, 'sold')}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-xl hover:bg-emerald-100 transition flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Mark as Sold
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkStatus(item.id, 'rented')}
                          className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold rounded-xl hover:bg-amber-100 transition flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Mark as Rented
                        </button>
                      )}
                    </>
                  )}

                  {item.status !== 'active' && (
                    <button
                      onClick={() => handleMarkStatus(item.id, 'active')}
                      className="px-3 py-1.5 bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl hover:bg-stone-200 transition flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Re-list
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Delete listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#D5D1C9] rounded-3xl p-12 text-center max-w-md mx-auto">
            <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-bold text-stone-800 text-base">No {activeTab} listings</h3>
            <p className="text-xs text-stone-500 mt-1">
              You do not have any items categorized as {activeTab}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}