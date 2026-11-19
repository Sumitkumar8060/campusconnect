import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Box,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Building,
} from 'lucide-react';

import DashboardNavbar from '../components/DashboardNavbar';
import StorageRequestCard from '../components/StorageRequestCard';
import StorageOfferCard from '../components/StorageOfferCard';
import CreateStorageRequestModal from '../components/CreateStorageRequestModal';
import CreateStorageOfferModal from '../components/CreateStorageOfferModal';
import StorageRequestDetails from '../components/StorageRequestDetails';
import StorageOfferDetails from '../components/StorageOfferDetails';
import MyStorageTab from '../components/MyStorageTab';

import {
  STORAGE_CATEGORIES,
  STORAGE_LOCATIONS,
  INITIAL_STORAGE_REQUESTS,
  INITIAL_STORAGE_OFFERS,
  INITIAL_STORAGE_BOOKINGS_RECEIVED,
  INITIAL_STORAGE_BOOKINGS_SENT,
} from '../data/storageData';

export default function StoragePage() {
  const [activeTab, setActiveTab] = useState('need'); // 'need' | 'offer' | 'my-storage'
  const [requests, setRequests] = useState(INITIAL_STORAGE_REQUESTS);
  const [offers, setOffers] = useState(INITIAL_STORAGE_OFFERS);
  const [receivedBookings, setReceivedBookings] = useState(INITIAL_STORAGE_BOOKINGS_RECEIVED);
  const [sentBookings, setSentBookings] = useState(INITIAL_STORAGE_BOOKINGS_SENT);

  // Detail views
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedOfferId, setSelectedOfferId] = useState(null);

  // Modals
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price'

  // MATCHING CALCULATION
  const getMatchingOffersForRequest = (req) => {
    return offers.filter(
      (o) =>
        (o.category === req.category || o.location === req.preferredLocation) &&
        o.status === 'Available'
    );
  };

  const getMatchingRequestsForOffer = (off) => {
    return requests.filter(
      (r) =>
        (r.category === off.category || r.preferredLocation === off.location) &&
        r.status === 'Open'
    );
  };

  // Filtered Requests
  const filteredRequests = useMemo(() => {
    return requests
      .filter((r) => {
        if (selectedCategory !== 'All Categories' && r.category !== selectedCategory) return false;
        if (selectedLocation !== 'All Locations' && r.preferredLocation !== selectedLocation) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            r.title.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.belongingsSize.toLowerCase().includes(q) ||
            r.requester.name.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price') return a.estimatedBudget - b.estimatedBudget;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [requests, selectedCategory, selectedLocation, searchQuery, sortBy]);

  // Filtered Offers
  const filteredOffers = useMemo(() => {
    return offers
      .filter((o) => {
        if (selectedCategory !== 'All Categories' && o.category !== selectedCategory) return false;
        if (selectedLocation !== 'All Locations' && o.location !== selectedLocation) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            o.title.toLowerCase().includes(q) ||
            o.description.toLowerCase().includes(q) ||
            o.capacity.toLowerCase().includes(q) ||
            o.provider.name.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price') return a.pricePerDay - b.pricePerDay;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [offers, selectedCategory, selectedLocation, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSelectedLocation('All Locations');
    setSortBy('newest');
  };

  // Detailed Request View
  if (selectedRequestId) {
    const req = requests.find((r) => r.id === selectedRequestId);
    const matches = req ? getMatchingOffersForRequest(req) : [];
    return (
      <div className="min-h-screen bg-[#EDEBE6] text-[#171717] font-sans antialiased">
        <DashboardNavbar />
        <StorageRequestDetails
          request={req}
          matchingOffers={matches}
          onBack={() => setSelectedRequestId(null)}
          onOfferStorage={(reqObj) => {
            alert(`Offered space to ${reqObj.requester.name}! (Demo confirmation sent)`);
          }}
        />
      </div>
    );
  }

  // Detailed Offer View
  if (selectedOfferId) {
    const off = offers.find((o) => o.id === selectedOfferId);
    const matches = off ? getMatchingRequestsForOffer(off) : [];
    return (
      <div className="min-h-screen bg-[#EDEBE6] text-[#171717] font-sans antialiased">
        <DashboardNavbar />
        <StorageOfferDetails
          offer={off}
          matchingRequests={matches}
          onBack={() => setSelectedOfferId(null)}
          onRequestStorage={(offObj) => {
            alert(`Storage request submitted to provider ${offObj.provider.name}!`);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDEBE6] text-[#171717] font-sans antialiased flex flex-col justify-between selection:bg-[#171717] selection:text-white">
      
      <DashboardNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 w-full">
        
        {/* =========================================================================
            1. PAGE HEADER & MAIN ACTION BUTTONS
           ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#D5D1C9]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#D5D1C9] text-xs font-semibold uppercase tracking-wider text-[#171717] mb-3">
              <Box className="w-3.5 h-3.5" />
              Student Storage Network
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171717]">
              Student Storage
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#555555] max-w-2xl leading-relaxed">
              Need a place to keep your belongings temporarily? Discover convenient storage options offered by fellow students.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'my-storage' ? 'need' : 'my-storage')}
              className={`h-11 px-5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border border-[#D5D1C9] cursor-pointer ${
                activeTab === 'my-storage'
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'bg-white text-[#171717] hover:bg-[#EDEBE6]'
              }`}
            >
              My Storage
            </button>

            {activeTab === 'need' ? (
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(true)}
                className="h-11 px-5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#171717] hover:bg-[#333333] transition-all duration-200 inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Request Storage
              </button>
            ) : activeTab === 'offer' ? (
              <button
                type="button"
                onClick={() => setIsOfferModalOpen(true)}
                className="h-11 px-5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#171717] hover:bg-[#333333] transition-all duration-200 inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Offer Storage
              </button>
            ) : null}
          </div>
        </div>

        {/* =========================================================================
            2. TWO PRIMARY SELECTABLE TABS
           ========================================================================= */}
        {activeTab !== 'my-storage' && (
          <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-white border border-[#D5D1C9] max-w-md mx-auto shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('need')}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'need'
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'text-[#666666] hover:text-[#171717]'
              }`}
            >
              <Box className="w-4 h-4" />
              I Need Storage ({requests.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('offer')}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'offer'
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'text-[#666666] hover:text-[#171717]'
              }`}
            >
              <Building className="w-4 h-4" />
              I Can Offer Storage ({offers.length})
            </button>
          </div>
        )}

        {/* Content View */}
        {activeTab === 'my-storage' ? (
          <MyStorageTab
            requests={requests}
            setRequests={setRequests}
            offers={offers}
            setOffers={setOffers}
            receivedBookings={receivedBookings}
            setReceivedBookings={setReceivedBookings}
            sentBookings={sentBookings}
            setSentBookings={setSentBookings}
          />
        ) : (
          <>
            {/* Search and Filters Bar */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#666666]">
                    <Search className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search storage options, boxes, suitcases or locations..."
                    className="w-full h-11 pl-11 pr-4 rounded-2xl bg-white border border-[#D5D1C9] text-sm text-[#171717] placeholder:text-[#888888] focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10 outline-none"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-11 px-3.5 rounded-2xl bg-white border border-[#D5D1C9] text-xs font-semibold text-[#171717] outline-none"
                >
                  {STORAGE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="h-11 px-3.5 rounded-2xl bg-white border border-[#D5D1C9] text-xs font-semibold text-[#171717] outline-none"
                >
                  {STORAGE_LOCATIONS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-11 px-3.5 rounded-2xl bg-white border border-[#D5D1C9] text-xs font-semibold text-[#171717] outline-none"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="price">Sort: Lowest Price</option>
                </select>

                {(searchQuery || selectedCategory !== 'All Categories' || selectedLocation !== 'All Locations') && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="h-11 px-4 rounded-2xl text-xs font-semibold border border-[#D5D1C9] bg-white hover:bg-[#EDEBE6] flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Display: "I Need Storage" (Requests Grid) */}
            {activeTab === 'need' && (
              <div>
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-16 px-4 rounded-3xl bg-white border border-[#D5D1C9]">
                    <p className="text-base font-bold text-[#171717]">No storage requests found</p>
                    <button
                      type="button"
                      onClick={() => setIsRequestModalOpen(true)}
                      className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-[#171717] text-white"
                    >
                      + Request Storage
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredRequests.map((req) => {
                      const matches = getMatchingOffersForRequest(req);
                      return (
                        <StorageRequestCard
                          key={req.id}
                          request={req}
                          matchingOffersCount={matches.length}
                          onViewDetails={(id) => setSelectedRequestId(id)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Display: "I Can Offer Storage" (Offers Grid) */}
            {activeTab === 'offer' && (
              <div>
                {filteredOffers.length === 0 ? (
                  <div className="text-center py-16 px-4 rounded-3xl bg-white border border-[#D5D1C9]">
                    <p className="text-base font-bold text-[#171717]">No storage spaces match your filters</p>
                    <button
                      type="button"
                      onClick={() => setIsOfferModalOpen(true)}
                      className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-[#171717] text-white"
                    >
                      + Offer Storage Space
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredOffers.map((off) => {
                      const matches = getMatchingRequestsForOffer(off);
                      return (
                        <StorageOfferCard
                          key={off.id}
                          offer={off}
                          matchingRequestsCount={matches.length}
                          onViewDetails={(id) => setSelectedOfferId(id)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </main>

      {/* Modals */}
      <CreateStorageRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onPublish={(newReq) => setRequests((prev) => [newReq, ...prev])}
      />

      <CreateStorageOfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        onPublish={(newOff) => setOffers((prev) => [newOff, ...prev])}
      />

      {/* Safety Notice Footer */}
      <footer className="border-t border-[#D5D1C9] bg-[#EDEBE6] py-8 text-center text-xs text-[#777777] space-y-1">
        <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#555555]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          CampusConnect peer storage reminder: Always inspect storage conditions and document belongings during handoff.
        </p>
        <p>© 2026 CampusConnect. Student Storage Network.</p>
      </footer>

    </div>
  );
}