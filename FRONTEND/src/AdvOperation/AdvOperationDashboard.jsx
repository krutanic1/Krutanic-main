import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
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
    revenue: revenueByMonth[month]?.totalRevenue || 0,
  }));

  const lineChartData = {
    labels: revenueData.map((data) => data.month),
    datasets: [
      {
        label: "Revenue Growth (₹)",
        data: revenueData.map((data) => data.revenue),
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div id="AdminDashboard">
      <h2 className="text-center font-semibold mb-4">Operation Dashboard</h2>

      <div className="numberdiv">
        <div>
          <i className="text-yellow-500 fa fa-calendar"></i>
          <h2>Booked</h2>
          <span>{bookedCount}</span>
        </div>
        <div>
          <i className="text-green-700 fa fa-money"></i>
          <h2>Full PAID</h2>
          <span>{fullPaidCount}</span>
        </div>
        <div>
          <i className="text-red-700 fa fa-times-circle"></i>
          <h2>Default</h2>
          <span>{defaultCount}</span>
        </div>
      </div>

      <div className="revenue">
        <div className="revenue-card">
          <h2 className="text-lg font-semibold">Revenue Details (Current Month)</h2>
          <p>Total Revenue: {totalRevenue}/-</p>
          <p>Credited Revenue: {creditedRevenue}/-</p>
          <p>Pending Revenue: {pendingRevenue}/-</p>
        </div>

        <div className="revenue-growth">
          <h2 className="text-lg font-semibold mb-4">Revenue Growth</h2>
          <div>
            <Line data={lineChartData} />
          </div>
        </div>

        <div className="revenue-card">
          <h2 className="text-lg font-bold mb-4">Your Target</h2>
          <div>
            {operation.map((item, index) => {
              if (item.target && item.target.length > 0) {
                const lastTarget = item.target[item.target.length - 1];

                if (lastTarget.currentMonth === currentMonthWithDate && lastTarget.percentage) {
                  return (
                    <div key={index}>
                      <p>📅 Payment Percentage: {lastTarget.percentage}</p>
                    </div>
                  );
                } else {
                  return <p key={index}>No target assigned for this month.</p>;
                }
              } else {
                return <p key={index}>No target assigned.</p>;
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvOperationDashboard;
