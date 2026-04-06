import React from 'react';
import dikshanntLogo from '../assets/dikshannt-logo-final.png';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'transparent';
  height?: string | number;
}

export default function Logo({ className = '', height = 'auto' }: LogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={dikshanntLogo} 
        alt="Dikshannt" 
        style={{ height }}
        className="max-w-full h-auto object-contain"
      />
    </div>
  );
}
