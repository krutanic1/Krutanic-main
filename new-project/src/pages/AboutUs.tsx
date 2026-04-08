import React from 'react';
import { CheckCircle2, Target, Eye, Handshake, Briefcase, GraduationCap } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const values = [
  {
    icon: Target,
    title: 'Outcome First',
    desc: 'Every microcourse is designed to produce measurable skills, portfolio work, and interview readiness.',
  },
  {
    icon: Eye,
    title: 'Industry Relevance',
    desc: 'We continuously update microcourse curriculum based on hiring trends, role expectations, and employer feedback.',
  },
  {
    icon: Handshake,
    title: 'Institution Collaboration',
    desc: 'We partner with colleges and organizations to scale employability through compact, practical micro-learning pathways.',
  },
];

const highlights = [
  'Learn in short, focused modules without overwhelming schedules',
  'Build job-ready skills through hands-on projects and real tools',
  'Get faster upskilling for internships, placements, and role switches',
  'Earn verifiable certificates that strengthen resumes and portfolios',
];

const microcourseBenefits = [
  {
    title: 'Faster Learning Cycles',
    desc: 'Microcourses help learners master one practical skill at a time, making progress visible and motivating.',
  },
  {
    title: 'Affordable Skill Building',
    desc: 'Short-format programs keep learning accessible while still delivering high-impact outcomes.',
  },
  {
    title: 'Career-Specific Paths',
    desc: 'Learners can combine multiple microcourses to create personalized tracks for data, marketing, design, and more.',
  },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-surface">
      <Header scrolled={true} />

      <section className="pt-32 pb-20 bg-surface">
        <div className="container mx-auto px-8">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-outline mb-4">About Dikshannt</p>
          <h1 className="text-5xl lg:text-6xl text-primary mb-6">Dikshaant: A Microcourse Company for Career Growth</h1>
          <p className="text-on-surface-variant max-w-3xl text-lg leading-relaxed">
            Dikshaant is a career-focused learning company that sells microcourses designed for students and working
            professionals. Our microcourses are short, practical, and industry-aligned so learners can build
            in-demand skills quickly, apply them immediately, and grow with confidence.
          </p>
        </div>
      </section>

      <section className="pb-20 bg-surface">
        <div className="container mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white p-8 lg:p-10 editorial-shadow border border-outline-variant/10">
            <h2 className="text-3xl text-primary mb-4">Our Mission</h2>
            <p className="text-on-surface-variant leading-relaxed">
              To make high-quality microcourses accessible, structured, and outcome-driven for students,
              professionals, and institutions that want real employability outcomes.
            </p>
          </div>

          <div className="bg-white p-8 lg:p-10 editorial-shadow border border-outline-variant/10">
            <h2 className="text-3xl text-primary mb-4">Our Vision</h2>
            <p className="text-on-surface-variant leading-relaxed">
              To become the most trusted micro-learning brand where short courses create long-term career impact.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20 bg-surface">
        <div className="container mx-auto px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {microcourseBenefits.map((item, index) => (
            <div key={index} className="bg-white p-7 editorial-shadow border border-outline-variant/10">
              <h3 className="text-2xl text-primary mb-3">{item.title}</h3>
              <p className="text-on-surface-variant leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-20 bg-surface-container-low">
        <div className="container mx-auto px-8 py-16">
          <h2 className="text-4xl text-primary mb-10">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 editorial-shadow border border-outline-variant/10">
                <value.icon className="w-6 h-6 text-primary mb-4" />
                <h3 className="text-xl text-primary mb-2">{value.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="container mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-4xl text-primary mb-6">How Dikshaant Microcourses Benefit Learners</h2>
            <div className="space-y-4">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-on-surface-variant">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 border border-outline-variant/10 editorial-shadow space-y-6">
            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-primary mt-1" />
              <div>
                <h3 className="text-lg text-primary">Career Alignment</h3>
                <p className="text-sm text-on-surface-variant">Each microcourse is mapped to real job roles, required tools, and practical outcomes.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-primary mt-1" />
              <div>
                <h3 className="text-lg text-primary">Academic Integration</h3>
                <p className="text-sm text-on-surface-variant">We help institutions integrate microcourses into academic journeys to improve placement readiness.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
