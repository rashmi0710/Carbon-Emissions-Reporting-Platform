import React, { useState } from 'react';
import api from './api';
import './form.css';

export default function Scope1Form() {
  const [activity, setActivity] = useState('');
  const [unit, setUnit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [recordedAt, setRecordedAt] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await api.post('/scope1/', {
        scope: 'Scope1',
        activity,
        unit,
        quantity: parseFloat(quantity),
        recorded_at: recordedAt,
        location,
      });
      setMessage(`✅ Emission recorded with ID: ${response.data.id}`);
    } catch (error) {
      setMessage('❌ Error: ' + (error.response?.data?.detail || error.message));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="scope-form">
      <h3 className="form-title">🌱 Submit Scope 1 Emission Data</h3>

      <div className="form-group">
        <label>Activity</label>
        <input
          type="text"
          value={activity}
          required
          onChange={(e) => setActivity(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Unit</label>
        <input
          type="text"
          value={unit}
          required
          onChange={(e) => setUnit(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Quantity</label>
        <input
          type="number"
          step="any"
          value={quantity}
          required
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Recorded Date</label>
        <input
          type="date"
          value={recordedAt}
          required
          onChange={(e) => setRecordedAt(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Location (optional)</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <button type="submit" className="submit-btn">
        🚀 Submit
      </button>

      {message && <p className="form-message">{message}</p>}
    </form>
  );
}
