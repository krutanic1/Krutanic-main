import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, ShieldCheck, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';
import DikshanntLoader from '../components/DikshanntLoader';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState<'student' | 'college'>('student');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError('');
    
    try {
      if (loginType === 'student') {
        const res = await axios.post('/microcourses/login', { email, password });
        localStorage.setItem('studentToken', res.data.token);
        localStorage.setItem('studentEmail', res.data.user.email);
        localStorage.setItem('studentName', res.data.user.fullName);
        navigate('/dashboard');
      } else {
        const res = await axios.post('/college/login', { email, password });
        localStorage.setItem('collegeId', res.data.college._id);
        localStorage.setItem('collegeName', res.data.college.collegeName);
        navigate('/college/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 w-full h-1 bg-primary"></div>
      
      <div className="w-full max-w-[420px] relative z-10">
        {/* Branding */}
        <div className="flex flex-col items-center justify-center mb-8">
          <Link to="/" className="mb-6 hover:scale-105 transition-transform">
             <Logo height={64} />
          </Link>
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-outline">
            <ShieldCheck className="text-primary" size={14} /> Secure Access
          </div>
        </div>

        {/* Login Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-white p-10 editorial-shadow rounded-none border border-outline-variant/10 relative"
        >
          {/* Top subtle accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

          <div className="mb-8 text-center">
            <h3 className="text-2xl text-primary font-serif mb-1">Welcome Back</h3>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Please enter your details to sign in</p>
          </div>

          <div className="flex gap-2 mb-8 p-1 bg-surface-container-low rounded-sm">
            <button 
              onClick={() => setLoginType('student')}
              className={`flex-1 py-2 text-[10px] font-bold tracking-widest uppercase rounded-sm transition-all ${loginType === 'student' ? 'bg-white text-primary shadow-sm border border-outline-variant/5' : 'text-outline hover:text-primary'}`}
            >
              Student
            </button>
            <button 
              onClick={() => setLoginType('college')}
              className={`flex-1 py-2 text-[10px] font-bold tracking-widest uppercase rounded-sm transition-all ${loginType === 'college' ? 'bg-white text-primary shadow-sm border border-outline-variant/5' : 'text-outline hover:text-primary'}`}
            >
              Institution
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest uppercase text-outline">{loginType === 'student' ? 'Student' : 'Admin'} Email</label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-outline" size={16} />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-outline-variant focus:border-primary pl-8 py-2 outline-none text-base transition-all bg-transparent"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Password</label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-outline" size={16} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b border-outline-variant focus:border-primary pl-8 py-2 outline-none text-base transition-all bg-transparent"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
               <div className="flex mt-2 p-3 bg-red-50/50 border-l-2 border-red-500 text-red-600 text-[10px] font-bold uppercase tracking-widest leading-tight">
                 {error}
               </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-primary text-white py-4 rounded-sm text-[10px] font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-3 hover:bg-primary-container transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : 'Sign In'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        </motion.div>

        <p className="mt-8 text-center text-[10px] text-outline uppercase tracking-widest leading-relaxed">
          Need help? Contact <a href="#" className="underline text-primary hover:text-primary-container transition-colors">Support</a>
        </p>
      </div>
    </div>
  );
}
