import React from 'react';
import Logo from './Logo';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  scrolled: boolean;
}

export default function Header({ scrolled }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <nav
      className={`fixed top-0 left-0 w-full h-20 z-50 transition-all duration-300 px-4 md:px-8 flex justify-between items-center ${
        scrolled ? 'bg-surface/90 backdrop-blur-md editorial-shadow' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center gap-12">
        <Link to="/" className="flex items-center scale-90 md:scale-100 origin-left">
          <Logo height={80} />
        </Link>
        <div className="hidden lg:flex gap-8">
          <Link to="/explore-courses" className="text-primary font-bold border-b-2 border-primary pb-1 text-xs tracking-[0.05em] uppercase whitespace-nowrap">
            Courses & Programs
          </Link>
          <a href="#" className="text-on-surface-variant font-medium hover:text-primary transition-colors text-xs tracking-[0.05em] uppercase whitespace-nowrap">
            For Institutions
          </a>
          <a href="#" className="text-on-surface-variant font-medium hover:text-primary transition-colors text-xs tracking-[0.05em] uppercase whitespace-nowrap">
            Insights
          </a>
          <Link to="/about-us" className="text-on-surface-variant font-medium hover:text-primary transition-colors text-xs tracking-[0.05em] uppercase whitespace-nowrap">
            Why Dikshannt
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <Link to="/login" className="block text-on-surface-variant hover:text-primary font-medium text-[10px] md:text-xs tracking-[0.05em] uppercase transition-colors whitespace-nowrap">
          Log In
        </Link>
        <button
          onClick={() => navigate('/explore-courses')}
          className="premium-gradient text-white px-4 md:px-6 py-2 md:py-2.5 rounded text-[10px] md:text-xs font-bold tracking-[0.05em] uppercase active:scale-95 transition-transform whitespace-nowrap"
        >
          Explore Courses
        </button>
      </div>
    </nav>
  );
}
