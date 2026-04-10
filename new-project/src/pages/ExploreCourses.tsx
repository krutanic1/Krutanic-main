import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Search, CheckCircle2, Clock3, Briefcase, Users, Calendar, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EnrollModal from '../components/EnrollModal';
import CourseDetailsModal from '../components/CourseDetailsModal';

const fallbackCourses = [
  { tag: 'TECH', title: 'Full Stack Web Development', desc: 'Build enterprise-grade applications from scratch.', duration: '24 WEEKS', format: 'COHORT-BASED', image: 'https://picsum.photos/seed/code/800/600' },
  { tag: 'DATA', title: 'Data Analytics for Decision Making', desc: 'Turn raw data into strategic business value.', duration: '12 WEEKS', format: 'ON-DEMAND', image: 'https://picsum.photos/seed/data/800/600' },
  { tag: 'AI', title: 'AI Essentials for Executives', desc: 'Navigate the landscape of machine learning and LLMs.', duration: '6 WEEKS', format: 'COHORT-BASED', image: 'https://picsum.photos/seed/ai/800/600' },
  { tag: 'GROWTH', title: 'Digital Marketing and Growth Strategy', desc: 'Advanced customer acquisition and retention tactics.', duration: '10 WEEKS', format: 'ON-DEMAND', image: 'https://picsum.photos/seed/marketing/800/600' },
];

const benefits = [
  {
    icon: Clock3,
    title: 'Flexible Learning Schedule',
    desc: 'Choose formats that fit your calendar, from cohort-based learning to self-paced modules.',
  },
  {
    icon: Briefcase,
    title: 'Career-Oriented Outcomes',
    desc: 'Programs are designed around real job roles, interview readiness, and practical skill delivery.',
  },
  {
    icon: Users,
    title: 'Mentorship and Community',
    desc: 'Learn with peers, get guided support, and build confidence through structured feedback.',
  },
];

const journey = [
  'Pick a program aligned with your goal and current level.',
  'Follow guided lessons with projects, quizzes, and mentorship checkpoints.',
  'Complete assessments and showcase your portfolio for placements or interviews.',
];

