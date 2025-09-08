import React from 'react';
import Scope1Form from './Scope1Form';
import YearOverYearChart from './YearOverYearChart';
import './app.css';

function App() {
  return (
    <div className="app-container">
      {/* Animated CO2 molecules */}
      <div className="co2-background">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="co2-bubble"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${2 + Math.random() * 8}s`,
            }}
          >
            <span className="co2-label">CO₂</span>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="main-content">
        <div className="content-wrapper flex flex-col items-center justify-center text-center py-10 px-6 bg-gradient-to-r from-emerald-900 via-green-800 to-emerald-900 rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="header-box">
            <h1 className="header-title text-4xl md:text-5xl font-extrabold text-white flex items-center justify-center gap-2 drop-shadow-lg">
              🌍 <span>GHG Emissions Dashboard</span>
            </h1>
            <p className="header-subtitle mt-3 text-lg md:text-xl font-medium text-green-100 italic tracking-wide opacity-95">
              Track and monitor greenhouse gas emissions across all scopes
            </p>
          </div>

          {/* Form container */}
          <div>
            <Scope1Form />
          </div>

          {/* Form container */}
          <div>
            <YearOverYearChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
