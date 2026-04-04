import axios from "axios";
import React, { useState, useEffect } from "react";
import API from "../API";

const AdvFullPayment = () => {
  const [advEnrolls, setAdvEnrolls] = useState([]);
  const fetchAdvEnrolls = async () => {
    const operationName = localStorage.getItem("advOperationName");
    try {
      const response = await axios.get(`${API}/getadvenrolls?all=true`);
      const fullPaidStudents = response.filter(
        (item) =>
          item.status === "fullPaid" && item.operationName === operationName
      );
      setAdvEnrolls(fullPaidStudents);
      setFilteredStudents(fullPaidStudents);

      const currentMonth = getCurrentMonth();
      setSelectedMonth(currentMonth);

      const filtered = fullPaidStudents.filter(
        (student) => getMonthFromDate(student.createdAt) === currentMonth
      );
      setFilteredStudents(filtered);
    } catch (error) {
      console.error("There was an error fetching advance enrolls:", error);
    }
  };
  
  useEffect(() => {
    fetchAdvEnrolls();
    setMonths(getPastMonths());
  }, []);
  
  
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
          student.clearPaymentMonth.toLowerCase().includes(value.toLowerCase())) ||
        (student.collegeName &&
          student.collegeName.toLowerCase().includes(value.toLowerCase())) ||
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
    setSelectedMonth(selectedMonth);
    const filtered = advEnrolls.filter(
      (student) => getMonthFromDate(student.createdAt) === selectedMonth
    );
    setFilteredStudents(filtered);
  };

  const getCurrentMonth = () => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    return `${months[currentMonthIndex]} ${currentYear}`;
  };

  const getPastMonths = () => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
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
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
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

  if (!advEnrolls || advEnrolls.length === 0) {
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
    <div id="AdminAddCourse">
      <div className="coursetable">
        <h1>Advance Program - Full Payments</h1>
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
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden w-max bg-gray-800 text-white text-sm rounded-md py-2 px-3 group-hover:block">
              Name, Email, Contact, Counselor Name, Operation Name
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
              <th>Sl</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Mode of Program</th>
              <th>Counselor Name</th>
              <th>Got Payment On</th>
              <th>Opted Domain</th>
              <th>Program Price</th>
              <th>Paid Amount</th>
              <th>Remaining</th>
              <th>Month Opted</th>
              <th>A/c Created</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(currentItems) && currentItems.length > 0 ? (
              currentItems?.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td className="capitalize">{item.fullname}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td className="capitalize">{item.program}</td>
                  <td>{item.counselor}</td>
                  <td>
                    {new Date(item.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td>{item.domain}</td>
                  <td>₹{item.programPrice}</td>
                  <td>₹{item.paidAmount}</td>
                  <td>₹{item.remainingAmount || (item.programPrice - item.paidAmount)}</td>
                  <td className="capitalize">{item.monthOpted}</td>
                  <td>{item.userCreated ? "Yes" : "No"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13">No data found</td>
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
      </div>
    </div>
  );
};

export default AdvFullPayment;
