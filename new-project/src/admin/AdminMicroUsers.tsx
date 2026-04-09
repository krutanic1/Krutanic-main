import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  Loader2, 
  Search,
  RefreshCw,
  BookOpen,
  Building2,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MicroUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  collegeId?: {
    collegeName: string;
  };
  enrolledCourses: Array<{
    _id: string;
    title: string;
  }>;
  createdAt: string;
}

export default function AdminMicroUsers() {
  const [users, setUsers] = useState<MicroUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 30;

  const fetchUsers = async () => {
    setRefreshing(true);
    try {
      const res = await axios.get('/admin/microusers', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm
        }
      });
      setUsers(res.data.users);
      setTotalPages(res.data.pagination.totalPages);
      setTotalItems(res.data.pagination.totalItems);
    } catch (err) {
      console.error('Failed to fetch micro users', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  // Handle search with page reset
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchUsers();
      } else {
        setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-serif text-primary mb-1 italic">Micro Student Roster</h1>
          <p className="text-[10px] text-outline uppercase tracking-[0.2em] font-bold">Manage students from all institutional partners</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, email or college..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-outline-variant/30 rounded-lg text-xs outline-none focus:border-primary transition-all w-80 shadow-sm font-sans"
            />
          </div>
          <button 
            onClick={fetchUsers}
            disabled={refreshing}
            className="p-2.5 bg-white border border-outline-variant/30 rounded-lg text-primary hover:bg-surface-container-low transition-all shadow-sm group"
            title="Refresh list"
          >
            <RefreshCw size={18} className={`${refreshing ? 'animate-spin' : 'group-active:rotate-180 transition-transform duration-500'}`} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl editorial-shadow overflow-hidden border border-outline-variant/10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-outline">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase">Loading records...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/10">
                  <th className="px-6 py-4 text-[10px] font-bold tracking-[0.2em] uppercase text-outline">Student Details</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-[0.2em] uppercase text-outline">Communication</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-[0.2em] uppercase text-outline">Institution</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-[0.2em] uppercase text-outline">Enrolled Courses</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-[0.2em] uppercase text-outline text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                <AnimatePresence>
                  {users.map((user) => (
                    <motion.tr 
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-surface-container-lowest transition-colors group"
                    >
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/5 text-primary rounded-full flex items-center justify-center shrink-0 border border-primary/10">
                            <span className="font-serif italic font-bold text-lg">{user.fullName.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-primary mb-0.5">{user.fullName}</div>
                            <div className="flex items-center gap-1.5 text-[9px] text-outline font-sans uppercase tracking-widest font-bold">
                              <User size={10} />
                              ID: {user._id.slice(-6).toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
                            <Mail size={12} className="text-outline" />
                            <a href={`mailto:${user.email}`} className="text-xs">{user.email}</a>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
                              <Phone size={12} className="text-outline" />
                              <a href={`tel:${user.phone}`} className="text-[11px] font-sans">{user.phone}</a>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-primary">
                          <Building2 size={14} className="text-outline" />
                          <span className="text-xs font-bold">{user.collegeId?.collegeName || 'Direct Enrollment'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-wrap gap-1.5 max-w-md">
                          {user.enrolledCourses.length > 0 ? (
                            user.enrolledCourses.map(course => (
                              <span key={course._id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-container-highest text-[9px] font-bold tracking-widest uppercase text-primary border border-outline-variant/20 rounded-md">
                                <BookOpen size={10} />
                                {course.title}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-outline italic">No active enrollments</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right font-sans">
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-2 text-outline">
                            <Calendar size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{formatDate(user.createdAt)}</span>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-24 text-center">
                      <div className="max-w-xs mx-auto text-outline">
                        <Users size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-xs font-bold tracking-widest uppercase mb-2">No Students Found</p>
                        <p className="text-[10px] leading-relaxed">Adjust your search or wait for new college enrollments.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-outline-variant/10 flex justify-between items-center bg-surface-container-low">
            <div className="text-[10px] font-bold tracking-widest uppercase text-outline">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
            </div>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1 || loading}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className={`px-4 py-2 rounded text-[10px] font-bold tracking-widest uppercase transition-all ${currentPage === 1 ? 'bg-stone-50 text-stone-300 cursor-not-allowed' : 'bg-white border border-outline-variant/30 text-primary hover:bg-primary hover:text-white shadow-sm'}`}
              >
                Previous
              </button>
              <div className="flex items-center px-4 font-mono text-xs text-primary">
                {currentPage} / {totalPages}
              </div>
              <button
                disabled={currentPage === totalPages || loading}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className={`px-4 py-2 rounded text-[10px] font-bold tracking-widest uppercase transition-all ${currentPage === totalPages ? 'bg-stone-50 text-stone-300 cursor-not-allowed' : 'bg-white border border-outline-variant/30 text-primary hover:bg-primary hover:text-white shadow-sm'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .editorial-shadow {
          box-shadow: 0px 4px 20px rgba(0, 45, 36, 0.04), 0px 12px 40px rgba(0, 45, 36, 0.08);
        }
      `}</style>
    </div>
  );
}
