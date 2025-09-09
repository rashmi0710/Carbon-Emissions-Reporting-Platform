// src/components/charts/HotspotDonut.jsx
import React, { useEffect, useState } from "react";
import { fetchHotspotData } from "../../api.js";

const HotspotDonut = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchHotspotData().then(setData).catch(console.error);
  }, []);

  return (
    <div style={{ flex: "1 1 45%", background: "#f7f5f8", padding: 20, borderRadius: 12 }}>
      <h3>Hotspot Emissions</h3>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre> // Replace with donut/pie chart component
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default HotspotDonut;
