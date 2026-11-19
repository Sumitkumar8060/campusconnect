// src/components/ProfileHeader.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  BookOpen, 
  Calendar, 
  Edit3, 
  Share2, 
  MessageSquare, 
  Flag, 
  Check, 
  Sparkles,
  Settings
} from 'lucide-react';
import ReportUserModal from './ReportUserModal';

export default function ProfileHeader({ user = {}, isOwner = true }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayName = user.fullName || user.name || 'Campus Student';
  const displayAvatar = user.avatar || user.profile_picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
  const displayCourse = user.course || 'Student';
  const displayYear = user.yearOfStudy || user.year_of_study || '';
  const displayUniversity = user.university || 'CampusConnect Member';
  const displayLocation = user.generalLocation || user.location || 'Campus';
  const displayJoined = user.joinedDate || (user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently');
  const displayBio = user.bio || 'No bio added yet. Tell fellow students a little about yourself!';

  return (
    <div className="bg-white border border-[#D5D1C9] rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-stone-200">
        
        {/* Left: Avatar & Primary Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative">
            <img
              src={displayAvatar}
              alt={displayName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-stone-200 shadow-sm"
            />
            {user.isVerified !== false && (
              <span 
                className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full shadow-md flex items-center gap-1 border-2 border-white"
                title="Verified Student Account (Demo)"
              >
                <ShieldCheck className="w-3 h-3" /> (Demo Verified)
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
                {displayName}
              </h1>
            </div>

            <div className="text-xs sm:text-sm text-stone-600 font-medium flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
              <span>{displayCourse}{displayYear ? ` • ${displayYear}` : ''}</span>
            </div>

            <p className="text-xs text-stone-500 font-medium">
              {displayUniversity}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                {displayLocation}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                Joined {displayJoined}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {isOwner ? (
            <>
              <button
                onClick={() => navigate('/profile/edit')}
                className="flex-1 md:flex-none px-4 py-2.5 bg-[#171717] hover:bg-[#333333] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Edit3 className="w-4 h-4" /> Edit Profile
              </button>
              <button
                onClick={() => navigate('/profile/settings')}
                className="p-2.5 border border-stone-200 text-stone-700 hover:bg-stone-100 rounded-xl transition"
                title="Profile Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={handleShare}
                className="p-2.5 border border-stone-200 text-stone-700 hover:bg-stone-100 rounded-xl transition flex items-center gap-1 text-xs"
                title="Share profile link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                {copied && <span className="text-[10px] text-emerald-600 font-bold">Copied</span>}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => alert(`Opening secure campus message thread with ${displayName}...`)}
                className="flex-1 md:flex-none px-5 py-2.5 bg-[#171717] hover:bg-[#333333] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <MessageSquare className="w-4 h-4" /> Send Message
              </button>
              <button
                onClick={handleShare}
                className="p-2.5 border border-stone-200 text-stone-700 hover:bg-stone-100 rounded-xl transition flex items-center gap-1 text-xs"
                title="Share profile link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setShowReportModal(true)}
                className="p-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                title="Report user"
              >
                <Flag className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bio section */}
      <div className="mt-5">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
          About
        </h4>
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed max-w-3xl">
          {displayBio}
        </p>
      </div>

      {/* Profile Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-stone-200">
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-center">
          <span className="text-[10px] sm:text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Total Posts
          </span>
          <div className="text-xl sm:text-2xl font-black text-[#171717] mt-0.5">
            {user.stats?.totalPosts ?? 0}
          </div>
        </div>

        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-center">
          <span className="text-[10px] sm:text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Active Listings
          </span>
          <div className="text-xl sm:text-2xl font-black text-amber-700 mt-0.5">
            {user.stats?.activeListings ?? 0}
          </div>
        </div>

        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-center">
          <span className="text-[10px] sm:text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Completed Activities
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-0.5">
            {user.stats?.completedActivities ?? 0}
          </div>
        </div>

        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-center">
          <span className="text-[10px] sm:text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Avg Rating
          </span>
          <div className="text-xl sm:text-2xl font-black text-blue-700 mt-0.5 flex items-center justify-center gap-1">
            <span>{user.stats?.averageRating ?? 5.0}</span>
            <span className="text-amber-500 text-lg">★</span>
          </div>
        </div>
      </div>

      {showReportModal && (
        <ReportUserModal
          userName={displayName}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}
