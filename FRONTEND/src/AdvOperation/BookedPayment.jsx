import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";
import { RiMailSendFill } from "react-icons/ri";
import { PiLockKeyOpenFill, PiLockKeyFill } from "react-icons/pi";
import { FaUserTimes } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa";

// VERSION: 2026-01-08-v2 - Year-aware month filtering fix

const BookedAmount = () => {
  const [iscourseFormVisible, setiscourseFormVisible] = useState(false);
  const resetForm = () => {
    setiscourseFormVisible(false);
    setFullname("");
    setEmail("");
    setPhone("");
    setWhatsAppNumber("");
    setCounselor("");
    setDomain("");
    setProgramPrice("");
    setPaidAmount("");
    setRemainingAmount(0);
    setMonthOpted("");
    setClearPaymentMonth("");
    setModeofpayment("");
    setCollegeName("");
    setBranch("");
    setYearOfPassingOut("");
    setCompanyName("");
    setRole("");
    setTransactionId("");
    setInternshipstartsmonth("");
    setInternshipendsmonth("");
    setBatchTiming("");
    setReferFriend("");
    setLanguages(["English"]);
    setEditingStudentId(null);
  };
  const [course, setCourse] = useState([]);

  const [offerData, setOfferData] = useState(null);
  const [offerDate, setOfferDate] = useState("");
  const [offerDuration, setOfferDuration] = useState("");
  const [offerStart, setOfferStart] = useState("");
  const [offerEnd, setOfferEnd] = useState("");
  const [offerLocation, setOfferLocation] = useState("Online");
  const [isOfferLetterSending, setIsOfferLetterSending] = useState(false);

  const resetOfferLeter = () => {
    setOfferData(null);
    setOfferDate("");
    setOfferDuration("");
    setOfferStart("");
    setOfferEnd("");
    setOfferLocation("Online");
  };

  const sendOfferleter = async (e) => {
    e.preventDefault();
    setIsOfferLetterSending(true);

    const offerLetterDetails = {
      id: offerData._id,
      fullname: offerData.fullname
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" "),
      domain: offerData.domain,
      email: offerData.email,
      date: new Date(offerDate).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      duration: offerDuration,
      start: new Date(offerStart).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      end: new Date(offerEnd).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      location: offerLocation,
      smtpConfig: 'SMTP_MAIL2',
    };
    // console.log("Sending Offer Letter:", offerLetterDetails);
    try {
      const response = await axios.post(
        `${API}/sendofferletter`,
        offerLetterDetails
      );
      toast.success("Offer letter sent successfully");
      fetchNewStudent();
      resetOfferLeter();
    } catch (error) {
      console.error("There was an error sending the offer letter:", error);
    } finally {
      setIsOfferLetterSending(false); // Ensure this always executes
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API}/getadvcourses`);
      setCourse(response.data);
    } catch (error) {
      console.error("There was an error fetching courses:", error);
    }
  };
  const [bda, setBda] = useState([]);
  const fetchBda = async () => {
    try {
      const response = await axios.get(`${API}/getbda`);
      setBda(response.data);
    } catch (error) {
      console.error("There was an error fetching courses:", error);
    }
  };
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [counselor, setCounselor] = useState("");
  const [domain, setDomain] = useState("");
  const [programPrice, setProgramPrice] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [monthOpted, setMonthOpted] = useState("");
  const [monthsToShow, setMonthsToShow] = useState([]);
  const [clearPaymentMonth, setClearPaymentMonth] = useState("");
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [modeofpayment, setModeofpayment] = useState("");
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [collegeName, setCollegeName] = useState("");
  const [branch, setBranch] = useState("");
  const [yearOfPassingOut, setYearOfPassingOut] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [internshipstartsmonth, setInternshipstartsmonth] = useState("");
  const [internshipendsmonth, setInternshipendsmonth] = useState("");
  const [batchTiming, setBatchTiming] = useState("");
  const [referFriend, setReferFriend] = useState("");
  const [languages, setLanguages] = useState(["English"]);
  const [newStudent, setNewStudent] = useState([]);
  const [editingStudentId, setEditingStudentId] = useState(null);

  useEffect(() => {
    const price = parseFloat(programPrice) || 0;
    const paid = parseFloat(paidAmount) || 0;
    setRemainingAmount(price - paid);
  }, [programPrice, paidAmount]);

  const handleLanguageChange = (lang) => {
    setLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!operationData) {
      toast.error("Operation data not loaded. Please wait or refresh.");
      return;
    }

    const formData = {
      fullname,
      email: email.trim(),
      phone,
      whatsAppNumber,
      counselor: counselor.trim(),
      domain: domain.trim(),
      programPrice,
      paidAmount,
      remainingAmount,
      monthOpted,
      modeofpayment,
      collegeName,
      branch,
      yearOfPassingOut,
      companyName,
      role,
      transactionId,
      languages,
      internshipstartsmonth,
      internshipendsmonth,
      referFriend,
      clearPaymentMonth,
      operationName: operationData.fullname,
      operationId: operationData._id,
      batchTiming,
    };
    try {
      let response;
      if (editingStudentId) {
        response = await axios.put(
          `${API}/editadvstudentdetails/${editingStudentId}`,
          formData
        );
      } else {
        response = await axios.post(`${API}/advenroll`, formData);
      }
      if (response.status === 200 || response.status === 201) {
        toast.success(
          editingStudentId
            ? "Student updated successfully."
            : "Form submitted successfully."
        );
        fetchNewStudent();
        resetForm();
      } else {
        toast.error("Error submitting the form.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
      toast.error(`Error: ${errorMsg}`);
    }
  };

  const fetchNewStudent = async () => {
    const operationName = localStorage.getItem("advOperationName");
    try {
      // Operations need all records to filter by month across 4 months
      const response = await axios.get(`${API}/getadvenrolls?all=true`);
      const bookedStudents = response.data.filter(
        (item) =>
          item.status === "booked" && item.operationName === operationName
      );
      console.log(`📊 Total booked students for ${operationName}:`, bookedStudents.length);
      setNewStudent(bookedStudents);
      setFilteredStudents(bookedStudents);

      const currentMonth = getCurrentMonth();
      setSelectedMonth(currentMonth);

      // Filter the students based on the current month by default
      const filtered = bookedStudents.filter(
        (student) => getMonthFromDate(student.createdAt) === currentMonth
      );
      console.log(`📅 Students in ${currentMonth}:`, filtered.length);
      setFilteredStudents(filtered);
    } catch (error) {
      console.error("There was an error fetching new student:", error);
    }
  };
  const [remarks, setRemarks] = useState("");
  const handleRemarkChange = async (e, studentId) => {
    const selectedRemark = e.target.value;
    if (!selectedRemark) {
      console.error("No remark selected");
      return;
    }
    setRemarks(selectedRemark);
    if (selectedRemark && studentId) {
      try {
        const response = await axios.post(`${API}/updateremark`, {
          remark: selectedRemark,
          studentId: studentId,
        });
        if (response.status === 200) {
          toast.success(response.data.message);
          // Update local state to reflect the new remark immediately
          setNewStudent((prev) =>
            prev.map((student) =>
              student._id === studentId
                ? { ...student, remark: [...student.remark, selectedRemark] }
                : student
            )
          );
          setFilteredStudents((prev) =>
            prev.map((student) =>
              student._id === studentId
                ? { ...student, remark: [...student.remark, selectedRemark] }
                : student
            )
          );
        } else {
          toast.error(response.data.error);
        }
      } catch (error) {
        toast.error("An error occurred while updating the remark.");
      }
    }
  };

  const handleEdit = (studentId) => {
    const isConfirmed = window.confirm("Are you sure you want to edit this?");
    if (isConfirmed) {
      const student = newStudent.find((item) => item._id === studentId);
      setEditingStudentId(student._id);
      setFullname(student.fullname);
      setEmail(student.email);
      setPhone(student.phone);
      setWhatsAppNumber(student.whatsAppNumber || "");
      setCounselor(student.counselor || "");
      setDomain(student.domain || "");
      setProgramPrice(student.programPrice || "");
      setPaidAmount(student.paidAmount || "");
      setRemainingAmount(student.remainingAmount || 0);
      setMonthOpted(student.monthOpted || "");
      setClearPaymentMonth(
        student.clearPaymentMonth
          ? new Date(student.clearPaymentMonth).toISOString().split("T")[0]
          : ""
      );
      setModeofpayment(student.modeofpayment || "");
      setCollegeName(student.collegeName || "");
      setBranch(student.branch || "");
      setYearOfPassingOut(student.yearOfStudy || student.yearOfPassingOut || "");
      setCompanyName(student.companyName || "");
      setRole(student.role || "");
      setTransactionId(student.transactionId || "");
      setInternshipstartsmonth(student.internshipstartsmonth || "");
      setInternshipendsmonth(student.internshipendsmonth || "");
      setBatchTiming(student.batchTiming || "");
      setReferFriend(student.referFriend || "");
      setLanguages(student.languages || ["English"]);
      setiscourseFormVisible(true);
    }
  };

  const [operationData, setOperationData] = useState(null);
  const fetchOperationData = async () => {
    const operationId = localStorage.getItem("advOperationId");
    try {
      const response = await axios.get(`${API}/getadvoperation`, {
        params: { operationId },
      });
      setOperationData(response.data);
    } catch (err) {
      console.log("Failed to fetch user data");
    }
  };

  useEffect(() => {
    console.log("🚀 BookedPayment component mounted - Starting data fetch...");
    fetchCourses();
    fetchBda();
    fetchNewStudent();
    fetchOperationData();
    const monthsArray = getPastMonths();
    console.log("🔍 DEBUG: Months array =", monthsArray);
    console.log("🔍 DEBUG: Current month =", getCurrentMonth());
    setMonths(monthsArray);
  }, []);

  const handleSendEmail = async (value) => {
    if (value.isSending) return;
    value.isSending = true;
    const emailData = {
      fullname: value.fullname,
      email: value.email,
      phone: value.phone,
      program: value.program,
      counselor: value.counselor,
      domain: value.domain,
      clearPaymentMonth: value.clearPaymentMonth,
      monthOpted: value.monthOpted,
    };
    try {
      const response = await axios.post(`${API}/send-email`, emailData);
      if (response.status === 200) {
        toast.success("Email sent successfully!");
        const studentData = {
          mailSended: true,
        };
        const updateResponse = await axios.put(
          `${API}/mailsendedchange/${value._id}`,
          studentData
        );
        if (updateResponse.status === 200) {
          toast.success("Operation record updated successfully!");
          setNewStudent((prev) =>
            prev.map((student) =>
              student._id === value._id
                ? { ...student, mailSended: true }
                : student
            )
          );
          setFilteredStudents((prev) =>
            prev.map((student) =>
              student._id === value._id
                ? { ...student, mailSended: true }
                : student
            )
          );
        } else {
          toast.error("Failed to update student record.");
        }
      } else {
        toast.error("Failed to send email.");
      }
    } catch (error) {
      toast.error("An error occurred while sending the email.");
    } finally {
      value.isSending = false;
    }
  };

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const handleDialogOpen = (item) => {
    setDialogData(item);
    setDialogVisible(true);
  };

  const handleDialogClose = () => {
    setDialogVisible(false);
    setDialogData(null);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    const filtered = newStudent.filter((student) => {
      return (
        (student.email &&
          student.email.toLowerCase().includes(value.toLowerCase())) ||
        (student.phone &&
          student.phone.toLowerCase().includes(value.toLowerCase())) ||
        (student.fullname &&
          student.fullname.toLowerCase().includes(value.toLowerCase())) ||
        (student.counselor &&
          student.counselor.toLowerCase().includes(value.toLowerCase())) ||
        (student.operationName &&
          student.operationName.toLowerCase().includes(value.toLowerCase())) ||
        (student.createdAt &&
          student.createdAt.toLowerCase().includes(value.toLowerCase())) ||
        (student.clearPaymentMonth &&
          student.clearPaymentMonth
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (student.collegeName &&
          student.collegeName.toLowerCase().includes(value.toLowerCase())) ||
        (student.branch &&
          student.branch.toLowerCase().includes(value.toLowerCase()))
      );
    });
    setFilteredStudents(filtered);
  };

  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");



  const handleAddNewCandidate = () => {
    resetForm();
    setEditingStudentId(null);
    setiscourseFormVisible(true);
  };

  const handleSendOnboardingDetails = async (value) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to send onboading email?"
    );
    if (isConfirmed) {
      const emailData = {
        fullname: value.fullname,
        email: value.email,
        program: value.program,
        domain: value.domain,
        clearPaymentMonth: value.clearPaymentMonth,
        monthOpted: value.monthOpted,
      };
      try {
        const response = await axios.post(
          `${API}/sendedOnboardingMail`,
          emailData
        );
        if (response.status === 200) {
          toast.success("Onboarding email sent successfully!!");
          const onboardingData = {
            onboardingSended: true,
          };
          const updateResponse = await axios.put(
            `${API}/mailsendedchange/${value._id}`,
            onboardingData
          );
          if (updateResponse.status === 200) {
            toast.success("Onboarding record updated successfully!");
            setNewStudent((prev) =>
              prev.map((student) =>
                student._id === value._id
                  ? { ...student, onboardingSended: true }
                  : student
              )
            );

            setFilteredStudents((prev) =>
              prev.map((student) =>
                student._id === value._id
                  ? { ...student, onboardingSended: true }
                  : student
              )
            );
          } else {
            toast.error("Failed to update onboarding record.");
          }
        } else {
          toast.error("Failed to send onboading email.");
        }
      } catch (error) {
        toast.error("An error occurred while sending the email.");
      }
    }
  };

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
  }, []);
  useEffect(() => {
    // const currentDate = new Date();
    // const currentMonthIndex = currentDate.getMonth();
    // const currentDay = currentDate.getDate();
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
    // let months = [];
    // if (currentMonthIndex === 1 && currentDay <= 7) {
    //   months = [monthNames[1], monthNames[2], monthNames[3]];
    // } else {
    //   months = [monthNames[2], monthNames[3], monthNames[4]];
    // }
    setMonthsToShow(monthNames);
  }, []);

  const handleCopyMobileNumbers = (selectedDate) => {
    const students = groupedData[selectedDate];
    if (Array.isArray(students)) {
      const mobileNumbers = students
        .map((student) => student.whatsAppNumber)
        .join("\n");
      navigator.clipboard
        .writeText(mobileNumbers)
        .then(() => {
          toast.success("Mobile numbers copied to clipboard!");
        })
        .catch((err) => {
          toast.error("Failed to copy: " + err);
        });
    } else {
      alert("No students found or invalid data format.");
    }
  };

  const createAccount = async (value) => {
    if (value.isSending) return;
    value.isSending = true;
    const Data = {
      fullname: value.fullname.trim(),
      email: value.email.trim(),
      phone: value.phone,
      advance: true,
    };
    try {
      const response = await axios.post(`${API}/users`, Data);
      if (response.status === 200) {
        toast.success("User has been created");
        const userCreated = {
          userCreated: true,
        };
        const updateResponse = await axios.put(
          `${API}/mailsendedchange/${value._id}`,
          userCreated
        );
        if (updateResponse.status === 200) {
          toast.success("User created true updated successfully!");
          setNewStudent((prev) =>
            prev.map((student) =>
              student._id === value._id
                ? { ...student, userCreated: true }
                : student
            )
          );

          setFilteredStudents((prev) =>
            prev.map((student) =>
              student._id === value._id
                ? { ...student, userCreated: true }
                : student
            )
          );
        } else {
          toast.error("Failed to update user record.");
        }
      } else {
        toast.error("Failed to create user.");
      }
    } catch (error) {
      toast.success("User already Created check in active user");
    } finally {
      value.isSending = false;
    }
  };

  const [selectedMonth, setSelectedMonth] = useState("");
  const [months, setMonths] = useState([]);
  const handleMonthChange = (event) => {
    const selectedMonth = event.target.value;
    setSelectedMonth(selectedMonth); // Update selected month
    const filtered = newStudent.filter(
      (student) => getMonthFromDate(student.createdAt) === selectedMonth
    );
    setFilteredStudents(filtered); // Update filtered students
  };
  // Format date to display
  // const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");

  // Get current month (in string format like "Jan", "Feb", etc.)
  const getCurrentMonth = () => {
    const months = [
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

    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    return `${months[currentMonthIndex]} ${currentYear}`;
  };

  // Get the previous months including the current month (with year awareness)
  const getPastMonths = () => {
    const months = [
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

    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    let pastMonths = [];

    for (let i = 0; i < 4; i++) {
      const targetDate = new Date(currentYear, currentMonthIndex - i, 1);
      const monthName = months[targetDate.getMonth()];
      const year = targetDate.getFullYear();
      // Store as "Month Year" format for proper year-aware filtering
      pastMonths.push(`${monthName} ${year}`);
    }

    return pastMonths;
  };

  // Get the month from the student's created date (with year)
  const getMonthFromDate = (date) => {
    const months = [
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

    const dateObj = new Date(date);
    const monthIndex = dateObj.getMonth();
    const year = dateObj.getFullYear();
    return `${months[monthIndex]} ${year}`;
  };

  // Pagination Logic (Moved to avoid TDZ)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedMonth, newStudent]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const groupedData = currentItems.reduce((acc, item) => {
    const date = formatDate(item.createdAt);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  if (!groupedData) {
    return (
      <div id="loader">
        <div className="three-body">
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
        </div>
      </div>
    );
  }

  return (
    <div id="OperationEnroll">
      <Toaster position="top-center" reverseOrder={false} />
      {offerData && (
        <div className="form">
          <form onSubmit={sendOfferleter} className="relative">
            <div
              onClick={resetOfferLeter}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500 cursor-pointer text-xl font-bold p-2"
            >
              ✖
            </div>
            <h2>Send Offer Letter</h2>
            <p>
              Name: <strong>{offerData?.fullname}</strong>
              <br />
              Domain: <strong>{offerData?.domain}</strong>
              <br />
              Email: <strong>{offerData?.email}</strong>
            </p>
            <label>Offer Letter Date:</label>
            <input
              type="date"
              value={offerDate}
              onChange={(e) => setOfferDate(e.target.value)}
              required
            />
            <label>Internship Duration:</label>
            <select
              value={offerDuration}
              onChange={(e) => setOfferDuration(e.target.value)}
              required
            >
              <option value="">Select Duration</option>
              <option value="One">One</option>
              <option value="Two">Two</option>
              <option value="Three">Three</option>
              <option value="Four">Four</option>
              <option value="Five">Five</option>
              <option value="Six">Six</option>
            </select>
            <label>Internship Start Date:</label>
            <input
              type="date"
              value={offerStart}
              onChange={(e) => setOfferStart(e.target.value)}
              required
            />
            <label>Internship End Date:</label>
            <input
              type="date"
              value={offerEnd}
              onChange={(e) => setOfferEnd(e.target.value)}
              required
            />
            <label>Reporting Location:</label>
            <select
              value={offerLocation}
              onChange={(e) => setOfferLocation(e.target.value)}
              className="border p-2 rounded w-full mb-4"
              required
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
            <div className="flex gap-4 mt-4">
              <button
                type="button"
                onClick={resetOfferLeter}
                className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <input
                type="submit"
                value={
                  isOfferLetterSending
                    ? "Sending..."
                    : "Send Letter"
                }
                className="w-full bg-[#1e40af] text-white p-2 rounded cursor-pointer hover:bg-[#1e3a8a] transition"
                disabled={isOfferLetterSending}
              />
            </div>
          </form>
        </div>
      )}
      {iscourseFormVisible && (
        <div className="fixed inset-0 z-[2000] bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
            <span
              onClick={resetForm}
              className="absolute top-4 right-4 text-2xl cursor-pointer text-gray-500 hover:text-black z-10"
            >
              ✖
            </span>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 border-b pb-3">
              {editingStudentId ? "Edit Enrolled Details" : "Add New Enrollment"}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Full Name</label>
                <input
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  type="text"
                  placeholder="Full Name"
                  required
                  className="border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  placeholder="Email"
                  required
                  className="border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Contact No</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="number"
                  placeholder="Contact No"
                  required
                  className="border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Whatsapp Number</label>
                <input
                  value={whatsAppNumber}
                  onChange={(e) => setWhatsAppNumber(e.target.value)}
                  type="number"
                  placeholder="Whatsapp Number"
                  required
                  className="border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Counselor Name</label>
                <input
                  value={counselor}
                  onChange={(e) => setCounselor(e.target.value)}
                  type="text"
                  placeholder="Counselor Name"
                  required
                  className="border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Mode of Payment</label>
                <select
                  value={modeofpayment}
                  onChange={(e) => setModeofpayment(e.target.value)}
                  required
                  className="border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition h-[45px]"
                >
                  <option value="" disabled>Mode of Payment</option>
                   <option value="Online">Online</option>
                  <option value="Cash">Cash</option>
                  <option value="Transfer">Transfer</option>
                  <option value="RazorPay">RazorPay</option>
                  <option value="QR Code">QR Code</option>
                  <option value="EaseBuZZ">EaseBuZZ</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Opted Domain</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  required
                  className="border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition h-[45px]"
                >
                  <option value="" disabled>Select Opted Domain</option>
                  {course.map((item) => (
                    <option key={item._id} value={item.title}>{item.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Opted Month</label>
                <select
                  value={monthOpted}
                  onChange={(e) => setMonthOpted(e.target.value)}
                  required
                  className="border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition h-[45px]"
                >
                  <option value="" disabled>Select Opted Month</option>
                  {monthsToShow.map((month, index) => (
                    <option key={index} value={month}>{month}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Program Price</label>
                <input
                  value={programPrice}
                  onChange={(e) => setProgramPrice(e.target.value)}
                  type="number"
                  placeholder="Program Price"
                  required
                  className="border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Paid Amount</label>
                <input
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  type="number"
                  placeholder="Paid Amount"
                  required
                  className="border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Remaining Amount</label>
                <input
                  value={remainingAmount}
                  type="number"
                  placeholder="Remaining Amount"
                  readOnly
                  className="border border-gray-300 p-2.5 rounded-md bg-gray-100 font-bold text-blue-700 outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">College Name</label>
                <input
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  type="text"
                  placeholder="College Name"
                  className="border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Branch/Department</label>
                <input
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  type="text"
                  placeholder="Branch/Department"
                  className="border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Year of Passing Out</label>
                <input
                  value={yearOfPassingOut}
                  onChange={(e) => setYearOfPassingOut(e.target.value)}
                  type="text"
                  placeholder="Year of Passing Out"
                  className="border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Company Name</label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  type="text"
                  placeholder="Company Name (if working)"
                  className="border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Role</label>
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  type="text"
                  placeholder="Role (if working)"
                  className="border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Transaction ID</label>
                <input
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  type="text"
                  placeholder="Transaction ID"
                  className="border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div className="col-span-full mt-2">
                <label className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider block">Languages Known</label>
                <div className="flex flex-wrap gap-4 border border-gray-200 p-3 rounded-md bg-gray-50">
                  {["English", "Hindi", "Kannada", "Telugu", "Tamil", "Malayalam", "Bengali"].map(lang => (
                    <label key={lang} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={languages.includes(lang)}
                        onChange={() => handleLanguageChange(lang)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-blue-600 transition">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Clear Payment Due Date</label>
                <input
                  value={clearPaymentMonth}
                  onChange={(e) => setClearPaymentMonth(e.target.value)}
                  type="date"
                  min={minDate}
                  max={maxDate}
                  className="border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Internship Start Month</label>
                <select
                  value={internshipstartsmonth}
                  onChange={(e) => setInternshipstartsmonth(e.target.value)}
                  className="border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition h-[45px]"
                >
                  <option value="" disabled>Start Month</option>
                  {monthsToShow.map((month, index) => (
                    <option key={index} value={month}>{month}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Internship End Month</label>
                <select
                  value={internshipendsmonth}
                  onChange={(e) => setInternshipendsmonth(e.target.value)}
                  className="border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition h-[45px]"
                >
                  <option value="" disabled>End Month</option>
                  {monthsToShow.map((month, index) => (
                    <option key={index} value={month}>{month}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Batch Timing</label>
                <select
                  value={batchTiming}
                  onChange={(e) => setBatchTiming(e.target.value)}
                  required
                  className="border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition h-[45px]"
                >
                  <option value="" disabled>Select Batch Timing</option>
                  <option value="Monday-Friday (8:00 pm - 9:30 pm)">Monday-Friday (8:00 pm - 9:30 pm)</option>
                  <option value="Saturday-Sunday (1 to 2 hours per day)">Saturday-Sunday (1 to 2 hours per day)</option>
                </select>
              </div>

              <div className="col-span-full mt-2">
                <label className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Referral (Name & Contact)</label>
                <textarea
                  value={referFriend}
                  onChange={(e) => setReferFriend(e.target.value)}
                  placeholder="Refer your friends to earn cashback. Name and Contact Number"
                  className="border border-gray-300 p-3 rounded-md w-full h-24 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div className="col-span-full mt-4 flex gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 shadow-md transition"
                >
                  {editingStudentId ? "Update Student" : "Submit Registration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="coursetable">
        <div className="mb-2">
          <h2>New Enroll Booking: </h2>
          {/* <span onClick={handleAddNewCandidate}>+ Add New Candidate</span> */}
        </div>
        <section className="flex items-center gap-1 mb-2">
          <input
            type="type"
            placeholder="Search here by "
            value={searchQuery}
            onChange={handleSearchChange}
            className="border border-black px-2 py-1 rounded-lg"
          />

          <div className="relative group inline-block">
            <i className="fa fa-info-circle text-lg cursor-pointer"></i>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden w-max bg-gray-800 text-white text-sm rounded-md py-2 px-3 group-hover:block">
              Name, Email, Contact No and Counselor Name
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-t-8 border-gray-800 border-x-8 border-x-transparent"></div>
            </div>
          </div>
        </section>

        <select
          className="border border-black px-2 py-1 rounded-lg"
          name="month"
          id="month"
          value={selectedMonth} // Bind to selectedMonth state
          onChange={handleMonthChange} // Trigger filter on month change
        >
          {months.map((month, index) => (
            <option key={index} value={month}>
              {month}
            </option>
          ))}
        </select>

        <table>
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Name</th>
              <th>WhatsApp No</th>
              <th>Program Price</th>
              <th>Paid Amount</th>
              <th>Remaining Amount</th>
              <th>Month Opted</th>
              <th>Clear Month</th>
              <th>Hierarchy</th>
              <th>Actions</th>
              <th>Login Credentials</th>
              <th>Create User account</th>
              <th>Send Onboarding Details</th>
              <th>send offer letter</th>
              {/* <th>Whatsapp</th> */}
              <th>More Details</th>
              <th>Last Remark</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedData).length > 0 ? (
              Object.keys(groupedData).map((date) => (
                <React.Fragment key={date}>
                  <tr
                    className="cursor-pointer"
                    onClick={() => handleCopyMobileNumbers(date)}
                  >
                    <td colSpan="16" style={{ fontWeight: "bold" }}>
                      {date}
                    </td>
                  </tr>
                  {groupedData[date].map((item, index) => {
                    const bdaObj = bda.find(b => b.fullname === item.counselor);
                    const teamName = bdaObj?.team || '';
                    const managers = bda.filter(b => b.designation && b.designation.toLowerCase() === 'manager');
                    const managerObj = managers.find(mgr => Array.isArray(mgr.teams) && mgr.teams.includes(teamName));
                    const managerName = managerObj?.fullname || '';
                    return (
                      <tr
                        key={item._id}
                        className={`${item.remark[item.remark.length - 1]}`}
                      >
                        <td>{index + 1}</td>
                        <td className="capitalize">{item.fullname}</td>
                        <td>{item.whatsAppNumber}</td>
                        <td>{item.programPrice}</td>
                        <td>{item.paidAmount}</td>
                        <td>{item.programPrice - item.paidAmount}</td>
                        <td className="capitalize">{item.monthOpted}</td>
                        <td className="whitespace-nowrap">
                          {item.clearPaymentMonth}
                        </td>
                        <td>
                          <div className="flex flex-col text-sm text-left px-2">
                            <span className="font-bold text-gray-700">{managerName} <span className="text-xs font-normal text-gray-500">(Mgr)</span></span>
                            <span className="text-gray-600 font-semibold">{teamName}</span>
                            {/* <span className="text-gray-500 text-xs">{item.counselor} <span className="text-[10px]">(BDA)</span></span> */}
                          </div>
                        </td>
                        <td>
                          <button onClick={() => handleEdit(item._id)}>
                            Edit
                          </button>
                        </td>
                        <td>
                          <div
                            className=" cursor-pointer"
                            onClick={
                              !item.mailSended
                                ? () => handleSendEmail(item)
                                : null
                            }
                            disabled={item.mailSended}
                          >
                            {item.mailSended ? (
                              <div className="flex items-center justify-center w-full">
                                <PiLockKeyOpenFill />
                                <i className="fa fa-send-o text-green-600"></i>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center w-full">
                                <PiLockKeyFill />{" "}
                                <i className="fa fa-send-o text-red-600"></i>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div
                            className="cursor-pointer"
                            onClick={() => createAccount(item)}
                          >
                            {item.userCreated ? (
                              <div className="flex items-center justify-center text-green-600 font-bold flex-col">
                                <FaUserCheck />
                                UC
                              </div>
                            ) : (
                              <div className="flex items-center justify-center text-red-600 font-bold flex-col">
                                <FaUserTimes className="text-lg" />
                                NotCreated
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div
                            className="flex item-center justify-center cursor-pointer"
                            onClick={() => handleSendOnboardingDetails(item)}
                          >
                            {item.onboardingSended ? (
                              <div className="flex items-center justify-center w-full">
                                {" "}
                                <RiMailSendFill />
                                <i className="fa fa-send-o text-green-600"></i>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center w-full">
                                <RiMailSendFill />{" "}
                                <i className="fa fa-send-o text-red-600"></i>
                              </div>
                            )}
                          </div>
                        </td>
                        <td
                          onClick={() => setOfferData(item)}
                          style={{ cursor: "pointer", color: "blue" }}
                        >
                          {item.offerlettersended ? (
                            <i className="fa fa-send">sended</i>
                          ) : (
                            <i className="fa fa-send"></i>
                          )}
                        </td>
                        {/* <td>
                        {" "}
                        <a
                          href={`https://web.whatsapp.com/send?phone=${item.whatsAppNumber
                            }&text=${encodeURIComponent(
                              `Registration Confirmation - ${item.domain} Program at Krutanic

Dear ${item.fullname},

Greetings from Krutanic!

I am ${item.operationName.charAt(0).toUpperCase() + item.operationName.slice(1)} from the Operations Department, and I am pleased to confirm your successful registration for the ${item.domain} program at Krutanic.

Please find the details of your Registration below:

Program Name: ${item.domain}
Program Fee: ₹${item.programPrice}
Start Date: 5th ${item.monthOpted}
Program Duration: ${item.program}
Mode of Training: 100% Online (Virtual)
Due Amount: ₹${item.programPrice - item.paidAmount}
Payment Due Date: ${item.clearPaymentMonth}

Thank you for choosing Krutanic as your learning partner. We are committed to delivering a high-quality training experience led by seasoned industry professionals.

If you have any questions or need further assistance, feel free to reach out to us at support@krutanic.com or contact me directly.

We look forward to welcoming you to the program on 5th ${item.monthOpted}!

Warm regards,
${item.operationName.charAt(0).toUpperCase() + item.operationName.slice(1)}
Operations Department
Team Krutanic`
                            )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa fa-whatsapp text-green-700 text-2xl cursor-pointer"></i>
                        </a>
                      </td> */}
                        <td>
                          <i
                            className="fa fa-info-circle text-2xl cursor-pointer"
                            onClick={() => handleDialogOpen(item)}
                          ></i>
                        </td>
                        <td>{item.remark[item.remark.length - 1]}</td>
                        <td>
                          <select
                            className="border rounded-full w-40 border-black"
                            onChange={(e) => handleRemarkChange(e, item._id)}
                            defaultValue="Select Remark"
                          >
                            <option disabled value="Select Remark">
                              {" "}
                              Select Remark
                            </option>
                            <option value="Reminder Issued">
                              {" "}
                              Reminder Issued
                            </option>
                            <option value="DNP">DNP</option>
                            <option value="NATC">NATC</option>
                            <option value="Not Interested">Not Interested</option>
                            <option value="Cut Call">Cut Call</option>
                            <option value="Default">Default</option>
                            <option value="Cleared">Cleared</option>
                            <option value="Half_Cleared">Half_Cleared</option>
                            <option value="Switch Off">Switch Off</option>
                            <option value="Call Back later">
                              {" "}
                              Call Back later
                            </option>
                            <option value="Busy">Busy</option>
                            <option value="Declined">Declined</option>
                            <option value="Need More Time">Need More Time</option>
                            <option value="Reviews are not good">
                              Reviews are not good
                            </option>
                            <option value="When Batch Starts">
                              When Batch Starts
                            </option>
                            <option value="No response">No response</option>
                            <option value="False pitch so not intrested">
                              False pitch so not intrested
                            </option>
                            <option value="Offer letter issues">
                              Offer letter issues
                            </option>
                            <option value="Counselor Told To Pay Before Class Start">
                              Counselor Told To Pay Before Class Start
                            </option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="17">No data found</td>
              </tr>
            )}
          </tbody>
        </table>

        {filteredStudents.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-4 mt-4 mb-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              Previous
            </button>
            <span className="font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              Next
            </button>
          </div>
        )}
        {dialogVisible && dialogData && (
          <div className="fixed flex flex-col rounded-md top-[30%] left-[50%] shadow-black shadow-sm transform translate-x-[-50%] transalate-y-[-50%] bg-white p-[20px] z-[1000]">
            <h2>Details</h2>
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> {dialogData.email}
              </p>
              <p>
                <strong>Phone:</strong> {dialogData.phone}
              </p>
              <p>
                <strong>Program:</strong> {dialogData.program}
              </p>
              <p>
                <strong>Domian Opted:</strong> {dialogData.domain}
              </p>

              <p>
                <strong>Counselor:</strong> {dialogData.counselor}
              </p>
              <p>
                <strong>College Name:</strong> {dialogData.collegeName}
              </p>
              <p>
                <strong>Branch:</strong> {dialogData.branch}
              </p>
              <p>
                <strong>Aadhar No:</strong> {dialogData.aadharNumber}
              </p>
              <p>
                <strong>Batch Timing:</strong> {dialogData.batchTiming || "N/A"}
              </p>
              <p>
                <strong>Mode of Payment:</strong> {dialogData.modeofpayment || "N/A"}
              </p>
            </div>
            <button onClick={handleDialogClose}>Close</button>
          </div>
        )}
        {dialogVisible && (
          <div
            onClick={handleDialogClose}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
          ></div>
        )}
      </div>
    </div>
  );
};
export default BookedAmount;
