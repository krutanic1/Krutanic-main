import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import toast, { Toaster } from 'react-hot-toast';

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });
  const nextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1).toLocaleString("default", { month: "long", year: "numeric" });

  const [Operation, setOperation] = useState([]);
  const [AdvOperation, setAdvOperation] = useState([]);
  const [bda, setBda] = useState([]);
  const [payment, setPayment] = useState([]);
  const [advPayment, setAdvPayment] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/getcourses`);
      setCourses(response.data);
    } catch (error) {
      console.error("There was an error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const [advCourses, setAdvCourses] = useState([]);
  const fetchAdvCourses = async () => {
    try {
      const response = await axios.get(`${API}/getadvcourses`);
      setAdvCourses(response.data);
    } catch (error) {
      console.error("There was an error fetching adv courses:", error);
    }
  };

  const fetchOperation = async () => {
    try {
      const response = await axios.get(`${API}/getoperation`);
      setOperation(response.data);
    } catch (error) {
      console.error("There was an error fetching operation:", error);
    }
  };

  const fetchAdvOperation = async () => {
    try {
      const response = await axios.get(`${API}/getadvoperation`);
      setAdvOperation(response.data);
    } catch (error) {
      console.error("There was an error fetching ADV operation:", error);
    }
  };

  const fetchBda = async () => {
    try {
      const response = await axios.get(`${API}/getbda`);
      setBda(response.data);
    } catch (error) {
      console.error("There was an error fetching bda:", error);
    }
  };

  const fetchNewStudent = async () => {
    try {
      // ✅ OPTIMIZATION: Limit to 1000 records for dashboard statistics
      // (Full data available via pagination on dedicated pages)
      const response = await axios.get(`${API}/getnewstudentenroll?all=true`);
      setPayment(response.data);
    } catch (error) {
      console.error("There was an error fetching new student:", error);
    }
  };

  const fetchAdvEnrollments = async () => {
    try {
      const response = await axios.get(`${API}/getadvenrolls?all=true`);
      setAdvPayment(response.data);
    } catch (error) {
      console.error("There was an error fetching adv enrollments:", error);
    }
  };

  useEffect(() => {
    // ✅ OPTIMIZATION: Sequential + batched loading to reduce Vercel instance spawn
    // Old: 4 parallel requests → 4 Vercel instances → 40 connections (with old minPoolSize: 10)
    // New: Sequential + 2 parallel max → 2 instances → reduced connection pressure
    (async () => {
      setLoading(true);
      try {
        // Priority 1: Courses (needed for table)
        await Promise.all([fetchCourses(), fetchAdvCourses()]);

        // Priority 2: Batch non-critical metadata (max 2 parallel)
        await Promise.all([
          fetchOperation(),
          fetchAdvOperation(),
          fetchBda()
        ]);

        // Priority 3: Heavy query last (full enrollments with limit)
        await Promise.all([fetchNewStudent(), fetchAdvEnrollments()]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);



  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredPayments, setFilteredPayments] = useState(payment);
  const [showFilters, setShowFilters] = useState(false);

  const filterPaymentsByDate = () => {
    let filteredData = payment;

    if (startDate) {
      filteredData = filteredData.filter(
        (item) => new Date(item.createdAt) >= new Date(startDate)
      );
    }

    if (endDate) {
      filteredData = filteredData.filter(
        (item) => new Date(item.createdAt) <= new Date(endDate)
      );
    }

    setFilteredPayments(filteredData);
    toast.success("Data filtered successfully.");
    setStartDate("");
    setEndDate("");
  };

  const exportToExcel = () => {
    if (filteredPayments.length === 0) {
      toast.error("Please select a valid start and end date to filter the data.");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(filteredPayments);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Filtered Data");
    const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelFile], { bookType: "xlsx", type: "application/octet-stream" });
    saveAs(blob, "filtered_students.xlsx");
    toast.success("Data exported successfully.");
    setShowFilters(false);
  };


  return (
    <div id="AdminDashboard" >
      <Toaster position="top-center" reverseOrder={false} />
      <div className="numberdiv">
        <div>
          <i className="text-blue-700	fa fa-book"></i>
          <h2>COURSE</h2>
          <span>{courses.length}</span>
        </div>
        <div>
          <i className="fa fa-book text-purple-700"></i>
          <h2>ADV COURSE</h2>
          <span>{advCourses.length}</span>
        </div>
        <div>
          <i className="fa fa-user-secret"></i>
          <h2>OPERATION</h2>
          <span>{Operation.length}</span>
        </div>
        <div>
          <i className="fa fa-user-secret text-purple-600"></i>
          <h2>ADV OPERATION</h2>
          <span>{AdvOperation.length}</span>
        </div>
        <div>
          <i className="fa fa-users"></i>
          <h2>BDA</h2>
          <span>{bda.length}</span>
        </div>
        <div>
          <i className="text-yellow-500 fa fa-calendar"></i>
          <h2>Booked</h2>
          <span>
            {payment.filter((item) => item.status === "booked").length}
          </span>
        </div>
        <div>
          <i className="text-green-700	fa fa-money"></i>
          <h2>Full PAID</h2>
          <span>
            {payment.filter((item) => item.status === "fullPaid").length}
          </span>
        </div>
        <div >
          <i className="text-red-700 fa fa-times-circle"></i>
          <h2>Default</h2>
          <span>
            {payment.filter((item) => item.status === "default").length}
          </span>
        </div>
      </div>
      <div className="p-4 relative">
        <button onClick={() => setShowFilters(!showFilters)} className="bg-blue-500 text-white py-2 px-4 rounded">
          <i className="fa fa-filter" aria-hidden="true"></i> Filter
        </button>
        {showFilters && (
          <div className="mt-4 absolute bg-white top-10 border w-[300px] p-4 rounded shadow-lg">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <button
              onClick={filterPaymentsByDate}
              className="bg-green-500 text-white py-2 px-4 rounded mb-4"
            >
              Filter Data
            </button>

            <h4 className="text-dm mb-2 font-semibold">Filtered Data: {filteredPayments.length}</h4>

            <button
              onClick={exportToExcel}
              className="bg-yellow-500 text-white py-2 px-4 rounded"
            >
              Download Excel
            </button>
          </div>
        )}
      </div>
      <h3>Added Courses</h3>
      <div className="courselist">
        {loading ? (
          <div id="loader">
            <div className="three-body">
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
            </div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Sl</th>
                <th>Course</th>
                <th>Session</th>
                <th>For {currentMonth} </th>
                <th>For {nextMonth}</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{course.title}</td>
                  <td>{course.session ? Object.keys(course.session).length : 0}</td>
                  <td>{payment?.filter((item) => item.domainId === course._id && item.monthOpted === currentMonth).length || 0}</td>
                  <td>{payment?.filter((item) => item.domainId === course._id && item.monthOpted === nextMonth).length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <br />
      <h3>Added Advance Courses</h3>
      <div className="courselist">
        {loading ? (
          <div id="loader">
            <div className="three-body">
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
            </div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Sl</th>
                <th>Course</th>
                <th>Session</th>
                <th>For {currentMonth} </th>
                <th>For {nextMonth}</th>
              </tr>
            </thead>
            <tbody>
              {advCourses.map((course, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{course.title}</td>
                  <td>{course.sessions?.length || 0}</td>
                  <td>{advPayment?.filter((item) => item.domainId === course._id && item.monthOpted === currentMonth).length || 0}</td>
                  <td>{advPayment?.filter((item) => item.domainId === course._id && item.monthOpted === nextMonth).length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
