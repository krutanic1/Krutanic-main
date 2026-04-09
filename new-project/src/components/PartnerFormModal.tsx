import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, User, Mail, Phone, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import axios from 'axios';

interface PartnerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PartnerFormModal({ isOpen, onClose }: PartnerFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    collegeName: '',
    contactName: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.collegeName || !formData.contactName || !formData.email || !formData.phone) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/partner/submit', formData);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-surface w-full max-w-xl overflow-y-auto max-h-[90vh] md:overflow-hidden editorial-shadow flex flex-col md:flex-row rounded-3xl"
      >
        {/* Sidebar Info */}
        <div className="bg-primary p-8 md:w-1/3 text-white flex flex-col justify-between shrink-0">
          <div>
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 mb-2">Partnership</div>
            <h2 className="text-2xl font-serif leading-tight mb-6 italic">Collaborate With Dikshannt</h2>
            
            <div className="space-y-6 mt-8">
              <div className="flex items-start gap-3 text-[10px] tracking-widest uppercase opacity-80">
                <CheckCircle2 size={16} className="text-white shrink-0" />
                <span>Integrated Curriculum</span>
              </div>
              <div className="flex items-start gap-3 text-[10px] tracking-widest uppercase opacity-80">
                <CheckCircle2 size={16} className="text-white shrink-0" />
                <span>Placement Bridges</span>
              </div>
              <div className="flex items-start gap-3 text-[10px] tracking-widest uppercase opacity-80">
                <CheckCircle2 size={16} className="text-white shrink-0" />
                <span>Expert Mentorship</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10 italic text-xs text-white/60">
            Join 50+ partner institutions in redefining career readiness.
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-8 relative flex flex-col">
          <button onClick={onClose} className="absolute right-6 top-6 text-outline hover:text-primary transition-colors p-2 z-20">
            <X size={20} />
          </button>

          <div className="flex-grow flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl text-primary font-serif mb-2">Institution Details</h3>
                  <p className="text-xs text-on-surface-variant mb-8">Please fill in the information below and our institutional partnership team will contact you shortly.</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-outline flex items-center gap-2">
                        <Building2 size={12} />
                        College / Institute Name
                      </label>
                      <input 
                        name="collegeName" 
                        value={formData.collegeName} 
                        onChange={handleInputChange} 
                        className="w-full border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors bg-transparent text-sm" 
                        placeholder="Enter full name of the institute" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-outline flex items-center gap-2">
                        <User size={12} />
                        Contact Person Name
                      </label>
                      <input 
                        name="contactName" 
                        value={formData.contactName} 
                        onChange={handleInputChange} 
                        className="w-full border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors bg-transparent text-sm" 
                        placeholder="e.g. Dean, Placement Officer" 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-outline flex items-center gap-2">
                          <Mail size={12} />
                          Work Email
                        </label>
                        <input 
                          name="email" 
                          type="email"
                          value={formData.email} 
                          onChange={handleInputChange} 
                          className="w-full border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors bg-transparent text-sm" 
                          placeholder="email@college.edu" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-outline flex items-center gap-2">
                          <Phone size={12} />
                          Mobile Number
                        </label>
                        <input 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleInputChange} 
                          className="w-full border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors bg-transparent text-sm" 
                          placeholder="+91 XXXX XXX XXX" 
                        />
                      </div>
                    </div>

                    {error && <p className="text-red-500 text-[10px] font-bold mt-4">{error}</p>}

                    <div className="pt-6">
                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-4 rounded text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-primary-container transition-all active:scale-95 shadow-md shadow-primary/10"
                      >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : 'Submit Inquiry'}
                        {!loading && <ArrowRight size={16} />}
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div 
                   key="success"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="text-center py-12 space-y-6"
                >
                  <div className="w-20 h-20 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-3xl text-primary font-serif leading-tight">Thank You!</h3>
                  <p className="text-sm text-on-surface-variant max-w-xs mx-auto leading-relaxed">
                    Your partnership inquiry has been received. Our team will review the details and reach out within 2 business days.
                  </p>
                  <div className="pt-4">
                    <button onClick={onClose} className="px-12 py-4 border border-outline-variant text-primary text-[10px] font-bold tracking-widest uppercase hover:bg-surface-container-low transition-all active:scale-95">Close</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
