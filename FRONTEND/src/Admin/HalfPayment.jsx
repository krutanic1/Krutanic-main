import axios from "axios";
import React, { useState, useEffect } from "react";
import API from "../API";

const HalfPayment = () => {
  const [newStudent, setNewStudent] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(""); // Store selected month (format: "Month-Year")
  // Generate months dynamically from current month going back 24 months
  const generateMonths = () => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const months = [];
    const now = new Date();

    for (let i = 0; i < 24; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      months.push(monthYear);
    }
    return months;
  };

  const [months] = useState(generateMonths());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 30;

  // Debounced search state
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch the new student data with server-side pagination
  const fetchNewStudent = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        remark: "Half_Cleared", // Server-side remark filtering
        search: debouncedSearch,
        month: selectedMonth ? selectedMonth.split(" ")[0] : undefined,
        year: selectedMonth ? selectedMonth.split(" ")[1] : undefined
      };

      const response = await axios.get(`${API}/getnewstudentenroll`, { params });

      // Check if response has pagination wrapper
      if (response.data.pagination) {
        setNewStudent(response.data.data);
        setFilteredStudents(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        // Fallback for older API or 'all=true'
        const halfPaidStudents = response.data.filter(
          (item) => item.remark && item.remark[item.remark.length - 1] === "Half_Cleared"
        );
        setNewStudent(halfPaidStudents);
        setFilteredStudents(halfPaidStudents);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("There was an error fetching new student:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debouncedSearch, selectedMonth]);

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

  // Handle search query change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  // Format date to display
  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");

  // Filter the students based on the selected month
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setCurrentPage(1); // Reset to first page
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(curr => curr + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(curr => curr - 1);
  };

  // Grouping logic for the CURRENT PAGE data
  const groupedData = newStudent.reduce((acc, item) => {
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
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
      )}
    </div>
  );
};

export default HalfPayment;
