// src/pages/EditProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  ShieldCheck,
  Lock,
  Loader2
} from 'lucide-react';
import {
  getMyProfile,
  updateMyProfile,
  uploadProfilePicture
} from '../api/profileApi';
import { useAuth } from '../context/AuthContext';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [current, setCurrent] = useState(null);
  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState('');
  const [course, setCourse] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('1st Year (Semester 1/2)');
  const [generalLocation, setGeneralLocation] = useState('');
  const [bio, setBio] = useState('');
  const [interestsInput, setInterestsInput] = useState('');
  const [avatar, setAvatar] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setErrorMsg('');
        const response = await getMyProfile();
        const profile = response.profile;

        setCurrent(profile);
        setFullName(profile.name || profile.fullName || '');
        setUniversity(profile.university || '');
        setCourse(profile.course || '');
        setYearOfStudy(profile.year_of_study || profile.yearOfStudy || '1st Year (Semester 1/2)');
        setGeneralLocation(profile.location || profile.generalLocation || '');
        setBio(profile.bio || '');
        setInterestsInput(
          Array.isArray(profile.interests) ? profile.interests.join(', ') : ''
        );
        setAvatar(profile.profile_picture || profile.avatar || '');
      } catch (error) {
        console.error('Profile loading error:', error);
        if (error.response?.status === 401) {
          navigate('/login');
          return;
        }
        setErrorMsg(
          error.response?.data?.message || 'Unable to load profile data.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/i)) {
      setErrorMsg('Only JPG, PNG, and WebP images are supported.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image file is too large (maximum allowed size is 5 MB).');
      return;
    }

    setErrorMsg('');
    setSelectedPhoto(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg(false);

    if (!fullName.trim()) {
      setErrorMsg('Full name cannot be blank.');
      return;
    }

    if (!course.trim()) {
      setErrorMsg('Please specify your current course or degree.');
      return;
    }

    if (!bio.trim()) {
      setErrorMsg('Please write a short bio so classmates can know you.');
      return;
    }

    const interestsArray = interestsInput
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    try {
      setSaving(true);

      // Step 1: Upload photo if a new file was chosen
      if (selectedPhoto) {
        await uploadProfilePicture(selectedPhoto);
      }

      // Step 2: Update student details in MySQL (both users and user_profiles)
      await updateMyProfile({
        name: fullName.trim(),
        fullName: fullName.trim(),
        university: university.trim(),
        course: course.trim(),
        year_of_study: yearOfStudy,
        location: generalLocation.trim(),
        bio: bio.trim(),
        interests: interestsArray,
      });

      await refreshUser();

      setSuccessMsg(true);
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (error) {
      console.error('Profile update error:', error);
      setErrorMsg(
        error.response?.data?.message || 'Failed to update profile. Please check your inputs.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EDEBE6] flex flex-col items-center justify-center p-6 text-stone-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#171717]" />
        <p className="text-sm font-medium">Loading profile for editing...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDEBE6] py-10 px-4 md:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/profile')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel &amp; Back to Profile
        </button>

        {/* Card Form */}
        <div className="bg-white rounded-3xl border border-[#D5D1C9] p-6 sm:p-10 shadow-sm">
          
          <div className="border-b border-stone-200 pb-5 mb-6">
            <h1 className="text-2xl font-extrabold text-[#171717] tracking-tight">
              Edit Student Profile
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Keep your campus details current so classmates and companions can connect with you.
            </p>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Profile updated successfully! Redirecting back to your profile...</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Avatar Preview with Camera Overlay */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Profile Photo
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-stone-200 bg-stone-100 flex-shrink-0">
                  <img
                    src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition text-white">
                    <Camera className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="text-xs text-stone-500">
                  <p className="font-semibold text-stone-800">Upload a clear photo</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">JPEG, PNG, or WebP up to 5MB.</p>
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]"
                placeholder="Your full name"
                required
              />
            </div>

            {/* Read-Only University Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Registered Email
                </label>
                <input
                  type="email"
                  value={current?.email ?? ''}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Student ID / Account ID
                </label>
                <input
                  type="text"
                  value={current?.id ? `#${current.id}` : ''}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* University & Degree */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                University
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="e.g. Apex Institute of Technology & Sciences"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Course / Major *
                </label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Year of Study
                </label>
                <select
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]"
                >
                  <option value="1st Year (Semester 1/2)">1st Year (Semester 1/2)</option>
                  <option value="2nd Year (Semester 3/4)">2nd Year (Semester 3/4)</option>
                  <option value="3rd Year (Semester 5/6)">3rd Year (Semester 5/6)</option>
                  <option value="4th Year (Semester 7/8)">4th Year (Semester 7/8)</option>
                  <option value="Postgraduate / Master's">Postgraduate / Master's</option>
                  <option value="PhD Scholar">PhD Scholar</option>
                </select>
              </div>
            </div>

            {/* General Campus Location */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                General Campus Location
              </label>
              <input
                type="text"
                value={generalLocation}
                onChange={(e) => setGeneralLocation(e.target.value)}
                placeholder="e.g. Hostel Block B / North Campus / PG Residency"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]"
              />
              <p className="mt-1 text-[11px] text-stone-400">
                To protect student privacy, never put your exact room number.
              </p>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Interests &amp; Hobbies (Comma separated)
              </label>
              <input
                type="text"
                value={interestsInput}
                onChange={(e) => setInterestsInput(e.target.value)}
                placeholder="Web Dev, Badminton, Gaming, Sci-Fi Novels, Photography"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Short Bio *
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share a few words about what you study, your hobbies, or what services you offer..."
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]"
                required
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[#171717] hover:bg-[#333333] disabled:bg-stone-400 text-white text-xs sm:text-sm font-bold rounded-xl shadow transition active:scale-[0.98] inline-flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
