import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Home,
  Users,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';

import DashboardNavbar from '../components/DashboardNavbar';
import RoomListingCard from '../components/RoomListingCard';
import FlatmateProfileCard from '../components/FlatmateProfileCard';
import CreateRoomModal from '../components/CreateRoomModal';
import CreateFlatmateModal from '../components/CreateFlatmateModal';
import RoomDetailsView from '../components/RoomDetailsView';
import FlatmateDetailsView from '../components/FlatmateDetailsView';
import MyListingsTab from '../components/MyListingsTab';

import {
  ROOM_TYPES,
  FURNISHING_TYPES,
  LOCATIONS,
  INITIAL_ROOMS,
  INITIAL_FLATMATES,
  INITIAL_ROOM_ENQUIRIES_RECEIVED,
  INITIAL_ROOM_ENQUIRIES_SENT,
} from '../data/roomsData';

export default function RoomsPage() {
  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' | 'flatmates' | 'my-listings'
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [flatmates, setFlatmates] = useState(INITIAL_FLATMATES);
  const [receivedEnquiries, setReceivedEnquiries] = useState(INITIAL_ROOM_ENQUIRIES_RECEIVED);
  const [sentEnquiries, setSentEnquiries] = useState(INITIAL_ROOM_ENQUIRIES_SENT);

  // Detail views
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedFlatmateId, setSelectedFlatmateId] = useState(null);

  // Modals
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isFlatmateModalOpen, setIsFlatmateModalOpen] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('All Types');
  const [selectedFurnishing, setSelectedFurnishing] = useState('All Furnishing');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price-asc' | 'price-desc'

  // Filtered Rooms
  const filteredRooms = useMemo(() => {
    return rooms
      .filter((r) => {
        if (selectedRoomType !== 'All Types' && r.roomType !== selectedRoomType) return false;
        if (selectedFurnishing !== 'All Furnishing' && r.furnishing !== selectedFurnishing) return false;
        if (selectedLocation !== 'All Locations' && r.location !== selectedLocation) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            r.title.toLowerCase().includes(q) ||
            r.location.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.monthlyRent - b.monthlyRent;
        if (sortBy === 'price-desc') return b.monthlyRent - a.monthlyRent;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [rooms, selectedRoomType, selectedFurnishing, selectedLocation, searchQuery, sortBy]);

  // Filtered Flatmates
  const filteredFlatmates = useMemo(() => {
    return flatmates
      .filter((f) => {
        if (selectedLocation !== 'All Locations' && f.preferredLocation !== selectedLocation) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            f.name.toLowerCase().includes(q) ||
            f.title.toLowerCase().includes(q) ||
            f.intro.toLowerCase().includes(q) ||
            f.preferredLocation.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.monthlyBudget - b.monthlyBudget;
        if (sortBy === 'price-desc') return b.monthlyBudget - a.monthlyBudget;
        return 0;
      });
  }, [flatmates, selectedLocation, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRoomType('All Types');
    setSelectedFurnishing('All Furnishing');
    setSelectedLocation('All Locations');
    setSortBy('newest');
  };

  // Detailed Room View
  if (selectedRoomId) {
    const room = rooms.find((r) => r.id === selectedRoomId);
    return (
      <div className="min-h-screen bg-[#EDEBE6] text-[#171717] font-sans antialiased">
        <DashboardNavbar />
        <RoomDetailsView
          room={room}
          onBack={() => setSelectedRoomId(null)}
          onSendEnquiry={(roomObj) => {
            alert(`Enquiry sent to ${roomObj.owner.name}! (Demo confirmation)`);
          }}
        />
      </div>
    );
  }

  // Detailed Flatmate View
  if (selectedFlatmateId) {
    const flatmate = flatmates.find((f) => f.id === selectedFlatmateId);
    return (
      <div className="min-h-screen bg-[#EDEBE6] text-[#171717] font-sans antialiased">
        <DashboardNavbar />
        <FlatmateDetailsView
          flatmate={flatmate}
          onBack={() => setSelectedFlatmateId(null)}
          onConnect={(flatmateObj) => {
            alert(`Connection request sent to ${flatmateObj.name}!`);
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
              <Home className="w-3.5 h-3.5" />
              Student Housing Network
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171717]">
              Find Your Space, Find Your People
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#555555] max-w-2xl leading-relaxed">
              Looking for a room or someone to share accommodation with? Discover student-friendly accommodation and connect with potential flatmates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'my-listings' ? 'rooms' : 'my-listings')}
              className={`h-11 px-5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border border-[#D5D1C9] cursor-pointer ${
                activeTab === 'my-listings'
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'bg-white text-[#171717] hover:bg-[#EDEBE6]'
              }`}
            >
              My Listings
            </button>

            {activeTab === 'rooms' ? (
              <button
                type="button"
                onClick={() => setIsRoomModalOpen(true)}
                className="h-11 px-5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#171717] hover:bg-[#333333] transition-all duration-200 inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Post a Room
              </button>
            ) : activeTab === 'flatmates' ? (
              <button
                type="button"
                onClick={() => setIsFlatmateModalOpen(true)}
                className="h-11 px-5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#171717] hover:bg-[#333333] transition-all duration-200 inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Find a Flatmate
              </button>
            ) : null}
          </div>
        </div>

        {/* =========================================================================
            2. TWO PRIMARY SELECTABLE TABS
           ========================================================================= */}
        {activeTab !== 'my-listings' && (
          <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-white border border-[#D5D1C9] max-w-md mx-auto shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('rooms')}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'rooms'
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'text-[#666666] hover:text-[#171717]'
              }`}
            >
              <Home className="w-4 h-4" />
              Find a Room ({rooms.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('flatmates')}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'flatmates'
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'text-[#666666] hover:text-[#171717]'
              }`}
            >
              <Users className="w-4 h-4" />
              Find a Flatmate ({flatmates.length})
            </button>
          </div>
        )}

        {/* Content View */}
        {activeTab === 'my-listings' ? (
          <MyListingsTab
            rooms={rooms}
            setRooms={setRooms}
            flatmates={flatmates}
            setFlatmates={setFlatmates}
            receivedEnquiries={receivedEnquiries}
            setReceivedEnquiries={setReceivedEnquiries}
            sentEnquiries={sentEnquiries}
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
                    placeholder="Search rooms, locations or flatmates..."
                    className="w-full h-11 pl-11 pr-4 rounded-2xl bg-white border border-[#D5D1C9] text-sm text-[#171717] placeholder:text-[#888888] focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10 outline-none"
                  />
                </div>

                {activeTab === 'rooms' && (
                  <>
                    <select
                      value={selectedRoomType}
                      onChange={(e) => setSelectedRoomType(e.target.value)}
                      className="h-11 px-3.5 rounded-2xl bg-white border border-[#D5D1C9] text-xs font-semibold text-[#171717] outline-none"
                    >
                      {ROOM_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>

                    <select
                      value={selectedFurnishing}
                      onChange={(e) => setSelectedFurnishing(e.target.value)}
                      className="h-11 px-3.5 rounded-2xl bg-white border border-[#D5D1C9] text-xs font-semibold text-[#171717] outline-none"
                    >
                      {FURNISHING_TYPES.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </>
                )}

                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="h-11 px-3.5 rounded-2xl bg-white border border-[#D5D1C9] text-xs font-semibold text-[#171717] outline-none"
                >
                  {LOCATIONS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-11 px-3.5 rounded-2xl bg-white border border-[#D5D1C9] text-xs font-semibold text-[#171717] outline-none"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="price-asc">Rent: Low to High</option>
                  <option value="price-desc">Rent: High to Low</option>
                </select>

                {(searchQuery || selectedRoomType !== 'All Types' || selectedFurnishing !== 'All Furnishing' || selectedLocation !== 'All Locations') && (
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

            {/* Display: "Find a Room" (Rooms Grid) */}
            {activeTab === 'rooms' && (
              <div>
                {filteredRooms.length === 0 ? (
                  <div className="text-center py-16 px-4 rounded-3xl bg-white border border-[#D5D1C9]">
                    <p className="text-base font-bold text-[#171717]">No room listings match your filters</p>
                    <button
                      type="button"
                      onClick={() => setIsRoomModalOpen(true)}
                      className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-[#171717] text-white"
                    >
                      + Post a Room
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredRooms.map((room) => (
                      <RoomListingCard
                        key={room.id}
                        room={room}
                        onViewDetails={(id) => setSelectedRoomId(id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Display: "Find a Flatmate" (Flatmates Grid) */}
            {activeTab === 'flatmates' && (
              <div>
                {filteredFlatmates.length === 0 ? (
                  <div className="text-center py-16 px-4 rounded-3xl bg-white border border-[#D5D1C9]">
                    <p className="text-base font-bold text-[#171717]">No flatmate profiles found</p>
                    <button
                      type="button"
                      onClick={() => setIsFlatmateModalOpen(true)}
                      className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-[#171717] text-white"
                    >
                      + Post Flatmate Requirement
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredFlatmates.map((flatmate) => (
                      <FlatmateProfileCard
                        key={flatmate.id}
                        flatmate={flatmate}
                        onViewDetails={(id) => setSelectedFlatmateId(id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </main>

      {/* Modals */}
      <CreateRoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        onPublish={(newRoom) => setRooms((prev) => [newRoom, ...prev])}
      />

      <CreateFlatmateModal
        isOpen={isFlatmateModalOpen}
        onClose={() => setIsFlatmateModalOpen(false)}
        onPublish={(newFlatmate) => setFlatmates((prev) => [newFlatmate, ...prev])}
      />

      {/* Footer Safety Notice */}
      <footer className="border-t border-[#D5D1C9] bg-[#EDEBE6] py-8 text-center text-xs text-[#777777] space-y-1">
        <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#555555]">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          Scam prevention tip: Always physically inspect accommodation and verify rental agreements before transferring money.
        </p>
        <p>© 2026 CampusConnect. Student Housing & Flatmate Network.</p>
      </footer>

    </div>
  );
}