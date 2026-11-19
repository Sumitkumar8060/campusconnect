// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { getMyProfile } from '../api/profileApi';
import ProfileHeader from '../components/ProfileHeader';
import ProfileOverviewTab from '../components/ProfileOverviewTab';
import ProfileActivitiesTab from '../components/ProfileActivitiesTab';
import ProfileListingsTab from '../components/ProfileListingsTab';
import ProfileReviewsTab from '../components/ProfileReviewsTab';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'activities' | 'listings' | 'reviews'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getMyProfile();
      setUser(response.profile);
      setActivities(response.activities || response.profile?.activities || []);
      setListings(response.listings || response.profile?.listings || []);
      setReviews(response.reviews || response.profile?.reviews || []);
    } catch (err) {
      console.error('Profile fetch error:', err);
      if (err.response?.status === 401) {
        navigate('/login');
        return;
      }
      setError(
        err.response?.data?.message || 'Unable to load profile. Please verify your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EDEBE6] flex flex-col items-center justify-center p-6 text-stone-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#171717]" />
        <p className="text-sm font-medium">Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#EDEBE6] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-rose-200 p-8 max-w-md w-full text-center shadow-sm space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-stone-900">Failed to Load Profile</h2>
          <p className="text-xs sm:text-sm text-stone-600">{error}</p>
          <button
            onClick={fetchProfile}
            className="px-5 py-2.5 bg-[#171717] hover:bg-[#333333] text-white text-xs sm:text-sm font-bold rounded-xl transition inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#EDEBE6] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 max-w-md w-full text-center shadow-sm space-y-4">
          <p className="text-sm text-stone-600">No profile found for this account.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 bg-[#171717] text-white text-xs sm:text-sm font-bold rounded-xl"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDEBE6] py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Profile Header Card */}
        <ProfileHeader user={user} isOwner={true} />

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-stone-300 pb-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'activities', label: `My Activities (${activities.length})` },
            { id: 'listings', label: `My Listings (${listings.length})` },
            { id: 'reviews', label: `Reviews (${reviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-[#171717] text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 bg-white/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div>
          {activeTab === 'overview' && (
            <ProfileOverviewTab
              user={user}
              activities={activities}
              listings={listings}
              reviews={reviews}
            />
          )}

          {activeTab === 'activities' && (
            <ProfileActivitiesTab activities={activities} />
          )}

          {activeTab === 'listings' && (
            <ProfileListingsTab listings={listings} />
          )}

          {activeTab === 'reviews' && (
            <ProfileReviewsTab reviews={reviews} />
          )}
        </div>
      </div>
    </div>
  );
}
