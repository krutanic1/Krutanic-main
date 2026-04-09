import React from 'react';
import { Building2, GraduationCap, Handshake, Briefcase, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const collaborationPillars = [
  {
    icon: GraduationCap,
    title: 'Curriculum-Aligned Courses',
    desc: 'Offer students compact, practical courses that complement academic programs and improve job readiness.',
  },
  {
    icon: Briefcase,
    title: 'Career-Focused Outcomes',
    desc: 'Help students gain portfolio-ready projects, interview confidence, and role-relevant technical exposure.',
  },
  {
    icon: Handshake,
    title: 'Institution Partnership Model',
    desc: 'Collaborate with Dikshannt to run co-branded upskilling tracks and measurable placement-focused initiatives.',
  },
];

const benefits = [
  'Flexible course delivery for students across departments',
  'Industry-aligned content built for real employability',
  'Progress tracking and structured learning pathways',
  'Certificate-driven outcomes to strengthen student profiles',
];

export default function Institutions() {
  return (
    <div className="min-h-screen bg-surface">
      <Header scrolled={true} />

      <section className="pt-32 pb-16 bg-surface">
        <div className="container mx-auto px-8">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-outline mb-4">Institution Partnerships</p>
          <h1 className="text-5xl lg:text-6xl text-primary leading-tight max-w-5xl mb-6">
            Institutions Can Collaborate With Dikshannt To Offer Career-Focused Courses To Students
          </h1>
          <p className="text-on-surface-variant max-w-3xl text-lg leading-relaxed">
            We work with colleges and academic institutions to integrate short, practical learning modules that
            strengthen placement readiness and bridge the gap between classroom learning and industry expectations.
          </p>
          <div className="mt-8">
            <Link
              to="/login"
              className="inline-flex premium-gradient text-white px-6 py-3 text-xs font-bold tracking-[0.06em] uppercase hover:opacity-90 transition-opacity"
            >
              Partner With Dikshannt
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-20 bg-surface">
        <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {collaborationPillars.map((item, index) => (
            <div key={index} className="bg-white p-7 editorial-shadow border border-outline-variant/10">
              <item.icon className="w-6 h-6 text-primary mb-4" />
              <h2 className="text-2xl text-primary mb-3">{item.title}</h2>
              <p className="text-on-surface-variant leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-24 bg-surface-container-low">
        <div className="container mx-auto px-8 py-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="inline-flex items-center gap-2 text-primary text-xs font-bold tracking-[0.12em] uppercase mb-5">
              <Building2 className="w-4 h-4" />
              Why Institutions Choose Dikshannt
            </div>
            <h3 className="text-4xl text-primary mb-6">Structured Collaboration For Student Success</h3>
            <p className="text-on-surface-variant leading-relaxed max-w-xl">
              Our institution model is designed for seamless collaboration with existing academic systems, so colleges
              can expand student opportunities without disrupting current curriculum structures.
            </p>
          </div>

          <div className="bg-white p-8 border border-outline-variant/10 editorial-shadow">
            <h4 className="text-2xl text-primary mb-6">What Students Gain</h4>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-on-surface-variant">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 bg-surface">
        <div className="container mx-auto px-8">
          <div className="bg-primary text-white p-8 md:p-12 editorial-shadow flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase text-white/70 mb-2">Start A Partnership</p>
              <h4 className="text-3xl">Bring Job-Ready Learning To Your Campus</h4>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/explore-courses"
                className="bg-white text-primary px-6 py-3 text-xs font-bold tracking-[0.06em] uppercase hover:opacity-90 transition-opacity"
              >
                View Courses
              </Link>
              <Link
                to="/about-us#contact-us"
                className="border border-white/40 text-white px-6 py-3 text-xs font-bold tracking-[0.06em] uppercase hover:bg-white/10 transition-colors"
              >
                Contact Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}