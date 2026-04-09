import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Search, 
  Filter, 
  ExternalLink,
  Award,
  Calendar,
  Mail,
  User,
  GraduationCap
} from 'lucide-react';

export default function AdminCertificates() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 30;

  useEffect(() => {
    fetchRequests();
  }, [currentPage]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/admin/certs/pending', {
        params: {
          page: currentPage,
          limit: itemsPerPage
        }
      });
      setRequests(res.data.requests);
      setTotalPages(res.data.pagination.totalPages);
      setTotalItems(res.data.pagination.totalItems);
    } catch (err) {
      console.error('Failed to fetch requests', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setActionLoading(id);
    try {
      await axios.put(`/admin/certs/${action}/${id}`);
      setRequests(prev => prev.filter(r => r._id !== id));
      alert(`Certificate successfully ${action}d`);
    } catch (err) {
      alert('Failed to process request');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredRequests = requests.filter(r => 
    r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 lg:p-12 space-y-12 bg-slate-50 min-h-screen animate-in fade-in duration-700">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-slate-200 pb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <span className="px-4 py-1 bg-emerald-600 text-white text-[10px] font-bold tracking-[0.3em] uppercase rounded-full shadow-lg shadow-emerald-200">Management Portal</span>
          </div>
          <h1 className="text-5xl font-serif text-slate-800 mb-4">Certification Oversight</h1>
          <p className="text-slate-500 font-serif italic italic font-light flex items-center gap-4">
             <Award size={16} /> Review and validate "Early Excellence" graduation requests.
          </p>
        </div>

        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by Scholar or Course..." 
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="animate-spin text-emerald-600" size={48} />
          <p className="text-[10px] font-bold tracking-[0.4em] text-slate-400 uppercase">Fetching Credentials...</p>
        </div>
      ) : filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {filteredRequests.map((req) => (
            <div key={req._id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               
               <div className="flex flex-col md:flex-row gap-8 relative z-10">
                  {/* Student Avatar/Initial */}
                  <div className="size-20 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-serif text-3xl shadow-lg shadow-slate-200 shrink-0">
                    {req.fullName.charAt(0)}
                  </div>

                  <div className="flex-grow space-y-6">
                    <div>
                      <h3 className="text-2xl font-serif text-slate-800 mb-2">{req.fullName}</h3>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-400 font-medium">
                        <span className="flex items-center gap-1.5"><Mail size={12}/> {req.email}</span>
                        <span className="flex items-center gap-1.5"><Calendar size={12}/> Applied {new Date(req.applyDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
                      <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest text-emerald-600 uppercase mb-2">
                        <GraduationCap size={12}/> Intended Certification
                      </div>
                      <p className="text-slate-700 font-serif text-lg leading-snug">{req.courseTitle}</p>
                      <p className="text-[10px] text-slate-400 mt-2">Enrolled on: {new Date(req.enrollDate).toLocaleDateString()}</p>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                       <button 
                        onClick={() => handleAction(req._id, 'approve')}
                        disabled={!!actionLoading}
                        className="flex-grow bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                       >
                         {actionLoading === req._id ? <Loader2 className="animate-spin" size={14}/> : <CheckCircle size={14}/>}
                         Authorize Issuance
                       </button>
                       <button 
                        onClick={() => handleAction(req._id, 'reject')}
                        disabled={!!actionLoading}
                        className="px-6 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 py-4 rounded-2xl font-bold transition-all border border-slate-100 hover:border-rose-100 flex items-center justify-center gap-2 disabled:opacity-50"
                       >
                         <XCircle size={14}/> Reject
                       </button>
                    </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 opacity-60">
           <Award size={64} className="mx-auto text-slate-200 mb-8" />
           <h2 className="text-3xl font-serif text-slate-400 mb-2">No Credentials Pending</h2>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">The repository is currently synchronized.</p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 p-8 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} Entries
          </div>
          <div className="flex items-center gap-4">
            <button
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className={`px-8 py-4 rounded-2xl text-[10px] font-bold tracking-widest uppercase transition-all shadow-sm ${currentPage === 1 ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50'}`}
            >
              Previous
            </button>
            <div className="text-xl font-serif text-slate-800 px-4">
              {currentPage} <span className="text-slate-300 mx-2">/</span> {totalPages}
            </div>
            <button
              disabled={currentPage === totalPages || loading}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className={`px-8 py-4 rounded-2xl text-[10px] font-bold tracking-widest uppercase transition-all shadow-sm ${currentPage === totalPages ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50'}`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
