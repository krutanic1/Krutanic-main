import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../Components/Footer';
import Header from '../../Components/Header';

const img1 = "/posters/post.jpeg";

const blogs = [
  {
    id: 1,
    title: "Data Analytics for Small Business Owners: Complete 2026 Guide",
    slug: "data-analytics-for-small-business-owners",
    description: "Learn how data analytics and business intelligence can transform your small business operations, from tracking KPIs to forecasting growth and making smarter, data-driven decisions.",
    image: img1,
    author: "Chirantan Dutta Banik",
    date: "August 26, 2026"
  }
];

const BlogList = () => {
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">Insights & Resources</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">Discover expert articles, guides, and best practices to accelerate your career and business growth.</p>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
           <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" alt="pattern" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map(blog => (
              <div key={blog.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col">
                <div className="relative h-56 overflow-hidden">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                  {/* <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#F15B29] uppercase tracking-wider">Business Intelligence</div> */}
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight hover:text-[#F15B29] transition-colors">{blog.title}</h2>
                  <div className="flex items-center text-xs text-gray-500 font-medium mb-4 space-x-2">
                    <span>{blog.author}</span>
                    <span>•</span>
                    <span>{blog.date}</span>
                  </div>
                  <p className="text-gray-600 mb-6 flex-grow line-clamp-3">{blog.description}</p>
                  <Link to={`/blog/${blog.slug}`} className="inline-flex items-center text-[#F15B29] font-bold hover:text-[#d84e20] transition-colors group">
                    Read the Full Guide 
                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogList;
