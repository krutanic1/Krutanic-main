import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Mail,
  Phone,
  User,
  Calendar,
  Loader2,
  Search,
  RefreshCw,
  BookOpen,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StudentRequest {
  _id: string;
  name: string;
  mobile: string;
  email: string;
  domainInterested: string;
  status: string;
  createdAt: string;
}

export default function AdminStudentRequests() {
  const [requests, setRequests] = useState<StudentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 30;

  const fetchRequests = async () => {
    setRefreshing(true);
    try {
      const res = await axios.get('/student-requests/all', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
        },
      });

      setRequests(res.data.requests || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setTotalItems(res.data.pagination?.totalItems || 0);
    } catch (err) {
      console.error('Failed to fetch student requests', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentPage]);

  const filteredRequests = requests.filter((req) => {
    const q = searchTerm.toLowerCase();
    return (
      req.name.toLowerCase().includes(q) ||
      req.email.toLowerCase().includes(q) ||
      req.mobile.toLowerCase().includes(q) ||
      req.domainInterested.toLowerCase().includes(q)
    );
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-serif text-primary mb-1">Student Requests</h1>
          <p className="text-xs text-outline uppercase tracking-widest font-bold">
            Manage inquiry form submissions from students
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={16} />
            <input
              type="text"
              placeholder="Search student requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-outline-variant/30 rounded-lg text-xs outline-none focus:border-primary transition-all w-64 shadow-sm"
            />
          </div>
          <button
            onClick={() => {
              setRefreshing(true);
              fetchRequests();
            }}
            disabled={refreshing}
            className="p-2.5 bg-white border border-outline-variant/30 rounded-lg text-primary hover:bg-surface-container-low transition-all shadow-sm group"
          >
            <RefreshCw
              size={18}
              className={`${refreshing ? 'animate-spin' : 'group-active:rotate-180 transition-transform duration-500'}`}
            />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl editorial-shadow overflow-hidden border border-outline-variant/10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-outline">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="text-xs font-bold tracking-widest uppercase">Loading requests...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/10">
                  <th className="px-6 py-4 text-[10px] font-bold tracking-[0.2em] uppercase text-outline">Student</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-[0.2em] uppercase text-outline">Communication</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-[0.2em] uppercase text-outline">Interested Workshop</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-[0.2em] uppercase text-outline">Date Received</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-[0.2em] uppercase text-outline text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                <AnimatePresence>
                  {filteredRequests.map((req) => (
                    <motion.tr
                      key={req._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-surface-container-lowest transition-colors group"
                    >
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center shrink-0">
                            <User size={18} />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-primary mb-0.5">{req.name}</div>
                            <div className="text-[10px] text-outline font-sans uppercase tracking-widest">Student Inquiry</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
                            <Mail size={12} className="text-outline" />
                            <a href={`mailto:${req.email}`} className="text-xs underline-offset-4 hover:underline">
                              {req.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
                            <Phone size={12} className="text-outline" />
                            <a href={`tel:${req.mobile}`} className="text-xs">
                              {req.mobile}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="inline-flex items-center gap-2 text-on-surface-variant">
                          <BookOpen size={14} className="text-outline" />
                          <span className="text-xs font-medium">{req.domainInterested}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-outline">
                          <Calendar size={14} />
                          <span className="text-xs">{formatDate(req.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-low text-[10px] font-bold tracking-widest uppercase text-primary border border-outline-variant/20 rounded-full">
                          <Clock size={10} />
                          {req.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>

                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-24 text-center">
                      <div className="max-w-xs mx-auto text-outline">
                        <User size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-xs font-bold tracking-widest uppercase mb-2">No Student Requests Found</p>
                        <p className="text-[10px] leading-relaxed">Inquiry form submissions will appear here.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-6 border-t border-outline-variant/10 flex justify-between items-center bg-surface-container-low">
            <div className="text-[10px] font-bold tracking-widest uppercase text-outline">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
            </div>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1 || loading}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className={`px-4 py-2 rounded text-[10px] font-bold tracking-widest uppercase transition-all ${
                  currentPage === 1
                    ? 'bg-stone-50 text-stone-300 cursor-not-allowed'
                    : 'bg-white border border-outline-variant/30 text-primary hover:bg-primary hover:text-white shadow-sm'
                }`}
              >
                Previous
              </button>
              <div className="flex items-center px-4 font-mono text-xs text-primary">
                {currentPage} / {totalPages}
              </div>
              <button
                disabled={currentPage === totalPages || loading}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className={`px-4 py-2 rounded text-[10px] font-bold tracking-widest uppercase transition-all ${
                  currentPage === totalPages
                    ? 'bg-stone-50 text-stone-300 cursor-not-allowed'
                    : 'bg-white border border-outline-variant/30 text-primary hover:bg-primary hover:text-white shadow-sm'
                }`}
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
