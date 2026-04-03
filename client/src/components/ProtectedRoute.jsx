import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const ProtectedRoute = ({ requiredRole }) => {
  const token = localStorage.getItem('studyhub_token');
  const { currentUser, isVerifying } = useApp();

  if (isVerifying) {
    return <div className="flex h-screen w-full items-center justify-center"><div className="loader"></div></div>;
  }

  if (!token || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin' && currentUser?.role !== 'admin') {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
};

export const GuestRoute = () => {
  const token = localStorage.getItem('studyhub_token');
  const { currentUser, isVerifying } = useApp();
  
  if (isVerifying) {
    return <div className="flex h-screen w-full items-center justify-center"><div className="loader"></div></div>;
  }

  // Only redirect if BOTH token AND currentUser are valid (prevents stale token auto-login)
  if (token && currentUser) {
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
};
