import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../API";
import debounce from "lodash/debounce";
import toast, { Toaster } from "react-hot-toast";
import "./Dashboard.css"; // Import the separate CSS file

const Dashboard = () => {
  const userEmail = localStorage.getItem("userEmail");
  const [enrollData, setenrollData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const fetchenrollData = debounce(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/enrollments`, {
        params: { userEmail },
      });
      // console.log("data" , response.data);
      setenrollData(response.data);
      // console.log(response.data[0].createdAt);

      // setenrollData(response.data.filter((item) => item.email === userEmail));
    } catch (error) {
      console.error("There was an error fetching enrolledData:", error);
    } finally {
      setLoading(false);
    }
  }, 500);

  const handleSubmit = async (data) => {
    const createdAt = new Date(data.createdAt);
    const currentDate = new Date();
    const eligibleDate = new Date(createdAt);
    eligibleDate.setMonth(createdAt.getMonth() + 2);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const eligibleDateFormatted = eligibleDate.toLocaleDateString(
      "en-US",
      options
    );

    if (currentDate < eligibleDate) {
      alert(`You can apply for a certificate after ${eligibleDateFormatted}.`);
      return;
    }

    if (
      !window.confirm(
        "Are you sure your internship is complete? If not,please cancel. If it's complete, click 'ok' to proceed."
      )
    ) {
      return;
    }
    if (!window.confirm("Do you really want to apply for your certificate?")) {
      return;
    }
    // console.log("c", data);
    const name = data.fullname
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    const email = data.email;
    const domain = data.domain.title;
    // console.log(name,email,domain);

    try {
      const response = await axios.post(`${API}/applycertificate`, {
        name,
        email,
        domain,
      });
      alert("Certificate Apply successfully!");
      fethCertificate();
    } catch (error) {
      console.error(
        "Error adding certificate:",
        error.response?.data?.error || "Server error"
      );
      alert("Failed to apply, or you have already applied.");
    }
  };

  const fethCertificate = async () => {
    try {
      const response = await axios.get(`${API}/getcertificate`, {
        params: { email: userEmail },
      });
      setCertificate(response.data);
      // console.log("certificate", response.data);
    } catch (error) {
      console.error("There was an error fetching enrolledData:", error);
    }
  };

  const trainingCertificateDownload = async () => {
    // console.log("hi",selectedCertificate);
    // console.log(selectedCertificate.domain);
    // console.log(new Date(selectedCertificate.startdate).toLocaleString('en-US', { month: 'long', year: 'numeric' }));    
    let finalOutput = selectedCertificate.domain + " "+"on"+" " + new Date(selectedCertificate.startdate).toLocaleString('en-US', { month: 'long', year: 'numeric' });
    // console.log(finalOutput);
    try {
      const imageUrl =`https://res.cloudinary.com/do5gatqvs/image/upload/co_rgb:000000,l_text:times%20new%20roman_65_bold_normal_left:${encodeURIComponent(selectedCertificate.name)}/fl_layer_apply,y_20/co_rgb:000000,l_text:times%20new%20roman_25_bold_normal_left:${encodeURIComponent(finalOutput)}/fl_layer_apply,y_225/training_certificate_demo_vknkst`
      const imageResponse = await fetch(imageUrl);
      const blob = await imageResponse.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "Training_Certificate.jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);

      toast.success("Training Certificate downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download training certificate");
      console.error("Download error:", error);
    }
  };

  useEffect(() => {
    fetchenrollData();
    fethCertificate();
  }, []);

  const handleStartLearning = (title, sessionlist) => {
    navigate("/Learning", {
      state: { courseTitle: title, sessions: sessionlist },
    });
  };

  const addLinkedin = (data) => {
    console.log("linkedin", data.date);
    let year = new Date(data.date).toLocaleDateString("en-US", {
      year: "numeric",
    });
    let month = new Date(data.date).toLocaleDateString("en-US", {
      month: "numeric",
    });
    let linkurl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${data.domain}&organizationName=Krutanic&issueYear=${year}&issueMonth=${month}&certUrl=${data.url}&certId=${data._id}`;
   
    window.open(linkurl, "_blank");
  };

  return (
    <div id="UserDashboard" className="futuristic-ui">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Certificate Modal */}
      {selectedCertificate && ( 
        <div className="viewcertificate-modal">
          <div className="modal-content neomorphic-card">
            <div className="cert-preview">
               <img src={selectedCertificate.url} alt="Certificate" />
            </div>
            <div className="cert-details">
              <h2 className="issuer">Issued By : KRUTANIC</h2>
              <a
                className="open-link"
                href={selectedCertificate.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in new tab <i className="fa fa-external-link"></i>
              </a>
              
              <div className="divider"></div>
              
              <h3 className="actions-title">Actions</h3>
              <div className="action-buttons">
                <button
                  className="neomorphic-btn linkedin-btn"
                  onClick={() => addLinkedin(selectedCertificate)}
                >
                  <i className="fa fa-linkedin"></i> Add to LinkedIn
                </button>
                <button
                  className="neomorphic-btn download-btn"
                  onClick={trainingCertificateDownload}
                >
                  <i className="fa fa-download"></i> Download Training Certificate
                </button>
                <button
                  className="neomorphic-btn close-btn"
                  onClick={() => setSelectedCertificate(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="glow-text">User Dashboard</h1>
          <p className="subtitle">Welcome back, continue your learning journey</p>
        </div>
        <div className="header-actions">
           <Link to="/Setting" className="neomorphic-btn sm-btn change-pass-btn">
             <i className="fa fa-lock"></i> Change Password
           </Link>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="stats-container">
        <div className="stat-card neomorphic-card float-animation">
          <div className="icon-box book-icon">
             <i className="fa fa-book"></i>
          </div>
          <div className="text-box">
             <h3>Enrolled Courses</h3>
             <h2 className="counter glow-text">{enrollData.length}</h2>
          </div>
        </div>
        <div className="stat-card neomorphic-card float-animation delay-1">
          <div className="icon-box grad-icon">
             <i className="fa fa-graduation-cap"></i>
          </div>
          <div className="text-box">
             <h3>Active Courses</h3>
             <h2 className="counter glow-text">
               {enrollData.filter((item) => item.status === "fullPaid").length}
             </h2>
          </div>
        </div>
      </section>

      {/* Courses List */}
      <section className="courses-section">
        <h2 className="section-title">Your Courses</h2>
        
        {loading ? (
          <div id="loader">
            <div className="three-body">
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
            </div>
          </div>
        ) : (
          <div className="courses-grid">
            {enrollData.map((item, index) => (
              <div key={index} className="course-card neomorphic-card">
                <div className="card-header">
                   <h3>{item.domain.title}</h3>
                   <div className="rating">★★★★★</div>
                </div>
                
                <div className="card-body">
                  <p className="info-row"><i className="fa fa-clock-o"></i> {Object.keys(item.domain.session).length} Sessions</p>
                  <p className="info-row"><i className="fa fa-calendar"></i> Opted: {item.monthOpted}</p>
                  
                  {item.status === "fullPaid" ? (
                    <div className="card-actions">
                      <button
                        className="neomorphic-btn primary-btn"
                        onClick={() => handleStartLearning(
                          item.domain.title,
                          item.domain.session
                        )}
                      >
                        Start Learning
                      </button>
                      <button
                        className="neomorphic-btn secondary-btn"
                        onClick={() => handleSubmit(item)}
                      >
                        Get Certificate
                      </button>
                    </div>
                  ) : (
                    <div className="payment-alert">
                      <div className="alert-content">
                        <h4>Payment Due</h4>
                        <p>Due Date: {item.clearPaymentMonth}</p>
                        <p className="amount">Amount: ₹ {item.programPrice - item.paidAmount}/-</p>
                      </div>
                      <a
                        className="neomorphic-btn pay-btn"
                        href="https://smartpay.easebuzz.in/219610/Krutanic"
                        target="_blank"
                      >
                        Pay Now
                      </a>
                      <p className="note-text">
                        <i className="fa fa-info-circle"></i> Settle due amount to access course.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Certificate Status Section */}
      <section className="certificate-status-section">
        <h2 className="section-title">Certificate Status</h2>
        <div className="certificate-status-card neomorphic-card">
          {certificate ? (
            <div className="status-details">
              <div className="info-group">
                <p><strong>Name:</strong> {certificate.name}</p>
                <p><strong>Email:</strong> {certificate.email}</p>
                <p><strong>Domain:</strong> {certificate.domain}</p>
                <p><strong>Applied:</strong> {new Date(certificate.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</p>
              </div>
              
              <div className="status-action">
                 <p className="status-label">Status:</p>
                 {certificate.delivered ? (
                   <button 
                     className="neomorphic-btn view-btn"
                     onClick={() => setSelectedCertificate(certificate)}
                   >
                     View Certificate
                   </button>
                 ) : (
                   <span className="pending-badge">Processing</span>
                 )}
              </div>
            </div>
          ) : (
             <div className="no-certificate">
               <i className="fa fa-certificate"></i>
               <p>No certificate applications found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
