import axios from "axios";
import React, { useEffect, useState } from "react";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const AdvBooked = () => {
  const [bookedEnrollments, setBookedEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [iscourseFormVisible, setiscourseFormVisible] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);

  // States for Edit Form
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [counselor, setCounselor] = useState("");
  const [domain, setDomain] = useState("");
  const [programPrice, setProgramPrice] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [monthOpted, setMonthOpted] = useState("");
  const [clearPaymentMonth, setClearPaymentMonth] = useState("");
  const [lead, setLead] = useState("");
  const [operationName, setOperationName] = useState("");
  const [operationId, setOperationId] = useState("");

  const [course, setCourse] = useState([]);
  const [bda, setBda] = useState([]);
  const [operation, setOperation] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [monthsToShow] = useState([
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogData, setDialogData] = useState(null);

  const fetchBookedEnrollments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/getadvenrolls?all=true`);
      const enrollments = response.data.data || response.data;
      const filtered = enrollments.filter((item) => item.status === "booked");
      setBookedEnrollments(filtered);
      setFilteredEnrollments(filtered);
    } catch (error) {
      console.error("Error fetching booked enrollments:", error);
      toast.error("Failed to load booked enrollments");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const [coursesRes, bdaRes, opsRes, execsRes] = await Promise.all([
        axios.get(`${API}/getadvcourses`),
        axios.get(`${API}/getbda`),
        axios.get(`${API}/getoperation`),
        axios.get(`${API}/admin/getallmarketingexecutives`)
      ]);
      setCourse(coursesRes.data);
      setBda(bdaRes.data);
      setOperation(opsRes.data);
      setExecutives(execsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchBookedEnrollments();
    fetchData();
  }, []);

  const handleStatusChange = async (studentId, action) => {
    try {
      const isConfirmed = window.confirm(`Are you sure you want to move this student to ${action}?`);
      if (!isConfirmed) return;

      const status = action === "fullPaid" ? "fullPaid" : "default";
      await axios.post(`${API}/updateadvenrollstatus`, { id: studentId, status });

      toast.success(`Student moved to ${action} successfully`);
      fetchBookedEnrollments();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleEdit = (studentId) => {
    const editStudent = bookedEnrollments.find((item) => item._id === studentId);
    if (!editStudent) return;

    setEditingStudentId(studentId);
    setFullname(editStudent.fullname || "");
    setEmail(editStudent.email || "");
    setPhone(editStudent.phone || "");
    setWhatsAppNumber(editStudent.whatsAppNumber || "");
    setCounselor(editStudent.counselor || "");
    setDomain(editStudent.domain || "");
    setProgramPrice(editStudent.programPrice || "");
    setPaidAmount(editStudent.paidAmount || "");
    setRemainingAmount(editStudent.programPrice - editStudent.paidAmount || 0);
    setMonthOpted(editStudent.monthOpted || "");
    setClearPaymentMonth(editStudent.clearPaymentMonth || "");
    setLead(editStudent.executive || editStudent.lead || "");
    setOperationName(editStudent.operationName || "");
    setOperationId(editStudent.operationId || "");
    setiscourseFormVisible(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      fullname,
      email: email.trim(),
      phone,
      whatsAppNumber,
      counselor: counselor.trim(),
      domain: domain.trim(),
      programPrice,
      paidAmount,
      remainingAmount: programPrice - paidAmount,
      monthOpted,
      clearPaymentMonth,
      lead,
      operationName,
      operationId,
    };

    try {
      const response = await axios.put(`${API}/editadvstudentdetails/${editingStudentId}`, formData);
      if (response.status === 200 || response.status === 201) {
        toast.success("Student updated successfully");
        fetchBookedEnrollments();
        resetForm();
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "An error occurred during update");
    }
  };

  const resetForm = () => {
    setiscourseFormVisible(false);
    setEditingStudentId(null);
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
    setLead("");
    setOperationName("");
    setOperationId("");
  };

  const handleDialogOpen = (item) => {
    setDialogData(item);
    setDialogVisible(true);
  };

  const handleDialogClose = () => {
    setDialogVisible(false);
    setDialogData(null);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    const filtered = bookedEnrollments.filter((enroll) => {
      return (
        (enroll.email && enroll.email.toLowerCase().includes(value.toLowerCase())) ||
        (enroll.phone && enroll.phone.toLowerCase().includes(value.toLowerCase())) ||
        (enroll.fullname && enroll.fullname.toLowerCase().includes(value.toLowerCase())) ||
        (enroll.counselor && enroll.counselor.toLowerCase().includes(value.toLowerCase())) ||
        (enroll.operationName && enroll.operationName.toLowerCase().includes(value.toLowerCase())) ||
        (enroll.domain && enroll.domain.toLowerCase().includes(value.toLowerCase()))
      );
    });
    setFilteredEnrollments(filtered);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB");
  };

  const groupedData = filteredEnrollments.reduce((acc, item) => {
    const date = formatDate(item.createdAt);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <div id="AdminAddCourse">
      <Toaster position="top-center" reverseOrder={false} />
      {iscourseFormVisible && (
        <div className="form">
          <form onSubmit={handleSubmit} className="space-y-5">
            <span onClick={resetForm}>✖</span>
            <h2>Edit Advanced Enrollment</h2>
            <input value={fullname} onChange={(e) => setFullname(e.target.value)} type="text" placeholder="Candidate Full Name" required />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Candidate Email" required />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} type="number" placeholder="Candidate Contact" required />
            <input value={whatsAppNumber} onChange={(e) => setWhatsAppNumber(e.target.value)} type="number" placeholder="WhatsApp Number" />

            <select value={counselor} onChange={(e) => setCounselor(e.target.value)}>
              <option value="" disabled>Select Counselor name</option>
              {bda.map((item) => (<option key={item._id} value={item.fullname}>{item.fullname}</option>))}
            </select>

            <select value={operationName} onChange={(e) => {
              const op = operation.find(item => item.fullname === e.target.value);
              setOperationName(op.fullname);
              setOperationId(op._id);
            }}>
              <option value="" disabled>Select Operation name</option>
              {operation.map((item) => (<option key={item._id} value={item.fullname}>{item.fullname}</option>))}
            </select>

            <select value={domain} onChange={(e) => setDomain(e.target.value)}>
              <option value="" disabled>Select Opted Domain</option>
              {course.map((item) => (<option key={item._id} value={item.title}>{item.title}</option>))}
            </select>

            <select value={monthOpted} onChange={(e) => setMonthOpted(e.target.value)} required>
              <option value="" disabled>Select Opted Month</option>
              {monthsToShow.map((month, index) => (<option key={index} value={month}>{month}</option>))}
            </select>

            <input value={programPrice} onChange={(e) => setProgramPrice(e.target.value)} type="number" placeholder="Program Price" required />
            <input value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} type="number" placeholder="Paid Amount" required />

            <select value={lead} required onChange={(e) => setLead(e.target.value)} >
              <option value="" disabled>Select Lead</option>
              <option value="CGFL">CGFL</option>
              <option value="SGFL">SGFL</option>
              {executives.map((exec) => (<option key={exec._id} value={exec.fullname}>{exec.fullname}</option>))}
            </select>

            <label className="block text-sm">Clear Payment Due Date</label>
            <input value={clearPaymentMonth} onChange={(e) => setClearPaymentMonth(e.target.value)} type="date" />

            <input className="cursor-pointer" type="submit" value="Save Changes" />
          </form>
        </div>
      )}

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
            <h2>ADV Booked List ({filteredEnrollments.length})</h2>
            <section className="flex items-center gap-1">
              <div className="relative group inline-block">
                <i className="fa fa-info-circle text-lg cursor-pointer text-gray-500"></i>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-[9999] mb-2 hidden w-max bg-gray-800 text-white text-sm rounded-md py-2 px-3 group-hover:block">
                  Search by Name, Email, Phone, Counselor, Operation, Domain
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-t-8 border-gray-800 border-x-8 border-x-transparent"></div>
                </div>
              </div>
              <input
                type="text"
                placeholder="Search here..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="border border-black px-2 py-1 rounded-lg"
              />
            </section>
          </div>

          <table>
            <thead>
              <tr>
                <th>Sl</th>
                <th>Name</th>
                <th>WhatsApp No</th>
                <th>Email</th>
                <th>Domain</th>
                <th>Month Opted</th>
                <th>Program Price</th>
                <th>Paid Amount</th>
                <th>BDA</th>
                <th>Operation</th>
                <th>Status</th>
                <th>Remark</th>
                <th>More Details</th>
                <th>Action</th>
                <th>Executive</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedData).length > 0 ? (
                Object.keys(groupedData).sort((a, b) => {
                  const dateA = a.split("/").reverse().join("");
                  const dateB = b.split("/").reverse().join("");
                  return dateB.localeCompare(dateA);
                }).map((date) => (
                  <React.Fragment key={date}>
                    <tr>
                      <td colSpan="15" style={{ fontWeight: "bold", backgroundColor: "#e3f2fd" }}>
                        {date}
                      </td>
                    </tr>
                    {groupedData[date].map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td className="capitalize">{item.fullname || "N/A"}</td>
                        <td>{item.whatsAppNumber || "N/A"}</td>
                        <td>{item.email || "N/A"}</td>
                        <td>{item.domain || "N/A"}</td>
                        <td className="capitalize">{item.monthOpted || "N/A"}</td>
                        <td className="text-green-600 font-bold">₹{item.programPrice || 0}</td>
                        <td>{item.paidAmount || 0}</td>
                        <td>{item.counselor || "N/A"}</td>
                        <td>{item.operationName || "N/A"}</td>
                        <td>
                          <div className="flex gap-2 justify-center">
                            <button className="button" onClick={() => handleStatusChange(item._id, "fullPaid")}>
                              <div className="relative group inline-block">
                                <i className="fa fa-money" aria-hidden="true"></i>
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-[9999] mb-2 hidden w-max bg-gray-800 text-white text-sm rounded-md py-2 px-3 group-hover:block">
                                  FullPaid
                                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-t-8 border-gray-800 border-x-8 border-x-transparent"></div>
                                </div>
                              </div>
                            </button>
                            <button className="button" onClick={() => handleStatusChange(item._id, "default")}>
                              <div className="relative group inline-block">
                                <i className="fa fa-ban"></i>
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-[9999] mb-2 hidden w-max bg-gray-800 text-white text-sm rounded-md py-2 px-3 group-hover:block">
                                  Default
                                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-t-8 border-gray-800 border-x-8 border-x-transparent"></div>
                                </div>
                              </div>
                            </button>
                          </div>
                        </td>
                        <td>
                          <ul className="text-xs list-decimal pl-4">
                            {item.remark && item.remark.map((rem, i) => (
                              <li key={i}>{rem}</li>
                            ))}
                          </ul>
                        </td>
                        <td className="text-center">
                          <i className="fa fa-info-circle text-2xl cursor-pointer" onClick={() => handleDialogOpen(item)}></i>
                        </td>
                        <td className="text-center">
                          <button onClick={() => handleEdit(item._id)}>
                            <i className="fa fa-edit text-xl"></i>
                          </button>
                        </td>
                        <td>{item.executive || item.lead || "N/A"}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="15">No booked enrollments found</td>
                </tr>
              )}
            </tbody>
          </table>

          {dialogVisible && dialogData && (
            <div className="fixed flex flex-col rounded-md top-[30%] left-[50%] shadow-black shadow-sm transform translate-x-[-50%] transalate-y-[-50%] bg-white p-[20px] z-[1000] w-[400px]">
              <h2 className="text-xl font-bold mb-4">Student Details</h2>
              <div className="space-y-2 overflow-y-auto max-h-[400px]">
                <p><strong>Name:</strong> {dialogData.fullname}</p>
                <p><strong>Email:</strong> {dialogData.email}</p>
                <p><strong>Phone:</strong> {dialogData.phone}</p>
                <p><strong>WhatsApp:</strong> {dialogData.whatsAppNumber}</p>
                <p><strong>Domain:</strong> {dialogData.domain}</p>
                <p><strong>Program Price:</strong> ₹{dialogData.programPrice}</p>
                <p><strong>Paid Amount:</strong> ₹{dialogData.paidAmount}</p>
                <p className="text-red-600 font-bold"><strong>Pending:</strong> ₹{dialogData.programPrice - dialogData.paidAmount}</p>
                <p><strong>Counselor:</strong> {dialogData.counselor}</p>
                <p><strong>Operation:</strong> {dialogData.operationName}</p>
                <p><strong>College:</strong> {dialogData.collegeName}</p>
                <p><strong>Branch:</strong> {dialogData.branch}</p>
                <p><strong>Internship Start:</strong> {dialogData.internshipstartsmonth}</p>
                <p><strong>Clear Payment Due:</strong> {dialogData.clearPaymentMonth}</p>
              </div>
              <button className="bg-black px-4 py-2 text-white rounded-md mt-4 self-center w-full" onClick={handleDialogClose}>Close</button>
            </div>
          )}
          {dialogVisible && (
            <div onClick={handleDialogClose} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 999 }}></div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvBooked;
