import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa";
import "../style/OnBoardingForm.css";

const Dialog = ({ isOpen, onClose, fullname, errorMessage, email, counselor, domain, monthOpted }) => {
  if (!isOpen) return null;

  // Create WhatsApp message with user details
  const whatsappMessage = `Hello,\n I am ${fullname}.\n Email: ${email}.\n Domain: ${domain}.\n Opted Month: ${monthOpted}.\n Kindly confirm my details`;
  const whatsappLink = `https://wa.me/917829102936?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        {errorMessage ? (
          <div>
            <h2>{errorMessage}</h2>
            <p className="text-xs whitespace-nowrap mt-2">
              NOTE: if you have any doubt feel free to contact your counselor
              for more details.
            </p>
          </div>
        ) : (
          <div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              Thank you for registration!
            </h3>
            <h3 className="mb-2 text-green-600 font-bold">
              Welcome to Krutanic Advance Program!
            </h3>
            <p>
              Your advance program dashboard access form has been submitted successfully.
            </p>
            <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> Please contact your assigned operations executive <br />Bhumika HK <br /> 7829102936<br /> bhumika@krutanic.org
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
              >
                <FaWhatsapp size={20} />
                Contact on WhatsApp
              </a>
            </div>
          </div>
        )}
        <button
          className="bg-red-600 float-right rounded-md px-6 py-2 text-white mt-8"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

const AdvanceDashboardAccess = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Helper function to format name to Title Case
  const toTitleCase = (value) => {
    if (!value) return "";
    // Check if the value ends with a space (user is typing a new word)
    const endsWithSpace = value.endsWith(" ");
    const formatted = value
      .split(/\s+/)
      .filter((word) => word.length > 0)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    // Preserve trailing space so user can continue typing
    return endsWithSpace ? formatted + " " : formatted;
  };

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [counselor, setCounselor] = useState("");
  const [domain, setDomain] = useState("");
  const [programPrice, setProgramPrice] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [monthOpted, setMonthOpted] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [clearPaymentMonth, setClearPaymentMonth] = useState("");
  const [modeofpayment, setModeOfPayment] = useState("");
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [remainingAmount, setRemainingAmount] = useState("");
  const [experience, setExperience] = useState("");
  const [paymentPlan, setPaymentPlan] = useState("");
  const [referFriend, setReferFriend] = useState("");
  const [yearOfPassingOut, setYearOfPassingOut] = useState("");
  const [course, setCourse] = useState([]);
  const [lead, setLead] = useState("");
  const [languages, setLanguages] = useState(["English"]);
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [internshipstartsmonth, setInternshipStartsMonth] = useState("");
  const [internshipendsmonth, setInternshipEndsMonth] = useState("");
  const [batchTiming, setBatchTiming] = useState("");

  const LANGUAGE_OPTIONS = ["English", "Hindi", "Kannada", "Telugu", "Tamil", "Malayalam", "Bengali"];

  const [monthsToShow, setMonthsToShow] = useState([]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth(); // 0-based index
    const currentDay = currentDate.getDate();
    const currentYear = currentDate.getFullYear();

    let months = [];
    let startMonthIndex;

    // Agar date 1 se 7 ke beech hai, toh current month se list shuru hogi
    if (currentDay >= 1 && currentDay <= 7) {
      startMonthIndex = currentMonthIndex;
    } else {
      // Warna agle month se shuru hoga
      startMonthIndex = currentMonthIndex + 1;
    }

    // Handle December case (Agar December hai toh agla saal start ho jayega)
    const nextYear = startMonthIndex > 11 ? currentYear + 1 : currentYear;
    startMonthIndex = startMonthIndex % 12;

    months = [
      `${monthNames[startMonthIndex]} ${nextYear}`,
      `${monthNames[(startMonthIndex + 1) % 12]} ${startMonthIndex + 1 > 11 ? nextYear + 1 : nextYear
      }`,
      `${monthNames[(startMonthIndex + 2) % 12]} ${startMonthIndex + 2 > 11 ? nextYear + 1 : nextYear
      }`,
      `${monthNames[(startMonthIndex + 3) % 12]} ${startMonthIndex + 3 > 11 ? nextYear + 1 : nextYear
      }`,
      `${monthNames[(startMonthIndex + 4) % 12]} ${startMonthIndex + 4 > 11 ? nextYear + 1 : nextYear
      }`,
      `${monthNames[(startMonthIndex + 5) % 12]} ${startMonthIndex + 5 > 11 ? nextYear + 1 : nextYear
      }`,
    ];

    setMonthsToShow(months);
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API}/getadvcourses`);
      setCourse(response.data);
    } catch (error) {
      console.error("There was an error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const navigate = useNavigate();
  const resetForm = () => {
    setFullname("");
    setEmail("");
    setPhone("");
    setWhatsAppNumber("");
    setCounselor("");
    setDomain("");
    setProgramPrice("");
    setPaidAmount("");
    setRemainingAmount("");
    setMonthOpted("");
    setTransactionId("");
    setExperience("");
    setPaymentPlan("");
    setClearPaymentMonth("");
    setModeOfPayment("");
    setReferFriend("");
    setYearOfPassingOut("");
    setLanguages(["English"]);
    setCompanyName("");
    setRole("");
    setInternshipStartsMonth("");
    setInternshipEndsMonth("");
    setBatchTiming("");
    navigate("/advancedashboardaccess");
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const handleSubmit = async (event) => {
    setIsSubmitting(true);
    event.preventDefault();

    const formData = {
      fullname: fullname,
      email: email.trim(),
      phone: phone,
      counselor: counselor.trim(),
      domain: domain.trim(),
      programPrice: programPrice,
      paidAmount: paidAmount,
      monthOpted: monthOpted,
      transactionId: transactionId,
      clearPaymentMonth: clearPaymentMonth,
      modeofpayment: modeofpayment,
      whatsAppNumber: whatsAppNumber,
      remainingAmount: remainingAmount,
      experience: experience,
      paymentPlan: paymentPlan,
      referFriend: referFriend,
      yearOfPassingOut: yearOfPassingOut,
      lead: lead.trim(),
      languages: languages,
      companyName: companyName,
      role: role,
      internshipstartsmonth: internshipstartsmonth,
      internshipendsmonth: internshipendsmonth,
      program: domain.trim(),
      batchTiming: batchTiming
    };

    if (isEmailVerified) {
      try {
        let response = await axios.post(`${API}/advenroll`, formData);

        if (response.status === 200 || response.status === 201) {
          setIsModalOpen(true);
        } else {
          toast.error("Error submitting the form.");
          resetForm();
        }
      } catch (error) {
        let errMessage = "An error occurred.";
        if (error.response) {
          errMessage =
            error.response.data?.message ||
            error.response.data?.error ||
            "An error occurred while processing your request.";
        } else if (error.request) {
          errMessage = "No response from the server. Please try again later.";
        }

        if (errMessage.toString().toLowerCase().includes("already submitted")) {
          errMessage = "You have already submitted your details.";
        }
        setErrorMessage(errMessage);
        setIsModalOpen(true);
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please enter a valid registered email.");
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };


  const handleEmailChange = async (e) => {
    const enteredEmail = e.target.value.trim();
    setEmail(enteredEmail);
    setIsEmailVerified(false); // Reset verification on change

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(enteredEmail)) {
      try {
        const response = await axios.post(`${API}/verify-transaction-email`, { email: enteredEmail });
        
        if (response.data.success) {
          setCounselor(response.data.counselor || "");
          setLead(response.data.lead || "");
          setIsEmailVerified(true);
          console.log("Email verified successfully");
        }
      } catch (error) {
        console.error("Verification failed:", error.response?.data?.message || error.message);
        setCounselor("");
        setLead("");
        setIsEmailVerified(false);
      }
    } else {
      setCounselor("");
      setLead("");
    }
  };




  useEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonthIndex = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    // Set minDate to today
    const minDate = currentDate.toISOString().split("T")[0];

    let maxDate;

    // If today is between the 1st and 5th, set maxDate to the 5th of the current month
    if (currentDay >= 1 && currentDay <= 5) {
      maxDate = new Date(currentYear, currentMonthIndex, 5)
        .toISOString()
        .split("T")[0];
    } else {
      // If today is after the 5th, set maxDate to 5 days from today
      maxDate = new Date(currentDate.setDate(currentDate.getDate() + 5))
        .toISOString()
        .split("T")[0];
    }

    setMinDate(minDate);
    setMaxDate(maxDate);
  }, []);

  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");



  useEffect(() => {
    const today = new Date();
    const minDate = today.toISOString().split("T")[0];
    const maxDate = new Date(today.setDate(today.getDate() + 5))
      .toISOString()
      .split("T")[0];
    setMinDate(minDate);
    setMaxDate(maxDate);
  }, [monthOpted, monthsToShow]);

  return (
    <div id="onboardingform">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container m-auto px-4 sm:px-6">
        <div className="marquee-container">
          <div className="marquee-text">
            <strong>Kind Reminder:</strong> Please ensure that you complete the <strong>Dashboard Access
              Form on the same day your payment is made.</strong> Submissions will not be
            accepted on the following day or any later date, and access will not
            be granted if the form is not submitted on time (We appreciate your
            understanding and adherence to this policy).
          </div>
        </div>

        <h2 className="mt-2">Advance Program DashBoard Access Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
            <div className="input-field">
              <input
                value={fullname}
                onChange={(e) => setFullname(toTitleCase(e.target.value))}
                type="text"
                required
              />
              <label htmlFor="fullname">Full Name</label>
            </div>

            <div className="input-field">
              <input
                value={email}
                onChange={handleEmailChange}
                // onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
              <label htmlFor="email">Email</label>
            </div>

            <div className="input-field">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="number"
                required
              />
              <label htmlFor=" Contact No">Contact No</label>
            </div>

            <div className="input-field">
              <input
                value={whatsAppNumber}
                onChange={(e) => setWhatsAppNumber(e.target.value)}
                type="number"
                required
              />
              <label htmlFor=" Whatsapp Number">Whatsapp Number</label>
            </div>

            <div className="input-field">
              <input
                type="text"
                value={counselor}
                onChange={(e) => setCounselor(e.target.value)}
                required
              />
              <label htmlFor="Counselor Name">Counselor Name</label>
            </div>

            <select
              value={modeofpayment}
              onChange={(e) => setModeOfPayment(e.target.value)}
              required
            >
              <option value="" disabled>
                Mode of Payment
              </option>
              <option value="RazorPay">RazorPay</option>
              <option value="QR Code">QR Code</option>
              <option value="EaseBuZZ">EaseBuZZ</option>
              <option value="PayPal">PayPal</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
            </select>

            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Opted Domain
              </option>
              {course.map((item) => (
                <option key={item._id || item.title} value={item.title}>{item.title}</option>
              ))}
            </select>

            <select
              value={monthOpted}
              onChange={(e) => setMonthOpted(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Opted Month
              </option>
              {monthsToShow.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>

            <div className="input-field">
              <input
                value={programPrice}
                onChange={(e) => setProgramPrice(e.target.value)}
                type="number"
                required
              />
              <label htmlFor="Program Price">Program Price</label>
            </div>

            <div className="input-field">
              <input
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                type="number"
                required
              />
              <label htmlFor="Paid Amount">Paid Amount</label>
            </div>

            <div className="input-field">
              <input
                value={remainingAmount}
                onChange={(e) => setRemainingAmount(e.target.value)}
                type="number"
                required
              />
              <label htmlFor="Remaining Amount">Remaining Amount</label>
            </div>

            <select
              value={paymentPlan}
              onChange={(e) => setPaymentPlan(e.target.value)}
              required
            >
              <option value="" disabled>
                Choose a payment plan that works best for you:
              </option>
              <option value="Pay in Full (One-time payment)">Pay in Full (One-time payment)</option>
              <option value="Pay in 3 Easy Installments">Pay in 3 Easy Installments</option>
              <option value="No Cost EMI (0% Interest) Upto 9 Months">No Cost EMI (0% Interest) Upto 9 Months</option>
            </select> 

            <div className="input-field">
              <input
                value={yearOfPassingOut}
                onChange={(e) => setYearOfPassingOut(e.target.value)}
                type="text"
                placeholder=""
                required
              />
              <label htmlFor="Year of Passing Out">Year of Passing Out</label>
            </div>

            <div className="input-field">
              <input
                value={companyName}
                onChange={(e) => setCompanyName(toTitleCase(e.target.value))}
                type="text"
              />
              <label htmlFor="Company Name">Company Name (if working)</label>
            </div>

            <div className="input-field">
              <input
                value={role}
                onChange={(e) => setRole(toTitleCase(e.target.value))}
                type="text"
              />
              <label htmlFor="Role">Role (if working)</label>
            </div>

            <div className="input-field">
              <input
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                type="text"
                required
              />
              <label htmlFor="Experience">Experience</label>
            </div>

            <div className="input-field">
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required
              />
              <label htmlFor="Transaction ID">Transaction ID</label>
            </div>

              <div className="input-field col-span-1 md:col-span-2 lg:col-span-3">
                <div
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="w-full p-[10px] border border-[#CCCCCC] rounded-[10px] bg-white cursor-pointer flex justify-between items-center transition-all duration-200"
                  style={{ minHeight: '44px', backgroundColor: '#ffffff' }}
                >
                  <span className={`text-sm ${languages.length > 0 ? "text-gray-800" : "text-transparent"}`}>
                    {languages.length > 0 ? languages.join(", ") : "."}
                  </span>
                  <svg className={`w-4 h-4 text-[#8d8d8d] transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <label
                  style={{
                    position: 'absolute',
                    left: '15px',
                    pointerEvents: 'none',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#ffffff',
                    padding: '0 5px',
                    zIndex: 2,
                    ...(languages.length > 0 || isLangDropdownOpen 
                      ? { top: '-10px', transform: 'translateY(0) scale(0.85)', color: '#F15B29', fontWeight: 'bold' }
                      : { top: '50%', transform: 'translateY(-50%)', color: '#8d8d8d' }
                    )
                  }}
                >
                  Languages Known
                </label>
                {isLangDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsLangDropdownOpen(false)}
                    ></div>
                    <div 
                      className="absolute z-50 w-full mt-1 border border-[#CCCCCC] rounded-[10px] shadow-xl max-h-60 overflow-y-auto lang-dropdown-list"
                    >
                      {LANGUAGE_OPTIONS.map((lang) => (
                        <div
                          key={lang}
                          onClick={() => {
                            setLanguages((prev) =>
                              prev.includes(lang)
                                ? prev.filter((l) => l !== lang)
                                : [...prev, lang]
                            );
                          }}
                          className="flex items-center p-3 cursor-pointer border-b border-gray-50 last:border-b-0 lang-dropdown-item"
                        >
                          <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors duration-200 ${
                            languages.includes(lang) ? "bg-[#F15B29] border-[#F15B29]" : "bg-white border-gray-300"
                          }`}>
                            {languages.includes(lang) && (
                              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-sm lang-dropdown-text ${languages.includes(lang) ? "selected" : ""}`}>
                            {lang}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

            <div className="input-field">
              <input
                value={clearPaymentMonth}
                onChange={(e) => setClearPaymentMonth(e.target.value)}
                type="date"
                name=""
                id="clearPaymentMonth"
                required
                min={minDate}
                max={maxDate}
              />
              <label htmlFor="clearPaymentMonth">Next instalment to clear the payment</label>
            </div>

            <select
              value={internshipstartsmonth}
              onChange={(e) => setInternshipStartsMonth(e.target.value)}
              required
            >
              <option value="" disabled>
                Internship Start Month
              </option>
              {monthsToShow.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={internshipendsmonth}
              onChange={(e) => setInternshipEndsMonth(e.target.value)}
              required
            >
              <option value="" disabled>
                Internship End Month
              </option>
              {monthsToShow.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={batchTiming}
              onChange={(e) => setBatchTiming(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Batch Timing
              </option>
              <option value="Monday-Friday (8:00 pm - 9:30 pm)">
                Monday-Friday (8:00 pm - 9:30 pm)
              </option>
              <option value="Saturday-Sunday (1 to 2 hours per day)">
                Saturday-Sunday (1 to 2 hours per day)
              </option>
            </select>

          </div>

          <div className="mt-6">
            <label className="text-gray-700 font-medium mb-2 block">Refer your friends to earn cashback.</label>
            <textarea
              value={referFriend}
              onChange={(e) => setReferFriend(e.target.value)}
              name="refer"
              id="refer"
              placeholder="Name and Contact Number"
              rows={3}
              required
              className="resize-none w-full border border-[#CCCCCC] rounded-[10px] p-3 mt-1 focus:outline-none focus:border-[#F15B29] transition-colors duration-200"
            ></textarea>
          </div>

          <input
            className="cursor-pointer w-full mt-8 bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors duration-200"
            disabled={isSubmitting}
            type="submit"
            value={isSubmitting ? "Submitting..." : "Submit"}
          />
        </form>
        <Dialog
          isOpen={isModalOpen}
          onClose={closeModal}
          fullname={fullname}
          email={email}
          counselor={counselor}
          domain={domain}
          monthOpted={monthOpted}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
};

const styles = {
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modalContent: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "500px",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  },
};

export default AdvanceDashboardAccess;
