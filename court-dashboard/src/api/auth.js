import api from './axios';

export const authAPI = {
  /**
   * POST /api/accounts/login/
   * Returns { access, refresh, user }
   */
  login: async (email, password) => {
    const response = await api.post('/accounts/login/', { email, password });
    return response.data;
  },

  /**
   * POST /api/accounts/register/
   */
  register: async (userData) => {
    const response = await api.post('/accounts/register/', userData);
    return response.data;
  },

  /**
   * GET /api/accounts/profile/
   */
  getProfile: async () => {
    const response = await api.get('/accounts/profile/');
    return response.data;
  },

  /**
   * PUT /api/accounts/profile/
   */
  updateProfile: async (userData) => {
    const response = await api.put('/accounts/profile/', userData);
    return response.data;
  },

  /**
   * Clear local auth state (JWT is stateless; no backend call needed).
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('harariCourtUser');
  },
};