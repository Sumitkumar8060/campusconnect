import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  ShoppingBag,
  Send,
  Compass,
  RotateCcw,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

import DashboardNavbar from '../components/DashboardNavbar';
import ErrandsRequestCard from '../components/ErrandsRequestCard';
import ErrandsOfferCard from '../components/ErrandsOfferCard';
import CreateRequestModal from '../components/CreateRequestModal';
import CreateOfferModal from '../components/CreateOfferModal';
import RequestDetailsView from '../components/RequestDetailsView';
import OfferDetailsView from '../components/OfferDetailsView';
import MyErrandsTab from '../components/MyErrandsTab';

import {
  ERRAND_CATEGORIES,
  DESTINATIONS,
  INITIAL_REQUESTS,
  INITIAL_OFFERS,
  INITIAL_ERRAND_REQUESTS_RECEIVED,
  INITIAL_ERRAND_REQUESTS_SENT,
} from '../data/errandsData';

export default function ErrandsPage() {
  const [activeMode, setActiveMode] = useState('need'); // 'need' | 'going' | 'my-errands'
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [offers, setOffers] = useState(INITIAL_OFFERS);
  const [receivedRequests, setReceivedRequests] = useState(INITIAL_ERRAND_REQUESTS_RECEIVED);
  const [sentRequests, setSentRequests] = useState(INITIAL_ERRAND_REQUESTS_SENT);

  // Selected Detail Views
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedOfferId, setSelectedOfferId] = useState(null);

  // Modals
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedDestination, setSelectedDestination] = useState('All Destinations');

  // MATCHING CALCULATION (Count matching offers for requests, and matching requests for offers)
  const getMatchingOffersForRequest = (req) => {
    return offers.filter(
      (o) =>
        (o.destination.toLowerCase().includes(req.preferredShop.toLowerCase()) ||
          req.preferredShop.toLowerCase().includes(o.destination.toLowerCase())) &&
        o.status !== 'Fully Booked'
    );
  };

  const getMatchingRequestsForOffer = (off) => {
    return requests.filter(
      (r) =>
        r.preferredShop.toLowerCase().includes(off.destination.toLowerCase()) ||
        off.destination.toLowerCase().includes(r.preferredShop.toLowerCase())
    );
  };

  // Filtered Requests
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (selectedCategory !== 'All Categories' && r.category !== selectedCategory) return false;
      if (selectedDestination !== 'All Destinations' && r.preferredShop !== selectedDestination) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.itemName.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.preferredShop.toLowerCase().includes(q) ||
          r.requester.name.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [requests, selectedCategory, selectedDestination, searchQuery]);

  // Filtered Offers
  const filteredOffers = useMemo(() => {
    return offers.filter((o) => {
      if (selectedDestination !== 'All Destinations' && o.destination !== selectedDestination) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          o.destination.toLowerCase().includes(q) ||
          o.traveler.name.toLowerCase().includes(q) ||
          o.notes.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [offers, selectedDestination, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSelectedDestination('All Destinations');
  };

  // Detailed Request View
  if (selectedRequestId) {
    const req = requests.find((r) => r.id === selectedRequestId);
    const matches = req ? getMatchingOffersForRequest(req) : [];
    return (
      <div className="min-h-screen bg-[#EDEBE6] text-[#171717] font-sans antialiased">
        <DashboardNavbar />
        <RequestDetailsView
          request={req}
          matchingOffers={matches}
          onBack={() => setSelectedRequestId(null)}
          onSelectOffer={(offId) => {
            setSelectedRequestId(null);
            setSelectedOfferId(offId);
          }}
          onExpressInterest={(reqObj) => {
            alert(`Interest expressed! Requester ${reqObj.requester.name} has been notified on frontend.`);
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
        <OfferDetailsView
          offer={off}
          matchingRequests={matches}
          onBack={() => setSelectedOfferId(null)}
          onRequestItem={(offObj) => {
            alert(`Item request sent to traveler ${offObj.traveler.name}!`);
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
              <ShoppingBag className="w-3.5 h-3.5" />
              Peer Delivery & Errands
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171717]">
              Campus Errands
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#555555] max-w-2xl leading-relaxed">
              Need something from outside campus? Or already heading out? Help fellow students and make everyday errands easier.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveMode(activeMode === 'my-errands' ? 'need' : 'my-errands')}
              className={`h-11 px-5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border border-[#D5D1C9] cursor-pointer ${
                activeMode === 'my-errands'
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'bg-white text-[#171717] hover:bg-[#EDEBE6]'
              }`}
            >
              My Errands
            </button>

            {activeMode === 'need' ? (
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(true)}
                className="h-11 px-5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#171717] hover:bg-[#333333] transition-all duration-200 inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Request an Item
              </button>
            ) : activeMode === 'going' ? (
              <button
                type="button"
                onClick={() => setIsOfferModalOpen(true)}
                className="h-11 px-5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#171717] hover:bg-[#333333] transition-all duration-200 inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Offer to Bring Items
              </button>
            ) : null}
          </div>
        </div>

        {/* =========================================================================
            2. TWO PRIMARY SELECTABLE TABS
           ========================================================================= */}
        {activeMode !== 'my-errands' && (
          <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-white border border-[#D5D1C9] max-w-md mx-auto shadow-xs">
            <button
              type="button"
              onClick={() => setActiveMode('need')}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                activeMode === 'need'
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'text-[#666666] hover:text-[#171717]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              I Need Something ({requests.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('going')}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                activeMode === 'going'
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'text-[#666666] hover:text-[#171717]'
              }`}
            >
              <Send className="w-4 h-4" />
              I'm Going Outside ({offers.length})
            </button>
          </div>
        )}

        {/* Content depending on active mode */}
        {activeMode === 'my-errands' ? (
          <MyErrandsTab
            requests={requests}
            setRequests={setRequests}
            offers={offers}
            setOffers={setOffers}
            receivedRequests={receivedRequests}
            setReceivedRequests={setReceivedRequests}
            sentRequests={sentRequests}
            setSentRequests={setSentRequests}
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
                    placeholder="Search for items, shops or requests..."
                    className="w-full h-11 pl-11 pr-4 rounded-2xl bg-white border border-[#D5D1C9] text-sm text-[#171717] placeholder:text-[#888888] focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10 outline-none"
                  />
                </div>

                {activeMode === 'need' && (
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-11 px-3.5 rounded-2xl bg-white border border-[#D5D1C9] text-xs font-semibold text-[#171717] outline-none"
                  >
                    {ERRAND_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                )}

                <select
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                  className="h-11 px-3.5 rounded-2xl bg-white border border-[#D5D1C9] text-xs font-semibold text-[#171717] outline-none"
                >
                  {DESTINATIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                {(searchQuery || selectedCategory !== 'All Categories' || selectedDestination !== 'All Destinations') && (
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

            {/* Display: "I Need Something" (Requests Grid) */}
            {activeMode === 'need' && (
              <div>
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-16 px-4 rounded-3xl bg-white border border-[#D5D1C9]">
                    <p className="text-base font-bold text-[#171717]">No item requests match your criteria</p>
                    <button
                      type="button"
                      onClick={() => setIsRequestModalOpen(true)}
                      className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-[#171717] text-white"
                    >
                      + Request this Item
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredRequests.map((req) => {
                      const matches = getMatchingOffersForRequest(req);
                      return (
                        <ErrandsRequestCard
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

            {/* Display: "I'm Going Outside" (Offers Grid) */}
            {activeMode === 'going' && (
              <div>
                {filteredOffers.length === 0 ? (
                  <div className="text-center py-16 px-4 rounded-3xl bg-white border border-[#D5D1C9]">
                    <p className="text-base font-bold text-[#171717]">No travel offers found for this search</p>
                    <button
                      type="button"
                      onClick={() => setIsOfferModalOpen(true)}
                      className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-[#171717] text-white"
                    >
                      + Offer to Bring Items
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredOffers.map((off) => {
                      const matches = getMatchingRequestsForOffer(off);
                      return (
                        <ErrandsOfferCard
                          key={off.id}
                          offer={off}
                          matchingRequestsCount={matches.length}
                          onViewOffer={(id) => setSelectedOfferId(id)}
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
      <CreateRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onPublish={(newReq) => setRequests((prev) => [newReq, ...prev])}
      />

      <CreateOfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        onPublish={(newOff) => setOffers((prev) => [newOff, ...prev])}
      />

      {/* Footer Safety Notice */}
      <footer className="border-t border-[#D5D1C9] bg-[#EDEBE6] py-8 text-center text-xs text-[#777777] space-y-1">
        <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#555555]">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          CampusConnect is a peer helper network. Settle item costs safely via UPI upon physical pickup.
        </p>
        <p>© 2026 CampusConnect. Campus Errands & Peer Deliveries.</p>
      </footer>

    </div>
  );
}