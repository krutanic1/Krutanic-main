import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { usePracticeAuth } from '../context/PracticeAuthContext';
import { ArrowLeft, BookOpen, Brain, Trophy, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import heroBg from '../../assets/futuristic_tech_bg.png';

const PracticeLoginPage = () => {
  const { isAuthenticated, loginWithEmail, registerWithEmail, loading } = usePracticeAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/practice';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await loginWithEmail(formData.email, formData.password);
    } else {
      await registerWithEmail(formData.name, formData.email, formData.password);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#181920] text-slate-200 selection:bg-indigo-500/30">
      
      {/* LEFT SIDE - Hero/Image Area (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-slate-800/50">
        {/* Background Image & Overlays */}
        <div 
          className="absolute inset-0 z-0 opacity-50 mix-blend-screen"
          style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1115]/90 via-[#181920]/80 to-indigo-900/40 z-0"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
        
        {/* Top Content */}
        <div className="relative z-10 flex flex-col items-start">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors mb-20 bg-white/5 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
            <ArrowLeft size={16} />
            Back to main site
          </Link>
          
          <div className="space-y-6">
            <h1 className="text-6xl xl:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 tracking-tighter leading-[1.1]">
              Code.<br />
              Compete.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">Conquer.</span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-md leading-relaxed font-medium">
              Join the elite ranks of developers. Master complex algorithms, ace your interviews, and build the future.
            </p>
          </div>
        </div>
        
        {/* Floating Glass Element (Bottom) */}
        <div className="relative z-10 mt-auto pt-12">
          <div className="bg-[#1e1f26]/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform -rotate-2 hover:rotate-0 hover:-translate-y-2 transition-all duration-500 group">
            
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-colors duration-500"></div>

            <div className="flex items-start gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.4)] flex-shrink-0">
                <CheckCircle2 size={24} className="text-white" />
              </div>
              <div>
                <p className="text-white font-black text-lg tracking-tight">Challenge Completed!</p>
                <p className="text-emerald-400 text-sm font-bold mt-0.5">+150 XP Earned</p>
              </div>
            </div>
            
            {/* Mock Code Block */}
            <div className="bg-[#0f1115]/80 rounded-xl p-4 border border-white/5 font-mono text-xs text-slate-400 space-y-2 relative z-10">
              <div className="flex gap-2">
                <span className="text-pink-400">function</span>
                <span className="text-blue-400">optimizeSolution</span>
                <span className="text-slate-300">(data) {'{'}</span>
              </div>
              <div className="pl-4 flex gap-2">
                <span className="text-indigo-400">return</span>
                <span className="text-emerald-300">data.sort().filter(O(1))</span>
              </div>
              <div className="text-slate-300">{'}'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center bg-[#1e1f26] relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 lg:hidden" />
        
        {/* Mobile Back Button */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md px-6 sm:px-12 py-12">
          <div className="mb-10 text-center lg:text-left">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center lg:hidden mx-auto mb-6">
              <BookOpen className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-sm text-slate-400">
              {isLogin ? 'Enter your details to access your dashboard.' : 'Start your journey with Krutanic Practice today.'}
            </p>
          </div>

          <div className="bg-[#2a2d36] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#181920] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder-slate-600"
                    placeholder="John Doe"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email address</label>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#181920] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder-slate-600"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                  {isLogin && <a href="#" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">Forgot password?</a>}
                </div>
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#181920] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder-slate-600"
                  placeholder="••••••••"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative flex items-center justify-center py-3.5 px-4 font-bold text-white transition-all duration-300 bg-indigo-600 rounded-xl overflow-hidden group/btn hover:bg-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]"
                >
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none"></span>
                  <span className="relative flex items-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : isLogin ? 'Sign in to Practice' : 'Create Account'}
                  </span>
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-sm text-slate-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors focus:outline-none ml-1"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeLoginPage;
