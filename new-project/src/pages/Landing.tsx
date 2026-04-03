import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronDown, 
  Brain, 
  Building2, 
  Megaphone, 
  Users, 
  ShieldCheck, 
  BarChart3, 
  Mic2, 
  GraduationCap,
  ArrowRight,
  Quote,
  CheckCircle2,
  Handshake,
  Briefcase
} from 'lucide-react';
import { motion } from 'motion/react';
import axios from 'axios';
import EnrollModal from '../components/EnrollModal';

const faculties = [
  { icon: Brain, title: "Technology & AI", desc: "Master the future of computation and machine intelligence." },
  { icon: Building2, title: "Business & Entrepreneurship", desc: "Strategic thinking and venture creation for the modern age." },
  { icon: Megaphone, title: "Marketing & Brand Growth", desc: "Data-driven storytelling and digital presence." },
  { icon: Users, title: "Leadership & Management", desc: "Developing human-centric organizational structures." },
  { icon: ShieldCheck, title: "Career Readiness", desc: "Bridge the gap between graduation and professional life." },
  { icon: BarChart3, title: "Data & Analytics", desc: "Interpreting complexity into actionable insights." },
  { icon: Mic2, title: "Communication & Soft Skills", desc: "The art of interpersonal influence and clarity." },
  { icon: GraduationCap, title: "College Partnership Programs", desc: "Curriculum integration and co-branded success." },
];

const courses = [
  { tag: "TECH", title: "Full Stack Web Development", desc: "Build enterprise-grade applications from scratch.", duration: "24 WEEKS", format: "COHORT-BASED", image: "https://picsum.photos/seed/code/800/600" },
  { tag: "DATA", title: "Data Analytics for Decision Making", desc: "Turn raw data into strategic business value.", duration: "12 WEEKS", format: "ON-DEMAND", image: "https://picsum.photos/seed/data/800/600" },
  { tag: "AI", title: "AI Essentials for Executives", desc: "Navigate the landscape of machine learning and LLMs.", duration: "6 WEEKS", format: "COHORT-BASED", image: "https://picsum.photos/seed/ai/800/600" },
  { tag: "GROWTH", title: "Digital Marketing and Growth Strategy", desc: "Advanced customer acquisition and retention tactics.", duration: "10 WEEKS", format: "ON-DEMAND", image: "https://picsum.photos/seed/marketing/800/600" },
  { tag: "LEADERSHIP", title: "Leadership Principles", desc: "Core competencies for emerging management roles.", duration: "8 WEEKS", format: "COHORT-BASED", image: "https://picsum.photos/seed/lead/800/600" },
  { tag: "BUSINESS", title: "Business Communication Mastery", desc: "Master high-stakes professional discourse.", duration: "6 WEEKS", format: "ON-DEMAND", image: "https://picsum.photos/seed/biz/800/600" },
];

const credentials = [
  { title: "Krutanic Career Launch", desc: "Entry-level mastery in high-growth digital sectors.", volume: "5 Courses", effort: "10-12 hrs/week" },
  { title: "College Employability Accelerator", desc: "Holistic readiness for Fortune 500 recruitment.", volume: "8 Courses", effort: "15 hrs/week" },
  { title: "Digital Skills Certification", desc: "Validated technical fluency for modern workflows.", volume: "4 Courses", effort: "8 hrs/week" },
];

