import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { ArrowRight, Menu, X } from 'lucide-react';

const Hero = () => {
  const videoRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const videoSrc = 'https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8';

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: false });
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => console.log('Autoplay blocked:', err));
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch((err) => console.log('Autoplay blocked:', err));
      });
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-codenest-bg overflow-hidden font-inter text-white selection:bg-codenest-green selection:text-codenest-bg">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          muted
          loop
          playsInline
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-codenest-bg via-codenest-bg/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-codenest-bg via-transparent to-transparent z-10" />
      </div>

      {/* Grid System (Visible on Desktop) */}
      <div className="hidden lg:block absolute inset-0 z-10 pointer-events-none">
        <div className="absolute left-[25%] top-0 bottom-0 w-px bg-white/10" />
        <div className="absolute left-[50%] top-0 bottom-0 w-px bg-white/10" />
        <div className="absolute left-[75%] top-0 bottom-0 w-px bg-white/10" />
      </div>

      {/* Central Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[300px] z-10 pointer-events-none">
        <svg viewBox="0 0 800 300" className="w-full h-full opacity-50">
          <defs>
            <filter id="glowBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="25" />
            </filter>
          </defs>
          <ellipse cx="400" cy="150" rx="350" ry="100" fill="#0f4a3e" filter="url(#glowBlur)" />
          <ellipse cx="400" cy="150" rx="200" ry="50" fill="#5ed29c" filter="url(#glowBlur)" />
        </svg>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-8 lg:px-12">
        <div className="font-inter font-bold text-2xl tracking-tight z-50">
          CodeNest<span className="text-codenest-green">.</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-[16px] font-medium z-50">
          {['PROJECTS', 'BLOG', 'ABOUT', 'RESUME'].map((item) => (
            <a key={item} href="#" className="hover:text-codenest-green transition-colors duration-300">
              {item}
            </a>
          ))}
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden z-50 p-2 -mr-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-codenest-bg flex flex-col items-center justify-center space-y-8 md:hidden">
          {['PROJECTS', 'BLOG', 'ABOUT', 'RESUME'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-2xl font-bold tracking-wider hover:text-codenest-green transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-20 flex flex-col justify-center min-h-screen px-6 lg:px-12 max-w-7xl mx-auto pt-20">
        <div className="flex flex-col items-start max-w-2xl">
          
          {/* Liquid Glass Card */}
          <div className="w-[200px] h-[200px] rounded-2xl liquid-glass translate-y-[-50px] flex flex-col justify-between p-6">
            <div className="text-[14px] font-mono tracking-widest text-white/60">
              [ 2025 ]
            </div>
            <div>
              <h3 className="text-[18px] leading-tight mb-2">
                Taught by <span className="font-instrument italic font-normal">Industry</span> Professionals
              </h3>
              <p className="text-[11px] text-white/50 leading-relaxed font-jakarta">
                Learn from the experts who have built the tools you use every day.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Eyebrow */}
            <div className="font-jakarta font-bold text-[11px] text-codenest-green uppercase tracking-[0.2em]">
              Career-Ready Curriculum
            </div>

            {/* Headline */}
            <h1 className="font-inter font-extrabold text-[40px] leading-[1.1] md:text-[56px] lg:text-[72px] uppercase tracking-tight">
              Launch Your <br className="hidden md:block" />
              Coding Career<span className="text-codenest-green">.</span>
            </h1>

            {/* Description */}
            <p className="text-[14px] leading-relaxed text-white/70 max-w-[512px]">
              Master in-demand coding skills through immersive, project-based learning. CodeNest provides the curriculum, community, and mentorship you need to thrive in the tech industry.
            </p>

            {/* CTA */}
            <button className="group flex items-center gap-3 bg-codenest-green text-codenest-bg px-8 py-4 rounded-full font-bold uppercase tracking-wider text-[14px] hover:bg-white transition-colors duration-300">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default Hero;
