import React, { useState } from 'react';
import {
  Search,
  Users,
  ShoppingBag,
  Send,
  Package,
  Home,
  Tag,
  Sparkles,
  Info,
} from 'lucide-react';

import DashboardNavbar from '../components/DashboardNavbar';
import DashboardServiceCard from '../components/DashboardServiceCard';
import QuickActionCard from '../components/QuickActionCard';
import ActivityCard from '../components/ActivityCard';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // 6 Quick Action Shortcuts
  const quickActions = [
    { title: 'Find a Companion', icon: Users, href: '/services/companions' },
    { title: 'Request an Item', icon: ShoppingBag, href: '/services/errands?type=request' },
    { title: 'Offer to Bring Items', icon: Send, href: '/services/errands?type=offer' },
    { title: 'Offer Storage', icon: Package, href: '/services/storage' },
    { title: 'Post a Room', icon: Home, href: '/services/rooms' },
    { title: 'Sell or Rent an Item', icon: Tag, href: '/services/marketplace' },
  ];

  // 5 Main Services Data
  const services = [
    {
      title: 'Find Companions',
      description:
        'Looking for someone to join you? Find students for shopping, food, movies, gym, sports, study sessions, and outings.',
      image:
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80',
      tag: 'Social & Activities',
      actionText: 'Find Companions',
      href: '/services/companions',
    },
    {
      title: 'Campus Errands',
      description:
        'Need something from outside campus or going out and willing to help someone? Connect with students and get things done.',
      image:
        'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1000&q=80',
      tag: 'Deliveries & Errands',
      isErrandsCard: true,
    },
    {
      title: 'Student Storage',
      description:
        'Need a safe temporary place for your luggage or belongings? Explore storage options offered by students.',
      image:
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
      tag: 'Luggage & Space',
      actionText: 'Explore Storage',
      href: '/services/storage',
    },
    {
      title: 'Rooms & Flatmates',
      description:
        'Looking for a room or someone to share accommodation with? Discover rooms and connect with potential flatmates.',
      image:
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80',
      tag: 'Housing & Accommodation',
      actionText: 'Discover Rooms',
      href: '/services/rooms',
    },
    {
      title: 'Student Marketplace',
      description:
        'Buy, sell, or rent second-hand student essentials such as books, bicycles, furniture, and electronics.',
      image:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=80',
      tag: 'Buy, Sell & Rent',
      actionText: 'Browse Marketplace',
      href: '/services/marketplace',
    },
  ];

  // Sample Activity Cards (Clearly marked as sample/demo content)
  const sampleActivities = [
    {
      category: 'Companions',
      title: 'Looking for 2 students for badminton doubles match tonight at 7 PM.',
      author: 'Rohan Sharma (B.Tech)',
      location: 'Indoor Stadium',
      time: '15m ago',
    },
    {
      category: 'Campus Errands',
      title: 'Going to Main Market at 5 PM. Can pick up fruits, snacks, or stationery.',
      author: 'Ananya Verma (MBA)',
      location: 'Gate 2 Departure',
      time: '40m ago',
    },
    {
      category: 'Student Marketplace',
      title: 'Engineering Mechanics (3rd Ed.) + Scientific Calculator in mint condition.',
      author: 'Karan Patel (ECE)',
      location: 'Hostel Block 4',
      time: '1h ago',
    },
    {
      category: 'Rooms & Flatmates',
      title: '1 Single room available in fully furnished 3BHK flat near North Campus.',
      author: 'Vikram Mehta (Design)',
      location: 'Green Valley Apts',
      time: '2h ago',
    },
  ];

  return (
    <div className="min-h-screen bg-[#EDEBE6] text-[#171717] font-sans antialiased selection:bg-[#171717] selection:text-white flex flex-col justify-between">
      
      {/* 1. Top Navigation */}
      <DashboardNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16 w-full">
        
        {/* =========================================================================
            2. WELCOME & SEARCH SECTION
           ========================================================================= */}
        <section className="relative rounded-3xl bg-white border border-[#D5D1C9] p-6 sm:p-10 shadow-sm overflow-hidden">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDEBE6] text-xs font-semibold uppercase tracking-wider text-[#171717] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Student Dashboard
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171717]">
              Welcome to CampusConnect!
            </h1>
            
            <p className="mt-3 text-sm sm:text-base text-[#555555] leading-relaxed">
              What are you looking for today? Explore services, connect with fellow students, and make campus life easier.
            </p>

            {/* Search Bar */}
            <div className="mt-6 sm:mt-8 relative max-w-2xl">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#666666]">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for services, activities, rooms, items..."
                className="w-full h-13 pl-12 pr-4 rounded-2xl bg-[#EDEBE6]/50 border border-[#D5D1C9] text-sm sm:text-base text-[#171717] placeholder:text-[#888888] focus:bg-white focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10 outline-none transition-all duration-200"
              />
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. QUICK ACTIONS SECTION
           ========================================================================= */}
        <section id="quick-actions" className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#171717]">
                Quick Actions
              </h2>
              <p className="text-xs sm:text-sm text-[#666666]">
                Jump straight into creating a post or finding help.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {quickActions.map((action) => (
              <QuickActionCard key={action.title} {...action} />
            ))}
          </div>
        </section>

        {/* =========================================================================
            4. MAIN SERVICES SECTION
           ========================================================================= */}
        <section id="explore-services" className="space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
              Explore CampusConnect
            </h2>
            <p className="mt-1 text-sm sm:text-base text-[#555555]">
              Everything you need to make your student life easier, all in one place.
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {services.map((service) => (
              <DashboardServiceCard key={service.title} {...service} />
            ))}
          </div>
        </section>

        {/* =========================================================================
            5. RECENT ACTIVITY SECTION (Sample / Demo Feed)
           ========================================================================= */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#171717]">
                Recent Activity
              </h2>
              <p className="text-xs sm:text-sm text-[#666666]">
                Recent companion posts, errand requests, and marketplace items.
              </p>
            </div>

            {/* Clear Demo Marker */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#D5D1C9] text-[11px] font-medium text-[#555555]">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              Demo activity feed (Sample data)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sampleActivities.map((activity, index) => (
              <ActivityCard key={index} {...activity} />
            ))}
          </div>
        </section>

      </main>

      {/* Dashboard Footer */}
      <footer className="border-t border-[#D5D1C9] bg-[#EDEBE6] py-8 text-center text-xs text-[#777777]">
        © 2026 CampusConnect. Connected student community.
      </footer>

    </div>
  );
}