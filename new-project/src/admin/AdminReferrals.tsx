import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Ticket, Users, BarChart3, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminReferrals() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newReferral, setNewReferral] = useState({
    code: '',
    discountPercentage: 40,
    usageLimit: 100
  });

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/admin/microcourses/referrals');
      setReferrals(res.data);
    } catch (err) {
      console.error('Failed to fetch referrals', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const createReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/admin/microcourses/referrals', newReferral);
      setIsFormOpen(false);
      setNewReferral({ code: '', discountPercentage: 40, usageLimit: 100 });
      fetchReferrals();
    } catch (err) {
      alert('Failed to create referral code');
    } finally {
      setLoading(false);
    }
  };

  const deleteReferral = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this referral code?')) return;
    try {
      await axios.delete(`/admin/microcourses/referrals/${id}`);
      fetchReferrals();
    } catch (err) {
      alert('Failed to delete referral code');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl text-primary mb-2">Referral Management</h1>
          <p className="text-on-surface-variant italic font-light">Generate and track referral codes for the MicroCourses.</p>
        </div>
        
        <button 
          onClick={() => setIsFormOpen(true)}
          className="premium-gradient text-white px-8 py-3 rounded text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 hover:opacity-90 shadow-lg active:scale-95 transition-all"
        >
          <Plus size={16} /> New Code
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {loading && referrals.length === 0 ? (
            <div className="col-span-full h-40 flex items-center justify-center text-outline italic">
              <Loader2 className="animate-spin mr-2" size={20} /> Loading referrals...
            </div>
          ) : referrals.length === 0 ? (
            <div className="col-span-full h-40 flex items-center justify-center text-outline italic border-2 border-dashed border-outline-variant/30 rounded-lg">
              No referral codes yet. Create your first one!
            </div>
          ) : referrals.map((r) => (
            <motion.div 
              key={r._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface editorial-shadow p-8 flex flex-col justify-between border-l-4 border-primary group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                  <Ticket size={24} />
                </div>
                <button 
                  onClick={() => deleteReferral(r._id)}
                  className="text-outline hover:text-red-500 transition-colors p-2 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div>
                <h3 className="text-3xl font-mono text-primary mb-2 uppercase tracking-tighter">{r.code}</h3>
                <p className="text-[10px] font-bold tracking-[0.2em] text-outline uppercase mb-8">{r.discountPercentage}% Discount</p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-outline flex items-center gap-2 uppercase tracking-widest"><Users size={12} /> Usage</span>
                    <span className="font-bold text-primary">{r.usedCount} / {r.usageLimit}</span>
                  </div>
                  <div className="w-full bg-surface-container-low h-1 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(r.usedCount / r.usageLimit) * 100}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-outline-variant/10 flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                <BarChart3 size={14} className="text-primary" />
                {r.usageLimit - r.usedCount} redemptions left
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Create Referral Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface w-full max-w-md p-8 editorial-shadow relative"
            >
              <button onClick={() => setIsFormOpen(false)} className="absolute right-6 top-6 text-outline hover:text-primary transition-colors">
                <X size={20} />
              </button>

              <h2 className="text-3xl text-primary mb-2">New Referral Code</h2>
              <p className="text-[10px] uppercase tracking-widest text-outline mb-8 italic">Define a new discount code for students.</p>

              <form onSubmit={createReferral} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Referral Code*</label>
                  <input 
                    required 
                    value={newReferral.code}
                    onChange={(e) => setNewReferral({...newReferral, code: e.target.value})}
                    placeholder="e.g. KRUTANIC40"
                    className="w-full border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors bg-transparent uppercase font-mono text-xl text-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Discount Percentage (%)</label>
                  <input 
                    type="number" 
                    required
                    value={newReferral.discountPercentage}
                    onChange={(e) => setNewReferral({...newReferral, discountPercentage: parseInt(e.target.value)})}
                    className="w-full border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors bg-transparent font-bold text-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Usage Limit</label>
                  <input 
                    type="number" 
                    required
                    value={newReferral.usageLimit}
                    onChange={(e) => setNewReferral({...newReferral, usageLimit: parseInt(e.target.value)})}
                    className="w-full border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors bg-transparent font-bold text-primary"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FE4323] text-white py-4 rounded text-xs font-bold tracking-widest uppercase hover:bg-[#E03A1C] transition-all shadow-md active:scale-95 disabled:opacity-50 mt-4"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : 'Create Referral Code'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
