import axiosClient from './axiosClient';

export const attendanceApi = {
  clockIn: (employeeId) => 
    axiosClient.post('/attendance/clock-in', { employeeId }),
  
  clockOut: (employeeId) => 
    axiosClient.post(`/attendance/clock-out/${employeeId}`),
  
  getByEmployee: (employeeId, page = 0, size = 10) => 
    axiosClient.get(`/attendance/employee/${employeeId}?page=${page}&size=${size}`),
};