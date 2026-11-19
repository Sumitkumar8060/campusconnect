import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search, Plus, Compass, Utensils, ShoppingBag, Film, Dumbbell,
  Trophy, BookOpen, MapPin, Sparkles, RotateCcw, Loader2,
} from 'lucide-react';

import { CATEGORIES } from '../data/companionsData';
import { getActivities as fetchActivities } from '../api/companionsApi';
import ActivityCard from '../components/ActivityCard1';
import CreateActivityModal from '../components/CreateActivityModal';
import ActivityDetailsPage from './ActivityDetailsPage';
import MyActivitiesTab from '../components/MyActivitiesTab';
import DashboardNavbar from '../components/DashboardNavbar';

const CATEGORY_ICONS = {
  'All Activities': Sparkles, 'Food & Dining': Utensils, Shopping: ShoppingBag,
  Movies: Film, Gym: Dumbbell, Sports: Trophy, Study: BookOpen,
  'Travel & Outings': Compass, Other: Sparkles,
};

export default function CompanionsPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('discover');
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All Activities');
  const [searchQuery, setSearchQuery] = useState('');
  const [slotFilter, setSlotFilter] = useState('all');
  const [sortBy, setSortBy] = useState('upcoming');

  const loadActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedCategory !== 'All Activities') params.category = selectedCategory;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (slotFilter !== 'all') params.slotFilter = slotFilter;
      params.sortBy = sortBy;

      const data = await fetchActivities(params);
      setActivities(data.activities || []);
    } catch (err) {
      console.error('Failed to load activities:', err);
      setError('Failed to load activities. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, slotFilter, sortBy]);

  useEffect(() => {
    if (activeTab === 'discover') {
      loadActivities();
    }
  }, [activeTab, loadActivities]);

  const handlePublishActivity = (newActivity) => {
    setActivities((prev) => [newActivity, ...prev]);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All Activities');
    setSearchQuery('');
    setSlotFilter('all');
    setSortBy('upcoming');
  };

  const handleJoinRequested = (activityId) => {
    // Optimistically update the activity in state
    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId ? { ...a, hasRequested: true, userRequestStatus: 'Pending' } : a
      )
    );
  };

  // If viewing a single activity detail
  if (selectedActivityId) {
    return (
      <div className="min-h-screen bg-[#EDEBE6] text-[#171717] font-sans antialiased">
        <DashboardNavbar />
        <main>
          <ActivityDetailsPage
            activityId={selectedActivityId}
            onBack={() => setSelectedActivityId(null)}
            onJoinRequested={handleJoinRequested}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDEBE6] text-[#171717] font-sans antialiased flex flex-col justify-between selection:bg-[#171717] selection:text-white">
      <DashboardNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 w-full">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#D5D1C9]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#D5D1C9] text-xs font-semibold uppercase tracking-wider text-[#171717] mb-3">
              <Compass className="w-3.5 h-3.5" /> Campus Companions
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171717]">
              Find Your People
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#555555] max-w-2xl leading-relaxed">
              Discover students who share your interests and plans. Find companions and make campus life more enjoyable.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'discover' ? 'my-activities' : 'discover')}
              className={`h-11 px-5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border border-[#D5D1C9] cursor-pointer ${
                activeTab === 'my-activities'
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'bg-white text-[#171717] hover:bg-[#EDEBE6]'
              }`}
            >
              {activeTab === 'discover' ? 'My Activities' : 'Browse All Activities'}
            </button>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="h-11 px-5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#171717] hover:bg-[#333333] transition-all duration-200 inline-flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Activity
            </button>
          </div>
        </div>

        {/* My Activities Tab */}
        {activeTab === 'my-activities' ? (
          <MyActivitiesTab />
        ) : (
          <>
            {/* Search & Filters */}
            <div className="space-y-5">
              <div className="relative max-w-2xl">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#666666]">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search activities, people or places..."
                  className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white border border-[#D5D1C9] text-sm text-[#171717] placeholder:text-[#888888] focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10 outline-none transition-all duration-200"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat] || Sparkles;
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-[#171717] text-white shadow-xs'
                          : 'bg-white text-[#292929] border border-[#D5D1C9] hover:border-[#171717]/40 hover:bg-[#EDEBE6]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" /> {cat}
                    </button>
                  );
                })}
              </div>

              {/* Secondary Filters */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#555555]">
                  <span>Filter by:</span>
                  <select
                    value={slotFilter}
                    onChange={(e) => setSlotFilter(e.target.value)}
                    className="h-8 px-2.5 rounded-lg bg-white border border-[#D5D1C9] text-xs font-medium text-[#171717] outline-none"
                  >
                    <option value="all">All Capacities</option>
                    <option value="open">Open Slots Only</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-8 px-2.5 rounded-lg bg-white border border-[#D5D1C9] text-xs font-medium text-[#171717] outline-none"
                  >
                    <option value="upcoming">Sort: Upcoming First</option>
                    <option value="newest">Sort: Newly Posted</option>
                  </select>

                  {(selectedCategory !== 'All Activities' || searchQuery || slotFilter !== 'all') && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-1 text-xs text-[#171717] font-semibold hover:underline cursor-pointer ml-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset filters
                    </button>
                  )}
                </div>

                <span className="text-xs text-[#777777]">
                  Showing <strong>{activities.length}</strong> activities
                </span>
              </div>
            </div>

            {/* Activity Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#171717]" />
              </div>
            ) : error ? (
              <div className="text-center py-16 px-4 rounded-3xl bg-white border border-[#D5D1C9]">
                <p className="text-sm text-red-600 font-semibold">{error}</p>
                <button
                  onClick={loadActivities}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-[#171717] text-white cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-3xl bg-white border border-[#D5D1C9] shadow-xs">
                <div className="h-12 w-12 rounded-full bg-[#EDEBE6] text-[#171717] flex items-center justify-center mx-auto mb-3">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#171717]">No activities found</h3>
                <p className="text-xs sm:text-sm text-[#555555] mt-1 max-w-sm mx-auto">
                  Try adjusting your search or create your own companion post.
                </p>
                <div className="mt-5 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#D5D1C9] hover:bg-[#EDEBE6] cursor-pointer"
                  >
                    Reset Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#171717] text-white hover:bg-[#333333] cursor-pointer"
                  >
                    + Create Activity
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {activities.map((act) => (
                  <ActivityCard
                    key={act.id}
                    activity={act}
                    onViewDetails={(id) => setSelectedActivityId(id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <CreateActivityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPublish={handlePublishActivity}
      />

      <footer className="border-t border-[#D5D1C9] bg-[#EDEBE6] py-8 text-center text-xs text-[#777777]">
        © 2026 CampusConnect. Find Companions & Activities.
      </footer>
    </div>
  );
}
