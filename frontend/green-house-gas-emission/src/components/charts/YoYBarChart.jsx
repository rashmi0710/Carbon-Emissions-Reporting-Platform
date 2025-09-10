// src/components/charts/YoYBarChart.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchYoYData } from "../../api.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const barColors = [
  "#72A1E5", "#FFBC75", "#92E3A9", "#FF6A7F",
  "#858AE3", "#EC368D", "#F6D6AD", "#A7FFEB"
];

const YoYBarChart = () => {
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetchYoYData();
        if (!mounted) return;
        setRaw(r);
      } catch (err) {
        console.error("fetchYoYData error:", err);
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // process the API response into { labels: [...years], values: [...] }
  const { labels, values } = useMemo(() => {
    if (!Array.isArray(raw)) return { labels: [], values: [] };

    // aggregate total emissions per year (cover many possible field names)
    const map = new Map();

    raw.forEach((item) => {
      // figure out the year (prefer numeric year, else parse date string)
      let yearKey = null;
      if (item.year !== undefined && item.year !== null) {
        const y = item.year;
        if (typeof y === "number") yearKey = String(y);
        else if (/^\d{4}$/.test(String(y))) yearKey = String(y);
        else {
          const d = new Date(String(y));
          if (!Number.isNaN(d.getTime())) yearKey = String(d.getFullYear());
          else yearKey = String(y).slice(0, 4); // fallback
        }
      } else if (item.date) {
        const d = new Date(String(item.date));
        yearKey = Number.isNaN(d.getTime()) ? String(item.date).slice(0, 4) : String(d.getFullYear());
      } else {
        // no year info — skip
        return;
      }

      // extract numeric emission value using multiple possible field names
      const val = Number(
        item.total ??
        item.total_emission ??
        item.emission ??
        item.ghg_emission ??
        item.tco2e ??
        item.value ??
        0
      ) || 0;

      map.set(yearKey, (map.get(yearKey) || 0) + val);
    });

    // sort years ascending numerically
    const sortedYears = Array.from(map.keys()).sort((a, b) => Number(a) - Number(b));
    const labels = sortedYears;
    const values = sortedYears.map((y) => map.get(y) || 0);

    return { labels, values };
  }, [raw]);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!labels.length) return <p>No data available</p>;

  const chartData = {
    labels,
    datasets: [
      {
        label: "Emissions (tCO₂e)",
        data: values,
        backgroundColor: labels.map((_, idx) => barColors[idx % barColors.length]),
        borderColor: "#232946",
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: "#EEBBC3",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 14, family: "Poppins, Arial, sans-serif" },
          color: "#22223B",
        },
      },
      title: {
        display: true,
        text: "Year-over-Year Emissions",
        color: "#22223B",
        font: { weight: "bold", size: 18, family: "Poppins, Arial, sans-serif" },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const v = ctx.parsed.y ?? ctx.parsed;
            // format big numbers (optional)
            return ` ${ctx.dataset.label}: ${Number(v).toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Year", color: "#232946", font: { size: 14, weight: "medium" } },
        grid: { color: "#f0f0f0" },
        ticks: { color: "#232946" },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Emissions (tCO₂e)", color: "#232946", font: { size: 14, weight: "medium" } },
        grid: { color: "#e6e6e6" },
        ticks: { color: "#232946" },
      },
    },
  };

  return (
    <div style={{ flex: "1 1 45%", background: "#f7f5f8", padding: 20, borderRadius: 16 }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default YoYBarChart;
