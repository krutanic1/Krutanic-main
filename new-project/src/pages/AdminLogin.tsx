import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    
    try {
      if (!otpSent) {
        await axios.post('/microadmin/otpsend', { email });
        setOtpSent(true);
      } else {
        const res = await axios.post('/microadmin/otpverify', { email, otp });
        localStorage.setItem('adminId', res.data.adminId);
        localStorage.setItem('adminName', res.data.adminName);
        navigate('/admin/enrolls');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8 relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500/5 -skew-x-12 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-indigo-500/5 skew-x-12 -translate-x-1/4"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-12 shadow-2xl shadow-black/50 overflow-hidden relative">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500"></div>

          <div className="mb-12">
            <div className="flex justify-between items-center mb-8">
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <Logo height={40} />
              </Link>
              <Link to="/login" className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:text-emerald-400 transition-colors">
                 <ArrowLeft size={14} /> Student Portal
              </Link>
            </div>
            
            <h3 className="text-3xl font-serif text-white mb-2 italic">Dikshannt Institutional Access</h3>
            <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] text-emerald-500 uppercase">
              <ShieldCheck size={16} /> Certified Administrator
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Restricted Admin Email</label>
              <div className="relative group">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input 
                  type="email" 
                  required 
                  disabled={otpSent}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 focus:border-emerald-500 pl-10 py-4 outline-none text-xl transition-all text-white font-light disabled:opacity-50"
                  placeholder="admin@institution.com"
                />
              </div>
            </div>

            <AnimatePresence mode='wait'>
              {otpSent && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400">6-Digit Verification Sequence</label>
                    <button 
                      type="button" 
                      onClick={() => setOtpSent(false)}
                      className="text-[10px] text-emerald-500 hover:underline font-bold uppercase"
                    >
                      Change Email
                    </button>
                  </div>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-0 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                    <input 
                      type="text" 
                      required 
                      maxLength={6}
                      autoFocus
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 focus:border-emerald-500 pl-10 py-4 outline-none text-2xl tracking-[0.8em] transition-all text-white font-bold"
                      placeholder="000000"
                    />
                  </div>
                  <p className="text-[10px] text-emerald-500/70 font-bold uppercase tracking-widest flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    Dynamic OTP dispatched to secure archives.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="bg-red-500/10 border-l-2 border-red-500 p-4 text-red-500 text-[10px] font-bold uppercase tracking-widest italic"
               >
                 {error}
               </motion.div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-white text-slate-900 py-6 rounded-2xl text-xs font-bold tracking-[0.25em] uppercase flex items-center justify-center gap-4 hover:bg-emerald-400 hover:text-emerald-950 transition-all shadow-xl shadow-white/5 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (otpSent ? 'Authorize Session' : 'Request Security Code')}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-16 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">
              Proprietary System Access. <br/>Unauthorized attempts will be logged per IT protocol.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
