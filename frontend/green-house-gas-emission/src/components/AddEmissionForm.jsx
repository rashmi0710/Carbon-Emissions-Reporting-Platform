import React, { useState } from "react";
import './AddEmission.css';

const AddEmissionForm = () => {
  const [formData, setFormData] = useState({
    scope: "Scope1",
    activity: "",
    unit: "",
    quantity: "",
    recorded_at: "",
    location: "",
    user_id: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Ensure numbers stay as numbers
    if (name === "quantity" || name === "user_id") {
      setFormData({ ...formData, [name]: value === "" ? "" : Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = formData.scope === "Scope1" ? "/scope1/" : "/scope2/";

    try {
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Failed to add emission record");

      const data = await response.json();
      alert("✅ Emission record added successfully!");
      console.log("Saved record:", data);

      // Reset form
      setFormData({
        scope: "Scope1",
        activity: "",
        unit: "",
        quantity: "",
        recorded_at: "",
        location: "",
        user_id: ""
      });
    } catch (error) {
      console.error("Error:", error);
      alert("❌ " + error.message);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Emission Data</h2>
      <form onSubmit={handleSubmit} className="emission-form">

        <div className="form-group">
          <label htmlFor="scope">Scope:</label>
          <select
            id="scope"
            name="scope"
            value={formData.scope}
            onChange={handleChange}
            required
          >
            <option value="Scope1">Scope 1</option>
            <option value="Scope2">Scope 2</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="activity">Activity:</label>
          <input
            id="activity"
            type="text"
            name="activity"
            value={formData.activity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="unit">Unit:</label>
          <input
            id="unit"
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            id="quantity"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="recorded_at">Date Recorded:</label>
          <input
            id="recorded_at"
            type="date"
            name="recorded_at"
            value={formData.recorded_at}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            id="location"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="user_id">User ID:</label>
          <input
            id="user_id"
            type="number"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="form-submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddEmissionForm;
