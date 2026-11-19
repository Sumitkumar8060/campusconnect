// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EDEBE6] flex flex-col items-center justify-center p-6 text-stone-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#171717]" />
        <p className="text-sm font-medium">Verifying campus session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated user to /login with replace so Back button works correctly
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
