import axios from "axios";
import React, { useEffect, useState } from "react";
import API from "../API";

const FullPaid = () => {
  const [newStudent, setNewStudent] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const fetchNewStudent = async () => {
    const bdaName = localStorage.getItem("bdaName");
    try {
      const response = await axios.get(`${API}/getnewstudentenroll`);
      const bookedStudents = response.data.filter(
        (item) => item.counselor === bdaName && item.status === "fullPaid"
      );
      setNewStudent(bookedStudents);
      setFilteredStudents(bookedStudents);


      const currentMonth = getCurrentMonth();
      setSelectedMonth(currentMonth);
      
      // Filter the students based on the current month by default
      const filtered = bookedStudents.filter((student) => getMonthFromDate(student.createdAt) === currentMonth);
      setFilteredStudents(filtered);
    } catch (error) {
      console.error("There was an error fetching new student:", error);
    }
  };
  useEffect(() => {
    fetchNewStudent();
    setMonths(getPastMonths());
  }, []);

  if (!newStudent) {
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
          student.clearPaymentMonth.toLowerCase().includes(value.toLowerCase()))||
          (student.collegeName &&
            student.collegeName.toLowerCase().includes(value.toLowerCase()))||
            (student.branch &&
              student.branch.toLowerCase().includes(value.toLowerCase()))
      );
    });
    setFilteredStudents(filtered);
  };

    const [selectedMonth, setSelectedMonth] = useState("");
      const [months, setMonths] = useState([]);
    const handleMonthChange = (event) => {
      const selectedMonth = event.target.value;
      setSelectedMonth(selectedMonth); // Update selected month
      const filtered = newStudent.filter((student) =>
        getMonthFromDate(student.createdAt) === selectedMonth
      );
      setFilteredStudents(filtered); // Update filtered students
    };
 // Format date to display
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

   for (let i = 0; i < 4; i++) {
    const index = (currentMonthIndex - i + 12) % 12; // handles wrap-around
    pastMonths.push(months[index]);
  }

  return pastMonths; 
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
      <div className="coursetable">
      <div className="mb-2">
        <section className="flex items-center gap-1">
          <input
            type="type"
            placeholder="Search here by "
            value={searchQuery}
            onChange={handleSearchChange}
            className="border border-black px-2 py-1 rounded-lg"
          />

          <div className="relative group inline-block">
            <i className="fa fa-info-circle text-lg cursor-pointer"></i>
            <div className="absolute left-1/2 z-[9999] -translate-x-1/2 bottom-full mb-2 hidden w-max bg-gray-800 text-white text-sm rounded-md py-2 px-3 group-hover:block">
              Name, Email, Contact ,Counselor Name, Operation Name
              <div className="absolute left-1/2  z-[9999] -translate-x-1/2 top-full w-0 h-0 border-t-8 border-gray-800 border-x-8 border-x-transparent"></div>
            </div>
          </div>
        </section>
        <h2>Full Payment</h2>
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
              <th>Operation Name</th>
              <th>Opted Domain</th>
              <th>Program Price</th>
              <th>Paid Amount </th>
              <th>Pending </th>
              <th>Month Opted</th>
              <th>Due Date</th>
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
                                    {/* <td>{item.counselor}</td> */}
                                    <td>{item.operationName}</td>
                                    <td className="capitalize">{item.domain}</td>
                                    <td>{item.programPrice}</td>
                                    <td>{item.paidAmount}</td>
                                    <td>{item.programPrice - item.paidAmount}</td>
                                    <td className="capitalize">{item.monthOpted}</td>
                                    <td className=" whitespace-nowrap">{item.clearPaymentMonth}</td>
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
    </div>
  );
};

export default FullPaid;
