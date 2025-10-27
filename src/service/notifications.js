import instance from './index.js';
import { endpoint } from './endpoints.js';

export const getMyNotifications = async (filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.NOTIFICATIONS}/me${qp ? `?${qp}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching my notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await instance.post(`${endpoint.NOTIFICATIONS}/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await instance.post(`${endpoint.NOTIFICATIONS}/read-all`);
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const response = await instance.delete(`${endpoint.NOTIFICATIONS}/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

export const getUnreadNotificationCount = async () => {
  try {
    const response = await instance.get(`${endpoint.NOTIFICATIONS}/unread-count`);
    return response.data;
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    return 0;
  }
};

export const sendAdminNotification = async (notificationData) => {
  try {
    const response = await instance.post(`${endpoint.NOTIFICATIONS}/admin`, notificationData);
    return response.data;
  } catch (error) {
    console.error('Error sending admin notification:', error);
    throw error;
  }
};

export const createNotification = async (notificationData) => {
  try {
    const response = await instance.post(`${endpoint.NOTIFICATIONS}`, notificationData);
    return response.data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const updateNotification = async (notificationId, notificationData) => {
  try {
    const response = await instance.put(`${endpoint.NOTIFICATIONS}/${notificationId}`, notificationData);
    return response.data;
  } catch (error) {
    console.error('Error updating notification:', error);
    throw error;
  }
};

export const getNotificationById = async (notificationId) => {
  try {
    const response = await instance.get(`${endpoint.NOTIFICATIONS}/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notification by ID:', error);
    throw error;
  }
};

export const getNotificationSettings = async () => {
  try {
    const response = await instance.get(`${endpoint.NOTIFICATIONS}/settings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    throw error;
  }
};

export const updateNotificationSettings = async (settings) => {
  try {
    const response = await instance.put(`${endpoint.NOTIFICATIONS}/settings`, settings);
    return response.data;
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw error;
  }
};

export const sendBulkNotification = async (notificationData) => {
  try {
    const response = await instance.post(`${endpoint.NOTIFICATIONS}/bulk`, notificationData);
    return response.data;
  } catch (error) {
    console.error('Error sending bulk notification:', error);
    throw error;
  }
};

export const getNotificationTemplates = async () => {
  try {
    const response = await instance.get(`${endpoint.NOTIFICATIONS}/templates`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notification templates:', error);
    throw error;
  }
};

export const createNotificationTemplate = async (templateData) => {
  try {
    const response = await instance.post(`${endpoint.NOTIFICATIONS}/templates`, templateData);
    return response.data;
  } catch (error) {
    console.error('Error creating notification template:', error);
    throw error;
  }
};

export const updateNotificationTemplate = async (templateId, templateData) => {
  try {
    const response = await instance.put(`${endpoint.NOTIFICATIONS}/templates/${templateId}`, templateData);
    return response.data;
  } catch (error) {
    console.error('Error updating notification template:', error);
    throw error;
  }
};

export const deleteNotificationTemplate = async (templateId) => {
  try {
    const response = await instance.delete(`${endpoint.NOTIFICATIONS}/templates/${templateId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting notification template:', error);
    throw error;
  }
};