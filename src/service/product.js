import instance from ".";
import { endpoint } from "./endpoints";

export const fetchProduct = async (params = {}) => {
    try {
        const query = new URLSearchParams(params).toString();
        const res = await instance.get(`${endpoint.PRODUCT}${query ? `?${query}` : ''}`);
        return res.data;
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const fetchProductDetail = async (id) => {
    try {
        const res = await instance.get(`${endpoint.PRODUCT}/${id}`);
        return res.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const fetchCategory = async () => {
    try {
        const res = await instance.get(endpoint.CATEGORY);
        return res.data;
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const fetchProductsByCategory = async (categoryId, extra = {}) => {
    try {
        const qp = new URLSearchParams({ category_id: categoryId, ...extra }).toString();
        const res = await instance.get(`${endpoint.PRODUCT}?${qp}`);
        return res.data;
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const fetchProductsByCategoryAndSubcategory = async (categoryId, subcategory) => {
    try {
        const res = await instance.get(`${endpoint.PRODUCT}?category_id=${categoryId}`);
        let products = res.data;
        
        // Filter by subcategory if specified
        if (subcategory) {
            if (subcategory === "socks") {
                products = products.filter(product => 
                    product.name.toLowerCase().includes('Tất') || 
                    product.name.toLowerCase().includes('tất') ||
                    product.name.toLowerCase().includes('sock')
                );
            } else if (subcategory === "bag") {
                products = products.filter(product => 
                    product.name.toLowerCase().includes('túi') || 
                    product.name.toLowerCase().includes('bag')
                );
            }
        }
        
        return products;
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const fetchFeaturedProducts = async () => {
    try {
        // Get first 6 products as featured products
        const res = await instance.get(`${endpoint.PRODUCT}?_limit=6`);
        return res.data;
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const searchProducts = async (query) => {
    try {
        const res = await instance.get(`${endpoint.PRODUCT}?q=${encodeURIComponent(query)}`);
        return res.data;
    } catch (error) {
        console.log(error);
        return [];
    }
};

// Review functions
export const fetchProductReviews = async (productId) => {
    try {
        // Ask backend to filter by productId directly
        const res = await instance.get(`${endpoint.REVIEWS}/${productId}`);
        return res.data;
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const submitProductReview = async (reviewData) => {
    try {
        const res = await instance.post(endpoint.REVIEWS, reviewData);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const updateProductReview = async (reviewId, reviewData) => {
    try {
        const res = await instance.put(`${endpoint.REVIEWS}/${reviewId}`, reviewData);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deleteProductReview = async (reviewId) => {
    try {
        const res = await instance.delete(`${endpoint.REVIEWS}/${reviewId}`);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
