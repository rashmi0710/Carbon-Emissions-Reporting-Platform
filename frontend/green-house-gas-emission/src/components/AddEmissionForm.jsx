import React, { useState } from "react";
import "./AddEmission.css";

const isValidISODate = (s) => {
  // Strict YYYY-MM-DD check + real date check
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  if (!iso.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(s);
  return (
    dt instanceof Date &&
    !isNaN(dt) &&
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() + 1 === m &&
    dt.getUTCDate() === d
  );
};

const AddEmissionForm = () => {
  const [formData, setFormData] = useState({
    scope: "Scope1",
    activity: "",
    unit: "",
    quantity: "",
    recorded_at: "", // user types YYYY-MM-DD manually
    location: "",
    user_id: ""
  });

  const [formError, setFormError] = useState(null); // client-side validation
  const [serverError, setServerError] = useState(null); // server response
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Keep numbers as numbers in state but allow empty string
    if (name === "quantity" || name === "user_id") {
      setFormData((s) => ({ ...s, [name]: value === "" ? "" : value }));
    } else {
      setFormData((s) => ({ ...s, [name]: value }));
    }
    setFormError(null);
    setServerError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setServerError(null);

    // Client-side validation
    if (!formData.activity.trim()) {
      setFormError("Activity is required.");
      return;
    }
    if (!formData.unit.trim()) {
      setFormError("Unit is required.");
      return;
    }
    if (formData.quantity === "" || isNaN(Number(formData.quantity))) {
      setFormError("Quantity is required and must be a number.");
      return;
    }
    if (!formData.recorded_at || !isValidISODate(formData.recorded_at)) {
      setFormError("Date must be entered manually in YYYY-MM-DD format (e.g. 2025-09-10).");
      return;
    }

    // Build payload (ensure numeric types)
    const payload = {
      scope: formData.scope,
      activity: formData.activity.trim(),
      unit: formData.unit.trim(),
      quantity: Number(formData.quantity),
      recorded_at: formData.recorded_at, // keep yyyy-mm-dd (FastAPI expects this)
      location: formData.location?.trim() || undefined,
      user_id: formData.user_id === "" ? undefined : Number(formData.user_id),
    };

    console.log("📤 Sending payload:", payload);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/emissions/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resBody = await res.json().catch(() => null);
      console.log("📥 Response status:", res.status, "body:", resBody);

      if (!res.ok) {
        // Try to extract useful error info from backend
        const msg =
          (resBody && (resBody.detail || JSON.stringify(resBody))) ||
          res.statusText ||
          "Failed to add emission record";
        setServerError(msg);
        throw new Error(msg);
      }

      // success
      alert("✅ Emission record added successfully!");
      console.log("Saved record:", resBody);

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
    } catch (err) {
      console.error("❌ Submit error:", err);
      // serverError already set above
      if (!serverError) setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Emission Data</h2>

      <form onSubmit={handleSubmit} className="emission-form" noValidate>
        {formError && <div className="error-msg">⚠️ {formError}</div>}
        {serverError && <div className="error-msg">🔴 {String(serverError)}</div>}

        <div className="form-group">
          <label htmlFor="scope">Scope:</label>
          <select id="scope" name="scope" value={formData.scope} onChange={handleChange} required>
            <option value="Scope1">Scope 1</option>
            <option value="Scope2">Scope 2</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="activity">Activity:</label>
          <input id="activity" type="text" name="activity" value={formData.activity} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="unit">Unit:</label>
          <input id="unit" type="text" name="unit" value={formData.unit} onChange={handleChange} required placeholder="e.g. litres, kWh" />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input id="quantity" type="number" name="quantity" value={formData.quantity} onChange={handleChange} required min="0" step="any" />
        </div>

        <div className="form-group">
          <label htmlFor="recorded_at">Date</label>
          <input
            id="recorded_at"
            type="text"
            name="recorded_at"
            value={formData.recorded_at}
            onChange={handleChange}
            placeholder="YYYY-MM-DD (e.g. 2025-09-10)"
            required
          />
  
        </div>

        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input id="location" type="text" name="location" value={formData.location} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="user_id">User ID:</label>
          <input id="user_id" type="number" name="user_id" value={formData.user_id} onChange={handleChange} />
        </div>

        <button type="submit" className="form-submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddEmissionForm;
