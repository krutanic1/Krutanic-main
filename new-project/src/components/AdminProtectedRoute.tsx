import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import DikshanntLoader from './DikshanntLoader';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/microadmin/is-authenticated');
        if (res.data.isAuthenticated) {
          setStatus('authenticated');
        } else {
          setStatus('unauthenticated');
        }
      } catch (err) {
        setStatus('unauthenticated');
      }
    };
    checkAuth();
  }, [location.pathname]);

  if (status === 'loading') {
    return <DikshanntLoader />;
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/adminlogin" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
