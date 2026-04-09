import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Calendar, User, ArrowRight, MessageCircle, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const feedbackList = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Data Analyst, TechCorp',
    feedback: 'The internship program at Dikshannt transformed my career trajectory. I went from struggling with SQL to landing a high-paying analytics role in just 6 months.',
    rating: 4,
    image: 'https://picsum.photos/seed/priya/100/100',
  },
  {
    id: 2,
    name: 'Arjun Patel',
    role: 'Marketing Manager, StartupHub',
    feedback: 'Exceptional workshop experience. The practical projects gave me real-world exposure that my college degree never provided. Highly recommend to anyone serious about their career.',
    rating: 5,
    image: 'https://picsum.photos/seed/arjun/100/100',
  },
  {
    id: 3,
    name: 'Neha Verma',
    role: 'Product Manager, Innovation Labs',
    feedback: 'The structured learning path and industry-relevant curriculum are unmatched. I applied the knowledge immediately at my job and got promoted within 4 months.',
    rating: 4,
    image: 'https://picsum.photos/seed/neha/100/100',
  },
  {
    id: 4,
    name: 'Rohit Kumar',
    role: 'Full Stack Developer, CloudSoft',
    feedback: 'Best decision I made for my career. The mentorship, peer learning, and project-based approach accelerated my learning significantly.',
    rating: 5,
    image: 'https://picsum.photos/seed/rohit/100/100',
  },
];

const blogPosts = [
  {
    id: 1,
    title: 'How Internships Shape Your Career Trajectory',
    excerpt: 'Discover why structured internship programs are the bridge between academic knowledge and industry readiness. Learn how hands-on experience accelerates career growth.',
    content: 'Internships are more than just work experience—they are transformative opportunities that bridge the gap between theoretical knowledge and practical industry skills. In today\'s competitive job market, employers increasingly value hands-on experience alongside academic credentials.\n\nStructured internship programs provide learners with real-world exposure to their chosen fields, allowing them to apply classroom concepts to tangible projects. This practical experience builds confidence, creates portfolio-ready work, and develops professional networks that can last throughout a career.\n\nThe benefits extend beyond immediate skill acquisition. Internships help individuals develop soft skills such as communication, teamwork, and problem-solving—qualities that are equally valued by employers. Moreover, successfully completed internships often lead to full-time job offers, making them a critical stepping stone in the journey from education to employment.\n\nBy choosing structured, industry-aligned internship programs, learners significantly increase their chances of landing their dream roles and accelerating their career growth.',
    author: 'Dr. Aisha Malhotra',
    date: 'March 15, 2026',
    readTime: '6 min read',
    category: 'Career Development',
    image: 'https://picsum.photos/seed/career/800/400',
  },
  {
    id: 2,
    title: 'The Future of Workplace Skills: What Companies Actually Need',
    excerpt: 'Explore the latest industry trends and discover which skills employers prioritize most. A data-driven guide to staying relevant in 2026 and beyond.',
    content: 'The workplace is evolving rapidly, and the skills companies need today are vastly different from those in demand even five years ago. According to recent industry surveys, the top skills employers are seeking include AI literacy, data analysis, digital marketing, and adaptive learning ability.\n\nBeyond technical skills, companies increasingly prioritize soft skills like emotional intelligence, communication, and agility. The ability to adapt to rapidly changing technologies and work environments is now as valuable as domain expertise.\n\nThis shift has important implications for career development strategies. Rather than focusing solely on deep expertise in a single area, professionals are now advised to develop a portfolio of complementary skills. Continuous learning has transitioned from a nice-to-have to an essential career requirement.\n\nOrganizations like Dikshannt recognize this shift and are restructuring their programs to address these emerging skill gaps. By combining technical workshops with leadership and soft skills training, learners can position themselves as valuable assets in any organization, ensuring long-term career stability and growth.',
    author: 'Rahul Deshmukh',
    date: 'March 10, 2026',
    readTime: '8 min read',
    category: 'Industry Insights',
    image: 'https://picsum.photos/seed/skills/800/400',
  },
  {
    id: 3,
    title: 'From Student to Professional: A Workshop Success Story',
    excerpt: 'Real testimonials from learners who transformed their careers through intensive workshop programs. Inspiration and practical lessons for aspiring professionals.',
    content: 'Workshop programs have proven to be game-changers for thousands of learners making the transition from student to professional. Unlike traditional education, intensive workshops compress years of practical experience into weeks or months, accelerating the learning curve dramatically.\n\nThe success lies in the program design: small cohorts, experienced mentors, real-world projects, and peer learning create an environment where growth is inevitable. Participants don\'t just learn theoretical concepts—they ship real products, solve actual business problems, and build networks with peers and industry professionals.\n\nMany of our learners report significant career improvements within months of completing workshops. Some have landed roles at top companies, while others have successfully launched their own ventures. The common thread: they gained confidence, built portfolios, and made meaningful professional connections.\n\nThese success stories aren\'t statistical anomalies—they represent the transformative power of well-designed, industry-aligned learning programs. If you\'re at a crossroads in your career, considering a field shift, or wanting to accelerate growth, workshop programs offer a proven pathway to success.',
    author: 'Priya Mishra',
    date: 'February 28, 2026',
    readTime: '7 min read',
    category: 'Success Stories',
    image: 'https://picsum.photos/seed/success/800/400',
  },
  {
    id: 4,
    title: 'Building a Culture of Continuous Learning in Organizations',
    excerpt: 'Why modern companies invest in employee upskilling. Learn frameworks for implementing internship and workshop programs at scale in your organization.',
    content: 'Forward-thinking organizations recognize that their competitive advantage lies not in their current capabilities, but in their ability to adapt and learn. This has led to a fundamental shift: companies are now investing heavily in employee development through structured internship and workshop programs.\n\nThe business case is compelling. Companies that prioritize continuous learning report higher employee retention, increased productivity, and faster innovation cycles. Employees who feel invested in show greater engagement and loyalty, reducing costly turnover.\n\nImplementing these programs at scale requires a strategic approach. Start by identifying skill gaps that matter most to business objectives. Design programs that are flexible, accessible, and aligned with company values. Measure impact through both employee feedback and business metrics.\n\nLeading companies like Google, Netflix, and Microsoft have built entire learning ecosystems where employees regularly engage in workshops, internships, and cross-functional projects. This culture of learning has become a key differentiator in talent attraction and retention.\n\nIf you\'re building organizational learning initiatives, focus on creating psychological safety, providing mentorship, and celebrating learning outcomes. The organizations that master this will lead their industries.',
    author: 'Vikram Reddy',
    date: 'February 20, 2026',
    readTime: '9 min read',
    category: 'Business Strategy',
    image: 'https://picsum.photos/seed/learning/800/400',
  },
];

