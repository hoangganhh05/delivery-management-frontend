import axiosClient from './axiosClient';

export const getDashboardStats = () => {
  return axiosClient.get('/dashboard/stats');
};

export const createOrder = (data) => {
  return axiosClient.post('/orders', data);
};

export const assignShipper = (data) => {
  return axiosClient.post('/shipments/assign', data);
};

export const updateShipmentStatus = (orderId, data) => {
  return axiosClient.put(`/shipments/orders/${orderId}/status`, data);
};

export const calculateVoucher = (data) => {
  return axiosClient.post('/vouchers/calculate', data);
};

export default {
  getDashboardStats,
  createOrder,
  assignShipper,
  updateShipmentStatus,
  calculateVoucher,
};
