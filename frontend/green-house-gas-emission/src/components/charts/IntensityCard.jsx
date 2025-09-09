// src/components/charts/IntensityCard.jsx
import React, { useEffect, useState } from "react";
import { fetchIntensityData } from "../../api.js";

const IntensityCard = () => {
  const [intensity, setIntensity] = useState(null);

  useEffect(() => {
    fetchIntensityData().then(data => setIntensity(data.intensity)).catch(console.error);
  }, []);

  return (
    <div style={{
      flex: "1 1 30%",
      background: "#7c3aed",
      color: "white",
      padding: 20,
      borderRadius: 12,
      textAlign: "center"
    }}>
      <h3>Emission Intensity</h3>
      {intensity !== null ? (
        <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{intensity} kgCO₂e / unit</p>
      ) : (
        <p>Loading intensity...</p>
      )}
    </div>
  );
};

export default IntensityCard;
