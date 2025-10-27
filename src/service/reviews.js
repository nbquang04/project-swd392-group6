import instance from ".";
import { endpoint } from "./endpoints";

// ===== REVIEW FUNCTIONS =====

// Lấy đánh giá theo sản phẩm
export const getReviewsByProductId = async (productId, filters = {}) => {
    try {
        const qp = new URLSearchParams(filters).toString();
        const res = await instance.get(`${endpoint.PRODUCT}/${productId}/reviews${qp ? `?${qp}` : ''}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching reviews by product ID:', error);
        return [];
    }
};

// Lấy thống kê đánh giá sản phẩm
export const getProductStats = async (productId) => {
    try {
        const res = await instance.get(`${endpoint.PRODUCT}/${productId}/reviews/stats`);
        return res.data;
    } catch (error) {
        console.error('Error fetching product stats:', error);
        return { averageRating: 0, reviewCount: 0, soldCount: 0 };
    }
};

// Tạo đánh giá mới
export const addReview = async (productId, reviewData) => {
    try {
        const res = await instance.post(`${endpoint.PRODUCT}/${productId}/reviews`, reviewData);
        return res.data;
    } catch (error) {
        console.error('Error adding review:', error);
        throw error;
    }
};

// Cập nhật đánh giá
export const updateReview = async (productId, reviewId, reviewData) => {
    try {
        const res = await instance.put(`${endpoint.PRODUCT}/${productId}/reviews/${reviewId}`, reviewData);
        return res.data;
    } catch (error) {
        console.error('Error updating review:', error);
        throw error;
    }
};

// Xóa đánh giá
export const deleteReview = async (productId, reviewId) => {
    try {
        const res = await instance.delete(`${endpoint.PRODUCT}/${productId}/reviews/${reviewId}`);
        return res.data;
    } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
    }
};

// Lấy đánh giá của người dùng hiện tại
export const getMyReviews = async (filters = {}) => {
    try {
        const qp = new URLSearchParams(filters).toString();
        const res = await instance.get(`${endpoint.REVIEWS}/my${qp ? `?${qp}` : ''}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching my reviews:', error);
        return [];
    }
};

// Lấy tất cả đánh giá (Admin)
export const getAllReviews = async (filters = {}) => {
    try {
        const qp = new URLSearchParams(filters).toString();
        const res = await instance.get(`${endpoint.REVIEWS}${qp ? `?${qp}` : ''}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching all reviews:', error);
        return [];
    }
};

// Lấy đánh giá theo ID
export const getReviewById = async (reviewId) => {
    try {
        const res = await instance.get(`${endpoint.REVIEWS}/${reviewId}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching review by ID:', error);
        return null;
    }
};

// Đánh dấu đánh giá hữu ích
export const markReviewHelpful = async (reviewId) => {
    try {
        const res = await instance.post(`${endpoint.REVIEWS}/${reviewId}/helpful`);
        return res.data;
    } catch (error) {
        console.error('Error marking review helpful:', error);
        throw error;
    }
};

// Báo cáo đánh giá không phù hợp
export const reportReview = async (reviewId, reason) => {
    try {
        const res = await instance.post(`${endpoint.REVIEWS}/${reviewId}/report`, { reason });
        return res.data;
    } catch (error) {
        console.error('Error reporting review:', error);
        throw error;
    }
};

// Phản hồi đánh giá (Admin)
export const replyToReview = async (reviewId, reply) => {
    try {
        const res = await instance.post(`${endpoint.REVIEWS}/${reviewId}/reply`, { reply });
        return res.data;
    } catch (error) {
        console.error('Error replying to review:', error);
        throw error;
    }
};

// Cập nhật trạng thái đánh giá (Admin)
export const updateReviewStatus = async (reviewId, status) => {
    try {
        const res = await instance.patch(`${endpoint.REVIEWS}/${reviewId}/status`, { status });
        return res.data;
    } catch (error) {
        console.error('Error updating review status:', error);
        throw error;
    }
};

// Lấy đánh giá theo rating
export const getReviewsByRating = async (productId, rating) => {
    try {
        const res = await instance.get(`${endpoint.PRODUCT}/${productId}/reviews?rating=${rating}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching reviews by rating:', error);
        return [];
    }
};

// Lấy đánh giá có hình ảnh
export const getReviewsWithImages = async (productId) => {
    try {
        const res = await instance.get(`${endpoint.PRODUCT}/${productId}/reviews?has_images=true`);
        return res.data;
    } catch (error) {
        console.error('Error fetching reviews with images:', error);
        return [];
    }
};

// Thêm hình ảnh vào đánh giá
export const addReviewImages = async (reviewId, images) => {
    try {
        const formData = new FormData();
        images.forEach((image, index) => {
            formData.append(`images`, image);
        });
        const res = await instance.post(`${endpoint.REVIEWS}/${reviewId}/images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    } catch (error) {
        console.error('Error adding review images:', error);
        throw error;
    }
};

// Xóa hình ảnh đánh giá
export const deleteReviewImage = async (reviewId, imageId) => {
    try {
        const res = await instance.delete(`${endpoint.REVIEWS}/${reviewId}/images/${imageId}`);
        return res.data;
    } catch (error) {
        console.error('Error deleting review image:', error);
        throw error;
    }
};

// Lấy thống kê đánh giá (Admin)
export const getReviewStats = async (filters = {}) => {
    try {
        const qp = new URLSearchParams(filters).toString();
        const res = await instance.get(`${endpoint.REVIEWS}/stats${qp ? `?${qp}` : ''}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching review stats:', error);
        return null;
    }
};

// Tìm kiếm đánh giá
export const searchReviews = async (query, filters = {}) => {
    try {
        const params = { q: query, ...filters };
        const qp = new URLSearchParams(params).toString();
        const res = await instance.get(`${endpoint.REVIEWS}/search${qp ? `?${qp}` : ''}`);
        return res.data;
    } catch (error) {
        console.error('Error searching reviews:', error);
        return [];
    }
};

// Xuất đánh giá (Admin)
export const exportReviews = async (filters = {}) => {
    try {
        const qp = new URLSearchParams(filters).toString();
        const response = await instance.get(`${endpoint.REVIEWS}/export${qp ? `?${qp}` : ''}`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error('Error exporting reviews:', error);
        throw error;
    }
};

// Lấy đánh giá nổi bật
export const getFeaturedReviews = async (productId, limit = 5) => {
    try {
        const res = await instance.get(`${endpoint.PRODUCT}/${productId}/reviews/featured?limit=${limit}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching featured reviews:', error);
        return [];
    }
};

// Lấy đánh giá mới nhất
export const getLatestReviews = async (productId, limit = 10) => {
    try {
        const res = await instance.get(`${endpoint.PRODUCT}/${productId}/reviews?sort=created_at:desc&limit=${limit}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching latest reviews:', error);
        return [];
    }
};
