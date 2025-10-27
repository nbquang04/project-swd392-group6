import instance from './index.js';
import { endpoint } from './endpoints.js';

// ===== SHOP FUNCTIONS =====

// Lấy danh sách tất cả cửa hàng
export const fetchShops = async (filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.SHOPS}${qp ? `?${qp}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Fetch shops error:', error);
    return [];
  }
};

// Lấy chi tiết cửa hàng theo ID
export const getShopById = async (shopId) => {
  try {
    const response = await instance.get(`${endpoint.SHOPS}/${shopId}`);
    return response.data;
  } catch (error) {
    console.error('Get shop by ID error:', error);
    return null;
  }
};

// Tạo cửa hàng mới (Admin)
export const createShop = async (shopData) => {
  try {
    const response = await instance.post(endpoint.SHOPS, shopData);
    return response.data;
  } catch (error) {
    console.error('Create shop error:', error);
    throw error;
  }
};

// Cập nhật thông tin cửa hàng (Admin)
export const updateShop = async (shopId, shopData) => {
  try {
    const response = await instance.put(`${endpoint.SHOPS}/${shopId}`, shopData);
    return response.data;
  } catch (error) {
    console.error('Update shop error:', error);
    throw error;
  }
};

// Xóa cửa hàng (Admin)
export const deleteShop = async (shopId) => {
  try {
    const response = await instance.delete(`${endpoint.SHOPS}/${shopId}`);
    return response.data;
  } catch (error) {
    console.error('Delete shop error:', error);
    throw error;
  }
};

// Cập nhật trạng thái cửa hàng (Admin)
export const updateShopStatus = async (shopId, status) => {
  try {
    const response = await instance.patch(`${endpoint.SHOPS}/${shopId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Update shop status error:', error);
    throw error;
  }
};

// Lấy sản phẩm của cửa hàng
export const getShopProducts = async (shopId, filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.SHOPS}/${shopId}/products${qp ? `?${qp}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Get shop products error:', error);
    return [];
  }
};

// Lấy thống kê cửa hàng
export const getShopStats = async (shopId) => {
  try {
    const response = await instance.get(`${endpoint.SHOPS}/${shopId}/stats`);
    return response.data;
  } catch (error) {
    console.error('Get shop stats error:', error);
    return null;
  }
};

// Lấy đánh giá cửa hàng
export const getShopReviews = async (shopId, filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.SHOPS}/${shopId}/reviews${qp ? `?${qp}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Get shop reviews error:', error);
    return [];
  }
};

// Tạo đánh giá cửa hàng
export const createShopReview = async (shopId, reviewData) => {
  try {
    const response = await instance.post(`${endpoint.SHOPS}/${shopId}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Create shop review error:', error);
    throw error;
  }
};

// Lấy thông tin liên hệ cửa hàng
export const getShopContact = async (shopId) => {
  try {
    const response = await instance.get(`${endpoint.SHOPS}/${shopId}/contact`);
    return response.data;
  } catch (error) {
    console.error('Get shop contact error:', error);
    return null;
  }
};

// Cập nhật thông tin liên hệ cửa hàng (Admin)
export const updateShopContact = async (shopId, contactData) => {
  try {
    const response = await instance.put(`${endpoint.SHOPS}/${shopId}/contact`, contactData);
    return response.data;
  } catch (error) {
    console.error('Update shop contact error:', error);
    throw error;
  }
};

// Lấy giờ hoạt động cửa hàng
export const getShopHours = async (shopId) => {
  try {
    const response = await instance.get(`${endpoint.SHOPS}/${shopId}/hours`);
    return response.data;
  } catch (error) {
    console.error('Get shop hours error:', error);
    return null;
  }
};

// Cập nhật giờ hoạt động cửa hàng (Admin)
export const updateShopHours = async (shopId, hoursData) => {
  try {
    const response = await instance.put(`${endpoint.SHOPS}/${shopId}/hours`, hoursData);
    return response.data;
  } catch (error) {
    console.error('Update shop hours error:', error);
    throw error;
  }
};

// Tìm kiếm cửa hàng
export const searchShops = async (query, filters = {}) => {
  try {
    const params = { q: query, ...filters };
    const qp = new URLSearchParams(params).toString();
    const response = await instance.get(`${endpoint.SHOPS}/search${qp ? `?${qp}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Search shops error:', error);
    return [];
  }
};

// Lấy cửa hàng gần đây
export const getNearbyShops = async (latitude, longitude, radius = 10) => {
  try {
    const response = await instance.get(`${endpoint.SHOPS}/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`);
    return response.data;
  } catch (error) {
    console.error('Get nearby shops error:', error);
    return [];
  }
};

// Lấy cửa hàng phổ biến
export const getPopularShops = async (limit = 10) => {
  try {
    const response = await instance.get(`${endpoint.SHOPS}/popular?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Get popular shops error:', error);
    return [];
  }
};

// Cập nhật hình ảnh cửa hàng
export const updateShopImage = async (shopId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await instance.post(`${endpoint.SHOPS}/${shopId}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Update shop image error:', error);
    throw error;
  }
};

// Xóa hình ảnh cửa hàng
export const deleteShopImage = async (shopId) => {
  try {
    const response = await instance.delete(`${endpoint.SHOPS}/${shopId}/image`);
    return response.data;
  } catch (error) {
    console.error('Delete shop image error:', error);
    throw error;
  }
};

// Lấy thống kê tổng quan cửa hàng (Admin)
export const getShopsOverview = async () => {
  try {
    const response = await instance.get(`${endpoint.SHOPS}/overview`);
    return response.data;
  } catch (error) {
    console.error('Get shops overview error:', error);
    return null;
  }
};

// Xuất danh sách cửa hàng (Admin)
export const exportShops = async (filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.SHOPS}/export${qp ? `?${qp}` : ''}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Export shops error:', error);
    throw error;
  }
};

// Import cửa hàng (Admin)
export const importShops = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await instance.post(`${endpoint.SHOPS}/import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Import shops error:', error);
    throw error;
  }
};
