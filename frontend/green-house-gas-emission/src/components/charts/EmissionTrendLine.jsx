// src/components/charts/EmissionTrendLine.jsx
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { fetchYoYData } from "../../api.js";

const EmissionTrendLine = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await fetchYoYData();
        if (Array.isArray(result)) {
          setData(result);
        } else {
          console.error("Unexpected API response:", result);
        }
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
      <h3 style={{ textAlign: "center", marginBottom: 20 }}>Emission Trend Over Years</h3>
      {loading ? (
        <p>Loading data...</p>
      ) : data.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#ddd" />
            <XAxis
              dataKey="year"
              label={{ value: "Year", position: "insideBottomRight", offset: -10, fill: "#666" }}
              tick={{ fill: "#555" }}
            />
            <YAxis
              label={{ value: "Emissions (tCO2e)", angle: -90, position: "insideLeft", fill: "#666" }}
              tick={{ fill: "#555" }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#f9f9f9", borderRadius: 8, borderColor: "#ccc" }}
              labelStyle={{ fontWeight: "bold" }}
            />
            <Legend verticalAlign="top" height={36} />
            <Line type="monotone" dataKey="scope1" stroke="#6a75f1" strokeWidth={3} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="scope2" stroke="#57d9a3" strokeWidth={3} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="scope3" stroke="#ffc658" strokeWidth={3} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>No emission data available</p>
      )}
    </div>
  );
};

export default EmissionTrendLine;
