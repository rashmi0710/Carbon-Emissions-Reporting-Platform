import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from './api';

export default function YearOverYearChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchYoY() {
      try {
        const res = await api.get('/emissions/yoy');
        setData(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch YoY emissions", err);
      }
    }
    fetchYoY();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-white text-center mb-4 drop-shadow-md">
        📊 Year-over-Year Emissions
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis dataKey="year" stroke="#e5e7eb" />
          <YAxis stroke="#e5e7eb" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(17,24,39,0.9)",
              borderRadius: "0.5rem",
              border: "none",
              color: "#fff",
            }}
          />
          <Legend wrapperStyle={{ color: "#fff" }} />
          <Bar dataKey="scope1" stackId="a" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          <Bar dataKey="scope2" stackId="a" fill="#10b981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