export default function Insights() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);

  const categories = Array.from(
    new Set(blogPosts.map((post) => post.category))
  );

  const filteredBlogs = selectedCategory
    ? blogPosts.filter((post) => post.category === selectedCategory)
    : blogPosts;

  return (
    <div className="min-h-screen bg-surface">
      <Header scrolled={true} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-surface">
        <div className="container mx-auto px-8">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-outline mb-4">
            Insights & Community
          </p>
          <h1 className="text-5xl lg:text-6xl text-primary leading-tight max-w-5xl mb-6">
            Stories, Insights, and Industry Trends
          </h1>
          <p className="text-on-surface-variant max-w-3xl text-lg leading-relaxed">
            Explore success stories from our learners, stay updated with the latest career and industry insights, and join
            a community of professionals committed to continuous growth.
          </p>
        </div>
      </section>

      {/* Feedback/Testimonials Section */}
      <section className="pb-24 bg-surface">
        <div className="container mx-auto px-8">
          <div className="mb-16">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-outline mb-4">Learner Feedback</p>
            <h2 className="text-4xl text-primary mb-4">What Our Learners Say</h2>
            <p className="text-on-surface-variant max-w-2xl">
              Real stories from professionals who transformed their careers through our internship and workshop programs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {feedbackList.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 editorial-shadow border border-outline-variant/10 hover:shadow-lg transition-all duration-300"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-500 text-amber-500" />
                  ))}
                </div>

                {/* Feedback Text */}
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">{item.feedback}</p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm text-primary font-bold">{item.name}</h4>
                    <p className="text-[10px] text-on-surface-variant">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blogs Section */}
      <section className="pb-24 bg-surface-container-low">
        <div className="container mx-auto px-8">
          <div className="mb-16">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-outline mb-4">Blogs & Articles</p>
            <h2 className="text-4xl text-primary mb-4">Latest Articles</h2>
            <p className="text-on-surface-variant max-w-2xl mb-8">
              Industry trends, career tips, and thought leadership from our community.
            </p>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 text-xs font-bold tracking-[0.06em] uppercase transition-all ${
                  selectedCategory === null
                    ? 'bg-primary text-white'
                    : 'bg-white border border-outline-variant text-on-surface-variant hover:bg-surface-container-highest'
                }`}
              >
                All Articles
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-xs font-bold tracking-[0.06em] uppercase transition-all ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-white border border-outline-variant text-on-surface-variant hover:bg-surface-container-highest'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredBlogs.map((post) => (
              <article
                key={post.id}
                onClick={() => setSelectedBlog(post)}
                className="bg-white overflow-hidden border border-outline-variant/10 editorial-shadow hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                {/* Blog Image */}
                <div className="aspect-video relative overflow-hidden bg-surface-container-highest">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold tracking-widest px-3 py-1 uppercase">
                    {post.category}
                  </div>
                </div>

                {/* Blog Content */}
                <div className="p-6">
                  <h3 className="text-xl text-primary mb-3 leading-snug group-hover:text-primary-container transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-on-surface-variant text-sm mb-4 line-clamp-2">{post.excerpt}</p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-[10px] text-on-surface-variant mb-4 pb-4 border-b border-outline-variant/10">
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{post.date}</span>
                    </div>
                  </div>

                  {/* Read More CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase">
                      {post.readTime}
                    </span>
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase group-hover:gap-3 transition-all">
                      Read More
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredBlogs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-on-surface-variant text-lg">No articles found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Community CTA */}
      <section className="pb-24 bg-surface">
        <div className="container mx-auto px-8">
          <div className="bg-primary text-white p-8 md:p-12 editorial-shadow flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-white/70 text-xs font-bold tracking-[0.12em] uppercase mb-2">
                <MessageCircle className="w-4 h-4" />
                Share Your Story
              </div>
              <h3 className="text-3xl">Have feedback or a success story to share?</h3>
            </div>
            <button
              onClick={() => navigate('/about-us#contact-us')}
              className="bg-white text-primary px-8 py-3 text-xs font-bold tracking-[0.06em] uppercase hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Get In Touch
            </button>
          </div>
        </div>
      </section>

      {/* Blog Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-lg editorial-shadow">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-outline-variant/10 p-6 flex items-center justify-between">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 text-primary text-xs font-bold tracking-[0.08em] uppercase mb-2">
                  <span className="px-3 py-1 bg-primary text-white">{selectedBlog.category}</span>
                </div>
                <h2 className="text-3xl text-primary">{selectedBlog.title}</h2>
              </div>
              <button
                onClick={() => setSelectedBlog(null)}
                className="p-2 hover:bg-surface-container-high transition-colors flex-shrink-0"
              >
                <X size={24} className="text-on-surface-variant" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Featured Image */}
              <img
                src={selectedBlog.image}
                alt={selectedBlog.title}
                className="w-full aspect-video object-cover mb-8 rounded"
                referrerPolicy="no-referrer"
              />

              {/* Author & Meta */}
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-outline-variant/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary">{selectedBlog.author}</p>
                    <p className="text-xs text-on-surface-variant">Author</p>
                  </div>
                </div>
                <div className="border-l border-outline-variant/20 pl-6">
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-1">
                    <Calendar size={14} />
                    <span>{selectedBlog.date}</span>
                  </div>
                  <div className="text-xs text-on-surface-variant">{selectedBlog.readTime}</div>
                </div>
              </div>

              {/* Blog Content */}
              <div className="prose prose-sm max-w-none">
                {selectedBlog.content.split('\n\n').map((paragraph: string, index: number) => (
                  <p key={index} className="text-on-surface-variant leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Modal Footer CTA */}
              <div className="mt-12 pt-8 border-t border-outline-variant/10">
                <div className="bg-surface-container-low p-6 rounded">
                  <p className="text-sm text-on-surface-variant mb-4">
                    Interested in our internship and workshop programs? Join thousands of learners transforming their careers.
                  </p>
                  <button
                    onClick={() => navigate('/explore-courses')}
                    className="premium-gradient text-white px-6 py-3 text-xs font-bold tracking-[0.06em] uppercase hover:opacity-90 transition-opacity"
                  >
                    Explore Programs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
