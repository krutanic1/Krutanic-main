import axios from "axios";
import React, { useState, useEffect } from "react";
import API from "../API";

const FullPaidList = () => {
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
  // Ideally we should have an API to get available months, but for now hardcoding or keeping empty until user selects or we do a distinct query.
  // Reverting to static list for now or letting user select ignoring availability.

  // Actually, keeping the previous logic of available months is tough with pagination.
  // Best approach: Show current month by default, and allow picking others.

  // Let's keep it simple: Just init with some reasonable range or empty.
  // For this task, I will keep months static or minimal since `getAvailableMonths` was client-side.


  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 30;

  // New state for server-side search
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch the new student data with pagination
  const fetchNewStudent = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        status: "fullPaid", // Filter only fullPaid
        search: debouncedSearch,
        month: selectedMonth ? selectedMonth.split(" ")[0] : undefined,
        year: selectedMonth ? selectedMonth.split(" ")[1] : undefined
      };

      const response = await axios.get(`${API}/getnewstudentenroll`, { params });

      // Check if response has pagination wrapper
      if (response.data.pagination) {
        setNewStudent(response.data.data);
        setFilteredStudents(response.data.data); // Keep filteredStudents for existing logic compatibility if needed, or remove
        setTotalPages(response.data.pagination.totalPages);
      } else {
        // Fallback for older API or 'all=true'
        setNewStudent(response.data);
        setTotalPages(1);
      }

      // Note: getAvailableMonths and month logic might need adjustment if we only fetch 30 items.
      // For now, we might lose the ability to see ALL available months unless we have a separate API for that.
      // Assuming user accepts this limitation or we fix it later. 

    } catch (error) {
      console.error("Error there was an error fetching new student:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debouncedSearch, selectedMonth]);


  // Handle search query change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(curr => curr + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(curr => curr - 1);
  };

  // Format date to display
  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");

  // Filter the students based on the selected month
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setCurrentPage(1); // Reset to first page
  };

  // Handle status change
  const handleChangeStatus = async (studentId, action) => {
    const isConfirmed = window.confirm("Are you sure you want to undo?");
    if (isConfirmed) {
      try {
        await axios.post(`${API}/updateStudentStatus`, {
          studentId,
          status: action,
        });
        fetchNewStudent();
      } catch (error) {
        console.error("There was an error changing status:", error);
      }
    }
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
            <h2>Full Payments</h2>
            <section className="flex items-center gap-1">
              <div className="relative group inline-block">
                <i className="fa fa-info-circle text-lg cursor-pointer text-gray-500"></i>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-[9999] mb-2 hidden w-max bg-gray-800 text-white text-sm rounded-md py-2 px-3 group-hover:block">
                  Name, Email, Contact ,Counselor, Operation , Due date ,  CollegeName and Branch
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
                <th>Action</th>
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
                        <td>
                          <button
                            onClick={() =>
                              handleChangeStatus(item._id, "booked")
                            }
                          >
                            <i className="fa fa-undo"></i>
                          </button>
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

export default FullPaidList;
