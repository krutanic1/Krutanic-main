import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";

const GrowthBarChart = ({ data }) => {
  const chartData = data.map((item) => {
    const { month, assigned, achieved } = item;

    // ✅ Calculate % safely
    const percentage =
      assigned > 0 ? ((achieved / assigned) * 100).toFixed(2) : "0.00";

    return {
      month,
      assigned,
      achieved,
      percentage,
    };
  });

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
          <XAxis dataKey="month" />
          {/* <YAxis unit="0" /> */}
          <YAxis
  tickFormatter={(val) => `₹${val.toLocaleString("en-IN")}`}
/>

          <Tooltip
            formatter={(value, name) => {
              if (name === "Target Achieved") return [`₹${value}`, "Achieved"];
              if (name === "Target Assigned") return [`₹${value}`, "Assigned"];
              return value;
            }}
            

          />
          <Legend />

          
          <Bar dataKey="assigned" fill="#8884d8" name="Target Assigned">
            
            <LabelList
    dataKey="assigned"
    position="top"
    formatter={(val) => `₹${Number(val).toLocaleString("en-IN")}`}
  />
          </Bar>

         
          <Bar dataKey="achieved" name="Target Achieved">
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={parseFloat(entry.percentage) >= 100 ? "#28a745" : "#dc3545"} // green if ≥100% else red
              />
            ))}
            <LabelList dataKey="percentage" position="top" formatter={(val) => `${val}%`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GrowthBarChart;
