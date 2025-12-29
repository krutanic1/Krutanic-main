import axios from "axios";
import React, { useEffect, useState } from "react";
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
import API from "../API";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const BDADashboard = () => {
  const [newStudent, setNewStudent] = useState([]);

  const fetchNewStudent = async () => {
    const bdaName = localStorage.getItem("bdaName");
    try {
      const response = await axios.get(`${API}/getnewstudentenroll`);
      setNewStudent(
        response.data.filter(
          (item) => item.counselor && item.counselor === bdaName
        )
      );
    } catch (error) {
      console.error("There was an error fetching new student:", error);
    }
  };

  useEffect(() => {
    fetchNewStudent();
  }, []);

  const totalRevenue = newStudent.reduce(
    (acc, student) => acc + (student.programPrice || 0),
    0
  );
  const bookedRevenue = newStudent.reduce(
    (acc, student) => acc + (student.programPrice || 0),
    0
  );
  const creditedRevenue = newStudent.reduce(
    (acc, student) =>
      acc + ((student.paidAmount || 0) - (student.defaultAmount || 0)),
    0
  );
  const pendingRevenue = bookedRevenue - creditedRevenue;

  const revenueByMonth = newStudent.reduce((acc, student) => {
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

  const data = {
    labels: ["Booked Revenue", "Credited Revenue", "Pending Revenue"],
    datasets: [
      {
        data: [bookedRevenue, creditedRevenue, pendingRevenue],
        backgroundColor: ["#36A2EB", "#4BC0C0", "#FF6384", "#FF9F40"],
        hoverBackgroundColor: ["#36A2EB", "#4BC0C0", "#FF6384", "#FF9F40"],
      },
    ],
  };

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

  return (
    <div id="AdminDashboard">
      <h2 className="text-center font-semibold mb-2">Dashboard</h2>

      <div className="numberdiv">
        <div>
          <i className="text-yellow-500 fa fa-calendar"></i>
          <h2>Booked</h2>
          <span>
            {newStudent.filter((item) => item.status === "booked").length}
          </span>
        </div>
        <div>
          <i className="text-green-700 fa fa-money"></i>
          <h2>Full PAID</h2>
          <span>
            {newStudent.filter((item) => item.status === "fullPaid").length}
          </span>
        </div>
        <div>
          <i className="text-red-700 fa fa-times-circle"></i>
          <h2>Default</h2>
          <span>
            {newStudent.filter((item) => item.status === "default").length}
          </span>
        </div>
      </div>

      <div className="revenue">
        <div className="revenue-card">
          <h2 className="text-lg font-bold mb-4">Revenue Details</h2>
          <p>Total Revenue: {totalRevenue}/-</p>
          <p>Booked Revenue: {bookedRevenue}/-</p>
          <p>Credited Revenue: {creditedRevenue}/-</p>
          <p>Pending Revenue: {pendingRevenue}/-</p>
        </div>

        <div className="revenue-growth">
          <h2 className="text-lg font-bold mb-4">Revenue Growth</h2>
          <div>
            <Line data={lineChartData} />
          </div>
        </div>

        <div className="revenue-card">
          <h2 className="text-lg font-bold mb-4">Overall Performance</h2>
          <div className="">
            <Pie data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BDADashboard;
