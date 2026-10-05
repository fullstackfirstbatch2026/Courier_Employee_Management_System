import api from '../api/api';

export const routeService = {
  // GET /api/routes
  getAllRoutes: async () => {
    const response = await api.get('/routes');
    return response.data;
  },

  // GET /api/routes/{id}
  getRouteById: async (id) => {
    const response = await api.get(`/routes/${id}`);
    return response.data;
  },

  // POST /api/routes
  createRoute: async (routeData) => {
    const response = await api.post('/routes', routeData);
    return response.data;
  },

  // PUT /api/routes/{id}
  updateRoute: async (id, routeData) => {
    const response = await api.put(`/routes/${id}`, routeData);
    return response.data;
  },

  // DELETE /api/routes/{id}
  deleteRoute: async (id) => {
    const response = await api.delete(`/routes/${id}`);
    return response.data;
  },
};

export default routeService;
