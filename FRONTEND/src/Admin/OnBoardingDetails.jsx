import axios from "axios";
import React, { useState, useEffect } from "react";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";


const OnBoardingDetails = () => {
  const [newStudent, setNewStudent] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNewStudent = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/getnewstudentenroll`);
      const studentsData = response.data.filter(
        (item) => item.operationName === null || item.operationName === null 
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

  const handleStatusChange = async (studentId, action) => {
    try {
      let updatedData = {};
      const isConfirmedFullPaid = window.confirm(
        "Are you sure you want to change?"
      );
      if (isConfirmedFullPaid) {
        if (action === "fullPaid") {
          updatedData = { status: "fullPaid" };
        } else if (action === "default") {
          updatedData = { status: "default" };
        }
      }
      await axios.post(`${API}/updateStudentStatus`, {
        studentId,
        ...updatedData,
      });
      fetchNewStudent();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    const filtered = newStudent.filter((student) => {
      return (
        (student.email && student.email.toLowerCase().includes(value.toLowerCase())) ||
        (student.phone && student.phone.toLowerCase().includes(value.toLowerCase())) ||
        (student.fullname && student.fullname.toLowerCase().includes(value.toLowerCase())) ||
        (student.counselor && student.counselor.toLowerCase().includes(value.toLowerCase())) ||
        (student.operationName && student.operationName.toLowerCase().includes(value.toLowerCase())) ||
        (student.createdAt && student.createdAt.toLowerCase().includes(value.toLowerCase()))
      );
    });
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

const [operation, setOperation] = useState(null);
const fetchOperation = async () => {
  try {
    const response = await axios.get(`${API}/getoperation`);
    setOperation(response.data);
  } catch (error) {
    console.error("There was an error fetching operation:", error);
  }
};

useEffect(() => {
  fetchOperation();
}, []);

const [selectedOperation, setSelectedOperation] = useState(null);
const handleOperationChange = async (e, rowId) => {
  const selectedOption = operation.find(item => item.fullname === e.target.value);
  setSelectedOperation(selectedOption);
  if (selectedOption) {
    const { fullname, _id } = selectedOption;
    try {
      const response = await axios.post(`${API}/update-operation/${rowId}`, {
        operationName: fullname,
        operationId: _id,
      });
      if (response.status === 200) {
        toast.success('Operation saved to the database');
      } else {
        toast.error('Failed to save the operation');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while saving the operation');
    }finally{
      fetchNewStudent();
    }
  }
};

const convertToIST = (utcDate) => {
  const date = new Date(utcDate);
  date.setHours(date.getHours() + 0);
  date.setMinutes(date.getMinutes() + 0);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

  return (
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
        <div className="mb-2">
          <h2>OnBoarding List:</h2>
          <section className="flex items-center  gap-1">
            <div className="relative group inline-block">
              <i className="fa fa-info-circle text-lg cursor-pointer text-gray-500"></i>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-[9999] mb-2 hidden w-max bg-gray-800 text-white text-sm rounded-md py-2 px-3 group-hover:block">
                Name, Email, Contact ,Counselor Name, Operation Name
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-t-8 border-gray-800 border-x-8 border-x-transparent"></div>
              </div>
            </div>
            <input
                type="text"
                placeholder="Search here by"
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
                {/* <th>Program</th> */}
                <th>Month Opted</th>
                <th>Program Price</th>
                <th>Paid Amount </th>
                {/* <th>Pending </th> */}
                <th>BDA </th>
                <th>Lead from</th>
                {/* <th>Transaction Id</th> */}
                <th>Operation </th>
                <th>Due Date</th>
                <th>Status</th>
                <th>More Details</th>
                <th>Asign Operation</th>
                <th>Time</th>
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
                        <td>{item.whatsAppNumber}</td>
                        <td>{item.email}</td>
                        <td>{item.domain}</td>
                        {/* <td>{item.program}</td> */}
                        <td>{item.monthOpted}</td>
                        <td className="text-green-600 font-bold" >{item.programPrice}</td>
                        <td>{item.paidAmount}</td>
                        {/* <td  >{item.programPrice - item.paidAmount}</td> */}
                        <td>{item.counselor}</td>
                        <td>{item.lead}</td>
                        {/* <td className="capitalize">{item.transactionId}</td> */}
                        <td>{item.operationName}</td>
                        <td className=" whitespace-nowrap">{item.clearPaymentMonth}</td>
                        <td>
                          <button
                          className="button"
                            onClick={() =>
                              handleStatusChange(item._id, "fullPaid")
                            }
                          >
                     
                      <div className="relative group inline-block">
                      <i className="fa fa-money" aria-hidden="true"></i>
                              <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-[9999] mb-2 hidden w-max bg-gray-800 text-white text-sm rounded-md py-2 px-3 group-hover:block">
                                FullPaid
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-t-8 border-gray-800 border-x-8 border-x-transparent"></div>
                              </div>
                            </div>
                          </button>
                          <button
                          className="button"
                            onClick={() =>
                              handleStatusChange(item._id, "default")
                            }
                          >
                           
                            <div className="relative group inline-block">
                            <i className="fa fa-ban"></i>
                              <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-[9999] mb-2 hidden w-max bg-gray-800 text-white text-sm rounded-md py-2 px-3 group-hover:block">
                                Default
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-t-8 border-gray-800 border-x-8 border-x-transparent"></div>
                              </div>
                            </div>
                          </button>
                        </td>
                        <td>
                          <i
                            className="fa fa-info-circle text-2xl cursor-pointer"
                            onClick={() => handleDialogOpen(item)}
                          ></i>
                        </td>
                        <td>
                         {
                            operation && operation.length > 0 && (
                              <select className="border rounded-full border-black " onChange={(e) => handleOperationChange(e, item._id)} defaultValue="Select Operation">
                                <option value="Select Operation" disabled>
                                  Select Operation
                                </option>
                                {operation.map((item) => (
                                  <option value={item.fullname}>{item.fullname}</option>
                                ))}
                              </select>
                            )
                         }
                        </td>
                        <td>
                        {convertToIST(item.createdAt)}
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
                <strong>Year of Study:</strong> {dialogData.yearOfStudy}
              </p>
              <p>
                <strong>Phone:</strong> {dialogData.phone}
              </p>
              <p >
                <strong>Program:</strong> {dialogData.program}
              </p>
              <p className="text-red-600 font-bold">
                <strong>Pending:</strong> {dialogData.programPrice - dialogData.paidAmount}
              </p>

              <p>
                <strong>Transaction Id:</strong> {dialogData.transactionId}
              </p>
              <p>
                <strong> Alternative Email:</strong> {dialogData.alternativeEmail}
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
  );
};
export default OnBoardingDetails;
