import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  PlusCircle,
  MessageSquare,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardNavbar() {
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setProfileDropdownOpen(false);
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/login', { replace: true });
    }
  };

  const navLinks = [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Explore', href: '/services/companions', icon: Compass },
    { label: 'Create', href: '/services/marketplace/create', icon: PlusCircle },
    { label: 'Messages', href: '/messages', icon: MessageSquare },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  const displayName = user?.name || user?.fullName || 'Student';
  const displayEmail = user?.email || 'student@campus.edu';
  const displayAvatar = user?.avatar || user?.profile_picture;
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'ST';

  return (
    <header className="sticky top-0 z-50 w-full bg-[#EDEBE6] border-b border-[#D5D1C9]/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2.5 text-[#171717] hover:opacity-85 transition-opacity duration-200 cursor-pointer"
            >
              <GraduationCap className="w-7 h-7 text-[#171717]" strokeWidth={2.2} />
              <span className="text-xl font-bold tracking-tight text-[#171717]">
                CampusConnect
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-[#D5D1C9]">
              {navLinks.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#171717] text-white shadow-xs'
                        : 'text-[#292929] hover:text-[#171717] hover:bg-black/5'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Notification & User Profile Avatar Dropdown */}
          <div className="flex items-center gap-3">
            
            {/* Notification Bell Button */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen((prev) => !prev)}
                aria-label="Campus alerts"
                className="relative p-2.5 rounded-xl border border-[#D5D1C9] bg-white hover:border-[#171717]/40 text-[#292929] hover:text-[#171717] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              </button>

              {/* Notification Popover Menu */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-[#D5D1C9] shadow-xl py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 pb-2 border-b border-[#D5D1C9]/60 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                      Notifications
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                      Live
                    </span>
                  </div>
                  <div className="divide-y divide-[#D5D1C9]/40 max-h-64 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-[#F9F8F6] transition-colors cursor-pointer">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-[#171717]">
                            Session Verified
                          </p>
                          <p className="text-[11px] text-[#555555] mt-0.5">
                            You are connected to your campus network.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                aria-label="User profile options"
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-white border border-[#D5D1C9] hover:border-[#171717]/40 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]"
              >
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-lg bg-[#171717] text-white flex items-center justify-center font-bold text-xs">
                    {initials}
                  </div>
                )}
                <span className="hidden sm:inline-block text-xs font-semibold text-[#171717]">
                  {displayName.split(' ')[0]}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-[#D5D1C9] shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-[#D5D1C9]/60">
                    <p className="text-xs font-bold text-[#171717] truncate">{displayName}</p>
                    <p className="text-[11px] text-[#666666] truncate">{displayEmail}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#292929] hover:text-[#171717] hover:bg-[#EDEBE6] transition-colors duration-150 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#555555]" />
                    Profile &amp; Settings
                  </Link>

                  <Link
                    to="/messages"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#292929] hover:text-[#171717] hover:bg-[#EDEBE6] transition-colors duration-150 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-[#555555]" />
                    Inbox Messages
                  </Link>

                  <div className="my-1 border-t border-[#D5D1C9]/60" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors duration-150 cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Log out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation"
                className="p-2 rounded-xl text-[#292929] hover:bg-black/5 transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#D5D1C9]/60 animate-in slide-in-from-top-2 duration-150">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#171717] text-white'
                        : 'text-[#292929] hover:text-[#171717] hover:bg-black/5'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
