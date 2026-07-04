import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";

const MedProFormModal = ({ isOpen, onClose, selectedCourse }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: selectedCourse || "Forensic Psychology",
    question: "",
  });

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset success state when modal closes/opens
  React.useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/medpro/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormData({ name: "", email: "", phone: "", course: "Forensic Psychology", question: "" });
        setIsSuccess(true);
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="mp2-modal-overlay" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(5px)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{ backgroundColor: "#0f0f1b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "1.5rem", width: "90%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto", position: "relative", color: "#fff", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", textAlign: isSuccess ? "center" : "left" }}
          >
            <button onClick={onClose} style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: "1.2rem" }}>
              <FaTimes />
            </button>
            
            {isSuccess ? (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: "2rem 0" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(34, 197, 94, 0.2)", display: "flex", justifyContent: "center", alignItems: "center", margin: "0 auto 1.5rem" }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "1rem", color: "#fff" }}>Application Received!</h2>
                <p style={{ color: "#9ca3af", fontSize: "1rem", marginBottom: "2rem", lineHeight: "1.6" }}>
                  Thank you for your interest in MedPro Packs. Our admissions team will review your details and contact you shortly.
                </p>
                <button onClick={onClose} style={{ width: "100%", padding: "0.85rem", borderRadius: "8px", background: "linear-gradient(135deg, #22c55e, #16a34a)", border: "none", color: "#fff", fontWeight: "600", fontSize: "1rem", cursor: "pointer" }}>
                  Done
                </button>
              </motion.div>
            ) : (
              <>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem", color: "#fff" }}>Apply for MedPro Packs</h2>
                <p style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Take the first step towards a premium certification program.</p>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.3rem", color: "#d1d5db" }}>Full Name *</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff", outline: "none" }} placeholder="John Doe" />
                  </div>
                  
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.3rem", color: "#d1d5db" }}>Email Address *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff", outline: "none" }} placeholder="john@example.com" />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.3rem", color: "#d1d5db" }}>Phone Number *</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff", outline: "none" }} placeholder="+91 9876543210" />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.3rem", color: "#d1d5db" }}>Interested Course *</label>
                    <select name="course" value={formData.course} onChange={handleChange} style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff", outline: "none", cursor: "pointer" }}>
                      <option value="Forensic Psychology" style={{ color: "#000" }}>Forensic Psychology</option>
                      <option value="Clinical Psychology" style={{ color: "#000" }}>Clinical Psychology</option>
                      <option value="Corporate Law" style={{ color: "#000" }}>Corporate Law</option>
                      <option value="Psychology" style={{ color: "#000" }}>Psychology</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.3rem", color: "#d1d5db" }}>Any Questions? (Optional)</label>
                    <textarea name="question" value={formData.question} onChange={handleChange} rows="3" style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#fff", outline: "none", resize: "vertical" }} placeholder="How does the mentorship work?"></textarea>
                  </div>

                  <button disabled={loading} type="submit" style={{ marginTop: "0.5rem", width: "100%", padding: "0.85rem", borderRadius: "8px", background: "linear-gradient(135deg, #c084fc, #818cf8)", border: "none", color: "#fff", fontWeight: "600", fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
                    {loading ? "Submitting..." : "Submit Application"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MedProFormModal;
