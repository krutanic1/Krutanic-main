import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PhoneCall, CheckCircle2 } from 'lucide-react';
import API from '../API';

const STAGES_AND_DISPOSITIONS = {
    "Fresh Lead": ["New Lead", "Invalid Lead"],
    "Attempting Contact": ["RNR", "Callback Requested", "No Response (Multi-touch)"],
    "In Conversation": ["Hot", "Warm"],
    "Demo Conducted": ["Decision Pending", "Negotiation Review", "Expected Payment Date"],
    "Closed Won": ["Converted"],
    "Closed Lost": ["Irrelevant Lead", "Not Interested", "Pricing Does Not Match", "No Response"]
};

const ACTION_TYPES = [
    { value: "call", label: "📞 Call" },
    { value: "email", label: "📧 Email" },
    { value: "whatsapp", label: "💬 WhatsApp" },
    { value: "meeting", label: "🤝 Meeting" },
    { value: "note", label: "📝 Note" }
];

export default function AdvLeadCallModal({ isOpen, onClose, onSuccess, leadId, leadName, taskId }) {
    const [formState, setFormState] = useState({
        actionType: 'call',
        stage: '',
        disposition: '',
        summary: '',
        remark: '',
        followUpDate: '',
        demoScheduleDate: '',
        expectedPaymentDate: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formState.stage) return toast.error("Please select a lead stage");
        if (!formState.disposition) return toast.error("Please select a disposition");
        if (!formState.actionType) return toast.error("Please select an action type");
        if (!formState.summary || formState.summary.trim() === "") return toast.error("Executive Summary is mandatory");

        if (!["Closed Won", "Closed Lost"].includes(formState.stage) && !formState.followUpDate) {
            return toast.error("Next Follow-up Date is mandatory");
        }


        const userId = localStorage.getItem("advTeamId");
        const userName = localStorage.getItem("advTeamName");

        setIsSubmitting(true);
        try {
            await axios.post(`${API}/api/adv-leads/log-call-activity`, {
                leadId: leadId,
                specialistId: userId,
                specialistName: userName,
                actionType: formState.actionType,
                stage: formState.stage,
                disposition: formState.disposition,
                summary: formState.summary,
                remark: formState.remark,
                demoScheduleDate: formState.demoScheduleDate ? `${formState.demoScheduleDate}:00.000Z` : undefined,
                followUpDate: formState.followUpDate ? `${formState.followUpDate}:00.000Z` : undefined,
                expectedPaymentDate: formState.expectedPaymentDate || undefined,
                isWeb: true
            });

            if (taskId) {
                await axios.put(`${API}/api/adv-tasks/${taskId}`, { status: 'Completed' }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("advTeamToken") || localStorage.getItem("adminToken") || localStorage.getItem("token")}` }
                });
            }

            toast.success("Activity logged and task completed successfully!");
            onSuccess(); // Close and refresh
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to log activity");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#1E293B] rounded-2xl border border-slate-700 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-[#1E293B] z-10 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                                    <PhoneCall className="w-5 h-5 text-indigo-400" />
                                    Log Call Outcome
                                </h2>
                                <p className="text-sm text-slate-400 mt-1">For Lead: <span className="font-medium text-slate-300">{leadName}</span></p>
                            </div>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Action Type */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Action Type *</label>
                                    <select
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                        value={formState.actionType}
                                        onChange={(e) => setFormState({ ...formState, actionType: e.target.value })}
                                    >
                                        {ACTION_TYPES.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Stage */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Stage *</label>
                                    <select
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                        value={formState.stage}
                                        onChange={(e) => setFormState({ ...formState, stage: e.target.value, disposition: "" })}
                                    >
                                        <option value="">Select Stage...</option>
                                        {Object.keys(STAGES_AND_DISPOSITIONS).map(stage => (
                                            <option key={stage} value={stage}>{stage}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Disposition */}
                            {formState.stage && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Disposition *</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {STAGES_AND_DISPOSITIONS[formState.stage].map(disp => (
                                            <button
                                                key={disp}
                                                type="button"
                                                onClick={(e) => { e.preventDefault(); setFormState({ ...formState, disposition: disp }); }}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                                                    formState.disposition === disp
                                                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                                }`}
                                            >
                                                {disp}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Conditional Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {formState.stage && !["Closed Won", "Closed Lost"].includes(formState.stage) && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Next Follow-up (IST) (Creates task) *</label>
                                        <input
                                            type="datetime-local"
                                            value={formState.followUpDate}
                                            onChange={(e) => setFormState({ ...formState, followUpDate: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all [color-scheme:dark]"
                                        />
                                    </div>
                                )}

                                {formState.disposition === "Expected Payment Date" && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Expected Payment Date</label>
                                        <input
                                            type="date"
                                            value={formState.expectedPaymentDate}
                                            onChange={(e) => setFormState({ ...formState, expectedPaymentDate: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all [color-scheme:dark]"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Summary */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Executive Summary *</label>
                                <textarea
                                    value={formState.summary}
                                    onChange={(e) => setFormState({ ...formState, summary: e.target.value })}
                                    placeholder="Enter key conversation highlights..."
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all min-h-[100px]"
                                />
                            </div>
                            
                            {/* Remark */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Internal Remark (Optional)</label>
                                <textarea
                                    value={formState.remark}
                                    onChange={(e) => setFormState({ ...formState, remark: e.target.value })}
                                    placeholder="Any internal notes?"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all min-h-[80px]"
                                />
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-[#1E293B] border-t border-slate-700 p-6 flex justify-end gap-3 rounded-b-2xl">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-6 py-2.5 rounded-xl font-medium text-white bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-500/25 flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        Save & Create Task
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
