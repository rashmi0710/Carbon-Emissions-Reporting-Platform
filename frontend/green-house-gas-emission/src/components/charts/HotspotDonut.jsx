// src/components/charts/HotspotDonut.jsx
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { fetchHotspotData } from "../../api.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const HotspotDonut = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchHotspotData().then(setData).catch(console.error);
  }, []);

  if (!data) {
    return (
      <div style={{ flex: "1 1 45%", background: "#f7f5f8", padding: 20, borderRadius: 12 }}>
        <h3>Hotspot Emissions</h3>
        <p>Loading data...</p>
      </div>
    );
  }

  // Extract labels & values
  const labels = data.map(item => item.activity);
  const values = data.map(item => item.total_emission);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Emissions (tCO₂e)",
        data: values,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40"
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: { size: 14, family: "Poppins, Arial, sans-serif" },
          color: "#232946",
        },
      },
      title: {
        display: true,
        text: "Emission Hotspots",
        color: "#22223B",
        font: { size: 18, weight: "bold", family: "Poppins, Arial, sans-serif" },
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.label}: ${context.formattedValue} tCO₂e`,
        },
      },
    },
  };

  return (
    <div style={{ flex: "1 1 45%", background: "#f7f5f8", padding: 20, borderRadius: 12 }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default HotspotDonut;
