import instance from './index.js';
import { endpoint } from './endpoints.js';

export const getOrderManagement = async (filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.ORDERS}/management${qp ? `?${qp}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order management data:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status, notes = '') => {
  try {
    const response = await instance.put(`${endpoint.ORDERS}/${orderId}/status`, { status, notes });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const getOrderDetails = async (orderId) => {
  try {
    const response = await instance.get(`${endpoint.ORDERS}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

export const getOrderHistory = async (orderId) => {
  try {
    const response = await instance.get(`${endpoint.ORDERS}/${orderId}/history`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error;
  }
};

export const addOrderNote = async (orderId, note) => {
  try {
    const response = await instance.post(`${endpoint.ORDERS}/${orderId}/notes`, { note });
    return response.data;
  } catch (error) {
    console.error('Error adding order note:', error);
    throw error;
  }
};

export const getOrderAnalytics = async (filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.ORDERS}/analytics${qp ? `?${qp}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order analytics:', error);
    throw error;
  }
};

export const exportOrders = async (filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.ORDERS}/export${qp ? `?${qp}` : ''}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting orders:', error);
    throw error;
  }
};

export const getOrderStatistics = async (filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.ORDERS}/statistics${qp ? `?${qp}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    throw error;
  }
};

export const getOrderTimeline = async (orderId) => {
  try {
    const response = await instance.get(`${endpoint.ORDERS}/${orderId}/timeline`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order timeline:', error);
    throw error;
  }
};

export const assignOrderToStaff = async (orderId, staffId) => {
  try {
    const response = await instance.post(`${endpoint.ORDERS}/${orderId}/assign`, { staffId });
    return response.data;
  } catch (error) {
    console.error('Error assigning order to staff:', error);
    throw error;
  }
};

export const getOrderReports = async (filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.ORDERS}/reports${qp ? `?${qp}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order reports:', error);
    throw error;
  }
};

export const getOrderMetrics = async (filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.ORDERS}/metrics${qp ? `?${qp}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order metrics:', error);
    throw error;
  }
};

export const getOrderPerformance = async (filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.ORDERS}/performance${qp ? `?${qp}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order performance:', error);
    throw error;
  }
};

export const getOrderInsights = async (filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.ORDERS}/insights${qp ? `?${qp}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order insights:', error);
    throw error;
  }
};
