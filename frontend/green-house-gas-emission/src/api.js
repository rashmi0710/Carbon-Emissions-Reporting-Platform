import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000',
});

// Fetch Year-over-Year emissions data
export const fetchYoYData = async () => {
  const response = await api.get('/analytics/yoy');
  return response.data;
};

// Fetch Hotspot emissions data
export const fetchHotspotData = async () => {
  const response = await api.get('/analytics/hotspot');
  return response.data;
};

// Fetch Emission Intensity data
export const fetchIntensityData = async () => {
  const response = await api.get('/intensity');
  return response.data;
};

export default api;
