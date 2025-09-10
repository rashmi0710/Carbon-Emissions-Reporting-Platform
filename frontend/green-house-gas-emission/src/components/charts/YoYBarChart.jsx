// src/components/charts/YoYBarChart.jsx
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { fetchYoYData } from "../../api.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const barColors = [
  "#72A1E5", // blue
  "#FFBC75", // orange
  "#92E3A9", // green
  "#FF6A7F", // pink
  "#858AE3", // purple
  "#EC368D", // magenta
  "#F6D6AD", // beige
  "#A7FFEB"  // teal
];

const YoYBarChart = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchYoYData().then(setData).catch(console.error);
  }, []);

  if (!data) return <p>Loading data...</p>;

  const labels = data.map(item => item.year);
  const emissions = data.map(item => item.emission);

  const chartData = {
    labels,
    datasets: [{
      label: "Emissions (tCO2e)",
      data: emissions,
      backgroundColor: labels.map((_, idx) => barColors[idx % barColors.length]),
      borderColor: "#232946",
      borderWidth: 2,
      borderRadius: 8,
      hoverBackgroundColor: "#EEBBC3"
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            family: "Poppins, Arial, sans-serif"
          },
          color: "#22223B"
        }
      },
      title: {
        display: true,
        text: "Year-over-Year Emissions",
        color: "#22223B",
        font: {
          weight: "bold",
          size: 18,
          family: "Poppins, Arial, sans-serif"
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Year",
          color: "#232946",
          font: {
            size: 14,
            weight: "medium"
          }
        },
        grid: {
          color: "#f0f0f0"
        },
        ticks: {
          color: "#232946"
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Emissions (tCO2e)",
          color: "#232946",
          font: {
            size: 14,
            weight: "medium"
          }
        },
        grid: {
          color: "#e6e6e6"
        },
        ticks: {
          color: "#232946"
        }
      }
    }
  };

  return (
    <div style={{ flex: "1 1 45%", background: "#f7f5f8", padding: 20, borderRadius: 16 }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default YoYBarChart;
