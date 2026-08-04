import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hls from 'hls.js';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const videoRef = useRef(null);
  const navigate = useNavigate();

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


      {/* Main Content */}
      <main className="relative z-20 flex flex-col justify-center items-center min-h-screen px-6 lg:px-12 max-w-7xl mx-auto pt-20">
        <div className="flex flex-col items-center text-center max-w-[860px] -mt-20">
          
          <div className="flex flex-col items-center w-full">
            {/* Trust line */}
            <div className="font-jakarta font-bold text-[14px] text-codenest-green uppercase tracking-[0.2em] text-center mb-6">
              Software Development — AI & ML — Cloud & DevOps — Data Science
            </div>

            {/* Headline */}
            <h1 className="!text-white font-inter font-extrabold text-[42px] leading-[1.15] md:text-[56px] lg:text-[64px] lg:leading-[1.05] tracking-tight text-center mb-8">
              Tech Courses Built for <br className="hidden md:block" />
              Students and Professionals<span className="!text-codenest-green">.</span>
            </h1>

            {/* Description */}
            <p className="text-[16px] md:text-[20px] leading-[1.8] text-white/80 max-w-[680px] text-center mb-12">
              Learn in-demand skills through expert-led training, hands-on projects, internship opportunities, and career support. We provide industry-focused courses for students and professionals.
            </p>

            {/* Proof Points (Horizontal layout) */}
            <div className="flex flex-col items-center mb-12 w-full">
              <span className="text-[11px] uppercase tracking-[0.25em] text-white/40 mb-4 font-jakarta">
                Key Highlights
              </span>
              <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-[14px] text-white/70 font-jakarta max-w-[760px] text-center">
                <span>Hands-on projects with real-world use cases</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 hidden md:block"></span>
                <span>Internship and placement assistance</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 hidden lg:block"></span>
                <span>Programs for beginners, freshers, and professionals</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              <button 
                onClick={() => navigate('/Mentorship')}
                className="group flex items-center justify-center gap-3 bg-codenest-green text-codenest-bg px-10 h-[58px] rounded-full font-extrabold uppercase tracking-widest text-[14px] hover:bg-white transition-colors duration-300"
              >
                Explore Courses
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default Hero;
