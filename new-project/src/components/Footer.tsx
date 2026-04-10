import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Instagram, Twitter } from 'lucide-react';
import Logo from './Logo';
import LiveEnrollmentCarousel from './LiveEnrollmentCarousel';

export default function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/20 px-4 md:px-6 py-6 md:py-7">
      <div className="max-w-[1180px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 xl:gap-6">
          <div>
            
              <Logo height={100} />
            

            
            <p className="mt-2.5 text-[11px] md:text-xs leading-[1.5] text-slate-600 max-w-sm">
              Accelerate your career with industry-ready learning. Master coding, design, and data with top-tier assistance.
            </p>

            <div className="mt-4 flex items-center gap-2">
              <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-full border border-outline-variant/20 bg-white flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-colors">
                <Linkedin size={14} />
              </a>
              <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full border border-outline-variant/20 bg-white flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-colors">
                <Instagram size={14} />
              </a>
              <a href="#" aria-label="Twitter" className="w-8 h-8 rounded-full border border-outline-variant/20 bg-white flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-colors">
                <Twitter size={14} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold tracking-[0.14em] uppercase text-slate-900 pb-2 border-b border-outline-variant/30 inline-block">Explore</h3>
            <div className="mt-3 flex flex-col gap-2">
              <Link to="/explore-courses" className="text-sm md:text-base text-slate-600 hover:text-primary transition-colors tracking-[0.06em]">Courses & Programs</Link>
              <Link to="/institutions" className="text-sm md:text-base text-slate-600 hover:text-primary transition-colors tracking-[0.06em]">For Institutions</Link>
              <Link to="/insights" className="text-sm md:text-base text-slate-600 hover:text-primary transition-colors tracking-[0.06em]">Insights</Link>
              <Link to="/about-us" className="text-sm md:text-base text-slate-600 hover:text-primary transition-colors tracking-[0.06em]">Why Dikshannt</Link>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold tracking-[0.14em] uppercase text-slate-900 pb-2 border-b border-outline-variant/30 inline-block">Support</h3>
            <div className="mt-3 flex flex-col gap-2">
              
              <Link to="/about-us#contact-us" className="text-sm md:text-base text-slate-600 hover:text-primary transition-colors">Contact Us</Link>
              <Link to="/about-us" className="text-sm md:text-base text-slate-600 hover:text-primary transition-colors">About Us</Link>
              <Link to="/insights" className="text-sm md:text-base text-slate-600 hover:text-primary transition-colors">Insights</Link>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold tracking-[0.14em] uppercase text-slate-900 pb-2 border-b border-outline-variant/30 inline-block">Secure Payments</h3>
            <div className="mt-3 flex flex-col gap-2">
              <p className="text-sm md:text-base font-bold text-[#0b3276]">Razorpay</p>
              </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-outline-variant/20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2.5">
          <p className="text-[10px] md:text-xs tracking-[0.08em] uppercase text-slate-500 font-semibold">© 2026 KRUTANIC. ALL RIGHTS RESERVED.</p>
          <div className="flex flex-wrap items-center gap-3 lg:gap-5">
            <Link to="/terms-of-service" className="text-[10px] md:text-xs tracking-[0.08em] uppercase text-slate-500 font-semibold hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/privacy-policy" className="text-[10px] md:text-xs tracking-[0.08em] uppercase text-slate-500 font-semibold hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/refund-policy" className="text-[10px] md:text-xs tracking-[0.08em] uppercase text-slate-500 font-semibold hover:text-primary transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
      <LiveEnrollmentCarousel />
    </footer>
  );
}