export default function ExploreCourses() {
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [upcomingCourses, setUpcomingCourses] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState<any>(null);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleEnrollClick = (course: any) => {
    setSelectedCourse(course);
    setIsEnrollModalOpen(true);
  };

  const handleLearnMoreClick = (course: any) => {
    setSelectedCourseDetails(course);
    setIsDetailsModalOpen(true);
  };

  const handleEnrollFromDetails = (course: any) => {
    setSelectedCourse(course);
    setIsEnrollModalOpen(true);
    setIsDetailsModalOpen(false);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [res, upcomingRes] = await Promise.all([
          axios.get('/microcourses/all'),
          axios.get('/microcourses/upcoming')
        ]);
        setCoursesList(res.data || []);
        setUpcomingCourses(upcomingRes.data || []);
      } catch (err) {
        console.error('Failed to fetch courses', err);
      }
    };

    fetchCourses();
  }, []);

  const courses = coursesList.length > 0 ? coursesList : fallbackCourses;

  const filteredCourses = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return courses;

    return courses.filter((course: any) => {
      const searchable = `${course.title || ''} ${course.desc || ''} ${course.tag || ''} ${course.duration || ''} ${course.format || ''}`.toLowerCase();
      return searchable.includes(normalized);
    });
  }, [courses, query]);

  return (
    <div className="min-h-screen bg-surface">
      <Header scrolled={true} />

      <section className="pt-32 pb-20 bg-surface">
        <div className="container mx-auto px-8">
          <h1 className="text-5xl lg:text-6xl text-primary mb-6">Explore Courses</h1>
          <p className="text-on-surface-variant max-w-2xl mb-10">Browse all available programs and find the right course for your learning and career goals.</p>
          <div className="mb-10">
            <Link
              to="/about-us#contact-us"
              className="inline-flex border border-primary text-primary px-6 py-3 text-xs font-bold tracking-[0.06em] uppercase hover:bg-primary hover:text-white transition-colors"
            >
              Contact Team
            </Link>
          </div>

          <div className="bg-white p-6 lg:p-8 editorial-shadow mb-12">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-full border-b border-outline-variant focus:border-primary border-t-0 border-x-0 bg-transparent py-4 px-2 outline-none text-on-surface placeholder:text-outline transition-colors"
              />
              <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            </div>
          </div>

          <div className="flex flex-col-reverse lg:flex-row gap-12">
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {filteredCourses.map((course: any, index: number) => (
              <motion.div
                key={course._id || index}
                whileHover={{ y: -10 }}
                className="bg-surface-container-lowest flex flex-col h-full editorial-shadow group overflow-hidden rounded-2xl"
              >
                <div className="aspect-video relative overflow-hidden bg-surface-container-highest">
                  <img
                    src={course.thumbnail || course.image}
                    alt={course.title}
                    className="w-full h-full object-cover grayscale-[0.3] group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold tracking-widest px-3 py-1 uppercase">
                    {course.tag || 'COURSE'}
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-xl text-primary leading-snug">{course.title}</h3>
                    {course.popular && (
                      <span className="shrink-0 bg-primary text-white text-[10px] font-bold tracking-widest px-3 py-1 uppercase rounded">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                      <span>{course.rating || 4.8}</span>
                      <Star size={10} fill="currentColor" strokeWidth={0} />
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant mb-4">{course.desc}</p>

                  <div className="mt-auto space-y-3">
                    <div className="flex justify-between text-[11px] font-bold tracking-widest uppercase text-on-surface-variant border-b border-outline-variant/10 pb-2">
                      <span>{course.duration}</span>
                      <span>{course.format}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEnrollClick(course)}
                        className="flex-1 text-center py-3 bg-primary text-white text-[10px] font-bold tracking-widest uppercase hover:bg-primary-container transition-all duration-300 active:scale-95 shadow-sm"
                      >
                        Enroll Now
                      </button>
                      <button
                        onClick={() => handleLearnMoreClick(course)}
                        className="flex-1 text-center py-3 border border-primary text-primary text-[10px] font-bold tracking-widest uppercase hover:bg-primary hover:text-white transition-all duration-300"
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

                {filteredCourses.length === 0 && (
                  <div className="md:col-span-2 bg-surface-container-low p-8 text-center border border-outline-variant/20">
                    <p className="text-primary text-lg mb-2">No matching courses found</p>
                    <p className="text-on-surface-variant text-sm">Try another keyword like AI, Data, Marketing, or Full Stack.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar content */}
            <div className="lg:w-80 shrink-0">
              <div className="bg-white p-6 editorial-shadow sticky top-28 border border-outline-variant/10">
                <div className="flex items-center gap-3 mb-6 border-b border-outline-variant/10 pb-4">
                  <Calendar className="text-primary w-5 h-5" />
                  <h3 className="text-xl text-primary font-bold">Upcoming Courses</h3>
                </div>
                
                <div className="space-y-4">
                  {upcomingCourses.length === 0 ? (
                    <p className="text-sm text-outline italic">No upcoming courses scheduled at the moment.</p>
                  ) : (
                    upcomingCourses.map((u, i) => (
                      <div key={u._id || i} className="relative group p-4 bg-surface-container-lowest border border-outline-variant/10 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default overflow-hidden rounded-xl">
                        <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                        <h4 className="relative z-10 text-sm font-bold text-primary group-hover:text-primary/90 transition-colors flex items-center justify-between mb-2">
                          <span className="pr-2">{u.courseName}</span>
                          <span className="opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-primary text-xs">→</span>
                        </h4>

                        <div className="relative z-10 flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-outline uppercase tracking-wider">
                            <Calendar size={12} className="text-primary/60" />
                            <span>Starts: {u.startDate || 'TBA'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-outline uppercase tracking-wider">
                            <Users size={12} className="text-primary/60" />
                            <span>{u.enrolledCount || 0}+ Enrolled</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="mt-8 pt-6 border-t border-outline-variant/10">
                  <p className="text-xs text-on-surface-variant leading-relaxed italic">
                    These topics are currently being developed with our industry partners. Stay tuned for early access announcements.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-20">
            <h2 className="text-3xl text-primary mb-8">Why Learn With Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benefits.map((item, index) => (
                <div key={index} className="bg-white p-6 editorial-shadow border border-outline-variant/10">
                  <item.icon className="w-6 h-6 text-primary mb-4" />
                  <h3 className="text-xl text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16 bg-white p-8 lg:p-10 editorial-shadow border border-outline-variant/10">
            <h2 className="text-3xl text-primary mb-6">Your Learning Journey</h2>
            <div className="space-y-4">
              {journey.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-on-surface-variant leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      {selectedCourse && (
        <EnrollModal
          isOpen={isEnrollModalOpen}
          onClose={() => setIsEnrollModalOpen(false)}
          course={selectedCourse}
        />
      )}

      {selectedCourseDetails && (
        <CourseDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onEnroll={handleEnrollFromDetails}
          course={selectedCourseDetails}
        />
      )}

      <Footer />
    </div>
  );
}
