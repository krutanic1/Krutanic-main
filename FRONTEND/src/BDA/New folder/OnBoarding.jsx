import axios from "axios";
import React, { useEffect, useState } from "react";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const OnBoarding = () => {
  const [iscourseFormVisible, setiscourseFormVisible] = useState(false);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [program, setProgram] = useState([]);
  const [domain, setDomain] = useState([]);
  const [programPrice, setProgramPrice] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [monthOpted, setMonthOpted] = useState("");
    const [modeofpayment, setModeOfPayment] = useState("");
  const [monthsToShow, setMonthsToShow] = useState([]);
   const [clearPaymentMonth, setClearPaymentMonth] = useState("");
const [transactionId, setTransactionId] = useState("");
  const [course, setCourse] = useState([]);
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

  const resetForm = () => {
    setiscourseFormVisible(false);
    setFullname("");
    setEmail("");
    setPhone("");
    setProgram("");
    setDomain("");
    setProgramPrice("");
    setPaidAmount("");
    setMonthOpted("");
    setTransactionId("");
    setClearPaymentMonth("");
    setModeOfPayment("")
  };

  useEffect(() => {
      const currentDate = new Date();
      const currentMonthIndex = currentDate.getMonth();
      const currentDay = currentDate.getDate();
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
      let months = [];
      if (currentMonthIndex === 1 && currentDay <= 7) {
        months = [monthNames[1], monthNames[2], monthNames[3]];
      } else {
        months = [monthNames[2], monthNames[3], monthNames[4]];
      }
      setMonthsToShow(months);
    }, []);
  
  const handleAddNewCandidate = () => {
    setiscourseFormVisible(true);
  };

  const [newStudent, setNewStudent] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNewStudent = async () => {
    setLoading(true);
    const bdaName = localStorage.getItem("bdaName");
    try {
      const response = await axios.get(`${API}/getnewstudentenroll`);
      const studentsData = response.data.filter(
        (item) => item.status === "booked" && item.counselor === bdaName
      );
      setNewStudent(studentsData);
      setFilteredStudents(studentsData);
    } catch (error) {
      console.error("There was an error fetching new student:", error);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewStudent();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (event) => {
    setIsSubmitting(true);
    const bdaName = localStorage.getItem("bdaName");
    event.preventDefault();
    
    const formData = {
      fullname: fullname,
      email: email.trim(),
      phone: phone,
      program: program,
      counselor: bdaName.trim(),
      domain: domain.trim(),
      programPrice: programPrice,
      paidAmount: paidAmount,
      monthOpted: monthOpted,
      transactionId: transactionId,
      clearPaymentMonth: clearPaymentMonth,
      modeofpayment: modeofpayment,
      operationName: null,
      operationId: null,
    };
    const minimalData = {
      fullName: fullname,
      email: email.trim(),
      phone: phone,
    };
    try {
      let response;
      let minimalResponse;
       {
        response = await axios.post(`${API}/newstudentenroll`, formData);
        minimalResponse = await axios.post(`${API}/users`, minimalData);
      }
      if (
        (response.status === 200 || response.status === 201) 
        &&
        (minimalResponse.status === 200 || minimalResponse.status === 201)
      ) {
        toast.success("Onboarding Form submitted successfully.");
        fetchNewStudent();
        resetForm();
      } else {
        toast.error("Error submitting the form.");
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error(
        "An error occurred while submitting the form. or student already exists, Please try again ."
      );
      setIsSubmitting(false);
    }
  };



  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    const filtered = newStudent.filter(
      (student) =>
        student.email.toLowerCase().includes(value.toLowerCase()) ||
        student.phone.toLowerCase().includes(value.toLowerCase()) ||
        student.fullname.toLowerCase().includes(value.toLowerCase()) ||
        student.counselor.toLowerCase().includes(value.toLowerCase()) ||
        student.operationName.toLowerCase().includes(value.toLowerCase()) ||
        student.createdAt.toLowerCase().includes(value.toLowerCase())
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

  const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");
  
    useEffect(() => {
      const today = new Date();
      const minDate = today.toISOString().split('T')[0];
      const maxDate = new Date(today.setDate(today.getDate() + 5)).toISOString().split('T')[0];
      setMinDate(minDate);
      setMaxDate(maxDate);
    }, []);

    const date = new Date();
  const options = { month: 'long', year: 'numeric' };
  const currentMonthYear = date.toLocaleDateString('en-US', options);
  return (
    <div id="OperationEnroll">
     <Toaster position="top-center" reverseOrder={false} />
      {iscourseFormVisible && (
        <div className="form z-[999] absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#ffffff] p-10 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <span onClick={resetForm}>✖</span>
            <h2>OnBoarding Form</h2>
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
            <select value={domain} onChange={(e) => setDomain(e.target.value)}>
              <option value="" selected disabled>
                Select Opted Domain
              </option>
              {course.map((item) => (
                <option value={item.title}>{item.title}</option>
              ))}
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
            />
            <input
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              type="number"
              placeholder="Paid Amount"
              required
            />
            <input type="text" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="Enter Transaction ID" required />

            <div>
              Due date for clear payment ?
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
            <input className="cursor-pointer" disabled={isSubmitting} type="submit" value="Submit" />
          </form>
        </div>
      )}
        <div id="AdminAddCourse">
           {/* <div className="flex justify-end items-center px-2 pt-2">

          <button className="border px-2 py-1 rounded-lg bg-black text-white" onClick={handleAddNewCandidate}>+ Add OnBoarding Form</button>
           </div> */}
       
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
                <div className="mb-2">
                  <h2 >OnBoarding Details:</h2>
                  <section className="flex items-center  gap-1">
                    <div className="relative group inline-block">
                      <i className="fa fa-info-circle text-lg cursor-pointer text-gray-500"></i>
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-[9999] mb-2 hidden w-max bg-gray-800 text-white text-sm rounded-md py-2 px-3 group-hover:block">
                        Name, Email, Contact ,Counselor Name, Operation Name
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-t-8 border-gray-800 border-x-8 border-x-transparent"></div>
                      </div>
                    </div>
                    <input
                      type="type"
                      placeholder="Search here by "
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="border border-black px-2 py-1 rounded-lg"
                    />
                  </section>
                </div>
                <h2 className="text-center font-bold text-xl text-[#F15B29]">Month: {currentMonthYear}</h2>
                  <table>
                    <thead>
                      <tr>
                        <th>Sl</th>
                        <th>Name</th>
                        <th>Opted Domain</th>
                        <th>Program Price</th>
                        <th>Paid Amount </th>
                        <th>Pending </th>
                        <th>Transaction Id</th>
                        <th>More Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(groupedData).length > 0 ? (
                        Object.keys(groupedData).map((date) => (
                          <React.Fragment key={date}>
                            <tr>
                              <td colSpan="16" style={{ fontWeight: "bold" }}>
                                {date}
                              </td>
                            </tr>
                            {groupedData[date].map((item, index) => (
                              <tr key={item._id}>
                                <td>{index + 1}</td>
                                <td className="capitalize">{item.fullname}</td>
                                <td>{item.domain}</td>
                                <td>{item.programPrice}</td>
                                <td>{item.paidAmount}</td>
                                <td>{item.programPrice - item.paidAmount}</td>
                                <td className="capitalize">{item.transactionId}</td>
                                <td>
                                  <i
                                    className="fa fa-info-circle text-2xl cursor-pointer"
                                    onClick={() => handleDialogOpen(item)}
                                  ></i>
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="14">No data found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                
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
                        <strong>Month Opted:</strong> {dialogData.monthOpted}
                      </p>
                      <p>
                        <strong>Mode Of Payment:</strong> {dialogData.modeofpayment}
                      </p>
        
                      <p>
                        <strong>Counselor:</strong> {dialogData.counselor}
                      </p>
                    </div>
                    <button className="bg-black px-4 py-1 text-white rounded-md mt-2" onClick={handleDialogClose}>Close</button>
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
    </div>
  );
};

export default OnBoarding;
