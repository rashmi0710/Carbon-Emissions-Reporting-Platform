import React, { useState } from "react";


const BusinessMetricForm = () => {
  const [formData, setFormData] = useState({
    metric_name: "",
    metric_date: "",
    value: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert "value" to number if not empty
    if (name === "value") {
      setFormData({ ...formData, [name]: value === "" ? "" : Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    console.log("Form Data:", { ...formData, [name]: value }); // debug
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/metrics/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Failed to add business metric");

      const data = await response.json();
      alert("✅ Business metric added successfully!");
      console.log("Saved metric:", data);

      // Reset form
      setFormData({
        metric_name: "",
        metric_date: "",
        value: ""
      });
    } catch (error) {
      console.error("Error:", error);
      alert("❌ " + error.message);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Business Metric</h2>
      <form onSubmit={handleSubmit} className="metric-form">

        <div className="form-group">
          <label htmlFor="metric_name">Metric Name:</label>
          <input
            id="metric_name"
            type="text"
            name="metric_name"
            value={formData.metric_name}
            onChange={handleChange}
            placeholder="e.g., Steel Produced"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="metric_date">Metric Date:</label>
          <input
            id="metric_date"
            type="date"
            name="metric_date"
            value={formData.metric_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="value">Value:</label>
          <input
            id="value"
            type="number"
            name="value"
            value={formData.value}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <button type="submit" className="form-submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default BusinessMetricForm;
