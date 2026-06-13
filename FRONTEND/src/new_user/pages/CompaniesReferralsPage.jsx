import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./CompaniesReferralsPage.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CompaniesReferralsPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [fresherFriendly, setFresherFriendly] = useState(false);
  const [internshipFriendly, setInternshipFriendly] = useState(false);
  const [remoteFriendly, setRemoteFriendly] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, [search, companyType, fresherFriendly, internshipFriendly, remoteFriendly, page]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = {
        search,
        companyType,
        fresherFriendly: fresherFriendly ? true : undefined,
        internshipFriendly: internshipFriendly ? true : undefined,
        remoteFriendly: remoteFriendly ? true : undefined,
        page,
        limit: 12
      };
      
      const response = await axios.get(`${API_BASE}/api/company-directory`, { params });
      
      if (response.data.success) {
        setCompanies(response.data.data);
        setTotalPages(response.data.totalPages);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch companies.");
      toast.error("Failed to fetch companies.");
    } finally {
      setLoading(false);
    }
  };

  const openReferralModal = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const closeReferralModal = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
  };

  return (
    <div className="companies-directory-container">
      <div className="companies-header">
        <div>
          <h1>Companies & Referrals</h1>
          <p>Discover top companies, find official career pages, and get referral assistance.</p>
        </div>
      </div>

      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <span className="material-symbols-outlined">search</span>
          <input 
            type="text" 
            placeholder="Search by company name..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <select 
          className="filter-select"
          value={companyType}
          onChange={(e) => { setCompanyType(e.target.value); setPage(1); }}
        >
          <option value="">All Types</option>
          <option value="Product">Product Company</option>
          <option value="Service">Service Company</option>
          <option value="Startup">Startup</option>
        </select>

        <div className="filter-checkboxes">
          <label className="filter-checkbox">
            <input 
              type="checkbox" 
              checked={fresherFriendly} 
              onChange={(e) => { setFresherFriendly(e.target.checked); setPage(1); }} 
            />
            Fresher Friendly
          </label>
          <label className="filter-checkbox">
            <input 
              type="checkbox" 
              checked={internshipFriendly} 
              onChange={(e) => { setInternshipFriendly(e.target.checked); setPage(1); }} 
            />
            Internship Available
          </label>
          <label className="filter-checkbox">
            <input 
              type="checkbox" 
              checked={remoteFriendly} 
              onChange={(e) => { setRemoteFriendly(e.target.checked); setPage(1); }} 
            />
            Remote Friendly
          </label>
        </div>
      </div>

      {loading && <div className="loading-state">Loading companies...</div>}
      {!loading && error && <div className="error-state">{error}</div>}
      {!loading && !error && companies.length === 0 && (
        <div className="empty-state">No companies found matching your criteria.</div>
      )}

      {!loading && !error && companies.length > 0 && (
        <>
          <div className="companies-grid">
            {companies.map((company) => (
              <div key={company._id} className="company-card">
                <div className="company-card-header">
                  {company.companyLogo ? (
                    <img 
                      src={company.companyLogo} 
                      alt={company.companyName} 
                      className="company-logo" 
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.companyName)}&background=random&color=fff&size=128`;
                      }}
                    />
                  ) : (
                    <div className="company-logo" style={{ background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      🏢
                    </div>
                  )}
                  <div className="company-info">
                    <h3>{company.companyName}</h3>
                    <p>
                      <span className="material-symbols-outlined">location_on</span>
                      {company.headquarters}
                    </p>
                  </div>
                </div>

                <div className="company-badges">
                  <span className={`badge ${company.companyType?.toLowerCase()}`}>
                    {company.companyType}
                  </span>
                  <span className="badge">{company.industry}</span>
                  {company.fresherFriendly && <span className="badge fresher">Fresher Friendly</span>}
                  {company.internshipFriendly && <span className="badge internship">Internship</span>}
                  {company.remoteFriendly && <span className="badge remote">Remote</span>}
                </div>

                <p className="company-desc">{company.description}</p>

                <div className="company-actions">
                  <a href={company.careersUrl} target="_blank" rel="noopener noreferrer" className="btn-careers">
                    <span className="material-symbols-outlined">open_in_new</span>
                    Visit Careers
                  </a>
                  <button className="btn-referral" onClick={() => openReferralModal(company)}>
                    <span className="material-symbols-outlined">handshake</span>
                    Ask Referral
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                disabled={page === 1} 
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button 
                disabled={page === totalPages} 
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {isModalOpen && selectedCompany && (
        <ReferralModal company={selectedCompany} onClose={closeReferralModal} />
      )}
    </div>
  );
};

const ReferralModal = ({ company, onClose }) => {
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");

  const encodedCompanyName = encodeURIComponent(company.companyName);

  const linkedInLinks = [
    { label: "Search Recruiters", query: `recruiter ${encodedCompanyName}` },
    { label: "Search Employees", query: `${encodedCompanyName}` },
    { label: "Search Hiring Managers", query: `hiring manager ${encodedCompanyName}` },
    { label: "Search Alumni", query: `alumni ${encodedCompanyName}` },
  ];

  const generateMessage = () => {
    return `Hi [Employee Name],\n\nI recently applied for the ${role || '[Role Name]'} position at ${company.companyName}. I came across your profile and noticed you work at the company. Based on my background in ${skills || '[Skills]'}, I believe I may be a good fit for the role.\n\nIf you feel my profile aligns with the position, I would greatly appreciate any guidance or referral.\n\nThank you for your time and consideration.\n\nBest regards,\n${userName || '[Your Name]'}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMessage());
    toast.success("Message copied to clipboard!");
  };

  return (
    <div className="referral-modal-overlay">
      <div className="referral-modal">
        <div className="referral-modal-header">
          <h2>Referral Assistant - {company.companyName}</h2>
          <button className="close-modal-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="referral-modal-body">
          
          <div className="linkedin-links">
            <h4>1. Find People on LinkedIn</h4>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '12px' }}>
              Click below to search for employees at {company.companyName} who can refer you.
            </p>
            <div className="linkedin-buttons">
              {linkedInLinks.map((link, idx) => (
                <a 
                  key={idx}
                  href={`https://www.linkedin.com/search/results/people/?keywords=${link.query}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-linkedin"
                >
                  <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" style={{ width: 16 }}/>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="generator-section">
            <h4>2. Generate Referral Message</h4>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Your Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. John Doe"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Role Applied For</label>
                <input 
                  type="text" 
                  placeholder="e.g. Software Engineer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Key Skills</label>
                <input 
                  type="text" 
                  placeholder="e.g. React, Node.js, Python"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>
            </div>

            <div className="generated-message">
              <button className="copy-btn" onClick={handleCopy}>
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>content_copy</span>
                Copy
              </button>
              <pre>{generateMessage()}</pre>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CompaniesReferralsPage;
