import instance from './index.js';
import { endpoint } from './endpoints.js';

// ===== AUTHENTICATION FUNCTIONS =====

// Đăng nhập người dùng
export const loginUser = async (data) => {
  try {
    const response = await instance.post(`${endpoint.AUTH}/login`, data);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Đăng ký người dùng mới
export const registerUser = async (data) => {
  try {
    const response = await instance.post(`${endpoint.AUTH}/register`, data);
    return response.data;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

// Lấy thông tin người dùng hiện tại
export const getMe = async () => {
  try {
    const response = await instance.get(`${endpoint.AUTH}/me`);
    return response.data;
  } catch (error) {
    console.error('Get me error:', error);
    throw error;
  }
};

// Đăng xuất (clear token)
export const logoutUser = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// Kiểm tra token có hợp lệ không
export const validateToken = async () => {
  try {
    const response = await instance.get(`${endpoint.AUTH}/me`);
    return response.data;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
};

// Refresh token (nếu backend hỗ trợ)
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');
    
    const response = await instance.post(`${endpoint.AUTH}/refresh`, {
      refreshToken
    });
    return response.data;
  } catch (error) {
    console.error('Refresh token error:', error);
    throw error;
  }
};

// Đổi mật khẩu
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await instance.put(`${endpoint.AUTH}/change-password`, {
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};

// Quên mật khẩu
export const forgotPassword = async (email) => {
  try {
    const response = await instance.post(`${endpoint.AUTH}/forgot-password`, {
      email
    });
    return response.data;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

// Reset mật khẩu
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await instance.post(`${endpoint.AUTH}/reset-password`, {
      token,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};
