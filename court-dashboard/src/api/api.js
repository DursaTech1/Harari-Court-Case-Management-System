import axios from 'axios';

const API_BASE = "http://localhost:8000/api";

// Helper to get auth headers
const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

// ---------- Auth APIs ----------

export const registerUser = async (payload) => {
  const res = await fetch(`${API_BASE}/accounts/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
};

export const loginUser = async (payload) => {
  const res = await fetch(`${API_BASE}/accounts/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

export const logoutUser = async () => {
  localStorage.removeItem('token');
};

// ---------- Dashboard APIs ----------

export const fetchDashboardData = async () => {
  const res = await axios.get(`${API_BASE}/dashboard/`, authHeaders());
  return res.data;
};

// ---------- Services APIs ----------

export const fetchCourtServices = async () => {
  const res = await axios.get(`${API_BASE}/services/`);
  return res.data;
};

// api.js
export const submitServiceRequest = async (serviceName, formPayload) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.post(
      `${API_BASE}/services/submit/`,
      formPayload,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Service submission error:', error);
    throw error;
  }
};