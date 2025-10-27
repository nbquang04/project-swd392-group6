import instance from './index.js';
import { endpoint } from './endpoints.js';

// ===== CATEGORY SERVICE =====

// Lấy danh sách tất cả danh mục
export const fetchCategories = async () => {
  try {
    const response = await instance.get(endpoint.CATEGORY);
    return response.data;
  } catch (error) {
    console.error('Fetch categories error:', error);
    return [];
  }
};

// Lấy chi tiết danh mục theo ID
export const getCategoryById = async (categoryId) => {
  try {
    const response = await instance.get(`${endpoint.CATEGORY}/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Get category by ID error:', error);
    return null;
  }
};

// Tạo danh mục mới (Admin)
export const createCategory = async (categoryData) => {
  try {
    const response = await instance.post(endpoint.CATEGORY, categoryData);
    return response.data;
  } catch (error) {
    console.error('Create category error:', error);
    throw error;
  }
};

// Cập nhật danh mục (Admin)
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await instance.put(`${endpoint.CATEGORY}/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Update category error:', error);
    throw error;
  }
};

// Xóa danh mục (Admin)
export const deleteCategory = async (categoryId) => {
  try {
    const response = await instance.delete(`${endpoint.CATEGORY}/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Delete category error:', error);
    throw error;
  }
};
