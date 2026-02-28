import axios from "axios";
import React, { useEffect, useState } from "react";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const AdvTeamOnBoarding = () => {
  const [iscourseFormVisible, setiscourseFormVisible] = useState(false);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [domain, setDomain] = useState("");
  const [programPrice, setProgramPrice] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [monthOpted, setMonthOpted] = useState("");
  const [clearPaymentMonth, setClearPaymentMonth] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [modeofpayment, setModeOfPayment] = useState("");
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [branch, setBranch] = useState("");
  const [yearOfPassingOut, setYearOfPassingOut] = useState("");
  const [referFriend, setReferFriend] = useState("");
  const [internshipstartsmonth, setInternshipStartsMonth] = useState("");
  const [internshipendsmonth, setInternshipEndsMonth] = useState("");
  
  const [advCourses, setAdvCourses] = useState([]);
  const [newStudent, setNewStudent] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogData, setDialogData] = useState(null);

  const advTeamName = localStorage.getItem("advTeamName");

  // Fetch advance courses
  const fetchAdvCourses = async () => {
    try {
      const response = await axios.get(`${API}/getadvcourses`);
      setAdvCourses(response.data);
    } catch (error) {
      console.error("There was an error fetching advance courses:", error);
    }
  };

  // Fetch enrolled students
  const fetchAdvEnrollments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/getadvenrolls`);
      const enrollments = response.data.data || response.data;
      const studentsData = enrollments.filter(
        (item) => item.status === "booked" && item.counselor === advTeamName
      );
      setNewStudent(studentsData);
      setFilteredStudents(studentsData);
    } catch (error) {
      console.error("There was an error fetching advance enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvCourses();
    fetchAdvEnrollments();
    
    // Set date range for payment clearance
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    const maxDate = new Date(today.setDate(today.getDate() + 5)).toISOString().split('T')[0];
    setMinDate(minDate);
    setMaxDate(maxDate);
  }, []);

  const resetForm = () => {
    setiscourseFormVisible(false);
    setFullname("");
    setEmail("");
    setPhone("");
    setDomain("");
    setProgramPrice("");
    setPaidAmount("");
    setMonthOpted("");
    setTransactionId("");
    setClearPaymentMonth("");
    setModeOfPayment("");
    setWhatsAppNumber("");
    setCollegeName("");
    setBranch("");
    setYearOfPassingOut("");
    setReferFriend("");
    setInternshipStartsMonth("");
    setInternshipEndsMonth("");
  };

  const handleAddNewCandidate = () => {
    setiscourseFormVisible(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = {
      fullname: fullname,
      email: email.trim(),
      phone: phone,
      counselor: advTeamName.trim(),
      domain: domain.trim(),
      programPrice: programPrice,
      paidAmount: paidAmount,
      monthOpted: monthOpted,
      transactionId: transactionId,
      clearPaymentMonth: clearPaymentMonth,
      modeofpayment: modeofpayment,
      whatsAppNumber: whatsAppNumber,
      collegeName: collegeName,
      branch: branch,
      yearOfPassingOut: yearOfPassingOut,
      referFriend: referFriend,
      internshipstartsmonth: internshipstartsmonth,
      internshipendsmonth: internshipendsmonth,
      operationName: null,
      operationId: null,
    };

    const minimalData = {
      fullName: fullname,
      email: email.trim(),
      phone: phone,
    };

    try {
      const response = await axios.post(`${API}/advenroll`, formData);
      const minimalResponse = await axios.post(`${API}/users`, minimalData);

      if (
        (response.status === 200 || response.status === 201) &&
        (minimalResponse.status === 200 || minimalResponse.status === 201)
      ) {
        toast.success("Onboarding Form submitted successfully.");
        fetchAdvEnrollments();
        resetForm();
      } else {
        toast.error("Error submitting the form.");
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error(
        "An error occurred while submitting the form or student already exists. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    const filtered = newStudent.filter(
      (student) =>
        student.email?.toLowerCase().includes(value.toLowerCase()) ||
        student.phone?.toLowerCase().includes(value.toLowerCase()) ||
        student.fullname?.toLowerCase().includes(value.toLowerCase()) ||
        student.counselor?.toLowerCase().includes(value.toLowerCase()) ||
        student.operationName?.toLowerCase().includes(value.toLowerCase()) ||
        student.createdAt?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");
  
  const groupedData = filteredStudents.reduce((acc, item) => {
    const date = formatDate(item.createdAt);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  const handleDialogOpen = (item) => {
    setDialogData(item);
    setDialogVisible(true);
  };

  const handleDialogClose = () => {
    setDialogVisible(false);
    setDialogData(null);
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      
      {iscourseFormVisible && (
        <div className="form z-[999] absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#ffffff] p-10 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            <span className="cursor-pointer text-2xl float-right" onClick={resetForm}>✖</span>
            <h2 className="text-2xl font-bold mb-4">Advance Program OnBoarding Form</h2>
            
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
              type="email"
              placeholder="Candidate Email"
              required
            />
            
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="number"
              placeholder="Candidate Contact No"
              required
            />
            
            <input
              value={whatsAppNumber}
              onChange={(e) => setWhatsAppNumber(e.target.value)}
              type="number"
              placeholder="WhatsApp Number"
            />
            
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Advance Course Domain
              </option>
              {advCourses.map((course) => (
                <option key={course._id} value={course.title}>
                  {course.title}
                </option>
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
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
            
            <input
              value={programPrice}
              onChange={(e) => setProgramPrice(e.target.value)}
              type="number"
              placeholder="Program Price"
              required
            />
            
            <input
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              type="number"
              placeholder="Paid Amount"
              required
            />
            
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter Transaction ID"
              required
            />
            
            <select
              value={modeofpayment}
              onChange={(e) => setModeOfPayment(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Mode of Payment
              </option>
              <option value="UPI">UPI</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Cash">Cash</option>
            </select>
            
            <div>
              <label className="block mb-2">Due date for clear payment?</label>
              <input
                value={clearPaymentMonth}
                onChange={(e) => setClearPaymentMonth(e.target.value)}
                type="date"
                required
                min={minDate}
                max={maxDate}
                className="w-full"
              />
            </div>
            
            <input
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              type="text"
              placeholder="College Name"
            />
            
            <input
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              type="text"
              placeholder="Branch/Department"
            />
            
            <input
              value={yearOfPassingOut}
              onChange={(e) => setYearOfPassingOut(e.target.value)}
              type="text"
              placeholder="Year of Passing Out"
            />
            
            <input
              value={referFriend}
              onChange={(e) => setReferFriend(e.target.value)}
              type="text"
              placeholder="Referred by (Friend's Name)"
            />
            
            <select
              value={internshipstartsmonth}
              onChange={(e) => setInternshipStartsMonth(e.target.value)}
            >
              <option value="" disabled>
                Internship Start Month
              </option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
            
            <select
              value={internshipendsmonth}
              onChange={(e) => setInternshipEndsMonth(e.target.value)}
            >
              <option value="" disabled>
                Internship End Month
              </option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
            
            <input
              className="cursor-pointer bg-[#f15b29] text-white px-6 py-2 rounded-md hover:bg-[#d14a1f] transition-colors"
              disabled={isSubmitting}
              type="submit"
              value={isSubmitting ? "Submitting..." : "Submit"}
            />
          </form>
        </div>
      )}
      
      <div id="AdminAddCourse">
        <Toaster position="top-center" reverseOrder={false} />
        
        {loading ? (
          <div id="loader">
            <div className="three-body">
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
            </div>
          </div>
        ) : (
          <div className="coursetable">
            <div className="mb-4 flex justify-between items-center">
              <button
                className="border px-4 py-2 rounded-lg bg-[#f15b29] text-white hover:bg-[#d14a1f] transition-colors"
                onClick={handleAddNewCandidate}
              >
                + Add OnBoarding Form
              </button>
              
              <section className="flex items-center gap-2">
                <div className="relative group inline-block">
                  <i className="fa fa-info-circle text-lg cursor-pointer text-gray-500"></i>
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-[9999] mb-2 hidden w-max bg-gray-800 text-white text-sm rounded-md py-2 px-3 group-hover:block">
                    Search by: Name, Email, Contact, Counselor, Operation Name
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-t-8 border-gray-800 border-x-8 border-x-transparent"></div>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Search here..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15b29]"
                />
              </section>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Sl</th>
                  <th>Name</th>
                  <th>Opted Domain</th>
                  <th>Program Price</th>
                  <th>Paid Amount</th>
                  <th>Pending</th>
                  <th>Transaction Id</th>
                  <th>More Details</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(groupedData).length > 0 ? (
                  Object.keys(groupedData).map((date) => (
                    <React.Fragment key={date}>
                      <tr>
                        <td colSpan="8" style={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
                          {date}
                        </td>
                      </tr>
                      {groupedData[date].map((item, index) => (
                        <tr key={item._id}>
                          <td>{index + 1}</td>
                          <td className="capitalize">{item.fullname}</td>
                          <td>{item.domain}</td>
                          <td>₹{item.programPrice?.toLocaleString()}</td>
                          <td>₹{item.paidAmount?.toLocaleString()}</td>
                          <td>₹{(item.programPrice - item.paidAmount)?.toLocaleString()}</td>
                          <td className="uppercase">{item.transactionId}</td>
                          <td>
                            <i
                              className="fa fa-info-circle text-2xl cursor-pointer text-[#f15b29] hover:text-[#d14a1f]"
                              onClick={() => handleDialogOpen(item)}
                            ></i>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No data found</td>
                  </tr>
                )}
              </tbody>
            </table>

            {dialogVisible && dialogData && (
              <div className="fixed flex flex-col rounded-md top-[30%] left-[50%] shadow-black shadow-lg transform translate-x-[-50%] translate-y-[-50%] bg-white p-6 z-[1000] max-w-md w-full">
                <h2 className="text-xl font-bold mb-4 text-[#f15b29]">Student Details</h2>
                <div className="space-y-2">
                  <p>
                    <strong>Email:</strong> {dialogData.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {dialogData.phone}
                  </p>
                  <p>
                    <strong>WhatsApp:</strong> {dialogData.whatsAppNumber || "N/A"}
                  </p>
                  <p>
                    <strong>Month Opted:</strong> {dialogData.monthOpted}
                  </p>
                  <p>
                    <strong>Counselor:</strong> {dialogData.counselor}
                  </p>
                  <p>
                    <strong>Payment Mode:</strong> {dialogData.modeofpayment || "N/A"}
                  </p>
                  <p>
                    <strong>College:</strong> {dialogData.collegeName || "N/A"}
                  </p>
                  <p>
                    <strong>Branch:</strong> {dialogData.branch || "N/A"}
                  </p>
                  <p>
                    <strong>Year of Passing:</strong> {dialogData.yearOfPassingOut || "N/A"}
                  </p>
                  <p>
                    <strong>Referred By:</strong> {dialogData.referFriend || "N/A"}
                  </p>
                  <p>
                    <strong>Internship Period:</strong>{" "}
                    {dialogData.internshipstartsmonth || "N/A"} to{" "}
                    {dialogData.internshipendsmonth || "N/A"}
                  </p>
                </div>
                <button
                  className="bg-[#f15b29] hover:bg-[#d14a1f] px-4 py-2 text-white rounded-md mt-4 transition-colors"
                  onClick={handleDialogClose}
                >
                  Close
                </button>
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
        )}
      </div>
    </>
  );
};

export default AdvTeamOnBoarding;
