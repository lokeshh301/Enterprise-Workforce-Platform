import axiosClient from './axiosClient';

export const employeeApi = {
  getAll: (page = 0, size = 10) => 
    axiosClient.get(`/employees?page=${page}&size=${size}`),
  
  getById: (id) => 
    axiosClient.get(`/employees/${id}`),
  
  create: (data) => 
    axiosClient.post('/employees', data),
  
  update: (id, data) => 
    axiosClient.put(`/employees/${id}`, data),
  
  delete: (id) => 
    axiosClient.delete(`/employees/${id}`),
};