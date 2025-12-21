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

// Generic service submission
export const submitServiceRequest = async (serviceName, payload) => {
  const urlName = serviceName.toLowerCase().replace(/\s/g, '-');
  return axios.post(`${API_BASE}/services/${urlName}/`, payload, authHeaders());
};

// Deprecated / fallback method for full service submission
export const submitService = async (token, payload) => {
  const res = await fetch(`${API_BASE}/services/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Service submission failed");
  return res.json();
};
