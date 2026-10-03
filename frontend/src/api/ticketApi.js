import axiosClient from './axiosClient';

export const ticketApi = {
  getAll: (status = '', page = 0, size = 10) => {
    const query = status ? `?status=${status}&page=${page}&size=${size}` : `?page=${page}&size=${size}`;
    return axiosClient.get(`/tickets${query}`);
  },
  
  create: (data) => 
    axiosClient.post('/tickets', data),
  
  updateStatus: (id, payload) => 
    axiosClient.patch(`/tickets/${id}/status`, payload),
};