// src/components/charts/EmissionTrendLine.jsx
import React, { useEffect, useState } from "react";
import { fetchYoYData } from "../../api.js"; // or separate API if available

const EmissionTrendLine = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchYoYData().then(setData).catch(console.error);
  }, []);

  return (
    <div style={{ flex: "1 1 60%", background: "#f7f5f8", padding: 20, borderRadius: 12 }}>
      <h3>Emission Trend</h3>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre> // Replace with line chart rendering
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default EmissionTrendLine;
