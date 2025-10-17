import instance from ".";
import { endpoint } from "./endpoints";

// Hàm lấy tất cả reviews
export const getAllReviews = async () => {
    try {
        const res = await instance.get(endpoint.REVIEWS);
        return res.data;
    } catch (error) {
        console.error('Error fetching all reviews:', error);
        return [];
    }
};

// Hàm lấy reviews theo product ID
export const getReviewsByProductId = async (productId) => {
    try {
        const res = await instance.get(`${endpoint.REVIEWS}/${productId}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching reviews by product ID:', error);
        return [];
    }
};

// Hàm lấy thống kê sản phẩm từ backend
export const getProductStats = async (productId) => {
    try {
        const res = await instance.get(`${endpoint.REVIEWS}/products/${productId}/stats`);
        return res.data;
    } catch (error) {
        console.error('Error fetching product stats:', error);
        return { averageRating: 0, reviewCount: 0, soldCount: 0 };
    }
};

// Hàm thêm review mới
export const addReview = async (reviewData) => {
    try {
        const res = await instance.post(endpoint.REVIEWS, reviewData);
        return res.data;
    } catch (error) {
        console.error('Error adding review:', error);
        throw error;
    }
};

// Hàm cập nhật review
export const updateReview = async (reviewId, updatedData) => {
    try {
        const res = await instance.put(`${endpoint.REVIEWS}/${reviewId}`, updatedData);
        return res.data;
    } catch (error) {
        console.error('Error updating review:', error);
        throw error;
    }
};

// Hàm xóa review
export const deleteReview = async (reviewId) => {
    try {
        const res = await instance.delete(`${endpoint.REVIEWS}/${reviewId}`);
        return res.data;
    } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
    }
};
