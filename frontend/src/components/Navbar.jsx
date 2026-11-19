import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Menu, X, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Modern, premium, fully responsive Navbar component for CampusConnect.
 * Exclusively renders the sticky top navbar.
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Close mobile menu when user presses Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Automatically close mobile menu if resized to desktop breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const navLinks = [
    { label: 'Explore', href: '#explore' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'About', href: '#about' },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#EDEBE6] border-b border-[#D5D1C9]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* ================= Left: Logo & Brand ================= */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              aria-label="CampusConnect Home"
              className="group inline-flex items-center gap-2.5 py-1 px-1.5 -ml-1.5 rounded-lg text-[#171717] cursor-pointer transition-all duration-200 hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EDEBE6]"
            >
              <span className="flex items-center justify-center text-[#171717] transition-transform duration-200 group-hover:scale-105">
                <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.2} />
              </span>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#171717]">
                CampusConnect
              </span>
            </Link>
          </div>

          {/* ================= Center: Navigation Links (Desktop) ================= */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center justify-center space-x-1 lg:space-x-2"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative px-3.5 py-2 text-sm lg:text-base font-medium text-[#292929] rounded-lg transition-colors duration-200 hover:text-[#171717] hover:bg-[#171717]/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EDEBE6] cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* ================= Right: Auth Buttons (Desktop) ================= */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 h-10 px-4.5 rounded-lg text-sm font-semibold text-white bg-[#171717] cursor-pointer transition-all duration-200 hover:bg-[#333333] hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center h-10 px-4.5 rounded-lg text-sm font-medium text-white bg-[#171717] cursor-pointer transition-all duration-200 hover:bg-[#333333] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EDEBE6] shadow-sm"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center h-10 px-4.5 rounded-lg text-sm font-medium text-[#171717] bg-white border border-[#D5D1C9] cursor-pointer transition-all duration-200 hover:bg-[#DCD9D2] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EDEBE6] shadow-sm"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* ================= Mobile: Hamburger Menu Button ================= */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={isOpen ? "Close main menu" : "Open main menu"}
              className="p-2 -mr-2 text-[#292929] hover:text-[#171717] hover:bg-[#171717]/[0.05] rounded-lg transition-colors duration-200 cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ================= Mobile Navigation Drawer ================= */}
      {isOpen && (
        <div className="md:hidden border-t border-[#D5D1C9]/60 bg-[#EDEBE6] px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="px-3 py-2 text-base font-medium text-[#292929] hover:text-[#171717] hover:bg-[#171717]/[0.05] rounded-lg transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-[#D5D1C9]/60 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={handleLinkClick}
                className="w-full inline-flex items-center justify-center h-11 rounded-lg text-sm font-semibold text-white bg-[#171717] cursor-pointer"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={handleLinkClick}
                  className="w-full inline-flex items-center justify-center h-10 rounded-lg text-sm font-medium text-white bg-[#171717] cursor-pointer"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={handleLinkClick}
                  className="w-full inline-flex items-center justify-center h-10 rounded-lg text-sm font-medium text-[#171717] bg-white border border-[#D5D1C9] cursor-pointer"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
