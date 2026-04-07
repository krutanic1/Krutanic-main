import React from 'react';
import Logo from './Logo';

interface HeaderProps {
  scrolled: boolean;
}

export default function Header({ scrolled }: HeaderProps) {
  return (
    <nav
      className={`fixed top-0 left-0 w-full h-20 z-50 transition-all duration-300 px-8 flex justify-between items-center ${
        scrolled ? 'bg-surface/90 backdrop-blur-md editorial-shadow' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center gap-12">
        <a href="#" className="flex items-center">
          <Logo height={80} />
        </a>
        <div className="hidden lg:flex gap-8">
          <a href="#" className="text-primary font-bold border-b-2 border-primary pb-1 text-xs tracking-[0.05em] uppercase">
            Courses & Programs
          </a>
          <a href="#" className="text-on-surface-variant font-medium hover:text-primary transition-colors text-xs tracking-[0.05em] uppercase">
            College Collaboration
          </a>
          <a href="#" className="text-on-surface-variant font-medium hover:text-primary transition-colors text-xs tracking-[0.05em] uppercase">
            For Institutions
          </a>
          <a href="#" className="text-on-surface-variant font-medium hover:text-primary transition-colors text-xs tracking-[0.05em] uppercase">
            Insights
          </a>
          <a href="#" className="text-on-surface-variant font-medium hover:text-primary transition-colors text-xs tracking-[0.05em] uppercase">
            Why Dikshannt
          </a>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <a href="/login" className="text-on-surface-variant hover:text-primary font-medium text-xs tracking-[0.05em] uppercase transition-colors">
          Log In
        </a>
        <button className="premium-gradient text-white px-6 py-2.5 rounded text-xs font-bold tracking-[0.05em] uppercase active:scale-95 transition-transform">
          Explore Courses
        </button>
      </div>
    </nav>
  );
}
