// src/pages/ProfileSettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  Bell, 
  KeyRound, 
  LogOut, 
  CheckCircle2, 
  AlertCircle,
  Eye, 
  EyeOff, 
  User,
  Loader2,
  Trash2
} from 'lucide-react';
import {
  getMyProfile,
  changePassword,
  updateSettings,
  deleteMyAccount,
  logoutUser
} from '../api/profileApi';
import { useAuth } from '../context/AuthContext';

const formatDate = (dateString) => {
  if (!dateString) return 'Member';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return 'Member';
  return d.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
};

export default function ProfileSettingsPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Profile State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState('');

  // Privacy & Notification State
  const [profileVisibleToCampus, setProfileVisibleToCampus] = useState(true);
  const [showActivityStatus, setShowActivityStatus] = useState(true);
  const [notifyOnMessages, setNotifyOnMessages] = useState(true);
  const [notifyOnErrands, setNotifyOnErrands] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Logout State
  const [loggingOut, setLoggingOut] = useState(false);

  // Delete Account State
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Fetch Profile & Preferences on Mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getMyProfile();
        const profile = response.profile;
        setUser(profile);

        setProfileVisibleToCampus(
          profile.campus_visibility !== undefined ? Boolean(profile.campus_visibility) : true
        );
        setShowActivityStatus(
          profile.show_online_status !== undefined ? Boolean(profile.show_online_status) : true
        );
        setNotifyOnMessages(
          profile.notify_messages !== undefined ? Boolean(profile.notify_messages) : true
        );
        setNotifyOnErrands(
          profile.notify_errands !== undefined ? Boolean(profile.notify_errands) : true
        );
      } catch (error) {
        console.error('Settings profile fetch error:', error);
        if (error.response?.status === 401) {
          navigate('/login');
          return;
        }
        setProfileError(
          error.response?.data?.message || 'Could not load account information.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Handle Setting Toggle and Persist to MySQL
  const handleSettingChange = async (key, val) => {
    let nextCampusVis = profileVisibleToCampus;
    let nextShowOnline = showActivityStatus;
    let nextNotifyMsg = notifyOnMessages;
    let nextNotifyErr = notifyOnErrands;

    if (key === 'campus_visibility') {
      setProfileVisibleToCampus(val);
      nextCampusVis = val;
    } else if (key === 'show_online_status') {
      setShowActivityStatus(val);
      nextShowOnline = val;
    } else if (key === 'notify_messages') {
      setNotifyOnMessages(val);
      nextNotifyMsg = val;
    } else if (key === 'notify_errands') {
      setNotifyOnErrands(val);
      nextNotifyErr = val;
    }

    try {
      setSettingsSaving(true);
      await updateSettings({
        campus_visibility: nextCampusVis,
        show_online_status: nextShowOnline,
        notify_messages: nextNotifyMsg,
        notify_errands: nextNotifyErr,
      });
      setSettingsSuccess('Preferences saved.');
      setTimeout(() => setSettingsSuccess(''), 2000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSettingsSaving(false);
    }
  };

  // Password Submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setPasswordError('');
    setPasswordSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all three password fields.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match. Please check and try again.');
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError('New password must be different from your current password.');
      return;
    }

    try {
      setPasswordSaving(true);
      await changePassword({ currentPassword, newPassword });

      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (error) {
      console.error('Password change error:', error);
      setPasswordError(
        error.response?.data?.message || 'Failed to update password. Please check your current password.'
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to log out of CampusConnect?')) return;

    try {
      setLoggingOut(true);
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login', { replace: true });
    }
  };

  // Delete Account Handler
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!window.confirm('This action cannot be undone. Are you sure you want to delete your CampusConnect account?')) {
      return;
    }

    try {
      setDeleting(true);
      setDeleteError('');
      await deleteMyAccount(deletePassword);
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Account deletion error:', err);
      setDeleteError(
        err.response?.data?.message || 'Failed to delete account. Please verify your password.'
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EDEBE6] flex flex-col items-center justify-center p-6 text-stone-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#171717]" />
        <p className="text-sm font-medium">Loading settings...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#EDEBE6] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-rose-200 p-8 text-center max-w-sm shadow-sm space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-stone-800">Could Not Load Settings</h2>
          <p className="text-xs sm:text-sm text-stone-500">
            {profileError || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="px-5 py-2.5 bg-[#171717] text-white text-xs sm:text-sm font-semibold rounded-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDEBE6] py-10 px-4 md:px-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Back Link */}
        <button
          onClick={() => navigate('/profile')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </button>

        <div className="border-b border-stone-300 pb-4">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#171717] tracking-tight">
            Profile &amp; Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Manage your account security, notification alerts, and privacy preferences.
          </p>
        </div>

        {/* ── 1. Account Information ─────────────────────────────────────── */}
        <div className="bg-white border border-[#D5D1C9] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <User className="w-4 h-4 text-stone-600" />
            <h3 className="font-bold text-sm text-[#171717]">Account Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-stone-400 font-semibold block">Full Name</span>
              <span className="font-bold text-stone-900 mt-0.5 block">
                {user.name || user.fullName || 'Not set'}
              </span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-stone-400 font-semibold block">Registered Email</span>
              <span className="font-bold text-stone-900 mt-0.5 block">
                {user.email}
              </span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-stone-400 font-semibold block">Student ID / Account ID</span>
              <span className="font-bold text-stone-900 mt-0.5 block">
                #{user.id}
              </span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-stone-400 font-semibold block">Member Since</span>
              <span className="font-bold text-stone-900 mt-0.5 block">
                {formatDate(user.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* ── 2. Privacy Settings ─────────────────────────────────────────── */}
        <div className="bg-white border border-[#D5D1C9] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-stone-600" />
              <h3 className="font-bold text-sm text-[#171717]">Privacy Settings</h3>
            </div>
            {settingsSuccess && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {settingsSuccess}
              </span>
            )}
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 bg-stone-50 rounded-xl cursor-pointer hover:bg-stone-100 transition">
              <div>
                <span className="font-bold text-stone-800 block">Campus-Only Visibility</span>
                <span className="text-stone-500 text-[11px]">
                  Only verified university accounts can see your profile.
                </span>
              </div>
              <input
                type="checkbox"
                checked={profileVisibleToCampus}
                onChange={(e) => handleSettingChange('campus_visibility', e.target.checked)}
                className="w-4 h-4 rounded accent-[#171717] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-stone-50 rounded-xl cursor-pointer hover:bg-stone-100 transition">
              <div>
                <span className="font-bold text-stone-800 block">Show Online Activity Status</span>
                <span className="text-stone-500 text-[11px]">
                  Displays your active status when browsing or coordinating.
                </span>
              </div>
              <input
                type="checkbox"
                checked={showActivityStatus}
                onChange={(e) => handleSettingChange('show_online_status', e.target.checked)}
                className="w-4 h-4 rounded accent-[#171717] cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* ── 3. Notification Preferences ─────────────────────────────────── */}
        <div className="bg-white border border-[#D5D1C9] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Bell className="w-4 h-4 text-stone-600" />
            <h3 className="font-bold text-sm text-[#171717]">Notification Preferences</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 bg-stone-50 rounded-xl cursor-pointer hover:bg-stone-100 transition">
              <div>
                <span className="font-bold text-stone-800 block">Message &amp; Enquiry Alerts</span>
                <span className="text-stone-500 text-[11px]">
                  Receive alerts when students enquire about your listings.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyOnMessages}
                onChange={(e) => handleSettingChange('notify_messages', e.target.checked)}
                className="w-4 h-4 rounded accent-[#171717] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-stone-50 rounded-xl cursor-pointer hover:bg-stone-100 transition">
              <div>
                <span className="font-bold text-stone-800 block">Companion &amp; Errand Reminders</span>
                <span className="text-stone-500 text-[11px]">
                  Notifications 1 hour before scheduled campus activities.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyOnErrands}
                onChange={(e) => handleSettingChange('notify_errands', e.target.checked)}
                className="w-4 h-4 rounded accent-[#171717] cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* ── 4. Change Password ─────────────────────────────────────────── */}
        <div className="bg-white border border-[#D5D1C9] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <KeyRound className="w-4 h-4 text-stone-600" />
            <h3 className="font-bold text-sm text-[#171717]">Change Password</h3>
          </div>

          {passwordSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Password updated successfully.</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl flex items-center gap-2 border border-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs max-w-md">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Current Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => { setCurrentPassword(e.target.value); setPasswordError(''); }}
                placeholder="••••••••"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#171717]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setPasswordError(''); }}
                placeholder="Min. 8 characters"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#171717]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Confirm New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(''); }}
                placeholder="••••••••"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#171717]"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="inline-flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-800 font-semibold"
              >
                {showPassword
                  ? <><EyeOff className="w-3.5 h-3.5" /> Hide</>
                  : <><Eye className="w-3.5 h-3.5" /> Show</>
                }
              </button>

              <button
                type="submit"
                disabled={passwordSaving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#171717] text-white text-xs font-bold rounded-xl hover:bg-[#333333] disabled:bg-stone-400 transition"
              >
                {passwordSaving ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating...</>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ── 5. Logout ──────────────────────────────────────────────────── */}
        <div className="bg-white border border-[#D5D1C9] rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-[#171717]">Sign Out</h4>
            <p className="text-xs text-stone-500 mt-0.5">
              End your current CampusConnect session on this device.
            </p>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="px-4 py-2 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 disabled:opacity-50 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            {loggingOut
              ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Signing out...</>
              : <><LogOut className="w-3.5 h-3.5" /> Log Out</>
            }
          </button>
        </div>

        {/* ── 6. Account Deletion (Danger Zone) ──────────────────────────── */}
        <div className="bg-white border border-rose-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-rose-700">Delete Account</h4>
            <p className="text-xs text-stone-500 mt-0.5">
              Permanently remove your student profile, listings, and activities.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-stone-900">Confirm Account Deletion</h3>
              <p className="text-xs text-stone-600">
                Are you sure you want to delete your account? This action is permanent and will remove all your data from CampusConnect.
              </p>
              {deleteError && (
                <p className="text-xs text-rose-600 font-semibold">{deleteError}</p>
              )}
              <form onSubmit={handleDeleteAccount} className="space-y-3">
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter current password to confirm"
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowDeleteModal(false); setDeleteError(''); }}
                    className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={deleting}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl disabled:bg-rose-400 flex items-center gap-1.5"
                  >
                    {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Confirm Delete
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
