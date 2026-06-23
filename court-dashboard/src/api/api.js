import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

// ─── Auth helpers ────────────────────────────────────────────────────────────

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

// ─── Auth APIs ───────────────────────────────────────────────────────────────

export const registerUser = async (payload) => {
  const res = await axios.post(`${API_BASE}/accounts/register/`, payload);
  return res.data;
};

export const loginUser = async (payload) => {
  const res = await axios.post(`${API_BASE}/accounts/login/`, payload);
  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('harariCourtUser');
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const fetchDashboardData = async () => {
  const res = await axios.get(`${API_BASE}/services/dashboard/`, authHeaders());
  return res.data;
};

// GET /api/services/my-requests/
export const fetchMyRequests = async () => {
  const res = await axios.get(`${API_BASE}/services/my-requests/`, authHeaders());
  return res.data;
};

// ─── Public Services List ─────────────────────────────────────────────────────

export const fetchCourtServices = async () => {
  const res = await axios.get(`${API_BASE}/services/`);
  return res.data;
};

// ─── Document Submission ──────────────────────────────────────────────────────

/**
 * POST /api/services/document-submission/
 * @param {object} formData  - { case_number, document_type, description }
 * @param {File[]} files     - array of File objects
 */
export const submitDocumentSubmission = async (formData, files = []) => {
  const token = localStorage.getItem('token');
  const payload = new FormData();
  Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
  files.forEach(file => payload.append('files', file.fileObject || file));

  const res = await axios.post(`${API_BASE}/services/document-submission/`, payload, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// ─── Arbitration Fee ──────────────────────────────────────────────────────────

/**
 * POST /api/services/arbitration-fee/
 * @param {object} data - { court_cause_type, case_title, claim_amount, calculated_fee }
 */
export const submitArbitrationFee = async (data) => {
  const res = await axios.post(`${API_BASE}/services/arbitration-fee/`, data, authHeaders());
  return res.data;
};

// ─── Document Search ──────────────────────────────────────────────────────────

/**
 * POST /api/services/search-document/
 * @param {object} data - { search_case_number, search_keywords, search_document_type,
 *                          search_case_year, requested_document_ids }
 */
export const submitDocumentSearch = async (data) => {
  const res = await axios.post(`${API_BASE}/services/search-document/`, data, authHeaders());
  return res.data;
};

// ─── Appointment ──────────────────────────────────────────────────────────────

/**
 * POST /api/services/appointment/
 * @param {object} data - { appointment_date, appointment_time, purpose, case_number, notes }
 */
export const submitAppointment = async (data) => {
  const res = await axios.post(`${API_BASE}/services/appointment/`, data, authHeaders());
  return res.data;
};

// ─── Complaint Form ───────────────────────────────────────────────────────────

/**
 * POST /api/services/complaint/
 * @param {object} formData - { complaint_type, against_whom, complaint_description, desired_resolution }
 * @param {File[]} files    - array of File objects
 */
export const submitComplaint = async (formData, files = []) => {
  const token = localStorage.getItem('token');
  const payload = new FormData();
  Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
  files.forEach(file => payload.append('files', file.fileObject || file));

  const res = await axios.post(`${API_BASE}/services/complaint/`, payload, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// ─── Feedback ─────────────────────────────────────────────────────────────────

/**
 * POST /api/services/feedback/
 * @param {object} data - { service_name, rating, comments, suggestions }
 */
export const submitFeedback = async (data) => {
  const res = await axios.post(`${API_BASE}/services/feedback/`, data, authHeaders());
  return res.data;
};

// ─── Legacy generic submit ────────────────────────────────────────────────────

export const submitServiceRequest = async (serviceName, formPayload) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(`${API_BASE}/services/submit/`, formPayload, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};