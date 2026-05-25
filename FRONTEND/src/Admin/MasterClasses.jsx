
import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import toast, { Toaster } from "react-hot-toast";

const MasterClasses = () => {
  const [isFormVisible, setisFormVisible] = useState(false);
  const [editClassId, setEditClassId] = useState(null);
  const [allMasterClass, setAllMasterClass] = useState([]);
  const [selectedMC, setSelectedMC] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    title: "",
    start: "",
    end: "",
    link: "",
    image: "",
    subheading: "",
    duration: "",
    venue: "",
    registeredCount: "",
    rating: "",
    level: "",
    price: "",
    language: "",
    certificateAvailable: "",
    instructorName: "",
    instructorLinkedIn: "",
    instructorDesignation: "",
    instructorExpertise: "",
    instructorCredibility: "",
    instructorExperience: "",
    instructorLearnersMentored: "",
    instructorRating: "",
    instructorSessions: "",
    instructorCompanyTags: "",
    instructorPhoto: "",
    whyAttend: "",
    whatYouWillLearn: "",
    whoShouldAttend: "",
    transformationBefore: "",
    transformationAfter: "",
    faqs: "",
  });

  const [takeaways, setTakeaways] = useState([{ title: "", desc: "" }]);
  const [faqsList, setFaqsList] = useState([{ q: "", a: "" }]);

  const resetForm = () => {
    setFormData({
      title: "",
      start: "",
      end: "",
      link: "",
      image: "",
      subheading: "",
      duration: "",
      venue: "",
      registeredCount: "",
      rating: "",
      level: "",
      price: "",
      language: "",
      certificateAvailable: "",
      instructorName: "",
      instructorLinkedIn: "",
      instructorDesignation: "",
      instructorExpertise: "",
      instructorCredibility: "",
      instructorExperience: "",
      instructorLearnersMentored: "",
      instructorRating: "",
      instructorSessions: "",
      instructorCompanyTags: "",
      instructorPhoto: "",
      whyAttend: "",
      whatYouWillLearn: "",
      whoShouldAttend: "",
      transformationBefore: "",
      transformationAfter: "",
      faqs: "",
    });
    setTakeaways([{ title: "", desc: "" }]);
    setFaqsList([{ q: "", a: "" }]);
    setEditClassId(null);
    setisFormVisible(false);
    setActiveTab("basic");
  };

  // ─── Google Drive URL helpers ───────────────────────────────────────────────
  // Detects if a URL is a Drive FOLDER (not an image file — cannot be embedded)
  const isDriveFolderUrl = (url) =>
    typeof url === "string" && url.includes("drive.google.com/drive/folders");

  // Converts a Google Drive FILE share link → lh3.googleusercontent.com/d/FILE_ID
  // This format bypasses CORS completely and works directly in <img> tags.
  // Supported inputs:
  //   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  //   https://drive.google.com/open?id=FILE_ID
  //   https://drive.google.com/uc?export=view&id=FILE_ID
  //   https://lh3.googleusercontent.com/d/FILE_ID  (already correct)
  const convertGoogleDriveUrl = (url) => {
    if (!url || typeof url !== "string") return url;
    if (isDriveFolderUrl(url)) return null; // folder — not an image
    const trimmed = url.trim();
    // Already the correct lh3 format
    if (trimmed.includes("lh3.googleusercontent.com")) return trimmed;
    // /file/d/FILE_ID/...
    const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/?&#]+)/);
    if (fileMatch) {
      return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;
    }
    // ?id=FILE_ID or &id=FILE_ID
    const idMatch = trimmed.match(/[?&]id=([^&#]+)/);
    if (idMatch && trimmed.includes("drive.google.com")) {
      return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
    }
    return trimmed;
  };
  // ─────────────────────────────────────────────────────────────────────────────

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Block submission if a folder URL was pasted
    if (isDriveFolderUrl(formData.image)) {
      toast.error("Cover Image: This is a folder link, not an image. Please share the specific image FILE from Google Drive.");
      return;
    }
    if (isDriveFolderUrl(formData.instructorPhoto)) {
      toast.error("Instructor Photo: This is a folder link, not an image. Please share the specific photo FILE from Google Drive.");
      return;
    }
    // Auto-convert Google Drive file share links before saving
    const sanitizedData = {
      ...formData,
      whatYouWillLearn: JSON.stringify(takeaways),
      faqs: JSON.stringify(faqsList),
      image: convertGoogleDriveUrl(formData.image) || formData.image,
      instructorPhoto: convertGoogleDriveUrl(formData.instructorPhoto) || formData.instructorPhoto,
    };
    try {
      if (editClassId) {
        await axios.put(`${API}/masterclass/${editClassId}`, sanitizedData);
        toast.success("MasterClass updated successfully");
      } else {
        await axios.post(`${API}/addmasterclass`, sanitizedData);
        toast.success("MasterClass created successfully");
      }
      fetchMasterclass();
      resetForm();
    } catch (error) {
      toast.error("There was an error while creating or updating the MasterClass");
      console.error("Error creating or updating MasterClass", error);
    }
  };


  const fetchMasterclass = async () => {
    try {
      const response = await axios.get(`${API}/allmasterclass`);
      setAllMasterClass(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("There was an error fsetching MasterClass:", error);
    }
  };

  const handleEdit = (masterclass) => {
    const isConfirmed = window.confirm("Are you sure you want to edit the Master Class?");
    if (isConfirmed) {
      let parsedTakeaways = [{ title: "", desc: "" }];
      try {
        if (masterclass.whatYouWillLearn) {
          const parsed = JSON.parse(masterclass.whatYouWillLearn);
          if (Array.isArray(parsed) && parsed.length > 0) {
            parsedTakeaways = parsed;
          }
        }
      } catch (e) {
        console.error("Error parsing takeaways", e);
      }

      let parsedFaqs = [{ q: "", a: "" }];
      try {
        if (masterclass.faqs) {
          const parsed = JSON.parse(masterclass.faqs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            parsedFaqs = parsed;
          }
        }
      } catch (e) {
        console.error("Error parsing faqs", e);
      }

      setTakeaways(parsedTakeaways);
      setFaqsList(parsedFaqs);

      setFormData({
        title: masterclass.title || "",
        start: masterclass.start || "",
        end: masterclass.end || "",
        link: masterclass.link || "",
        image: masterclass.image || "",
        subheading: masterclass.subheading || "",
        duration: masterclass.duration || "",
        venue: masterclass.venue || "",
        registeredCount: masterclass.registeredCount || "",
        rating: masterclass.rating || "",
        level: masterclass.level || "",
        price: masterclass.price || "",
        language: masterclass.language || "",
        certificateAvailable: masterclass.certificateAvailable || "",
        instructorName: masterclass.instructorName || "",
        instructorLinkedIn: masterclass.instructorLinkedIn || "",
        instructorDesignation: masterclass.instructorDesignation || "",
        instructorExpertise: masterclass.instructorExpertise || "",
        instructorCredibility: masterclass.instructorCredibility || "",
        instructorExperience: masterclass.instructorExperience || "",
        instructorLearnersMentored: masterclass.instructorLearnersMentored || "",
        instructorRating: masterclass.instructorRating || "",
        instructorSessions: masterclass.instructorSessions || "",
        instructorCompanyTags: masterclass.instructorCompanyTags || "",
        instructorPhoto: masterclass.instructorPhoto || "",
        whyAttend: masterclass.whyAttend || "",
        whatYouWillLearn: masterclass.whatYouWillLearn || "",
        whoShouldAttend: masterclass.whoShouldAttend || "",
        transformationBefore: masterclass.transformationBefore || "",
        transformationAfter: masterclass.transformationAfter || "",
        faqs: masterclass.faqs || "",
      });
      setEditClassId(masterclass._id);
      setisFormVisible(true);
      setActiveTab("basic");
    }
  };

  const handlePdfChange = async (e, masterclass) => {
    const newPdf = e.target.value;

    if (masterclass.status === "completed"){
      try {
        const response = await axios.put(`${API}/masterclass/${masterclass._id}`, { pdfstatus: newPdf });
        console.log(response.data.message);
        fetchMasterclass();
      } catch (error) {
        console.error("Error updating status:", error.response?.data?.message || error.message);
      }
    }
    else{
      alert("please change the status first");
    }
  };

  const handleStatusChange = async (e, id) => {
    const newStatus = e.target.value;

    try {
      const response = await axios.put(`${API}/masterclass/${id}`, { status: newStatus });
      console.log(response.data.message);
      fetchMasterclass();
    } catch (error) {
      console.error("Error updating status:", error.response?.data?.message || error.message);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this MasterClass?");
    if (!isConfirmed) return;
    try {
      const response = await axios.delete(`${API}/masterclass/${id}`);
      toast.success("MasterClass deleted successfully!");
      fetchMasterclass();
    } catch (error) {
      toast.error("Error deleting MasterClass");
      console.error("Delete Error:", error.response?.data || error.message);
    }
  };

  const exportToExcel = () => {
    console.log(selectedMC);
    if (selectedMC.applications === 0) {
      toast.error("No data available to download!");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(selectedMC.applications);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Masterclass Data");
    const excelFile = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelFile], { bookType: "xlsx", type: "application/octet-stream" });
    saveAs(blob,`${selectedMC.title}.xlsx`);
    toast.success("Downloda successfully.");
  };

  useEffect(() => {
    fetchMasterclass();
  }, []);

  return (
    <div id="AdminAddCourse">
      <Toaster position="top-center" reverseOrder={false} />
      {isFormVisible && (
        <div className="form">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '650px', height: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>{editClassId ? "Edit MasterClass" : "Add New MasterClass"}</h2>
              <span onClick={resetForm} style={{ fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}>✖</span>
            </div>
            
            {/* Tab Headers */}
            <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              <button
                type="button"
                onClick={() => setActiveTab("basic")}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  backgroundColor: activeTab === "basic" ? "#f15b29" : "#eee",
                  color: activeTab === "basic" ? "#fff" : "#333",
                  flex: 1
                }}
              >
                1. Basic Info
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("instructor")}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  backgroundColor: activeTab === "instructor" ? "#f15b29" : "#eee",
                  color: activeTab === "instructor" ? "#fff" : "#333",
                  flex: 1
                }}
              >
                2. Instructor
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("landing")}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  backgroundColor: activeTab === "landing" ? "#f15b29" : "#eee",
                  color: activeTab === "landing" ? "#fff" : "#333",
                  flex: 1
                }}
              >
                3. Page Content
              </button>
            </div>

            {/* Tab 1: Basic Info */}
            {activeTab === "basic" && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: 1, paddingRight: '5px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Masterclass Title *</label>
                  <input
                    value={formData.title}
                    onChange={handleChange}
                    type="text"
                    name="title"
                    placeholder="Enter Masterclass title"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Start Date & Time *</label>
                  <input
                    value={formData.start}
                    onChange={handleChange}
                    type="datetime-local"
                    name="start"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>End Date & Time *</label>
                  <input
                    value={formData.end}
                    onChange={handleChange}
                    type="datetime-local"
                    name="end"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>WhatsApp Group Link *</label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    placeholder="Enter Whatsapp group link"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Cover Card Image URL *</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Paste image URL or Google Drive FILE share link"
                    required
                    style={{ borderColor: isDriveFolderUrl(formData.image) ? 'red' : undefined }}
                  />
                  {isDriveFolderUrl(formData.image) ? (
                    <span style={{ fontSize: '11px', color: 'red', fontWeight: 'bold' }}>
                      ✗ This is a FOLDER link — it cannot be used as an image.<br/>
                      Open the file in Drive → right-click → "Share" → copy the file share link.
                    </span>
                  ) : (
                    <span style={{ fontSize: '10px', color: '#f15b29' }}>✓ Google Drive FILE links are auto-converted — paste your Drive file share URL directly</span>
                  )}
                  {formData.image && !isDriveFolderUrl(formData.image) && (
                    <img
                      src={convertGoogleDriveUrl(formData.image)}
                      alt="Cover preview"
                      style={{ width: '100%', maxHeight: '120px', objectFit: 'cover', borderRadius: '8px', marginTop: '6px', border: '1px solid #eee' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                      onLoad={(e) => { e.target.style.display = 'block'; }}
                    />
                  )}
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Subheading (Value Proposition)</label>
                  <input
                    type="text"
                    name="subheading"
                    value={formData.subheading}
                    onChange={handleChange}
                    placeholder="e.g. Master automation testing frameworks and land high-paying roles"
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Duration</label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="e.g. 90 Mins"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Venue</label>
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleChange}
                      placeholder="e.g. Online Live"
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Price Option</label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="e.g. 100% Free"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Language</label>
                    <input
                      type="text"
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      placeholder="e.g. English"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Certificate Available?</label>
                    <input
                      type="text"
                      name="certificateAvailable"
                      value={formData.certificateAvailable}
                      onChange={handleChange}
                      placeholder="e.g. Yes"
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Registered Count Display</label>
                    <input
                      type="text"
                      name="registeredCount"
                      value={formData.registeredCount}
                      onChange={handleChange}
                      placeholder="e.g. 3,840+"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Rating Display</label>
                    <input
                      type="text"
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      placeholder="e.g. 4.8"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Target Level Display</label>
                    <input
                      type="text"
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      placeholder="e.g. Beginner to Intermediate"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Instructor Info */}
            {activeTab === "instructor" && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: 1, paddingRight: '5px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Instructor Name</label>
                    <input
                      type="text"
                      name="instructorName"
                      value={formData.instructorName}
                      onChange={handleChange}
                      placeholder="e.g. Abhijeet Gupta"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>LinkedIn Profile (Optional)</label>
                    <input
                      type="url"
                      name="instructorLinkedIn"
                      value={formData.instructorLinkedIn}
                      onChange={handleChange}
                      placeholder="e.g. https://linkedin.com/in/..."
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Instructor Designation</label>
                  <input
                    type="text"
                    name="instructorDesignation"
                    value={formData.instructorDesignation}
                    onChange={handleChange}
                    placeholder="e.g. Project Engineer at WIPRO"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Instructor Photo URL</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        name="instructorPhoto"
                        value={formData.instructorPhoto}
                        onChange={handleChange}
                        placeholder="Paste image URL or Google Drive share link"
                      />
                      <span style={{ fontSize: '10px', color: '#f15b29' }}>✓ Google Drive links are auto-converted — paste your Drive share URL directly</span>
                    </div>
                    {formData.instructorPhoto && (
                      <img
                        src={convertGoogleDriveUrl(formData.instructorPhoto)}
                        alt="Instructor preview"
                        style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #f15b29', flexShrink: 0 }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                        onLoad={(e) => { e.target.style.display = 'block'; }}
                      />
                    )}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Instructor Areas of Expertise</label>
                  <input
                    type="text"
                    name="instructorExpertise"
                    value={formData.instructorExpertise}
                    onChange={handleChange}
                    placeholder="e.g. Automation Testing & QA Lead"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Short Bio / Achievements</label>
                  <textarea
                    name="instructorCredibility"
                    value={formData.instructorCredibility}
                    onChange={handleChange}
                    placeholder="Successfully trained and mentored over 5,000+ QA professionals globally."
                    style={{ height: '70px', padding: '8px', border: '1px solid #ccc', borderRadius: '10px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Years Experience</label>
                    <input
                      type="text"
                      name="instructorExperience"
                      value={formData.instructorExperience}
                      onChange={handleChange}
                      placeholder="e.g. 5+ Years"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Learners Mentored</label>
                    <input
                      type="text"
                      name="instructorLearnersMentored"
                      value={formData.instructorLearnersMentored}
                      onChange={handleChange}
                      placeholder="e.g. 5,000+"
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Instructor Rating</label>
                    <input
                      type="text"
                      name="instructorRating"
                      value={formData.instructorRating}
                      onChange={handleChange}
                      placeholder="e.g. 4.9"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Sessions Done</label>
                    <input
                      type="text"
                      name="instructorSessions"
                      value={formData.instructorSessions}
                      onChange={handleChange}
                      placeholder="e.g. 40+ Live Classes"
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Company Badges (Comma-separated)</label>
                  <input
                    type="text"
                    name="instructorCompanyTags"
                    value={formData.instructorCompanyTags}
                    onChange={handleChange}
                    placeholder="e.g. WIPRO, QA Specialist, Ex-Amazon"
                  />
                </div>
              </div>
            )}

            {/* Tab 3: Landing Content */}
            {activeTab === "landing" && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: 1, paddingRight: '5px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Why Attend (Problem Statement Paragraph)</label>
                  <textarea
                    name="whyAttend"
                    value={formData.whyAttend}
                    onChange={handleChange}
                    placeholder="Describe user pain points and how this session resolves them..."
                    style={{ height: '70px', padding: '8px', border: '1px solid #ccc', borderRadius: '10px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Who Should Attend (Comma-separated list)</label>
                  <input
                    type="text"
                    name="whoShouldAttend"
                    value={formData.whoShouldAttend}
                    onChange={handleChange}
                    placeholder="e.g. Students & Freshers, QA Professionals, Self-learners"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Before Attending (Comma-separated pain points)</label>
                  <input
                    type="text"
                    name="transformationBefore"
                    value={formData.transformationBefore}
                    onChange={handleChange}
                    placeholder="e.g. Stuck in tutorial loop, No portfolio to display"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>After Attending (Comma-separated achievements)</label>
                  <input
                    type="text"
                    name="transformationAfter"
                    value={formData.transformationAfter}
                    onChange={handleChange}
                    placeholder="e.g. Equipped with clear roadmap, Built real-world framework"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '5px' }}>Takeaways / Strategies to Learn</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {takeaways.map((item, index) => (
                      <div key={index} style={{ display: 'flex', gap: '5px', alignItems: 'center', backgroundColor: '#f9f9f9', padding: '6px', borderRadius: '6px', border: '1px solid #eee' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <input
                            type="text"
                            placeholder="Title (e.g. Career Roadmap)"
                            value={item.title || ""}
                            onChange={(e) => {
                              const newTakeaways = [...takeaways];
                              newTakeaways[index].title = e.target.value;
                              setTakeaways(newTakeaways);
                            }}
                            style={{ padding: '4px 8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #ccc', margin: 0 }}
                          />
                          <input
                            type="text"
                            placeholder="Description (e.g. Step-by-step path...)"
                            value={item.desc || ""}
                            onChange={(e) => {
                              const newTakeaways = [...takeaways];
                              newTakeaways[index].desc = e.target.value;
                              setTakeaways(newTakeaways);
                            }}
                            style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '4px', border: '1px solid #ccc', margin: 0 }}
                          />
                        </div>
                        {takeaways.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setTakeaways(takeaways.filter((_, i) => i !== index));
                            }}
                            style={{ padding: '4px 8px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setTakeaways([...takeaways, { title: "", desc: "" }])}
                      style={{ padding: '5px 10px', backgroundColor: '#f15b29', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', alignSelf: 'flex-start' }}
                    >
                      + Add Takeaway
                    </button>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '5px' }}>Frequently Asked Questions</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {faqsList.map((item, index) => (
                      <div key={index} style={{ display: 'flex', gap: '5px', alignItems: 'center', backgroundColor: '#f9f9f9', padding: '6px', borderRadius: '6px', border: '1px solid #eee' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <input
                            type="text"
                            placeholder="Question"
                            value={item.q || ""}
                            onChange={(e) => {
                              const newFaqs = [...faqsList];
                              newFaqs[index].q = e.target.value;
                              setFaqsList(newFaqs);
                            }}
                            style={{ padding: '4px 8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #ccc', margin: 0 }}
                          />
                          <input
                            type="text"
                            placeholder="Answer"
                            value={item.a || ""}
                            onChange={(e) => {
                              const newFaqs = [...faqsList];
                              newFaqs[index].a = e.target.value;
                              setFaqsList(newFaqs);
                            }}
                            style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '4px', border: '1px solid #ccc', margin: 0 }}
                          />
                        </div>
                        {faqsList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setFaqsList(faqsList.filter((_, i) => i !== index));
                            }}
                            style={{ padding: '4px 8px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFaqsList([...faqsList, { q: "", a: "" }])}
                      style={{ padding: '5px 10px', backgroundColor: '#f15b29', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', alignSelf: 'flex-start' }}
                    >
                      + Add FAQ
                    </button>
                  </div>
                </div>
              </div>
            )}

            <input
              className="cursor-pointer"
              type="submit"
              value={editClassId ? "Update Master Class" : "Create Master Class"}
              style={{
                backgroundColor: 'black',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: 'auto'
              }}
            />
          </form>
        </div>
      )}

      {selectedMC && (
        <div className="jobdetails">
          <div className="jobdetailsdiv">
            <div className="title">
              <h2>{selectedMC.title}</h2>
              <span onClick={exportToExcel} >Download Excel</span>
              < span onClick={() => setSelectedMC(null)} >✖</span>
            </div>
            <a href={selectedMC.link} target="_blank" rel="noopener noreferrer">{selectedMC.link}</a>
            
            <span></span>
            <table>
              <thead>
                <tr>
                  <th>Sl</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Experience (Years)</th>
                  <th>Working Field</th>
                  <th >Number</th>
                </tr>
              </thead>
              <tbody>
                {selectedMC.applications?.map((application, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{application.name}</td>
                    <td>{application.email}</td>
                    <td>{application.experience}</td>
                    <td>{application.field}</td>
                    <td>{application.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="coursetable">
        <div>
          <h2>MasterClass List</h2>
          <button className="p-2 border border-black rounded-md" onClick={() => setisFormVisible(true)}> + Add MasterClass</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Sl No.</th>
              <th>Title</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Applicant</th>
              <th>Pdf Downlowd</th>
              <th>Change PdfDownload</th>
              <th>Action</th>
              <th>Status</th>
              <th>Change Status</th>
            </tr>
          </thead>
          <tbody>
            {allMasterClass?.map((masterclass, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{masterclass.title}</td>
                <td>{new Date(masterclass.start).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</td>
                <td>{new Date(masterclass.end).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</td>
                <td className="applicationclick" onClick={() => setSelectedMC(masterclass)} >{masterclass.applications.length}</td>
                <td>{masterclass.pdfstatus ? 'ACTIVE' : 'INACTIVE'}</td>
                <td>
                  <select
                    className="border rounded-full border-black p-1"
                    onChange={(e) => handlePdfChange(e, masterclass)}
                    defaultValue="Select Remark"
                  >
                    <option disabled value="Select Remark"> Select Active Status</option>
                    <option value="true"> ACTIVE</option>
                    <option value="false">INACTIVE</option>
                  </select>
                </td>
                <td>
                  <button ><i className="fa fa-edit" onClick={() => handleEdit(masterclass)}></i></button>
                  <button onClick={() => handleDelete(masterclass._id)}><i className="fa fa-trash-o text-red-600"></i></button>
                </td>
                <td>{masterclass.status}</td>
                <td>
                  <select
                    className="border rounded-full border-black p-1"
                    onChange={(e) => handleStatusChange(e, masterclass._id)}
                    defaultValue="Select Remark"
                  >
                    <option disabled value="Select Remark"> Select Remark</option>
                    <option value="upcoming"> UPCOMING</option>
                    <option value="ongoing">ONGOING</option>
                    <option value="completed">COMPLETED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default MasterClasses;
