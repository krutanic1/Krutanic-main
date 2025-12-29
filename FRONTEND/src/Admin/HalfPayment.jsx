import axios from "axios";
import React, { useState, useEffect } from "react";
import API from "../API";

const HalfPayment = () => {
  const [newStudent, setNewStudent] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
 const [selectedMonth, setSelectedMonth] = useState(""); // Store selected month
  const [months, setMonths] = useState([]); // Store list of months

  const fetchNewStudent = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/getnewstudentenroll`);
      const studentsData = response.data.filter(
        (item) => item.remark[item.remark.length - 1] === "Half_Cleared"
      );
      setNewStudent(studentsData);
       // Set the current month for default selection
       const currentMonth = getCurrentMonth();
       setSelectedMonth(currentMonth);
       
       // Filter the students based on the current month by default
       const filtered = studentsData.filter((student) => getMonthFromDate(student.createdAt) === currentMonth);
       setFilteredStudents(filtered);
    } catch (error) {
      console.error("There was an error fetching new student:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewStudent();
    setMonths(getPastMonths());
  }, []);

//   const handleChangeStatus = async (studentId, action) => {
//     const isConfirmed = window.confirm("Are you sure you want to undo?");
//     if (isConfirmed) {
//       try {
//         await axios.post(`${API}/updateStudentStatus`, {
//           studentId,
//           status: action,
//         });
//         fetchNewStudent();
//       } catch (error) {
//         console.error("There was an error changing status:", error);
//       }
//     }
//   };

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

   // Get current month (in string format like "Jan", "Feb", etc.)
   const getCurrentMonth = () => {
    const months = [
      "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    
    const currentMonthIndex = new Date().getMonth();
    return months[currentMonthIndex];
  };

  // Get the previous months including the current month
  const getPastMonths = () => {
    const months = [
      "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    
    const currentMonthIndex = new Date().getMonth();
    let pastMonths = [];

    for (let i = currentMonthIndex; i >= 0; i--) {
      pastMonths.push(months[i]);
    }
    return pastMonths;
  };

  // Filter the students based on the selected month
  const handleMonthChange = (event) => {
    const selectedMonth = event.target.value;
    setSelectedMonth(selectedMonth); // Update selected month
    const filtered = newStudent.filter((student) =>
      getMonthFromDate(student.createdAt) === selectedMonth
    );
    setFilteredStudents(filtered); // Update filtered students
  };

  // Get the month from the student's created date
  const getMonthFromDate = (date) => {
    const months = [
      "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    
    const monthIndex = new Date(date).getMonth();
    return months[monthIndex];
  };


  const groupedData = filteredStudents.reduce((acc, item) => {
    const date = formatDate(item.createdAt);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <div id="AdminAddCourse">
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
            <h2>Half Payments</h2>
            <section className="flex items-center gap-1">
              <div className="relative group inline-block">
                <i className="fa fa-info-circle text-lg cursor-pointer text-gray-500"></i>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-[9999] mb-2 hidden w-max bg-gray-800 text-white text-sm rounded-md py-2 px-3 group-hover:block">
                  Name, Email, Contact ,Counselor, Operation and Due date
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
          <div>
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
          </div>
          <table>
            <thead>
              <tr>
                <th>Sl</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Mode of Program</th>
                <th>Counselor Name</th>
                <th>Op Name</th>
                <th>Opted Domain</th>
                <th>Program Price</th>
                <th>Paid Amount</th>
                <th>Pending</th>
                <th>Month Opted</th>
                <th>Due Date</th>
                {/* <th>Action</th> */}
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
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        <td className="capitalize">{item.program}</td>
                        <td>{item.counselor}</td>
                        <td>{item.operationName}</td>
                        <td className="capitalize">{item.domain}</td>
                        <td>{item.programPrice}</td>
                        <td>{item.paidAmount}</td>
                        <td>{item.programPrice - item.paidAmount}</td>
                        <td className="capitalize">{item.monthOpted}</td>
                        <td className="whitespace-nowrap">
                          {item.clearPaymentMonth}
                        </td>
                        {/* <td>
                          <button
                            onClick={() =>
                              handleChangeStatus(item._id, "booked")
                            }
                          >
                            <div className="relative group inline-block">
                            <i className="fa fa-undo"></i>
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-[9999] mb-2 hidden w-max bg-gray-800 text-white text-sm rounded-md py-2 px-3 group-hover:block">
                            Undo
                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-t-8 border-gray-800 border-x-8 border-x-transparent"></div>
                          </div>
                        </div>
                          </button>
                        </td> */}
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
          
        </div>
      )}
    </div>
  );
};

export default HalfPayment;
