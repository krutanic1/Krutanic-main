import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";
import { RiMailSendFill } from "react-icons/ri";
import { PiLockKeyOpenFill, PiLockKeyFill } from "react-icons/pi";
import { FaUserTimes } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa";

const AdvBookedPayment = () => {
  const [iscourseFormVisible, setiscourseFormVisible] = useState(false);
  const resetForm = () => {
    setiscourseFormVisible(false);
    setFullname("");
    setEmail("");
    setPhone("");
    setProgram("");
    setCounselor("");
    setDomain("");
    setProgramPrice("");
    setPaidAmount("");
    setMonthOpted("");
    setClearPaymentMonth("");
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
    try {
      const response = await axios.post(
        `${API}/sendofferletter`,
        offerLetterDetails
      );
      toast.success("Offer letter sent successfully");
      fetchAdvEnrolls();
      resetOfferLeter();
    } catch (error) {
      console.error("There was an error sending the offer letter:", error);
    } finally {
      setIsOfferLetterSending(false);
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
  
  const [advTeam, setAdvTeam] = useState([]);
  const fetchAdvTeam = async () => {
    try {
      const response = await axios.get(`${API}/getadvteam`);
      setAdvTeam(response.data);
    } catch (error) {
      console.error("There was an error fetching advance team:", error);
    }
  };
  
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [program, setProgram] = useState([]);
  const [counselor, setCounselor] = useState([]);
  const [domain, setDomain] = useState([]);
  const [programPrice, setProgramPrice] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [monthOpted, setMonthOpted] = useState("");
  const [monthsToShow, setMonthsToShow] = useState([]);
  const [clearPaymentMonth, setClearPaymentMonth] = useState("");
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [advEnrolls, setAdvEnrolls] = useState([]);
  const [editingStudentId, setEditingStudentId] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      fullname: fullname,
      email: email.trim(),
      phone: phone,
      program: program,
      counselor: counselor.trim(),
      domain: domain.trim(),
      programPrice: programPrice,
      paidAmount: paidAmount,
      monthOpted: monthOpted,
      clearPaymentMonth: clearPaymentMonth,
      operationName: operationData.fullname,
      operationId: operationData._id,
    };
    try {
      let response;
      if (editingStudentId) {
        response = await axios.put(
          `${API}/editadvenroll/${editingStudentId}`,
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
        fetchAdvEnrolls();
        resetForm();
      } else {
        toast.error("Error submitting the form.");
      }
    } catch (error) {
      toast.error(
        "An error occurred while submitting the form. or student already exists, Please try again ."
      );
    }
  };

  const fetchAdvEnrolls = async () => {
    const operationName = localStorage.getItem("advOperationName");
    try {
      const response = await axios.get(`${API}/getadvenrolls?all=true`);
      const bookedStudents = response.filter(
        (item) =>
          item.status === "booked" && item.operationName === operationName
      );
      console.log(`📊 Total booked students for ${operationName}:`, bookedStudents.length);
      setAdvEnrolls(bookedStudents);
      setFilteredStudents(bookedStudents);

      const currentMonth = getCurrentMonth();
      setSelectedMonth(currentMonth);

      const filtered = bookedStudents.filter(
        (student) => getMonthFromDate(student.createdAt) === currentMonth
      );
      console.log(`📅 Students in ${currentMonth}:`, filtered.length);
      setFilteredStudents(filtered);
    } catch (error) {
      console.error("There was an error fetching advance enrolls:", error);
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
        const response = await axios.post(`${API}/updateadvenrollremark`, {
          remark: selectedRemark,
          studentId: studentId,
        });
        if (response.status === 200) {
          toast.success(response.data.message);
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
      const editStudent = advEnrolls.find((item) => item._id === studentId);
      setFullname(editStudent.fullname);
      setEmail(editStudent.email);
      setPhone(editStudent.phone);
      setWhatsAppNumber(editStudent.whatsAppNumber);
      setProgram(editStudent.program);
      setCounselor(editStudent.counselor);
      setDomain(editStudent.domain);
      setProgramPrice(editStudent.programPrice);
      setPaidAmount(editStudent.paidAmount);
      setMonthOpted(editStudent.monthOpted);
      setClearPaymentMonth(editStudent.clearPaymentMonth);
      setEditingStudentId(studentId);
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
      console.log("Failed to fetch operation data");
    }
  };

  useEffect(() => {
    console.log("🚀 AdvBookedPayment component mounted - Starting data fetch...");
    fetchCourses();
    fetchAdvTeam();
    fetchAdvEnrolls();
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
          `${API}/advmailsendedchange/${value._id}`,
          studentData
        );
        if (updateResponse.status === 200) {
          toast.success("Operation record updated successfully!");
          setAdvEnrolls((prev) =>
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
    const filtered = advEnrolls.filter((student) => {
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
            `${API}/advmailsendedchange/${value._id}`,
            onboardingData
          );
          if (updateResponse.status === 200) {
            toast.success("Onboarding record updated successfully!");
            setAdvEnrolls((prev) =>
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
    };
    try {
      const response = await axios.post(`${API}/users`, Data);
      if (response.status === 200) {
        toast.success("User has been created");
        const userCreated = {
          userCreated: true,
        };
        const updateResponse = await axios.put(
          `${API}/advmailsendedchange/${value._id}`,
          userCreated
        );
        if (updateResponse.status === 200) {
          toast.success("User created true updated successfully!");
          setAdvEnrolls((prev) =>
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
    setSelectedMonth(selectedMonth);
    const filtered = advEnrolls.filter(
      (student) => getMonthFromDate(student.createdAt) === selectedMonth
    );
    setFilteredStudents(filtered);
  };

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
      pastMonths.push(`${monthName} ${year}`);
    }

    return pastMonths;
  };

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedMonth, advEnrolls]);

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
        <div className="form">
          <form onSubmit={handleSubmit} className="space-y-5">
            <span onClick={resetForm}>✖</span>
            <h2>
              {editingStudentId
                ? "Edit Enrolled Details"
                : "Add New Enrollment"}
            </h2>
            <input
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              type="text"
              placeholder="Candidate Full Name"
              required
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Candidate Email"
              required
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="number"
              placeholder="Candidate contact no"
              required
            />
            <input
              value={whatsAppNumber}
              onChange={(e) => setWhatsAppNumber(e.target.value)}
              type="number"
              placeholder="Candidate whatsapp no"
              required
            />
            <select
              value={program}
              onChange={(e) => setProgram(e.target.value)}
            >
              <option value="" selected disabled>
                {" "}
                Mode of Program
              </option>
              <option value="Self-guided">Self-guided</option>
              <option value="Instructor Led">Instructor Led</option>
              <option value="Career Advancement">Career Advancement</option>
            </select>
            <select
              disabled={editingStudentId !== null}
              value={counselor}
              onChange={(e) => setCounselor(e.target.value)}
            >
              <option value="" selected disabled>
                Select Counselor name
              </option>
              {advTeam.map((item) => (
                <option key={item._id} value={item.fullname}>{item.fullname}</option>
              ))}
            </select>
            <select value={domain} onChange={(e) => setDomain(e.target.value)}>
              <option value="" selected disabled>
                Select Opted Domain
              </option>
              {course.map((item) => (
                <option key={item._id} value={item.title}>{item.title}</option>
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
            <input
              value={programPrice}
              onChange={(e) => setProgramPrice(e.target.value)}
              type="number"
              placeholder="Program Price"
              required
              disabled={editingStudentId !== null}
            />
            <input
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              type="number"
              placeholder="Paid Amount"
              required
            />

            <div>
              Next instalment to clear the payment
              <input
                value={clearPaymentMonth}
                onChange={(e) => setClearPaymentMonth(e.target.value)}
                type="date"
                name=""
                id=""
                min={minDate}
                max={maxDate}
              />
            </div>
            <input
              className="cursor-pointer"
              type="submit"
              value={editingStudentId ? "Save" : "Submit"}
            />
          </form>
        </div>
      )}

      <div className="coursetable">
        <div className="mb-2">
          <h2>Advance Program Booked Enrollments</h2>
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
          value={selectedMonth}
          onChange={handleMonthChange}
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
              <th>Next instalment to clear the payment</th>
              <th>Hierarchy</th>
              <th>Actions</th>
              <th>Login Credentials</th>
              <th>Create User account</th>
              <th>Send Onboarding Details</th>
              <th>send offer letter</th>
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
                    <td colSpan="17" style={{ fontWeight: "bold" }}>
                      {date}
                    </td>
                  </tr>
                  {groupedData[date].map((item, index) => {
                    const advTeamObj = advTeam.find(b => b.fullname === item.counselor);
                    const teamName = advTeamObj?.team || '';
                    const managers = advTeam.filter(b => b.designation && b.designation.toLowerCase() === 'manager');
                    const managerObj = managers.find(mgr => Array.isArray(mgr.teams) && mgr.teams.includes(teamName));
                    const managerName = managerObj?.fullname || '';
                    return (
                      <tr
                        key={item._id}
                        className={`${item.remark && item.remark[item.remark.length - 1]}`}
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
                        <td>
                          <i
                            className="fa fa-info-circle text-2xl cursor-pointer"
                            onClick={() => handleDialogOpen(item)}
                          ></i>
                        </td>
                        <td>{item.remark && item.remark[item.remark.length - 1]}</td>
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
                            <option value="Offer letter issues">
                              Offer letter issues
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
                <strong>Next instalment to clear the payment:</strong> {dialogData.clearPaymentMonth || "N/A"}
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
export default AdvBookedPayment;
