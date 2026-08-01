import React, { useEffect, useRef } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import MentorshipForm from '../MentorshipForm';
import './MentorshipPremium.css';

/* Generates random floating particles on a canvas */
const HeroCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle pool — deep blue tones matching the background
    const NUM = 35;
    const particles = Array.from({ length: NUM }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.4,
      dx: (Math.random() - 0.5) * 0.25,
      dy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.35 + 0.10,
      // some particles are blue, some slightly indigo
      color: Math.random() > 0.5 ? '96,165,250' : '129,140,248',
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
      });

      // Subtle connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(37,99,235,${0.10 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pm-hero-canvas" aria-hidden="true" />;
};

const MentorshipHero = ({ onOpenForm }) => {
  return (
    <section className="pm-hero">
      {/* Animated canvas particles */}
      <HeroCanvas />

      {/* Floating decorative orbs */}
      <div className="pm-orb pm-orb-1" aria-hidden="true" />
      <div className="pm-orb pm-orb-2" aria-hidden="true" />
      <div className="pm-orb pm-orb-3" aria-hidden="true" />

      {/* Animated scanning light beam */}
      <div className="pm-scan-beam" aria-hidden="true" />

      <div className="pm-hero-container">
        <div className="pm-hero-content pm-anim-fadein-left">

          {/* Eyebrow with animated pulse dot */}
          <div className="pm-hero-eyebrow">
            <span className="pm-eyebrow-dot" />
            Premium Career Accelerator
          </div>

          {/* Title with stagger */}
          <h1 className="pm-hero-title pm-anim-fadein-up pm-delay-1">
            Choose the mentorship path that shapes your{' '}
            <span className="pm-text-gradient pm-shimmer-text">next profession.</span>
          </h1>

          <p className="pm-hero-subtitle pm-anim-fadein-up pm-delay-2">
            Structured, mentor-led pathways in engineering, AI, design, and infrastructure for learners building serious careers.
          </p>

          <div className="pm-hero-actions pm-anim-fadein-up pm-delay-3">
            <button className="pm-btn-primary pm-btn-ripple" onClick={onOpenForm}>
              Explore Pathways <FaArrowRight className="pm-btn-icon pm-icon-bounce" />
            </button>
            <button className="pm-btn-secondary" onClick={onOpenForm}>
              Speak to an Advisor
            </button>
          </div>

          <div className="pm-hero-trust pm-anim-fadein-up pm-delay-4">
            <div className="pm-trust-item">
              <span className="pm-trust-value pm-count-glow">10k+</span>
              <span className="pm-trust-label">Active Learners</span>
            </div>
            <div className="pm-trust-divider" />
            <div className="pm-trust-item">
              <span className="pm-trust-value pm-count-glow">500+</span>
              <span className="pm-trust-label">Hiring Brands</span>
            </div>
            <div className="pm-trust-divider" />
            <div className="pm-trust-item">
              <span className="pm-trust-value pm-count-glow">100%</span>
              <span className="pm-trust-label">Outcome Focused</span>
            </div>
          </div>
        </div>

        <div className="pm-hero-visual pm-anim-fadein-right pm-delay-2">
          <div className="pm-form-float-wrapper">
            <MentorshipForm inlineMode={true} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MentorshipHero;
