// src/components/charts/EmissionTrendLine.jsx
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { fetchTrendData } from "../../api.js";

const EmissionTrendLine = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const raw = await fetchTrendData();

        // Pivot data: group by year-month
        const grouped = {};
        raw.forEach((row) => {
          const date = `${row.year}-${String(row.month).padStart(2, "0")}`;
          if (!grouped[date]) grouped[date] = { date, scope1: 0, scope2: 0, scope3: 0 };
          grouped[date][row.scope] = row.total;
        });

        setData(Object.values(grouped));
      } catch (err) {
        console.error("Error fetching emission trend:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div style={{ flex: "1 1 60%", background: "#f7f5f8", padding: 20, borderRadius: 12 }}>
      <h3 style={{ textAlign: "center", marginBottom: 20 }}>Emission Trend Over Time</h3>
      {loading ? (
        <p>Loading data...</p>
      ) : data.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#ddd" />
            <XAxis dataKey="date" tick={{ fill: "#555" }} />
            <YAxis
              label={{ value: "Emissions (tCO2e)", angle: -90, position: "insideLeft", fill: "#666" }}
              tick={{ fill: "#555" }}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="scope1" stroke="#6a75f1" strokeWidth={3} />
            <Line type="monotone" dataKey="scope2" stroke="#57d9a3" strokeWidth={3} />
            <Line type="monotone" dataKey="scope3" stroke="#ffc658" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>No emission data available</p>
      )}
    </div>
  );
};

export default EmissionTrendLine;
