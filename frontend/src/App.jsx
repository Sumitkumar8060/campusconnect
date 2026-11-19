import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';

import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import CompanionsPage from './pages/CompanionsPage';
import ErrandsPage from './pages/ErrandsPage';
import StoragePage from './pages/StoragePage';
import RoomsPage from './pages/RoomsPage';

import MarketplacePage from './pages/MarketplacePage';
import PostItemPage from './pages/PostItemPage';
import MyMarketplaceListingsPage from './pages/MyMarketplaceListingsPage';
import MarketplaceEnquiriesPage from './pages/MarketplaceEnquiriesPage';

import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import PublicProfilePage from './pages/PublicProfilePage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Landing Page - Accessible to Everyone */}
          <Route
            path="/"
            element={
              <div className="min-h-screen bg-[#EDEBE6] text-[#171717] font-sans antialiased">
                <Navbar />
                <main>
                  <LandingPage />
                </main>
              </div>
            }
          />

          {/* Public-Only Authentication Routes (Logged-in students redirected to /dashboard) */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnlyRoute>
                <SignUpPage />
              </PublicOnlyRoute>
            }
          />

          {/* Protected Routes (Unauthenticated students redirected to /login with history replacement) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Find Companions */}
          <Route
            path="/services/companions"
            element={
              <ProtectedRoute>
                <CompanionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/companions"
            element={
              <ProtectedRoute>
                <CompanionsPage />
              </ProtectedRoute>
            }
          />

          {/* Errands Service */}
          <Route
            path="/services/errands"
            element={
              <ProtectedRoute>
                <ErrandsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/errands"
            element={
              <ProtectedRoute>
                <ErrandsPage />
              </ProtectedRoute>
            }
          />

          {/* Storage Service */}
          <Route
            path="/services/storage"
            element={
              <ProtectedRoute>
                <StoragePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/storage"
            element={
              <ProtectedRoute>
                <StoragePage />
              </ProtectedRoute>
            }
          />

          {/* Rooms Service */}
          <Route
            path="/services/rooms"
            element={
              <ProtectedRoute>
                <RoomsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms"
            element={
              <ProtectedRoute>
                <RoomsPage />
              </ProtectedRoute>
            }
          />

          {/* Marketplace Routes */}
          <Route
            path="/services/marketplace"
            element={
              <ProtectedRoute>
                <MarketplacePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services/marketplace/create"
            element={
              <ProtectedRoute>
                <PostItemPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services/marketplace/my-listings"
            element={
              <ProtectedRoute>
                <MyMarketplaceListingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services/marketplace/enquiries"
            element={
              <ProtectedRoute>
                <MarketplaceEnquiriesPage />
              </ProtectedRoute>
            }
          />

          {/* Profile Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <EditProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/settings"
            element={
              <ProtectedRoute>
                <ProfileSettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Public Profile - Viewable by anyone with valid student ID */}
          <Route path="/profile/:userId" element={<PublicProfilePage />} />

          {/* Messages Route */}
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-[#EDEBE6] flex flex-col items-center justify-center p-6 text-center">
                  <h1 className="text-2xl font-bold text-[#171717]">Messages &amp; Inbox</h1>
                  <p className="mt-2 text-sm text-[#555555]">Direct peer communication channels coming soon.</p>
                  <a href="/dashboard" className="mt-4 px-4 py-2 bg-[#171717] text-white rounded-xl text-xs font-semibold">
                    Back to Dashboard
                  </a>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
