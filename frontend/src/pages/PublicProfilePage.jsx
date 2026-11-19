// src/pages/PublicProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  AlertCircle,
  Loader2,
  Calendar,
  MapPin,
  Tag,
  Star
} from 'lucide-react';
import { getPublicProfile } from '../api/profileApi';
import ProfileHeader from '../components/ProfileHeader';

export default function PublicProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [activities, setActivities] = useState([]);
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'listings' | 'reviews'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicStudent = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getPublicProfile(userId);
        setStudent(response.profile);
        setActivities(response.activities || response.profile?.activities || []);
        setListings(response.listings || response.profile?.listings || []);
        setReviews(response.reviews || response.profile?.reviews || []);
      } catch (err) {
        console.error('Error fetching public student profile:', err);
        setError(
          err.response?.data?.message || 'Student profile could not be found or has been removed.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPublicStudent();
    } else {
      setError('Invalid student profile ID.');
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EDEBE6] flex flex-col items-center justify-center p-6 text-stone-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#171717]" />
        <p className="text-sm font-medium">Loading student profile...</p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-[#EDEBE6] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 max-w-md w-full text-center shadow-sm space-y-4">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-stone-900">Student Not Found</h2>
          <p className="text-xs sm:text-sm text-stone-600">
            {error || 'The requested student profile does not exist.'}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-[#171717] hover:bg-[#333333] text-white text-xs sm:text-sm font-bold rounded-xl transition inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDEBE6] py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Public Header (isOwner={false} displays public action buttons like message/report) */}
        <ProfileHeader user={student} isOwner={false} />

        {/* Public Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-300 pb-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Public Overview' },
            { id: 'listings', label: `Active Public Listings (${listings.length})` },
            { id: 'reviews', label: `Student Reviews (${reviews.length})` },
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

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Interests */}
            <div className="bg-white border border-[#D5D1C9] rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Student Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {student.interests && student.interests.length > 0 ? (
                  student.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-stone-100 border border-stone-200 text-stone-800 text-xs font-semibold rounded-xl"
                    >
                      #{interest}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-stone-400 italic">No interests listed.</p>
                )}
              </div>
            </div>

            {/* Public Activities Highlight */}
            <div className="bg-white border border-[#D5D1C9] rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-base text-[#171717] mb-3">
                Recent Public Activities
              </h3>
              {activities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activities.map((act) => (
                    <div key={act.id} className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[10px] font-bold text-stone-500 uppercase">{act.category}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {act.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-stone-900">{act.title}</h4>
                      <p className="text-[11px] text-stone-500 flex items-center gap-2">
                        <span>{act.location}</span> • <span>{act.date}</span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-400 italic">No public activities posted yet.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="space-y-3">
            {listings.length > 0 ? (
              listings.filter((l) => l.status === 'Active').map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#D5D1C9] rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                      {item.service}
                    </span>
                    <h4 className="font-bold text-sm text-stone-900 truncate mt-0.5">{item.title}</h4>
                    <p className="text-xs font-bold text-emerald-700 mt-1">{item.price}</p>
                  </div>
                  <button
                    onClick={() => alert(`Enquiring about "${item.title}" from ${student.fullName || student.name}...`)}
                    className="px-4 py-2 bg-[#171717] hover:bg-[#333333] text-white text-xs font-bold rounded-xl transition whitespace-nowrap"
                  >
                    I'm Interested
                  </button>
                </div>
              ))
            ) : (
              <div className="bg-white border border-[#D5D1C9] rounded-2xl p-8 text-center text-xs text-stone-400">
                No active public listings at this time.
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-3">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev.id} className="bg-white border border-[#D5D1C9] rounded-2xl p-4 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-900">{rev.reviewerName}</span>
                    <span className="text-amber-500">{'★'.repeat(rev.rating || 5)}</span>
                  </div>
                  <p className="text-xs text-stone-700">"{rev.comment}"</p>
                  <span className="text-[10px] text-stone-400 block pt-1">{rev.date}</span>
                </div>
              ))
            ) : (
              <div className="bg-white border border-[#D5D1C9] rounded-2xl p-8 text-center text-xs text-stone-400">
                No reviews received yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
