import instance from ".";
import { endpoint } from "./endpoints";

// ===== USER FUNCTIONS =====

// Lấy danh sách tất cả người dùng (Admin)
export const fetchUsers = async (filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const res = await instance.get(`${endpoint.USER}${qp ? `?${qp}` : ''}`);
    return res.data;
  } catch (error) {
    console.error('Fetch users error:', error);
    return [];
  }
};

// Lấy thông tin người dùng theo ID
export const getUserById = async (userId) => {
  try {
    const res = await instance.get(`${endpoint.USER}/${userId}`);
    return res.data;
  } catch (error) {
    console.error('Get user by ID error:', error);
    return null;
  }
};

// Cập nhật thông tin người dùng
export const updateUser = async (userId, userData) => {
  try {
    const res = await instance.put(`${endpoint.USER}/${userId}`, userData);
    return res.data;
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};

// Xóa người dùng (Admin)
export const deleteUser = async (userId) => {
  try {
    const res = await instance.delete(`${endpoint.USER}/${userId}`);
    return res.data;
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
};

// Cập nhật trạng thái người dùng (Admin)
export const updateUserStatus = async (userId, status) => {
  try {
    const res = await instance.patch(`${endpoint.USER}/${userId}/status`, { status });
    return res.data;
  } catch (error) {
    console.error('Update user status error:', error);
    throw error;
  }
};

// Cập nhật vai trò người dùng (Admin)
export const updateUserRole = async (userId, role) => {
  try {
    const res = await instance.patch(`${endpoint.USER}/${userId}/role`, { role });
    return res.data;
  } catch (error) {
    console.error('Update user role error:', error);
    throw error;
  }
};

// Lấy thông tin profile người dùng hiện tại
export const getCurrentUserProfile = async () => {
  try {
    const res = await instance.get(`${endpoint.USER}/profile`);
    return res.data;
  } catch (error) {
    console.error('Get current user profile error:', error);
    return null;
  }
};

// Cập nhật profile người dùng hiện tại
export const updateCurrentUserProfile = async (profileData) => {
  try {
    const res = await instance.put(`${endpoint.USER}/profile`, profileData);
    return res.data;
  } catch (error) {
    console.error('Update current user profile error:', error);
    throw error;
  }
};

// Đổi mật khẩu người dùng hiện tại


// Cập nhật địa chỉ người dùng
export const updateUserAddress = async (addressData) => {
  try {
    const res = await instance.put(`${endpoint.USER}/address`, addressData);
    return res.data;
  } catch (error) {
    console.error('Update user address error:', error);
    throw error;
  }
};

// Lấy danh sách địa chỉ người dùng
export const getUserAddresses = async () => {
  try {
    const res = await instance.get(`${endpoint.USER}/addresses`);
    return res.data;
  } catch (error) {
    console.error('Get user addresses error:', error);
    return [];
  }
};

// Thêm địa chỉ mới
export const addUserAddress = async (addressData) => {
  try {
    const res = await instance.post(`${endpoint.USER}/addresses`, addressData);
    return res.data;
  } catch (error) {
    console.error('Add user address error:', error);
    throw error;
  }
};

// Xóa địa chỉ
export const deleteUserAddress = async (addressId) => {
  try {
    const res = await instance.delete(`${endpoint.USER}/addresses/${addressId}`);
    return res.data;
  } catch (error) {
    console.error('Delete user address error:', error);
    throw error;
  }
};

// Đặt địa chỉ mặc định
export const setDefaultAddress = async (addressId) => {
  try {
    const res = await instance.post(`${endpoint.USER}/addresses/${addressId}/default`);
    return res.data;
  } catch (error) {
    console.error('Set default address error:', error);
    throw error;
  }
};

// Lấy lịch sử hoạt động người dùng
export const getUserActivityHistory = async (userId, filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const res = await instance.get(`${endpoint.USER}/${userId}/activity${qp ? `?${qp}` : ''}`);
    return res.data;
  } catch (error) {
    console.error('Get user activity history error:', error);
    return [];
  }
};

// Lấy thống kê người dùng (Admin)
export const getUserStats = async (userId) => {
  try {
    const res = await instance.get(`${endpoint.USER}/${userId}/stats`);
    return res.data;
  } catch (error) {
    console.error('Get user stats error:', error);
    return null;
  }
};

// Lấy thống kê tổng quan người dùng (Admin)
export const getUsersOverview = async () => {
  try {
    const res = await instance.get(`${endpoint.USER}/overview`);
    return res.data;
  } catch (error) {
    console.error('Get users overview error:', error);
    return null;
  }
};

// Tìm kiếm người dùng (Admin)
export const searchUsers = async (query, filters = {}) => {
  try {
    const params = { q: query, ...filters };
    const qp = new URLSearchParams(params).toString();
    const res = await instance.get(`${endpoint.USER}/search${qp ? `?${qp}` : ''}`);
    return res.data;
  } catch (error) {
    console.error('Search users error:', error);
    return [];
  }
};

// Xuất danh sách người dùng (Admin)
export const exportUsers = async (filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.USER}/export${qp ? `?${qp}` : ''}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Export users error:', error);
    throw error;
  }
};

// Import người dùng (Admin)
export const importUsers = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await instance.post(`${endpoint.USER}/import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  } catch (error) {
    console.error('Import users error:', error);
    throw error;
  }
};

// Khóa/Mở khóa tài khoản người dùng (Admin)
export const toggleUserStatus = async (userId) => {
  try {
    const res = await instance.post(`${endpoint.USER}/${userId}/toggle-status`);
    return res.data;
  } catch (error) {
    console.error('Toggle user status error:', error);
    throw error;
  }
};

// Gửi email thông báo cho người dùng (Admin)
export const sendNotificationToUser = async (userId, notificationData) => {
  try {
    const res = await instance.post(`${endpoint.USER}/${userId}/notify`, notificationData);
    return res.data;
  } catch (error) {
    console.error('Send notification to user error:', error);
    throw error;
  }
};

// Lấy danh sách yêu thích của người dùng
export const getUserFavorites = async () => {
  try {
    const res = await instance.get(`${endpoint.USER}/favorites`);
    return res.data;
  } catch (error) {
    console.error('Get user favorites error:', error);
    return [];
  }
};

// Thêm sản phẩm vào yêu thích
export const addToFavorites = async (productId) => {
  try {
    const res = await instance.post(`${endpoint.USER}/favorites`, { productId });
    return res.data;
  } catch (error) {
    console.error('Add to favorites error:', error);
    throw error;
  }
};

// Xóa sản phẩm khỏi yêu thích
export const removeFromFavorites = async (productId) => {
  try {
    const res = await instance.delete(`${endpoint.USER}/favorites/${productId}`);
    return res.data;
  } catch (error) {
    console.error('Remove from favorites error:', error);
    throw error;
  }
};