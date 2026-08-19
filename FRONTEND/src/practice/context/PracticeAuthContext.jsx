import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PracticeAuthContext = createContext(null);

export const usePracticeAuth = () => {
  const context = useContext(PracticeAuthContext);
  if (!context) {
    throw new Error('usePracticeAuth must be used within PracticeAuthProvider');
  }
  return context;
};

const PRACTICE_TOKEN_KEY = 'practiceToken';
const PRACTICE_USER_KEY = 'practiceUser';
const RAW_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE = RAW_URL.endsWith('/api') ? RAW_URL : `${RAW_URL}/api`;

export const PracticeAuthProvider = ({ children }) => {
  const [practiceUser, setPracticeUser] = useState(() => {
    try {
      const saved = localStorage.getItem(PRACTICE_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [practiceToken, setPracticeToken] = useState(() => {
    return localStorage.getItem(PRACTICE_TOKEN_KEY) || null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (practiceToken) {
      localStorage.setItem(PRACTICE_TOKEN_KEY, practiceToken);
    } else {
      localStorage.removeItem(PRACTICE_TOKEN_KEY);
    }
  }, [practiceToken]);

  useEffect(() => {
    if (practiceUser) {
      localStorage.setItem(PRACTICE_USER_KEY, JSON.stringify(practiceUser));
    } else {
      localStorage.removeItem(PRACTICE_USER_KEY);
    }
  }, [practiceUser]);

  const loginWithEmail = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/practice-auth/login`, { email, password });
      const { token, user } = response.data;

      setPracticeToken(token);
      setPracticeUser(user);

      toast.success(`Welcome back, ${user.name}! 🎉`);
      return { success: true, user };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to login.';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const registerWithEmail = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/practice-auth/register`, { name, email, password });
      const { token, user } = response.data;

      setPracticeToken(token);
      setPracticeUser(user);

      toast.success(`Welcome to Practice, ${user.name}! 🎉`);
      return { success: true, user };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to register.';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setPracticeToken(null);
    setPracticeUser(null);
    localStorage.removeItem(PRACTICE_TOKEN_KEY);
    localStorage.removeItem(PRACTICE_USER_KEY);
    toast.success('Logged out from Practice Module');
  }, []);

  const checkAuthStatus = useCallback(async () => {
    if (!practiceToken) return;
    try {
      const res = await axios.get(`${API_BASE}/practice-auth/me`, {
        headers: { Authorization: `Bearer ${practiceToken}` }
      });
      setPracticeUser(res.data.user);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      }
    }
  }, [practiceToken, logout]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const practiceApi = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
  });

  practiceApi.interceptors.request.use((config) => {
    if (practiceToken) {
      config.headers.Authorization = `Bearer ${practiceToken}`;
    }
    return config;
  });

  practiceApi.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );

  // Check for LMS admin token
  const hasLmsAdminToken = !!localStorage.getItem('adminToken');

  const value = {
    practiceUser: practiceUser,
    practiceToken,
    isAuthenticated: !!practiceToken,
    isAdmin: hasLmsAdminToken || practiceUser?.practiceRole === 'admin',
    loading,
    loginWithEmail,
    registerWithEmail,
    logout,
    practiceApi,
  };

  return (
    <PracticeAuthContext.Provider value={value}>
      {children}
    </PracticeAuthContext.Provider>
  );
};
