// src/pages/MarketplacePage.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Bookmark, 
  Sparkles, 
  BookOpen, 
  Laptop, 
  Bike, 
  Armchair, 
  Home, 
  Dumbbell, 
  Package, 
  ArrowUpDown,
  Inbox,
  Filter,
  CheckCircle,
  HelpCircle,
  X
} from 'lucide-react';
import { 
  MARKETPLACE_CATEGORIES, 
  INITIAL_MARKETPLACE_ITEMS 
} from '../data/marketplaceData';
import MarketplaceItemCard from '../components/MarketplaceItemCard';
import MarketplaceDetailsPage from './MarketplaceDetailsPage';
import DashboardNavbar from '../components/DashboardNavbar';


// Icon mapper for categories
const CATEGORY_ICON_MAP = {
  Sparkles,
  BookOpen,
  Laptop,
  Bike,
  Armchair,
  Home,
  Dumbbell,
  Package,
};

export default function MarketplacePage() {
  const navigate = useNavigate();

  // State
  const [items, setItems] = useState(INITIAL_MARKETPLACE_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'sale' | 'rent'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price-low' | 'price-high'
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [selectedItemForDetails, setSelectedItemForDetails] = useState(null);

  // Toggle bookmark save state
  const handleToggleSave = (itemId) => {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, isSaved: !it.isSaved } : it))
    );
  };

  // Filtered & sorted items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Active check
        if (item.status !== 'active') return false;

        // Saved filter check
        if (showSavedOnly && !item.isSaved) return false;

        // Type filter check (sale vs rent)
        if (typeFilter !== 'all' && item.type !== typeFilter) return false;

        // Category filter check
        if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

        // Search check
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchLoc = item.location.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchLoc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') {
          const priceA = a.type === 'rent' ? a.rentalRate : a.price;
          const priceB = b.type === 'rent' ? b.rentalRate : b.price;
          return priceA - priceB;
        }
        if (sortBy === 'price-high') {
          const priceA = a.type === 'rent' ? a.rentalRate : a.price;
          const priceB = b.type === 'rent' ? b.rentalRate : b.price;
          return priceB - priceA;
        }
        // default newest
        return 0;
      });
  }, [items, searchQuery, selectedCategory, typeFilter, sortBy, showSavedOnly]);

  const savedCount = items.filter((i) => i.isSaved).length;

  return (
    <div className="min-vh-100 bg-[#EDEBE6] text-[#171717] pb-20">
        <DashboardNavbar />
      {/* Top Hero Section */}
      <div className="bg-[#171717] text-white pt-10 pb-12 px-4 md:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-800 border border-stone-700 text-stone-300 text-xs font-semibold rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Verified Campus Community
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Student Marketplace
            </h1>
            <p className="mt-2 text-stone-300 text-sm md:text-base leading-relaxed">
              Buy, sell, and rent essentials from students right on your campus. Save money, reduce waste, and transact safely in person.
            </p>
          </div>

          {/* Quick Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => navigate('/services/marketplace/enquiries')}
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-white text-xs md:text-sm font-medium rounded-xl transition flex items-center gap-2"
            >
              <Inbox className="w-4 h-4 text-amber-400" />
              <span>Enquiries</span>
            </button>
            <button
              onClick={() => navigate('/services/marketplace/my-listings')}
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-white text-xs md:text-sm font-medium rounded-xl transition flex items-center gap-2"
            >
              <span>My Listings</span>
            </button>
            <button
              onClick={() => navigate('/services/marketplace/create')}
              className="px-5 py-2.5 bg-white text-[#171717] hover:bg-stone-200 text-xs md:text-sm font-semibold rounded-xl transition shadow flex items-center gap-2 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Post an Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6 space-y-6">
        
        {/* Search & Control Bar */}
        <div className="bg-white border border-[#D5D1C9] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, cycles, mini-fridges, tech..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#171717] focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type Toggle: All / For Sale / For Rent */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 self-start md:self-auto">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                typeFilter === 'all'
                  ? 'bg-white text-[#171717] shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter('sale')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                typeFilter === 'sale'
                  ? 'bg-white text-[#171717] shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              For Sale
            </button>
            <button
              onClick={() => setTypeFilter('rent')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                typeFilter === 'rent'
                  ? 'bg-white text-[#171717] shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              For Rent
            </button>
          </div>

          {/* Sort Dropdown & Saved Bookmark Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#171717] cursor-pointer"
              >
                <option value="newest">Recently Added</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400" />
            </div>

            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border transition flex items-center gap-1.5 ${
                showSavedOnly
                  ? 'bg-[#171717] text-white border-[#171717]'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-current text-amber-400' : ''}`} />
              <span>Saved ({savedCount})</span>
            </button>
          </div>
        </div>

        {/* Category Horizontal Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {MARKETPLACE_CATEGORIES.map((cat) => {
            const IconComponent = CATEGORY_ICON_MAP[cat.icon] || Package;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-medium whitespace-nowrap transition border ${
                  isSelected
                    ? 'bg-[#171717] text-white border-[#171717] shadow-sm'
                    : 'bg-white text-stone-700 border-[#D5D1C9] hover:bg-stone-50 hover:border-stone-400'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-stone-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between text-xs text-stone-500 font-medium px-1">
          <span>
            Showing <strong>{filteredItems.length}</strong> {filteredItems.length === 1 ? 'item' : 'items'}
            {selectedCategory !== 'all' && ` in ${MARKETPLACE_CATEGORIES.find((c) => c.id === selectedCategory)?.label}`}
            {showSavedOnly && ' (Saved items only)'}
          </span>
          {(selectedCategory !== 'all' || typeFilter !== 'all' || searchQuery || showSavedOnly) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setTypeFilter('all');
                setSearchQuery('');
                setShowSavedOnly(false);
              }}
              className="text-stone-800 hover:underline font-semibold"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <MarketplaceItemCard
                key={item.id}
                item={item}
                onSelect={(selected) => setSelectedItemForDetails(selected)}
                onToggleSave={handleToggleSave}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white border border-[#D5D1C9] rounded-3xl p-12 text-center max-w-lg mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto mb-4 text-stone-400">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-800">No items found</h3>
            <p className="text-sm text-stone-500 mt-1">
              {showSavedOnly
                ? "You haven't saved any items yet. Bookmark items to view them here later!"
                : "No listings match your search or filter criteria. Try clearing some filters or be the first to post this item!"}
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setTypeFilter('all');
                  setSearchQuery('');
                  setShowSavedOnly(false);
                }}
                className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-semibold rounded-xl hover:bg-stone-50"
              >
                Clear Filters
              </button>
              <button
                onClick={() => navigate('/marketplace/create')}
                className="px-4 py-2 bg-[#171717] text-white text-xs font-semibold rounded-xl hover:bg-[#333333]"
              >
                Post an Item
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Item Details Modal/Overlay (if clicked from the card) */}
      {selectedItemForDetails && (
        <MarketplaceDetailsPage
          item={selectedItemForDetails}
          onClose={() => setSelectedItemForDetails(null)}
          onToggleSave={handleToggleSave}
        />
      )}
    </div>
  );
}