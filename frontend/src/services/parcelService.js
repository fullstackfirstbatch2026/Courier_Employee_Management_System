import api from '../api/api';

export const parcelService = {
  // GET /api/parcels
  getAllParcels: async () => {
    const response = await api.get('/parcels');
    return response.data;
  },

  // GET /api/parcels/{id}
  getParcelById: async (id) => {
    const response = await api.get(`/parcels/${id}`);
    return response.data;
  },

  // POST /api/parcels
  createParcel: async (parcelData) => {
    const response = await api.post('/parcels', parcelData);
    return response.data;
  },

  // PUT /api/parcels/{id}
  updateParcel: async (id, parcelData) => {
    const response = await api.put(`/parcels/${id}`, parcelData);
    return response.data;
  },

  // DELETE /api/parcels/{id}
  deleteParcel: async (id) => {
    const response = await api.delete(`/parcels/${id}`);
    return response.data;
  },
};

export default parcelService;
