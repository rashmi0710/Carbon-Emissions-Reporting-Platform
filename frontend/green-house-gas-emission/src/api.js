import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000',
});

// Fetch YoY emissions data
export async function fetchYoYData() {
  const res = await api.get('/analytics/yoy');
  return res.data;
}

// Fetch Trend data
export async function fetchTrendData() {
  const res = await api.get('/analytics/trend');
  return res.data;
}

// Fetch Hotspot emissions data
export const fetchHotspotData = async () => {
  const res = await api.get('/analytics/hotspots'); 
  return res.data;
};

// // Fetch Emission Intensity data
// export const fetchIntensityData = async () => {
//   const res = await api.get('/analytics/intensity'); 
//   return res.data;
// };

export default api;
