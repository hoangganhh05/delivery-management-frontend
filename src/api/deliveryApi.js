import axiosClient from './axiosClient';

// Authentication APIs
export const login = (data) => {
  return axiosClient.post('/auth/login', data);
};

export const register = (data) => {
  return axiosClient.post('/auth/register', data);
};

// Dashboard & Stats APIs
export const getDashboardStats = () => {
  return axiosClient.get('/dashboard/stats');
};

// Order APIs
export const createOrder = (data) => {
  return axiosClient.post('/orders', data);
};

// Shipment & Shipper APIs
export const assignShipper = (data) => {
  return axiosClient.post('/shipments/assign', data);
};

export const updateShipmentStatus = (orderId, data) => {
  return axiosClient.put(`/shipments/orders/${orderId}/status`, data);
};

// Voucher APIs
export const calculateVoucher = (data) => {
  return axiosClient.post('/vouchers/calculate', data);
};

// Public Tracking API
export const trackOrder = (trackingNumber) => {
  return axiosClient.get(`/tracking/${trackingNumber}`);
};

// VNPay Payment API
export const createPayment = (orderId) => {
  return axiosClient.get(`/payment/vnpay/${orderId}`);
};

export default {
  login,
  register,
  getDashboardStats,
  createOrder,
  assignShipper,
  updateShipmentStatus,
  calculateVoucher,
  trackOrder,
  createPayment,
};
