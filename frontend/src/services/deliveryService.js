import api from '../api/api';

export const deliveryService = {
  // GET /api/deliveries
  getAllDeliveries: async () => {
    const response = await api.get('/deliveries');
    return response.data;
  },

  // GET /api/deliveries/{id}
  getDeliveryById: async (id) => {
    const response = await api.get(`/deliveries/${id}`);
    return response.data;
  },

  // GET /api/deliveries/details
  getDeliveryDetails: async () => {
    const response = await api.get('/deliveries/details');
    return response.data;
  },

  // POST /api/deliveries/assign
  // body: { employeeId, parcelId, routeId }
  assignDelivery: async (assignData) => {
    const response = await api.post('/deliveries/assign', assignData);
    return response.data;
  },

  // PATCH /api/deliveries/{id}/status
  // body: { status }
  updateDeliveryStatus: async (id, status) => {
    const response = await api.patch(`/deliveries/${id}/status`, { status });
    return response.data;
  },

  // DELETE /api/deliveries/{id}
  deleteDelivery: async (id) => {
    const response = await api.delete(`/deliveries/${id}`);
    return response.data;
  },

  // GET /api/deliveries/employee/{employeeId}/count
  getEmployeeDeliveryCount: async (employeeId) => {
    const response = await api.get(`/deliveries/employee/${employeeId}/count`);
    return response.data;
  },
};

export default deliveryService;
