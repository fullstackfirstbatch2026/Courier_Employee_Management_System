import api from '../api/api';

export const employeeService = {
  // GET /api/employees
  getAllEmployees: async () => {
    const response = await api.get('/employees');
    return response.data;
  },

  // GET /api/employees/{id}
  getEmployeeById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  // POST /api/employees
  createEmployee: async (employeeData) => {
    const response = await api.post('/employees', employeeData);
    return response.data;
  },

  // PUT /api/employees/{id}
  updateEmployee: async (id, employeeData) => {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
  },

  // DELETE /api/employees/{id}
  deleteEmployee: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  // GET /api/employees/above-average
  getAboveAverageEmployees: async () => {
    const response = await api.get('/employees/above-average');
    return response.data;
  },

  // GET /api/deliveries/employee/{id}/count
  getEmployeeDeliveryCount: async (id) => {
    const response = await api.get(`/deliveries/employee/${id}/count`);
    return response.data;
  },
};

export default employeeService;
