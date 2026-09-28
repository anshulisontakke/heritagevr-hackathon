const API_BASE = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('hvr_token');
  }

  setToken(token) {
    this.token = token;
    if (token) localStorage.setItem('hvr_token', token);
    else localStorage.removeItem('hvr_token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();
      if (!response.ok) throw { status: response.status, ...data };
      return data;
    } catch (error) {
      if (error.status === 401) {
        this.setToken(null);
        window.location.href = '/login';
      }
      throw error;
    }
  }

  get(endpoint) { return this.request(endpoint); }
  post(endpoint, body) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) }); }
  put(endpoint, body) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }); }
  delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }

  // Auth
  register(data) { return this.post('/auth/register', data); }
  login(data) { return this.post('/auth/login', data); }
  getProfile() { return this.get('/auth/profile'); }

  // Sites
  getSites(params = '') { return this.get(`/sites${params ? '?' + params : ''}`); }
  getSite(id) { return this.get(`/sites/${id}`); }
  createSite(data) { return this.post('/sites', data); }
  updateSite(id, data) { return this.put(`/sites/${id}`, data); }
  deleteSite(id) { return this.delete(`/sites/${id}`); }
  getComponents(siteId) { return this.get(`/sites/${siteId}/components`); }
  createComponent(siteId, data) { return this.post(`/sites/${siteId}/components`, data); }
  updateComponent(siteId, componentId, data) { return this.put(`/sites/${siteId}/components/${componentId}`, data); }
  deleteComponent(siteId, componentId) { return this.delete(`/sites/${siteId}/components/${componentId}`); }

  // Donations
  createOrder(data) { return this.post('/donations/create-order', data); }
  verifyPayment(data) { return this.post('/donations/verify', data); }
  demoPayment(data) { return this.post('/donations/demo-pay', data); }

  // User
  getUserDashboard() { return this.get('/user/dashboard'); }
  getUserDonations() { return this.get('/user/donations'); }
  getUserAdoptions() { return this.get('/user/adoptions'); }

  // Admin
  getAdminDashboard() { return this.get('/admin/dashboard'); }
  getAdminDonations(params = '') { return this.get(`/admin/donations${params ? '?' + params : ''}`); }
  getAdminUsers() { return this.get('/admin/users'); }
  updateUserRole(userId, role) { return this.put(`/admin/users/${userId}/role`, { role }); }

  // Funds
  getFundOverview() { return this.get('/funds/overview'); }

  // Contact
  submitContact(data) { return this.post('/contact', data); }
}

const api = new ApiService();
export default api;
