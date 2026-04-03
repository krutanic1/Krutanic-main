import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle2, XCircle, Clock, Search, Filter, Mail, CreditCard, ChevronRight, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminEnrolls() {
  const [enrolls, setEnrolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEnrolls = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/admin/microcourses/enrolls?status=${filter}`);
      setEnrolls(res.data);
    } catch (err) {
      console.error('Failed to fetch enrolls', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolls();
  }, [filter]);

  const verifyEnroll = async (id: string, status: 'accepted' | 'rejected') => {
    if (!window.confirm(`Are you sure you want to ${status} this enrollment?`)) return;
    try {
      await axios.patch(`/admin/microcourses/enroll/${id}/verify`, { status });
      fetchEnrolls();
    } catch (err) {
      alert('Failed to update enrollment');
    }
  };

  const sendCredentials = async (id: string) => {
    setLoading(true);
    try {
      await axios.post(`/admin/microcourses/send-credentials/${id}`);
      alert('Credentials sent successfully!');
      fetchEnrolls();
    } catch (err) {
      alert('Failed to send credentials');
    } finally {
      setLoading(false);
    }
  };

  const filteredEnrolls = enrolls.filter(e => 
    e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl text-primary mb-2">MicroCourse Enrolls</h1>
          <p className="text-on-surface-variant italic">Manage student enrollment requests and verify payments.</p>
        </div>
        
        <div className="flex gap-4">
          {['pending', 'accepted', 'rejected'].map((s) => (
            <button 
              key={s}
              onClick={() => setFilter(s)}
              className={`px-6 py-2 rounded text-[10px] font-bold tracking-widest uppercase transition-all ${filter === s ? 'bg-primary text-white' : 'bg-surface-container-low text-outline hover:text-primary'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface editorial-shadow overflow-hidden">
        <div className="p-6 border-b border-outline-variant/10 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email, or transaction ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low rounded-sm outline-none focus:ring-1 ring-primary/20 transition-all text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/10">
                <th className="p-4 text-left text-[10px] font-bold tracking-widest uppercase text-outline">Student</th>
                <th className="p-4 text-left text-[10px] font-bold tracking-widest uppercase text-outline">Course</th>
                <th className="p-4 text-left text-[10px] font-bold tracking-widest uppercase text-outline">Transaction ID</th>
                <th className="p-4 text-left text-[10px] font-bold tracking-widest uppercase text-outline">Amount</th>
                <th className="p-4 text-left text-[10px] font-bold tracking-widest uppercase text-outline">Status</th>
                <th className="p-4 text-center text-[10px] font-bold tracking-widest uppercase text-outline">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {loading ? (
                <tr><td colSpan={6} className="p-20 text-center text-outline italic">Loading applications...</td></tr>
              ) : filteredEnrolls.length === 0 ? (
                <tr><td colSpan={6} className="p-20 text-center text-outline italic">No matching enrollments found.</td></tr>
              ) : filteredEnrolls.map((e) => (
                <motion.tr 
                  layout
                  key={e._id} 
                  className="group hover:bg-surface-container-lowest transition-colors"
                >
                  <td className="p-4">
                    <div className="font-bold text-primary">{e.fullName}</div>
                    <div className="text-[10px] text-outline tracking-wider flex items-center gap-1 mt-1 uppercase">
                      <Mail size={10} /> {e.email}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-serif italic text-primary">{e.courseName}</span>
                    {e.referralCode && (
                       <div className="text-[9px] text-green-600 font-bold mt-1 uppercase tracking-tighter">Code: {e.referralCode}</div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 font-mono text-xs text-primary">
                      <CreditCard size={12} className="text-outline" />
                      {e.transactionId || <span className="text-outline italic">Not submitted</span>}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-primary">₹{e.amount}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase flex items-center w-fit gap-1.5 ${
                      e.status === 'accepted' ? 'bg-green-100 text-green-600' : 
                      e.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {e.status === 'pending' && <Clock size={10} />}
                      {e.status === 'accepted' && <CheckCircle2 size={10} />}
                      {e.status === 'rejected' && <XCircle size={10} />}
                      {e.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {e.status === 'pending' ? (
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => verifyEnroll(e._id, 'accepted')}
                          className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors shadow-sm"
                          title="Accept"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button 
                          onClick={() => verifyEnroll(e._id, 'rejected')}
                          className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-sm"
                          title="Reject"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ) : (
                    <div className="flex justify-center flex-col items-center gap-2">
                      <span className="text-[10px] text-outline italic">Verified on {new Date(e.updatedAt).toLocaleDateString()}</span>
                      {e.status === 'accepted' && (
                        <button 
                          onClick={() => sendCredentials(e._id)}
                          disabled={loading}
                          className={`mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded text-[9px] font-bold tracking-widest uppercase transition-all ${e.credentialsSent ? 'bg-stone-50 text-stone-400 border border-stone-100 cursor-default' : 'bg-primary/5 text-primary border border-primary/10 hover:bg-primary hover:text-white'}`}
                        >
                          {loading ? <Loader2 size={10} className="animate-spin" /> : <Send size={10} />}
                          {e.credentialsSent ? 'Resend Access' : 'Send Credentials'}
                        </button>
                      )}
                    </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
