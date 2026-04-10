import React, { useState } from 'react';
import { CheckCircle2, Target, Eye, Handshake, Briefcase, GraduationCap, Check, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

const values = [
  {
    icon: Target,
    title: 'Outcome First',
    desc: 'Every internship and workshop track is designed to produce measurable skills, portfolio work, and interview readiness.',
  },
  {
    icon: Eye,
    title: 'Industry Relevance',
    desc: 'We continuously update internship and workshop curriculum based on hiring trends, role expectations, and employer feedback.',
  },
  {
    icon: Handshake,
    title: 'Institution Collaboration',
    desc: 'We partner with colleges and organizations to scale employability through practical internship and workshop pathways.',
  },
];

const highlights = [
  'Learn in short, focused modules without overwhelming schedules',
  'Build job-ready skills through hands-on projects and real tools',
  'Get faster upskilling for internships, placements, and role switches',
  'Earn verifiable certificates that strengthen resumes and portfolios',
];

const internshipWorkshopBenefits = [
  {
    title: 'Structured Internship Learning',
    desc: 'Internship-led learning helps learners build one practical skill at a time, making progress visible and motivating.',
  },
  {
    title: 'Accessible Workshop Programs',
    desc: 'Workshop-led programs keep learning accessible while still delivering high-impact outcomes.',
  },
  {
    title: 'Career-Specific Tracks',
    desc: 'Learners can combine internships and workshops to create personalized tracks for data, marketing, design, and more.',
  },
];

export default function AboutUs() {
  const [contactForm, setContactForm] = useState({
    contactName: '',
    email: '',
    phone: '',
    collegeName: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      await axios.post('/partner/submit', contactForm);
      setIsSubmitted(true);
      setContactForm({ 
        contactName: '', 
        email: '', 
        phone: '', 
        collegeName: '', 
        message: '' 
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header scrolled={true} />

      <section className="pt-32 pb-20 bg-surface">
        <div className="container mx-auto px-8">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-outline mb-4">About Dikshannt</p>
          <h1 className="text-5xl lg:text-6xl text-primary mb-6">Dikshaant: Internship and Workshop Programs for Career Growth</h1>
          <p className="text-on-surface-variant max-w-3xl text-lg leading-relaxed">
            Dikshaant is a career-focused learning company that offers internships and workshops designed for students and
            working professionals. Our programs are practical and industry-aligned so learners can build in-demand skills
            quickly, apply them immediately, and grow with confidence.
          </p>
        </div>
      </section>

      <section className="pb-20 bg-surface">
        <div className="container mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white p-8 lg:p-10 editorial-shadow border border-outline-variant/10">
            <h2 className="text-3xl text-primary mb-4">Our Mission</h2>
            <p className="text-on-surface-variant leading-relaxed">
              To make high-quality internships and workshops accessible, structured, and outcome-driven for students,
              professionals, and institutions that want real employability outcomes.
            </p>
          </div>

          <div className="bg-white p-8 lg:p-10 editorial-shadow border border-outline-variant/10">
            <h2 className="text-3xl text-primary mb-4">Our Vision</h2>
            <p className="text-on-surface-variant leading-relaxed">
              To become the most trusted internship and workshop brand where practical learning creates long-term career impact.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20 bg-surface">
        <div className="container mx-auto px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {internshipWorkshopBenefits.map((item, index) => (
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
            <h2 className="text-4xl text-primary mb-6">How Dikshaant Internships and Workshops Benefit Learners</h2>
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
                <p className="text-sm text-on-surface-variant">Each internship and workshop track is mapped to real job roles, required tools, and practical outcomes.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-primary mt-1" />
              <div>
                <h3 className="text-lg text-primary">Academic Integration</h3>
                <p className="text-sm text-on-surface-variant">We help institutions integrate internships and workshops into academic journeys to improve placement readiness.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      <section id="contact-us" className="pb-24 bg-surface-container-low scroll-mt-28">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl mx-auto bg-white p-8 lg:p-12 editorial-shadow border border-outline-variant/10">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-outline mb-4">Contact Us</p>
            <h2 className="text-4xl text-primary mb-4">Let’s Build Career-Ready Learning Together</h2>
            <p className="text-on-surface-variant mb-8 leading-relaxed">
              Reach out to partner with Dikshannt for internship and workshop programs. Our team will connect with you shortly.
            </p>

            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contactName" className="block text-xs font-bold tracking-[0.08em] uppercase text-primary mb-2">Contact Person Name</label>
                  <input
                    id="contactName"
                    name="contactName"
                    type="text"
                    value={contactForm.contactName}
                    onChange={handleContactChange}
                    required
                    className="w-full border border-outline-variant/30 bg-surface px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-bold tracking-[0.08em] uppercase text-primary mb-2">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    required
                    className="w-full border border-outline-variant/30 bg-surface px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold tracking-[0.08em] uppercase text-primary mb-2">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={contactForm.phone}
                    onChange={handleContactChange}
                    required
                    className="w-full border border-outline-variant/30 bg-surface px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label htmlFor="collegeName" className="block text-xs font-bold tracking-[0.08em] uppercase text-primary mb-2">College / Institute Name</label>
                  <input
                    id="collegeName"
                    name="collegeName"
                    type="text"
                    value={contactForm.collegeName}
                    onChange={handleContactChange}
                    required
                    className="w-full border border-outline-variant/30 bg-surface px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                    placeholder="Enter institution or company name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-bold tracking-[0.08em] uppercase text-primary mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={contactForm.message}
                  onChange={handleContactChange}
                  required
                  className="w-full border border-outline-variant/30 bg-surface px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Tell us your goals and collaboration requirements"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="premium-gradient text-white px-8 py-3 text-xs font-bold tracking-[0.08em] uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
                {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
                {isSubmitted && (
                  <p className="text-sm text-green-700 font-medium">Thank you. Our team will contact you soon.</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
