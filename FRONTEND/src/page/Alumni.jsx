import { Helmet } from "react-helmet";
import { useState , useMemo } from "react";
import axios from "axios";
import AlumniData from "../Components/alumniData";
import API from "../API";

const Alumni = () => {
  const [filters, setFilters] = useState({ post: "", location: "", role: "" });
  const [dropdownOpen, setDropdownOpen] = useState({ post: false, location: false, role: false,});
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [filteredResults, setFilteredResults] = useState(AlumniData);
  const [isFlipped, setIsFlipped] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const uniqueValues = useMemo(
    () => ({  
      posts: [...new Set(AlumniData.map((a) => a.post))].sort(),
      locations: [...new Set(AlumniData.map((a) => a.location))].sort(),
      roles: [...new Set(AlumniData.map((a) => a.role))].sort(),
    }),
    []
  );

  const handleSelect = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setDropdownOpen((prev) => ({ ...prev, [field]: false }));
  };

  const handleSearch = () => {
    setFilteredResults(
      AlumniData.filter((a) =>
        Object.entries(filters).every(([k, v]) => !v || a[k] === v)
      )
    );
  };

  const handleCardClick = (alumni) => {
    if (!alumni?.name) {
      console.warn("Invalid alumni:", alumni);
      return;
    }
    setIsFlipped(false);
    setSelectedAlumni(alumni);
  };

  const handleCloseDialog = () => {
    setSelectedAlumni(null);
    setIsFlipped(false);
    setFormErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const errors = {};

    // Frontend validation
    if (!data.email.includes("@")) errors.email = "Invalid email";
    if (data.contact?.length < 10) errors.contact = "Invalid phone number";
    if (!data.graduationYear || data.graduationYear < 1900)
      errors.graduationYear = "Invalid year";

    setFormErrors(errors);

    if (Object.keys(errors).length) return;

    try {
      const response = await axios.post(`${API}/alumni-data`, {
        fullName: data.fullName,
        contact: data.contact,
        email: data.email,
        graduationYear: Number(data.graduationYear),
        currentCompany: data.currentCompany,
        yearsOfExperience: Number(data.yearsOfExperience),
        advancedDomains: data.advancedDomains
          ? Array.isArray(data.advancedDomains)
            ? data.advancedDomains
            : [data.advancedDomains]
          : [],
      });

      if (!response.data.success) {
        setFormErrors({ general: response.data.message });
        return;
      }

      handleCloseDialog();
      alert("Form submitted successfully!");
    } catch (error) {
      setFormErrors({ general: "Failed to submit form. Please try again." });
    }
  };

  const Dropdown = ({ field, placeholder, options }) => (
    <div className="w-full relative">
      <button
        onClick={() =>
          setDropdownOpen((prev) => ({ ...prev, [field]: !prev[field] }))
        }
        className="w-full bg-black text-white px-4 py-2 rounded-md text-sm text-left flex justify-between"
      >
        {filters[field] || placeholder}
      </button>
      {dropdownOpen[field] && (
        <div className="absolute z-10 w-full bg-[#1A1A1A] text-white rounded-md mt-1 max-h-40 overflow-y-auto scrollbar-hide">
          <button
            onClick={() => handleSelect(field, "")}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
          >
            {placeholder}
          </button>
          {options.map((item, i) => (
            <button
              key={i}
              onClick={() => handleSelect(field, item)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="container m-auto px-[10px] py-[20px]">
      <Helmet>
          <title>Krutanic Alumni | Success Stories from E-Learning Leaders</title>
          <meta name="keywords" content="e-learning alumni, Krutanic graduates, tech careers, coding success, mentorship stories"/>
          <meta name="description" content="Explore how Krutanic alumni achieved career success through our top e-learning programs. Real stories in tech, coding, and data science mentorship."/>
          <meta property="og:title" content="Krutanic Alumni | Success Stories from E-Learning Leaders"/>
          <meta property="og:url" content="https://www.krutanic.com/Alumni"/>
          <meta property="og:image" content="https://www.krutanic.com/assets/LOGO3-Do06qODb.png"/>
          <meta property="og:description" content="Explore how Krutanic alumni achieved career success through our top e-learning programs. Real stories in tech, coding, and data science mentorship."/>
          <meta property="og:type" content="website"/>
          <meta name="twitter:card" content="summary"/>
          <meta name="twitter:title" content="Krutanic Alumni | Success Stories from E-Learning Leaders"/>
          <meta name="twitter:image" content="https://www.krutanic.com/assets/LOGO3-Do06qODb.png"/>
          <meta name="twitter:description" content="Explore how Krutanic alumni achieved career success through our top e-learning programs. Real stories in tech, coding, and data science mentorship."/>
          <link rel="canonical" href="https://www.krutanic.com/Alumni" />
      </Helmet>
      <h1 className="text-3xl font-bold mb-2">
        Krutanic Alumni
        <span className="inline-flex items-center text-[#F15B29] text-base border border-[#F15B29] rounded px-2 py-0.5 ml-2">
          ⭐ 4.9 <span className="text-gray-500 ml-1">(8,980 learners)</span>
        </span>
      </h1>
      <p className="text-gray-600 mb-6 max-w-4xl">
        At Krutanic, learners transform their careers, mastering coding and
        securing dream jobs.
      </p>
      <div className="bg-[#1A1A1A] text-white rounded-xl p-5 mb-6 flex flex-col md:flex-row gap-2 justify-end">
        <Dropdown
          field="post"
          placeholder="Select Company"
          options={uniqueValues.posts}
        />
        <span></span>
        <Dropdown
          field="location"
          placeholder="Select Location"
          options={uniqueValues.locations}
        />
        <span></span>
        <Dropdown
          field="role"
          placeholder="Select Job Role"
          options={uniqueValues.roles}
        />
        <span></span>
        <button
          onClick={handleSearch}
          className=" active:scale-105 duration-300 ease-linear bg-[#F15B29] px-4 w-full rounded-md text-white font-bold text-sm"
        >
          SEARCH ALUMNI
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredResults.length ? (
            [...filteredResults].reverse().map((alumni, i) => (
            <div
              key={i}
              className="border rounded-lg p-4 flex flex-col gap-4 cursor-pointer hover:scale-104 hover:shadow-lg"
              onClick={() => handleCardClick(alumni)}
            >
              <div className="flex gap-4 items-center">
                <div>
                  <h2 className="text-lg font-semibold">{alumni.name}</h2>
                  <div className="text-sm text-gray-600">
                    📍 {alumni.location}
                  </div>
                  <div className="text-yellow-500 mt-1">
                    {"⭐".repeat(alumni.rating)}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-700 flex justify-between items-center border-t pt-2">
                <div>
                  <div className="font-semibold text-gray-500">
                    Pre Krutanic
                  </div>
                  <div>{alumni.pre}</div>
                </div>
                <div className="text-2xl">➡️</div>
                <div>
                  <div className="font-semibold text-gray-500">
                    Post Krutanic
                  </div>
                  <div>{alumni.post}</div>
                  <p className="text-sm ">
                      <strong>Package :</strong> {alumni.package}
                    </p>
                </div>
              </div>
              <div className="text-right border-t">
                <button
                  className="text-blue-600 text-sm mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(alumni);
                  }}
                >
                  View Profile →
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No alumni found.</p>
        )}
      </div>
      {selectedAlumni && (
        <div className="fixed inset-0 px-1 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative w-full max-w-2xl bg-white rounded-lg p-3 max-h-[80vh] overflow-y-auto scrollbar-hide">
            <button
              onClick={handleCloseDialog}
              className="absolute top-0 right-3 text-xl font-bold"
              aria-label="Close dialog"
            >
              x
            </button>
            {!isFlipped ? (
              <>
                <div className="flex gap-4 items-center mb-4">
                  {/* <img
                    src={selectedAlumni.image}
                    alt={selectedAlumni.name}
                    className="w-24 h-24 rounded-full border-4 border-purple-700"
                  /> */}
                  <div>
                    <h2 className="text-xl font-bold">{selectedAlumni.name}
                    </h2>
                    <p className="text-sm">
                      {selectedAlumni.role} at  {selectedAlumni.post}
                    
                    </p>
                    {/* <p className="text-sm ">
                      Package : {selectedAlumni.package}
                    </p> */}
                      <a
                      href={selectedAlumni.linkdinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 border border-blue-600 text-blue-600 px-4 rounded cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-300"
                    >
                      In Connect
                    </a>
                  </div>
                </div>
                <div className="text-sm text-gray-700 mb-4">
                  <p>📍{selectedAlumni.location}</p>
                  <p>
                    {/* 🎓{selectedAlumni.college} | {selectedAlumni.degree} */}
                  </p>
                  <p>💼{selectedAlumni.experience}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-700 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Pre Krutanic</p>
                    <p className="font-semibold">{selectedAlumni.pre}</p>
                    <p className="text-xs">{selectedAlumni.preRole}</p>
                  </div>
                  <div className="text-2xl">➡️</div>
                  <div>
                    <p className="text-xs text-gray-500">Post Krutanic</p>
                    <p className="font-semibold">{selectedAlumni.post}</p>
                    
                    {/* <p className="text-xs">{selectedAlumni.postRole}</p> */}
                  </div>
                </div>
                <div className="border p-4 rounded bg-gray-100">
                  <div className="text-base font-semibold mb-1">
                    Connect 1-1 with Alumni
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    We will match you with the alumni based on their
                    availability.
                  </p>
                  <button
                    onClick={() => setIsFlipped(true)}
                    className="w-full bg-[#F15B29] text-white font-bold py-2 rounded"
                  >
                    REQUEST FOR 1-1 SESSION
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-md font-bold mb-4">
                  Take your career to the next level!
                </h2>
                {formErrors.general && (
                  <p className="text-red-500 text-sm mb-4">
                    {formErrors.general}
                  </p>
                )}
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <input
                      type="text"
                      name="fullName"
                      className="block w-full border border-gray-300 rounded-md p-2 text-sm"
                      placeholder="Full name"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="contact"
                      className="block w-full border border-gray-300 rounded-md p-2 text-sm"
                      placeholder="Contact number"
                      required
                    />
                    {formErrors.contact && (
                      <p className="text-red-500 text-xs">
                        {formErrors.contact}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      className="block w-full border border-gray-300 rounded-md p-2 text-sm"
                      placeholder="Email"
                      required
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs">{formErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="number"
                      name="graduationYear"
                      className="block w-full border border-gray-300 rounded-md p-2 text-sm"
                      placeholder="Graduation year"
                      required
                    />
                    {formErrors.graduationYear && (
                      <p className="text-red-500 text-xs">
                        {formErrors.graduationYear}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="currentCompany"
                      className="block w-full border border-gray-300 rounded-md p-2 text-sm"
                      placeholder="Current company"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      className="block w-full border border-gray-300 rounded-md p-2 text-sm"
                      placeholder="Years of experience"
                      required
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Select Advanced Domains
                    </p>
                    <div className="grid grid-rows-4 grid-flow-col gap-x-8">
                      {[
                        "Data Science",
                        "Digital Marketing",
                        "Investment Banking",
                        "Product Management",
                        "MERN Stack Development",
                        "Performance Marketing",
                        "Generative AI With Prompt Engineering",
                        "Automation Testing",
                      ].map((domain) => (
                        <div key={domain} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={domain}
                            name="advancedDomains"
                            value={domain}
                            className="h-3 w-3 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={domain}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {domain}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setIsFlipped(false)}
                      className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="bg-[#F15B29] text-white font-bold py-2 px-4 rounded"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Alumni;
