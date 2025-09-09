import React, { useEffect, useState } from "react";
import api from "../api";
import './Homepage.css';

const Home = () => {
  const [scope1, setScope1] = useState(0);
  const [scope2, setScope2] = useState(0);
  const [latestMetric, setLatestMetric] = useState(null);
  const [intensity, setIntensity] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const scope1Res = await api.get("/emissions/scope1/total");
        const scope2Res = await api.get("/emissions/scope2/total");
        setScope1(scope1Res.data.total_emission);
        setScope2(scope2Res.data.total_emission);

        const metricRes = await api.get("/business-metrics/latest");
        setLatestMetric(metricRes.data);

        const intensityRes = await api.get("/emissions/intensity");
        setIntensity(intensityRes.data.intensity);
      } catch (err) {
        console.error("Error loading home data:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="homePage">
      <div className="container">
        <h1 className="title">🌍 GHG Emissions Dashboard</h1>
        <p className="subtitle">
          Track and monitor Scope 1 & Scope 2 emissions with intensity metrics
        </p>

        <div className="cards">
          <div className="card">
            <h3>Scope 1 Emissions</h3>
            <p>{scope1} kgCO₂e</p>
          </div>

          <div className="card">
            <h3>Scope 2 Emissions</h3>
            <p>{scope2} kgCO₂e</p>
          </div>

          <div className="card">
            <h3>Emission Intensity</h3>
            <p>{intensity ? `${intensity} kgCO₂e / unit` : "--"}</p>
          </div>
        </div>

        {latestMetric && (
          <div className="latestMetric">
            <h3>Latest Metric</h3>
            <p>
              {latestMetric.metric_name}: {latestMetric.value} (on {latestMetric.metric_date})
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
