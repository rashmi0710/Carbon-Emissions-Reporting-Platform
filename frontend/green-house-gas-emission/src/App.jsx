import React from "react";
import { Routes, Route } from "react-router-dom";
import "./app.css";

import Navbar from "./components/Navbar";
import Background from "./Background";

// Pages & Components
import Home from "./components/Home";
import AddEmissionForm from "./components/AddEmissionForm";
import BusinessMetricForm from "./components/BusinessMetricForm";
// import AuditLogs from "./components/AuditLogs"; // ✅ you'll need to create this component

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Background />

      <div className="content">
        <Routes>
          {/* Dashboard (first page) */}
          <Route path="/" element={<Home />} />

          {/* Add Emission Page */}
          <Route path="/add-emission" element={<AddEmissionForm />} />

          {/* Business Metrics Page */}
          <Route path="/metrics" element={<BusinessMetricForm />} />

          {/* Audit Logs Page */}
          {/* <Route path="/audit" element={<AuditLogs />} /> */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
