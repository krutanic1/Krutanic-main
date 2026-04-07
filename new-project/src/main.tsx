import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App.tsx';
import './index.css';

// Ensure VITE_API_URL includes /api if it doesn't already, or fallback to /api for local dev proxy
const apiBase = import.meta.env.VITE_API_URL || '';
axios.defaults.baseURL = apiBase ? (apiBase.endsWith('/api') ? apiBase : `${apiBase.replace(/\/$/, '')}/api`) : '/api';
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
