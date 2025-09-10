import React from "react";
import YoYBarChart from "../components/charts/YoYBarChart";
import HotspotDonut from "../components/charts/HotspotDonut";
// import IntensityCard from "../components/charts/IntensityCard";
// import EmissionTrendLine from "../components/charts/EmissionTrendLine";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="cards-grid">
        <div className="dashboard-card">
          <YoYBarChart />
        </div>
        <div className="dashboard-card">
          <HotspotDonut />
        </div>
        {/* <div className="dashboard-card intensity-card">
          <IntensityCard />
        </div> */}
        {/* <div className="dashboard-card">
          <EmissionTrendLine />
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
