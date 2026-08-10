import { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";

const LeaderBoard = () => {
  const [allData, setAllData] = useState({});
  const [selectedTeam, setSelectedTeam] = useState("");

  const today = new Date();

  // August 2025 is the start month
  const startMonth = new Date("2025-08-01");

  // Helper to get YYYY-MM format
  const formatMonth = (date) => date.toISOString().slice(0, 7);

  // Get list of months from August 2025 up to the current month
  const getVisibleMonths = () => {
    const months = [];
    const current = new Date(startMonth);

    while (
      current.getFullYear() < today.getFullYear() ||
      (current.getFullYear() === today.getFullYear() && current.getMonth() <= today.getMonth())
    ) {
      months.push(formatMonth(current));
      current.setMonth(current.getMonth() + 1);
    }

    return months.reverse();
  };


  const visibleMonths = getVisibleMonths();

  const fetchAllData = async () => {
    try {
      const response = await axios.get(`${API}/leaderboard-agg`);
      setAllData(response.data);
    } catch (error) {
      console.error("There was an error fetching leaderboard data:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const getTop3BDAsByGrossRevenue = (month) => {
    const monthData = allData[month];
    if (!monthData) return [];
    
    let bdas = monthData.allBDAs || [];
    if (selectedTeam) {
      bdas = bdas.filter(bda => bda.team === selectedTeam);
    }
    
    return bdas.slice(0, 5);
  };

  const getTotalPaymentsForMonth = (month) => {
    const monthData = allData[month];
    if (!monthData) return 0;
    
    // If a team is selected, we should ideally sum only that team's payments,
    // otherwise show the overall month's payments. 
    // To match previous logic, we should sum it dynamically if filtered:
    if (selectedTeam) {
      return monthData.allBDAs
        .filter(bda => bda.team === selectedTeam)
        .reduce((sum, bda) => sum + (bda.paymentCount || 0), 0);
    }
    return monthData.totalPayments || 0;
  };

  return (
    <div id="AdminAddCourse">
      <div className="flex flex-col mt-6">
        <h3>🏆 Leaderboard Progression (August 2025)</h3>

        {visibleMonths.map((month) => {
          const top3BDAs = getTop3BDAsByGrossRevenue(month);
          const totalPayments = getTotalPaymentsForMonth(month);

          return (
            <div
              key={month}
              style={{
                marginTop: "1rem",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              <h4>{month}</h4>
              <p>
                <strong>💰 Total Payment Count:</strong> {totalPayments}
              </p>
              <table className="bdarevenuetable mt-2">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Team</th>
                    <th>Gross Revenue (Program Price)</th>
                    <th>No. of Payments</th>
                  </tr>
                </thead>
                <tbody>
                  {top3BDAs.length > 0 ? (
                    top3BDAs.map((bda, idx) => (
                      <tr key={idx}>
                        <td>#{idx + 1}</td>
                        <td>{bda.fullname}</td>
                        <td>{bda.team}</td>
                        <td>₹ {bda.grossRevenue.toLocaleString()}</td>
                        <td>{bda.paymentCount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No Data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaderBoard;