const insights = [
  { date: "OCT 12, 2024", title: "The Future of AI in Campus Curriculum", author: "By Academic Board", image: "https://picsum.photos/seed/insight1/800/600" },
  { date: "SEP 28, 2024", title: "Bridging the Talent Gap: A 2024 Report", author: "By Career Services", image: "https://picsum.photos/seed/insight2/800/600" },
  { date: "SEP 15, 2024", title: "Designing Outcome-Based Digital Learning", author: "By Dr. Elena Rossi", image: "https://picsum.photos/seed/insight3/800/600" },
];

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/microcourses/all');
      setCoursesList(res.data);
    } catch (err) {
      console.error('Failed to fetch courses', err);
    }
  };

  const handleEnrollClick = (course: any) => {
    setSelectedCourse(course);
    setIsEnrollModalOpen(true);
  };

  useEffect(() => {
    fetchCourses();
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-8 py-4 flex justify-between items-center ${scrolled ? 'bg-surface/90 backdrop-blur-md editorial-shadow' : 'bg-transparent'}`}>
        <div className="flex items-center gap-12">
          <a href="#" className="text-2xl font-serif tracking-tighter text-primary">Krutanic</a>
          <div className="hidden lg:flex gap-8">
            <a href="#" className="text-primary font-bold border-b-2 border-primary pb-1 text-xs tracking-[0.05em] uppercase">Courses & Programs</a>
            <a href="#" className="text-on-surface-variant font-medium hover:text-primary transition-colors text-xs tracking-[0.05em] uppercase">College Collaboration</a>
            <a href="#" className="text-on-surface-variant font-medium hover:text-primary transition-colors text-xs tracking-[0.05em] uppercase">For Institutions</a>
            <a href="#" className="text-on-surface-variant font-medium hover:text-primary transition-colors text-xs tracking-[0.05em] uppercase">Insights</a>
            <a href="#" className="text-on-surface-variant font-medium hover:text-primary transition-colors text-xs tracking-[0.05em] uppercase">Why Krutanic</a>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <a href="/login" className="text-on-surface-variant hover:text-primary font-medium text-xs tracking-[0.05em] uppercase transition-colors">Log In</a>
          <button className="premium-gradient text-white px-6 py-2.5 rounded text-xs font-bold tracking-[0.05em] uppercase active:scale-95 transition-transform">Explore Courses</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-24 lg:pt-60 lg:pb-40 overflow-hidden bg-surface">
        <div className="container mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl lg:text-7xl text-primary leading-[1.1] tracking-tighter mb-8">
              Learn Online. <br/>Build Real Skills. <br/>Create Career-Ready Campuses.
            </h1>
            <p className="text-lg text-on-surface-variant mb-10 font-light leading-relaxed max-w-lg">
              Krutanic offers flexible online courses, certificate programs, and institution collaboration models for modern learners and colleges.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="premium-gradient text-white px-8 py-4 rounded text-xs font-bold tracking-[0.05em] uppercase shadow-lg hover:opacity-90 transition-opacity">
                Explore Courses & Programs
              </button>
              <button className="bg-transparent border border-outline-variant text-primary px-8 py-4 rounded text-xs font-bold tracking-[0.05em] uppercase hover:bg-surface-container-low transition-colors">
                Partner With Krutanic
              </button>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="aspect-[4/5] bg-surface-container-high rounded-lg overflow-hidden editorial-shadow transform translate-x-8 translate-y-8">
              <img 
                src="https://picsum.photos/seed/campus/1200/1500" 
                alt="Institutional excellence" 
                className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute inset-0 border-[0.5px] border-outline-variant/30 rounded-lg"></div>
          </motion.div>
        </div>
        <div className="absolute -right-20 top-0 w-1/3 h-full bg-surface-container-low -skew-x-12 z-0 hidden lg:block"></div>
      </section>

      {/* Search Bar Section */}
      <section className="py-20 bg-surface-container-low">
        <div className="container mx-auto px-8">
          <div className="bg-white p-8 lg:p-12 editorial-shadow flex flex-col lg:flex-row gap-8 items-center justify-between">
            <div className="w-full lg:w-1/3">
              <h3 className="text-3xl text-primary mb-2">Refine Your Search</h3>
              <p className="text-sm text-on-surface-variant">Access our full curriculum of elite certifications.</p>
            </div>
            <div className="w-full lg:w-2/3 flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-grow w-full relative">
                <input 
                  type="text" 
                  placeholder="Search courses, skills, or programs..."
                  className="w-full border-b border-outline-variant focus:border-primary border-t-0 border-x-0 bg-transparent py-4 px-2 outline-none text-on-surface placeholder:text-outline transition-colors"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button className="premium-gradient text-white px-8 py-4 rounded text-xs font-bold tracking-[0.05em] uppercase whitespace-nowrap hover:opacity-90 transition-opacity">
                  Browse Programs
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Faculties */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div className="max-w-md">
              <h2 className="text-4xl text-primary mb-4">Academic Faculties</h2>
              <p className="text-on-surface-variant">Specialized tracks designed for professional mastery and institutional integration.</p>
            </div>
            <div className="h-[1px] flex-grow bg-outline-variant/20 hidden md:block ml-12"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-outline-variant/20 border border-outline-variant/20">
            {faculties.map((f, i) => (
              <div key={i} className="bg-surface p-8 group hover:bg-surface-container-lowest transition-all duration-500 cursor-pointer">
                <f.icon className="text-primary w-8 h-8 mb-6 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                <h3 className="text-xl text-primary mb-3">{f.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-6">{f.desc}</p>
                <div className="w-0 group-hover:w-full h-0.5 bg-primary transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Curriculum */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-8">
          <h2 className="text-4xl text-primary mb-16 text-center italic">Signature Curriculum</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(coursesList.length > 0 ? coursesList : courses).map((c, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-surface-container-lowest flex flex-col h-full editorial-shadow group overflow-hidden"
              >
                <div className="aspect-video relative overflow-hidden bg-surface-container-highest">
                  <img 
                    src={c.thumbnail || c.image} 
                    alt={c.title} 
                    className="w-full h-full object-cover grayscale-[0.3] group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold tracking-widest px-3 py-1 uppercase">
                    {c.tag}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl text-primary mb-2 leading-snug">{c.title}</h3>
                  <p className="text-xs text-on-surface-variant mb-6">{c.desc}</p>
                  <div className="mt-auto space-y-4">
                    <div className="flex justify-between text-[11px] font-bold tracking-widest uppercase text-on-surface-variant border-b border-outline-variant/10 pb-2">
                      <span className="text-primary font-bold">₹{c.price || 5000}</span>
                      <span>{c.duration}</span>
                      <span>{c.format}</span>
                    </div>
                    <div className="flex gap-2">
                        <button 
                          onClick={() => handleEnrollClick(c)}
                          className="flex-1 text-center py-3 bg-[#FE4323] text-white text-[10px] font-bold tracking-widest uppercase hover:bg-[#E03A1C] transition-all duration-300 active:scale-95 shadow-sm"
                        >
                          Enroll Now
                        </button>
                        <button className="flex-1 text-center py-3 border border-primary text-primary text-[10px] font-bold tracking-widest uppercase hover:bg-primary hover:text-white transition-all duration-300">
                          Learn More
                        </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Credential Suites */}
      <section className="py-24 bg-surface-container-low overflow-hidden">
        <div className="container mx-auto px-8 relative">
          <h2 className="text-4xl text-primary mb-2">Professional Credential Suites</h2>
          <p className="text-on-surface-variant mb-12 italic">Comprehensive paths for deep expertise.</p>
          <div className="flex flex-nowrap gap-8 overflow-x-auto pb-8 snap-x no-scrollbar">
            {credentials.map((cred, i) => (
              <div key={i} className="min-w-[320px] md:min-w-[400px] bg-white p-10 snap-center border-l-4 border-primary editorial-shadow">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary mb-6 block">Certification Track</span>
                <h3 className="text-2xl text-primary mb-4">{cred.title}</h3>
                <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">{cred.desc}</p>
                <div className="flex gap-12">
                  <div>
                    <span className="block text-[10px] uppercase text-outline font-bold tracking-widest mb-1">Volume</span>
                    <span className="text-sm font-medium">{cred.volume}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-outline font-bold tracking-widest mb-1">Effort</span>
                    <span className="text-sm font-medium">{cred.effort}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 bg-surface border-y border-outline-variant/10">
        <div className="container mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-16 mb-24">
            <div className="space-y-6">
              <span className="text-primary text-4xl font-serif">01.</span>
              <h3 className="text-2xl">Real-World Learning</h3>
              <p className="text-on-surface-variant leading-relaxed">No abstract theory. Every module is built with industry practitioners to solve today's market challenges.</p>
            </div>
            <div className="space-y-6">
              <span className="text-primary text-4xl font-serif">02.</span>
              <h3 className="text-2xl">Institutional Collaboration</h3>
              <p className="text-on-surface-variant leading-relaxed">We don't replace colleges; we empower them with cutting-edge curriculum and placement bridges.</p>
            </div>
            <div className="space-y-6">
              <span className="text-primary text-4xl font-serif">03.</span>
              <h3 className="text-2xl">Real Career Outcomes</h3>
              <p className="text-on-surface-variant leading-relaxed">Success is measured by employment and growth, not just certificates. Our model is purely outcome-driven.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-32 bg-primary text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://picsum.photos/seed/boardroom/1920/1080" 
            alt="Institutional background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="container mx-auto px-8 relative z-10 text-center max-w-4xl">
          <Quote className="w-16 h-16 mx-auto mb-8 text-white/30" />
          <blockquote className="text-3xl md:text-5xl leading-tight mb-12 italic">
            "Krutanic has redefined how our institution views career readiness. Their curriculum integration was seamless, and the impact on student employability was immediate."
          </blockquote>
          <div className="h-px w-24 bg-white/30 mx-auto mb-8"></div>
          <div className="font-bold tracking-widest uppercase text-xs">Dr. Alistair Vance</div>
          <div className="text-white/60 text-xs mt-2">Director of Digital Innovation</div>
        </div>
      </section>

      {/* Academic Insights */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-8">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-4xl text-primary">Academic Insights</h2>
            <a href="#" className="text-[11px] font-bold tracking-widest uppercase text-primary border-b border-primary pb-1 hover:opacity-70 transition-opacity">Read All Articles</a>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {insights.map((article, i) => (
              <article key={i} className="group cursor-pointer">
                <div className="aspect-[4/3] bg-surface-container-high mb-8 overflow-hidden editorial-shadow">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[0.5]"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-outline uppercase block mb-3">{article.date}</span>
                <h3 className="text-2xl text-primary mb-4 group-hover:text-primary/70 transition-colors">{article.title}</h3>
                <p className="text-sm text-on-surface-variant">{article.author}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* College Collaboration */}
      <section className="py-24 bg-surface-container-low">
        <div className="container mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src="https://picsum.photos/seed/collaboration/1000/1000" 
                alt="Collaboration" 
                className="w-full aspect-square object-cover rounded-sm editorial-shadow"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl text-primary mb-8 leading-tight">Empowering Institutions with the Chancellor Framework.</h2>
              <ul className="space-y-8 mb-12">
                <li className="flex gap-4 items-start">
                  <CheckCircle2 className="text-[#FE4323] w-6 h-6 mt-1" />
                  <div>
                    <h4 className="font-bold text-sm tracking-tight mb-1 uppercase">Value-Added Certification</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">Integrated credentials that complement existing degree pathways.</p>
                  </div>
                </li>
              </ul>
              <button className="premium-gradient text-white px-10 py-5 rounded text-xs font-bold tracking-[0.05em] uppercase hover:opacity-90 transition-opacity">
                Start a Collaboration
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-100 py-16 px-8 border-t border-stone-200">
         <div className="max-w-7xl mx-auto text-center">
          <p className="text-[10px] font-bold tracking-widest uppercase text-outline">© 2024 Krutanic. The Digital Chancellor Framework.</p>
        </div>
      </footer>

      {/* Enrollment Modal */}
      {selectedCourse && (
        <EnrollModal 
          isOpen={isEnrollModalOpen} 
          onClose={() => setIsEnrollModalOpen(false)} 
          course={selectedCourse} 
        />
      )}
    </div>
  );
}
