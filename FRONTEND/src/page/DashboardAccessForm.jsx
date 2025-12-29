import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const Dialog = ({ isOpen, onClose, fullname, errorMessage }) => {
  if (!isOpen) return null;

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
            <h3 className="mb-2 text-green-600 font-bold">
              Welcome to Krutanic!
            </h3>
            <p>
              Your dashboard access form has been submitted successfully.
            </p>
            <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> Our operation department will contact you within 24hrs regarding the further process.
              </p>
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
};

const DashboardAccessForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [alternativeEmail, setAlternativeEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [program, setProgram] = useState([]);
  const [counselor, setCounselor] = useState([]);
  const [domain, setDomain] = useState([]);
  const [programPrice, setProgramPrice] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [monthOpted, setMonthOpted] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [clearPaymentMonth, setClearPaymentMonth] = useState("");
  const [modeofpayment, setModeOfPayment] = useState("");
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [remainingAmount, setRemainingAmount] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [branch, setBranch] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [referFriend, setReferFriend] = useState("");
  const [internshipstartsmonth, setInternshipStartsMonth] = useState("");
  const [internshipendsmonth, setInternshipEndsMonth] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [course, setCourse] = useState([]);
  const [lead, setLead] = useState("");

  const [monthsToShow, setMonthsToShow] = useState([]);
  const [endsMonthsToShow, setEndsMonthsToShow] = useState([]);

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
      `${monthNames[(startMonthIndex + 1) % 12]} ${
        startMonthIndex + 1 > 11 ? nextYear + 1 : nextYear
      }`,
      `${monthNames[(startMonthIndex + 2) % 12]} ${
        startMonthIndex + 2 > 11 ? nextYear + 1 : nextYear
      }`,
    ];

    setMonthsToShow(months);
  }, []);
  // Dynamically calculate next 6 months based on selected start month
  useEffect(() => {
    if (!internshipstartsmonth) return;

    const [startMonthName, startYearStr] = internshipstartsmonth.split(" ");
    const startMonthIndex = monthNames.indexOf(startMonthName);
    const startYear = parseInt(startYearStr);

    const ends = [1, 2, 3, 4, 5, 6].map((offset) => {
      const index = (startMonthIndex + offset) % 12;
      const year = startMonthIndex + offset > 11 ? startYear + 1 : startYear;
      return `${monthNames[index]} ${year}`;
    });

    setEndsMonthsToShow(ends);
    setInternshipEndsMonth(""); // Reset end month when start month changes
  }, [internshipstartsmonth]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API}/getcourses`);
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
    setAlternativeEmail("");
    setProgram("");
    setCounselor("");
    setDomain("");
    setProgramPrice("");
    setPaidAmount("");
    setRemainingAmount("");
    setMonthOpted("");
    setTransactionId("");
    setCollegeName("");
    setBranch("");
    setAadharNumber("");
    setClearPaymentMonth("");
    setModeOfPayment("");
    setReferFriend("");
    setInternshipStartsMonth("");
    setInternshipEndsMonth("");
    setYearOfStudy("");
    navigate("/dashboardaccessform");
  };

  const [getTransactionId, setGetTransactionId] = useState([]);
  const getTransactionIdList = async () => {
    try {
      const response = await axios.get(`${API}/gettransactionwithname`);
      setGetTransactionId(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTransactionIdList();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    setIsSubmitting(true);
    event.preventDefault();

    const formData = {
      fullname: fullname,
      email: email.trim(),
      alternativeEmail: alternativeEmail.trim(),
      phone: phone,
      program: program,
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
      collegeName: collegeName,
      branch: branch,
      aadharNumber: aadharNumber,
      referFriend: referFriend,
      internshipstartsmonth: internshipstartsmonth,
      internshipendsmonth: internshipendsmonth,
      yearOfStudy: yearOfStudy,
      lead: lead.trim(),
    };

    if (
      getTransactionId.transaction.includes(email) &&
      getTransactionId.counselor.includes(counselor)
    ) {
      try {
        let response = await axios.post(`${API}/newstudentenroll`, formData);

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
            "An error occurred while processing your request.";
        } else if (error.request) {
          errMessage = "No response from the server. Please try again later.";
        }

        if (errMessage.includes("already submitted")) {
          errMessage = "You have already submitted your details.";
        }
        setErrorMessage(errMessage);
        setIsModalOpen(true);
      }
    } else {
      toast.error("Enter valid email and try again.");
      resetForm();
      window.location.reload();
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  // const handleEmailChange = (e) => {
  //   const enteredEmail = e.target.value.trim();
  //   setEmail(enteredEmail);
  //   if (getTransactionId.transaction.includes(enteredEmail)) {
  //     const matchedCounselor = getTransactionId.counselor.find((counselorItem, index) => getTransactionId.transaction[index] === enteredEmail);
  //      const matchedLead = getTransactionId.lead.find((counselorItem, index) => getTransactionId.transaction[index] === enteredEmail);
  //     console.log("Matched Counselor:", matchedCounselor);
  //     console.log("Counselor lead:", matchedLead);
  //     if (matchedCounselor) {
  //       setCounselor(matchedCounselor);
  //     }
  //   }
  // };

  const handleEmailChange = (e) => {
  const enteredEmail = e.target.value.trim();
  setEmail(enteredEmail);

  // Defensive nullish checks
  if (getTransactionId?.transaction?.includes(enteredEmail)) {
    const index = getTransactionId.transaction.indexOf(enteredEmail);

    const matchedCounselor = getTransactionId.counselor?.[index];
    const matchedLead = getTransactionId.lead?.[index];

    console.log("Matched Counselor:", matchedCounselor);
    console.log("Counselor Lead:", matchedLead);

    if (matchedCounselor) {
      setCounselor(matchedCounselor);
    }
    if (matchedLead) {
      setLead(matchedLead);
    }
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
      <div className="container m-auto">
        <div className="marquee-container">
      <div className="marquee-text">
        <strong>Kind Reminder:</strong> Please ensure that you complete the <strong>Dashboard Access
        Form on the same day your payment is made.</strong> Submissions will not be
        accepted on the following day or any later date, and access will not
        be granted if the form is not submitted on time (We appreciate your
        understanding and adherence to this policy).
      </div>
    </div>

        <h2 className="mt-2">DashBoard Access Form</h2>
        <form onSubmit={handleSubmit}>
          <div className=" grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[10px]">
            <div className="input-field">
              <input
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
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
                value={alternativeEmail}
                onChange={(e) => setAlternativeEmail(e.target.value)}
                type="email"
                required
              />
              <label htmlFor="College Email">College Email</label>
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
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              required
            >
              <option value="" selected disabled>
                {" "}
                Mode of Program
              </option>
            <option value="Self-Guided [2 Months – Training & Internship]">Self-Guided [2 Months – Training & Internship]</option>
           <option value="Instructor-Led [2 Months – Training & Internship]">Instructor-Led [2 Months – Training & Internship]</option>
         <option value="Career Advancement [3 Months – Training, Internship & Placement Assistance]">Career Advancement [3 Months – Training, Internship & Placement Assistance]</option>

            </select>

            <select
              value={modeofpayment}
              onChange={(e) => setModeOfPayment(e.target.value)}
              required
            >
              <option value="" selected disabled>
                {" "}
                Mode of Payment
              </option>
              <option value="RazorPay">RazorPay</option>
              <option value="QR Code">QR Code</option>
              <option value="EaseBuZZ">EaseBuZZ</option>
              <option value="PayPal">PayPal</option>
            </select>

            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
            >
              <option value="" selected disabled>
                Select Opted Domain
              </option>
              {course.map((item) => (
                <option value={item.title}>{item.title}</option>
              ))}
            </select>

            <select
              value={monthOpted}
              onChange={(e) => setMonthOpted(e.target.value)}
              required
            >
              <option value="" selected disabled>
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

            <div className="input-field">
              <input
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                type="text"
                required
              />
              <label htmlFor=" College Name"> College Name</label>
            </div>

            <div className="input-field">
              <input
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                type="text"
                required
              />
              <label htmlFor="Branch/Department Name">Branch/Department</label>
            </div>

            <select
              value={yearOfStudy}
              onChange={(e) => setYearOfStudy(e.target.value)}
              required
            >
              <option value="" disabled>
                Year of Study
              </option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Graduated">Graduated</option>
            </select>

            <div className="input-field">
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required
              />
              <label htmlFor="Transaction ID">Transaction ID</label>
            </div>

            <div className="input-field">
              <input
                type="number"
                value={aadharNumber}
                onChange={(e) => setAadharNumber(e.target.value)}
                required
              />
              <label htmlFor="Aadhar Number">Aadhar Number</label>
            </div>

            <div style={{ display: "flex" }}>
              <label htmlFor="">Due date for clear payment ?</label>
              <input
                value={clearPaymentMonth}
                onChange={(e) => setClearPaymentMonth(e.target.value)}
                type="date"
                name=""
                id=""
                required
                min={minDate}
                max={maxDate}
              />
            </div>

            <select
              value={internshipstartsmonth}
              onChange={(e) => setInternshipStartsMonth(e.target.value)}
              required
            >
              <option value="" selected disabled>
                Internship starts month
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
              disabled={!internshipstartsmonth}
            >
              <option value="" disabled>
                Internship ends month
              </option>
              {endsMonthsToShow.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>

            

          </div>

          <div className="mt-5">
            Refer your friends to earn cashback.
            <textarea
              value={referFriend}
              onChange={(e) => setReferFriend(e.target.value)}
              name="refer"
              id="refer"
              placeholder="Name and Contact Number"
              cols={60}
              rows={3}
              required
              className="resize-none"
            ></textarea>
          </div>

          <input
            className="cursor-pointer"
            disabled={isSubmitting}
            type="submit"
            value="Submit"
          />
        </form>
        <Dialog
          isOpen={isModalOpen}
          onClose={closeModal}
          fullname={fullname}
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
    borderRadius: "5px",
    width: "content",
    textAlign: "center",
  },
};

export default DashboardAccessForm;
