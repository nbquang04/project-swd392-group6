import instance from './index.js';
import { endpoint } from './endpoints.js';

export const createPaymentIntent = async (amount, currency = 'VND', orderId = null) => {
  try {
    const response = await instance.post(`${endpoint.PAYMENTS}/create-intent`, { amount, currency, orderId });
    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

export const confirmPayment = async (paymentIntentId, paymentMethodId) => {
  try {
    const response = await instance.post(`${endpoint.PAYMENTS}/confirm`, { paymentIntentId, paymentMethodId });
    return response.data;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

export const getPaymentStatus = async (paymentId) => {
  try {
    const response = await instance.get(`${endpoint.PAYMENTS}/${paymentId}/status`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment status:', error);
    throw error;
  }
};

export const processRefund = async (paymentId, amount = null, reason = '') => {
  try {
    const response = await instance.post(`${endpoint.PAYMENTS}/${paymentId}/refund`, { amount, reason });
    return response.data;
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error;
  }
};

export const getPaymentHistory = async (filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.PAYMENTS}/history${qp ? `?${qp}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return [];
  }
};

export const getPaymentMethods = async () => {
  try {
    const response = await instance.get(`${endpoint.PAYMENTS}/methods`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
};

export const addPaymentMethod = async (methodData) => {
  try {
    const response = await instance.post(`${endpoint.PAYMENTS}/methods`, methodData);
    return response.data;
  } catch (error) {
    console.error('Error adding payment method:', error);
    throw error;
  }
};

export const deletePaymentMethod = async (methodId) => {
  try {
    const response = await instance.delete(`${endpoint.PAYMENTS}/methods/${methodId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
};

export const updatePaymentMethod = async (methodId, methodData) => {
  try {
    const response = await instance.put(`${endpoint.PAYMENTS}/methods/${methodId}`, methodData);
    return response.data;
  } catch (error) {
    console.error('Error updating payment method:', error);
    throw error;
  }
};

export const setDefaultPaymentMethod = async (methodId) => {
  try {
    const response = await instance.post(`${endpoint.PAYMENTS}/methods/${methodId}/default`);
    return response.data;
  } catch (error) {
    console.error('Error setting default payment method:', error);
    throw error;
  }
};

export const getPaymentAnalytics = async (filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.PAYMENTS}/analytics${qp ? `?${qp}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment analytics:', error);
    throw error;
  }
};

export const getPaymentSummary = async (filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.PAYMENTS}/summary${qp ? `?${qp}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment summary:', error);
    throw error;
  }
};

export const createPaymentLink = async (paymentData) => {
  try {
    const response = await instance.post(`${endpoint.PAYMENTS}/links`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Error creating payment link:', error);
    throw error;
  }
};

export const getPaymentLink = async (linkId) => {
  try {
    const response = await instance.get(`${endpoint.PAYMENTS}/links/${linkId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment link:', error);
    throw error;
  }
};

export const cancelPaymentLink = async (linkId) => {
  try {
    const response = await instance.post(`${endpoint.PAYMENTS}/links/${linkId}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Error cancelling payment link:', error);
    throw error;
  }
};

export const getPaymentWebhooks = async () => {
  try {
    const response = await instance.get(`${endpoint.PAYMENTS}/webhooks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment webhooks:', error);
    throw error;
  }
};

export const createPaymentWebhook = async (webhookData) => {
  try {
    const response = await instance.post(`${endpoint.PAYMENTS}/webhooks`, webhookData);
    return response.data;
  } catch (error) {
    console.error('Error creating payment webhook:', error);
    throw error;
  }
};

export const updatePaymentWebhook = async (webhookId, webhookData) => {
  try {
    const response = await instance.put(`${endpoint.PAYMENTS}/webhooks/${webhookId}`, webhookData);
    return response.data;
  } catch (error) {
    console.error('Error updating payment webhook:', error);
    throw error;
  }
};

export const deletePaymentWebhook = async (webhookId) => {
  try {
    const response = await instance.delete(`${endpoint.PAYMENTS}/webhooks/${webhookId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting payment webhook:', error);
    throw error;
  }
};