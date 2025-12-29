import axios from "axios";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
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
import GrowthBarChart from "./New folder/GrowthBarChart";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const Home = () => {
  const [newStudent, setNewStudent] = useState([]);
  const [bda, setBda] = useState([]);
  const bdaName = localStorage.getItem("bdaName");
  const today = new Date();
  const currentMonth = today.toISOString().slice(0, 7);

  const fetchNewStudent = async () => {
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

  const fetchBda = async () => {
    try {
      const response = await axios.get(`${API}/getbda`);
      setBda(response.data.filter((item) => item.fullname === bdaName));
    } catch (error) {
      console.error("There was an error fetching bda:", error);
    }
  };

  useEffect(() => {
    fetchBda();
    fetchNewStudent();
  }, []);

  const totalRevenue = newStudent.reduce(
    (acc, student) => acc + (student.programPrice || 0),
    0
  );
  const bookedRevenue = newStudent.reduce(
    (acc, student) => acc + (student.paidAmount || 0),
    0
  );
  const creditedRevenue = newStudent.reduce((acc, student) => {
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

    const processedData = [];
    const monthsToShow = Array.from({ length: 4 }, (_, i) => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() - (3 - i));
    return date.toISOString().slice(0, 7); // YYYY-MM
  });

  monthsToShow.forEach((month) => {
    let totalAssigned = 0;
    let totalAchieved = 0;

    // Go through all BDAs for this month
    bda.forEach((item) => {
      if (item.target && item.target.length > 0) {
        const monthTarget = item.target.find((t) => t.currentMonth === month);

        if (monthTarget) {
          totalAssigned += monthTarget.targetValue;

          const eligibleStudents = newStudent.filter((student) => {
            const studentMonth = new Date(student.createdAt)
              .toISOString()
              .slice(0, 7);
            return (
              studentMonth === month &&
              (student.status === "fullPaid" ||
                student.remark[student.remark.length - 1] === "Half_Cleared")
            );
          });

          totalAchieved += eligibleStudents.reduce(
            (acc, student) => acc + (parseFloat(student.paidAmount) || 0),
            0
          );
        }
      }
    });

    // Only push if there’s data
    if (totalAssigned > 0 || totalAchieved > 0) {
      processedData.push({
        month,
        assigned: totalAssigned,
        achieved: totalAchieved,
      });
    }
  });

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
          {/* <p>Booked Revenue: {bookedRevenue}/-</p> */}
          <p>Credited Revenue: {creditedRevenue}/-</p>
          <p>Pending Revenue: {pendingRevenue}/-</p>
        </div>

        <div className="revenue-growth">
          <h2 className="text-lg font-bold mb-4">Revenue Growth</h2>
          <div>
            <Line data={lineChartData} />
          </div>
        </div>

       
      </div>
      <div id="targetSection">
         <div className="revenue-card">
          <h2 className="text-lg font-bold mb-4">Your Target</h2>
          <div>
            {bda.map((item, index) => {
              if (item.target && item.target.length > 0) {
                const lastTarget = item.target[item.target.length - 1];

                if (lastTarget.currentMonth === currentMonth) {
                  const eligibleStudents = newStudent.filter((student) => {
                    const studentMonth = new Date(student.createdAt)
                      .toISOString()
                      .slice(0, 7);
                    return (
                      studentMonth === currentMonth &&
                      (student.status === "fullPaid" ||
                        student.remark[student.remark.length - 1] === "Half_Cleared")
                    );
                  });

                  const achievedTarget = eligibleStudents.reduce(
                    (acc, student) =>
                      acc + (parseFloat(student.paidAmount) || 0),
                    0
                  );

                  const pendingTarget = lastTarget.targetValue - achievedTarget;
                  const assignedPaymentNumber = lastTarget.payments
                  const allPaymentsThisMonth = newStudent.filter((enroll) => {
          const enrollMonth = new Date(enroll.createdAt).toISOString().slice(0, 7);
          return enrollMonth === currentMonth;
        });

      const actualPayments = allPaymentsThisMonth.length;

    

         processedData.push({
              month: currentMonth,
              assigned: lastTarget.targetValue,
              achieved: achievedTarget,
            });
 
                  return (
                    <div key={index}>
                      <p>🎯 Target Assigned: ₹{lastTarget.targetValue}</p>
                      {eligibleStudents.length === 0 ? (
                        <>
                          <p>
                            ❌ None of your leads have been marked as Full Paid
                            or Half Cleared for this month.
                          </p>
                          <p>✅ Target Achieved: ₹0</p>
                          <p>⏳ Pending Target: ₹{lastTarget.targetValue}</p>
                          <p>📅 No Of Payments : {lastTarget.payments}</p>
                        </>
                      ) : (
                        <>
                          <p>✅ Target Achieved: ₹{achievedTarget}</p>
                          <p>
                            ⏳ Pending Target: ₹
                            {pendingTarget > 0 ? pendingTarget : 0}
                          </p>
                            <p>📅 No Of Payments : {assignedPaymentNumber}</p>
                          <p>💰 Payments Received: {actualPayments}</p>
                        </>
                      )}
                    </div>
                  );
                } else {
                  return <p key={index}>No target assigned for this month.</p>;
                }
              } else {
                return <p key={index}>No target assigned.</p>;
              }
            })}

          {processedData.length > 0 && <GrowthBarChart data={processedData} />}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Home;
