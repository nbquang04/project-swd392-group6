import instance from './index.js';
import { endpoint } from './endpoints.js';

export const getDashboardStats = async () => {
  try {
    const response = await instance.get(`${endpoint.ANALYTICS}/dashboard`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const getRevenueStats = async (filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.ANALYTICS}/revenue${qp ? `?${qp}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching revenue stats:', error);
    throw error;
  }
};

export const getBestSellingProducts = async (limit = 5) => {
  try {
    const response = await instance.get(`${endpoint.ANALYTICS}/best-selling-products?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching best selling products:', error);
    throw error;
  }
};

export const getTopCustomers = async (limit = 5) => {
  try {
    const response = await instance.get(`${endpoint.ANALYTICS}/top-customers?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching top customers:', error);
    throw error;
  }
};

export const getConversionRate = async (filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.ANALYTICS}/conversion-rate${qp ? `?${qp}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching conversion rate:', error);
    throw error;
  }
};

export const getSalesTrends = async (filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.ANALYTICS}/sales-trends${qp ? `?${qp}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sales trends:', error);
    throw error;
  }
};

export const getInventoryStats = async () => {
  try {
    const response = await instance.get(`${endpoint.ANALYTICS}/inventory`);
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory stats:', error);
    throw error;
  }
};

export const getCustomerAnalytics = async (filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.ANALYTICS}/customers${qp ? `?${qp}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer analytics:', error);
    throw error;
  }
};

export const getProductPerformance = async (filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.ANALYTICS}/products${qp ? `?${qp}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product performance:', error);
    throw error;
  }
};

export const getOrderAnalytics = async (filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.ANALYTICS}/orders${qp ? `?${qp}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order analytics:', error);
    throw error;
  }
};

export const getGeographicData = async () => {
  try {
    const response = await instance.get(`${endpoint.ANALYTICS}/geographic`);
    return response.data;
  } catch (error) {
    console.error('Error fetching geographic data:', error);
    throw error;
  }
};

export const getMarketingMetrics = async (filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.ANALYTICS}/marketing${qp ? `?${qp}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching marketing metrics:', error);
    throw error;
  }
};

export const exportAnalytics = async (type, filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.ANALYTICS}/export/${type}${qp ? `?${qp}` : ''}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting analytics:', error);
    throw error;
  }
};