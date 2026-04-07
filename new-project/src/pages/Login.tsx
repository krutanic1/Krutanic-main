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
    <div className="min-h-screen bg-surface flex items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
      
      <div className="container max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
        {/* Branding Info */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center gap-4">
            <Logo height={48} />
            <h1 className="text-5xl font-serif text-primary tracking-tighter italic">Dikshannt</h1>
          </div>
          <h2 className="text-4xl lg:text-6xl text-primary leading-tight mb-8">Access Your <br/>Premium Curriculum.</h2>
          <p className="text-lg text-on-surface-variant font-light leading-relaxed max-w-md">Log in to your {loginType} portal to access certifications, live sessions, and industry-grade learning modules.</p>
          
          <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest uppercase text-outline">
            <ShieldCheck className="text-primary" size={16} /> Secure {loginType === 'student' ? 'Student' : 'Institutional'} Authentication
          </div>
        </div>

        {/* Login Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-12 editorial-shadow border-t-8 border-primary"
        >
          <div className="mb-10 text-center md:text-left">
            <Link to="/" className="inline-block mb-6">
               <Logo height={48} />
            </Link>
            <h3 className="text-2xl text-primary mb-2">Welcome Back</h3>
            <div className="flex gap-4 mb-6 p-1 bg-surface-container-low rounded">
              <button 
                onClick={() => setLoginType('student')}
                className={`flex-1 py-2 text-[10px] font-bold tracking-widest uppercase rounded transition-all ${loginType === 'student' ? 'bg-white text-primary shadow-sm' : 'text-outline hover:text-primary'}`}
              >
                Student
              </button>
              <button 
                onClick={() => setLoginType('college')}
                className={`flex-1 py-2 text-[10px] font-bold tracking-widest uppercase rounded transition-all ${loginType === 'college' ? 'bg-white text-primary shadow-sm' : 'text-outline hover:text-primary'}`}
              >
                College
              </button>
            </div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">Access your {loginType === 'student' ? 'learning' : 'institutional'} portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold tracking-widest uppercase text-outline">{loginType === 'student' ? 'Student' : 'Admin'} Email Address</label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-outline" size={18} />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-outline-variant focus:border-primary pl-8 py-3 outline-none text-xl transition-all font-light italic"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Access Password</label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-outline" size={18} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b border-outline-variant focus:border-primary pl-8 py-3 outline-none text-xl transition-all font-light"
                  placeholder="********"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
               <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest bg-red-50 p-3 border-l-2 border-red-500 italic">
                 {error}
               </p>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-5 rounded text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-primary-container transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Login to Dashboard'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="mt-12 text-center text-[10px] text-outline uppercase tracking-widest leading-relaxed">
            Trouble logging in? Contact <a href="#" className="underline text-primary">Student Support</a> or check your enrollment status in your email.
          </p>
        </motion.div>
      </div>

      {/* Decorative skew */}
      <div className="absolute right-0 top-0 w-1/4 h-full bg-surface-container-low -skew-x-12 z-0 hidden lg:block border-l border-outline-variant/10"></div>
    </div>
  );
}
