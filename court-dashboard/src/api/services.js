import api from './axios';

export const servicesAPI = {
  getCases: async (params = {}) => {
    const response = await api.get('/services/cases/', { params });
    return response.data;
  },

  getCase: async (id) => {
    const response = await api.get(`/services/cases/${id}/`);
    return response.data;
  },

  createCase: async (caseData) => {
    const response = await api.post('/services/cases/', caseData);
    return response.data;
  },

  getDocuments: async (caseId) => {
    const response = await api.get('/services/documents/', { params: { case_id: caseId } });
    return response.data;
  },

  uploadDocument: async (documentData) => {
    const formData = new FormData();
    Object.keys(documentData).forEach(key => {
      formData.append(key, documentData[key]);
    });
    
    const response = await api.post('/services/documents/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getHearings: async (caseId) => {
    const response = await api.get('/services/hearings/', { params: { case_id: caseId } });
    return response.data;
  },

  getServices: async (params = {}) => {
    const response = await api.get('/services/services/', { params });
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/services/dashboard/stats/');
    return response.data;
  },
};