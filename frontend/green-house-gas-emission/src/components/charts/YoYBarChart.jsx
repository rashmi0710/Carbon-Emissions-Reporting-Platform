// src/components/charts/YoYBarChart.jsx
import React, { useEffect, useState } from "react";
import { fetchYoYData } from "../../api.js";

const YoYBarChart = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchYoYData().then(setData).catch(console.error);
  }, []);

  return (
    <div style={{ flex: "1 1 45%", background: "#f7f5f8", padding: 20, borderRadius: 12 }}>
      <h3>Year-over-Year Emissions</h3>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre> // Replace with chart library render
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default YoYBarChart;
