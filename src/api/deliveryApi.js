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

// Shipper Management APIs
export const getShippers = () => {
  return axiosClient.get('/shippers');
};

// Notification APIs
export const getNotifications = () => {
  return axiosClient.get('/notifications');
};

export const getUnreadNotificationCount = () => {
  return axiosClient.get('/notifications/unread-count');
};

export const markNotificationAsRead = (id) => {
  return axiosClient.put(`/notifications/${id}/read`);
};

export const markAllNotificationsAsRead = () => {
  return axiosClient.put('/notifications/read-all');
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
  getShippers,
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
