import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const AdvOperationDashboard = () => {
  const [operationData, setOperationData] = useState([]);
  const [advEnrolls, setAdvEnrolls] = useState([]);
  const [operation, setOperation] = useState([]);
  const today = new Date();
  const currentMonthWithDate = today.toISOString().slice(0, 7);
  const operationName = localStorage.getItem("advOperationName");

  const fetchOperationData = async () => {
    const operationId = localStorage.getItem("advOperationId");
    const operationName = localStorage.getItem("advOperationName");
    try {
      const response = await axios.get(`${API}/getadvenrolls?all=true`, {
        params: { operationId },
      });
      setOperationData(
        response.data.filter((data) => data.operationName === operationName)
      );
    } catch (err) {
      console.log("Failed to fetch operation data");
    }
  };

  const fetchOperation = async () => {
    try {
      const response = await axios.get(`${API}/getadvoperation`);
      setOperation(response.data.filter((item) => item.fullname === operationName));
    } catch (error) {
      console.error("There was an error fetching operation:", error);
    }
  };

  const fetchAdvEnrolls = async () => {
    try {
      const response = await axios.get(`${API}/getadvenrolls?all=true`);
      setAdvEnrolls(
        response.data.filter(
          (item) => item.operationName === operationName
        )
      );
    } catch (error) {
      console.error("There was an error fetching advance enrolls:", error);
    }
  };

  useEffect(() => {
    fetchOperationData();
    fetchOperation();
    fetchAdvEnrolls();
  }, []);

  if (!operationData) {
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

  const bookedCount = operationData.filter((item) => item.status === "booked").length;
  const fullPaidCount = operationData.filter((item) => item.status === "fullPaid").length;
  const defaultCount = operationData.filter((item) => item.status === "default").length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Filter operationData to only include current month's records
  const currentMonthData = operationData.filter((student) => {
    const createdAt = new Date(student.createdAt);
    return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
  });

  const totalRevenue = currentMonthData.reduce(
    (acc, student) => acc + (student.programPrice || 0),
    0
  );

  const bookedRevenue = currentMonthData.reduce(
    (acc, student) => acc + (student.paidAmount || 0),
    0
  );

  const creditedRevenue = currentMonthData.reduce((acc, student) => {
    const lastRemark = Array.isArray(student.remark) && student.remark.length > 0
      ? student.remark[student.remark.length - 1]
      : null;

    if (
      student.status === "fullPaid" ||
      lastRemark === "Half_Cleared"
    ) {
      return acc + (student.paidAmount || 0);
    }

    return acc;
  }, 0);

  const pendingRevenue = totalRevenue - creditedRevenue;

  const revenueByMonth = operationData.reduce((acc, student) => {
    const month = new Date(student.createdAt).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    if (!acc[month]) {
      acc[month] = { totalRevenue: 0 };
    }
    if (student.status === "booked" || student.status === "default") {
      acc[month].totalRevenue += student.paidAmount || 0;
    } else if (student.status === "fullPaid") {
      acc[month].totalRevenue += student.programPrice || 0;
    }
    return acc;
  }, {});

  const sortedMonths = Object.keys(revenueByMonth).sort(
    (a, b) => new Date(`1 ${a}`) - new Date(`1 ${b}`)
  );
  const lastTwoMonths = sortedMonths.slice(-2);
  const revenueData = lastTwoMonths.map((month) => ({
    month,
    ...revenueByMonth[month],
  }));

  const pieData = {
    labels: ["Booked", "Full Paid", "Default"],
    datasets: [
      {
        label: "Student Status",
        data: [bookedCount, fullPaidCount, defaultCount],
        backgroundColor: ["#36A2EB", "#4BC0C0", "#FF6384"],
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: revenueData.map((item) => item.month),
    datasets: [
      {
        label: "Revenue",
        data: revenueData.map((item) => item.totalRevenue),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div id="OperationDashboard">
      <div className="operation-dashboard-container">
        <h1 className="dashboard-title">
          Welcome, <span className="highlight">{operationName}</span>!
        </h1>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Current Month Revenue</h3>
            <p className="revenue-amount">₹ {totalRevenue.toLocaleString()}</p>
          </div>

          <div className="dashboard-card">
            <h3>Booked Revenue</h3>
            <p className="revenue-amount">₹ {bookedRevenue.toLocaleString()}</p>
          </div>

          <div className="dashboard-card">
            <h3>Credited Revenue</h3>
            <p className="revenue-amount">₹ {creditedRevenue.toLocaleString()}</p>
          </div>

          <div className="dashboard-card">
            <h3>Pending Revenue</h3>
            <p className="revenue-amount">₹ {pendingRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="charts-container">
          <div className="chart-card">
            <h3>Student Status Distribution</h3>
            <Pie data={pieData} />
          </div>

          <div className="chart-card">
            <h3>Revenue Trend</h3>
            <Line data={lineData} />
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card booked">
            <h4>Booked Students</h4>
            <p className="stat-number">{bookedCount}</p>
          </div>

          <div className="stat-card fullpaid">
            <h4>Full Paid Students</h4>
            <p className="stat-number">{fullPaidCount}</p>
          </div>

          <div className="stat-card default">
            <h4>Default Students</h4>
            <p className="stat-number">{defaultCount}</p>
          </div>

          <div className="stat-card total">
            <h4>Total Students</h4>
            <p className="stat-number">{operationData.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvOperationDashboard;
