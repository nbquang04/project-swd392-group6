import instance from ".";
import { endpoint } from "./endpoints";

// ===== PRODUCT UTILITIES =====

const normalizeProduct = (p = {}) => {
  const name = p.name ?? p.productName ?? p.title ?? "";
  const price = p.price ?? p.unitPrice ?? p.unit_price ?? 0;
  const id = p.id ?? p.productId ?? p.code ?? p.sku ?? null;
  return { ...p, id, name, price };
};

// ===== PRODUCT CRUD FUNCTIONS =====

// Lấy danh sách sản phẩm với bộ lọc và phân trang
export const fetchProduct = async (params = {}) => {
  try {
    const map = {
      categoryId: "category_id",
      shopId: "shop_id",
      size: "size",
      occasion: "occasion",
      q: "q",
      page: "page",
      size: "size",
      featured: "featured",
      _limit: "_limit",
    };
    const actual = {};
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        actual[map[k] || k] = v;
      }
    });
    const query = new URLSearchParams(actual).toString();
    const res = await instance.get(
      `${endpoint.PRODUCT}${query ? `?${query}` : ""}`
    );
    const data = Array.isArray(res.data?.content)
      ? res.data.content
      : Array.isArray(res.data)
      ? res.data
      : [];
    const mapped = data.map(normalizeProduct);
    const meta = res.data?.totalPages
      ? {
          totalPages: res.data.totalPages,
          totalElements: res.data.totalElements,
          number: res.data.number,
          size: res.data.size,
        }
      : null;
    return meta ? { items: mapped, meta } : mapped;
  } catch (error) {
    console.error('Fetch products error:', error);
    return [];
  }
};

// Lấy chi tiết sản phẩm theo ID
export const fetchProductDetail = async (id) => {
  try {
    const { data } = await instance.get(`${endpoint.PRODUCT}/${id}`);
    return normalizeProduct(data);
  } catch (error) {
    console.error('Fetch product detail error:', error);
    return null;
  }
};

// Tạo sản phẩm mới (Admin)
export const createProduct = async (payload) => {
  try {
    const { data } = await instance.post(endpoint.PRODUCT, payload);
    return normalizeProduct(data);
  } catch (error) {
    console.error('Create product error:', error);
    throw error;
  }
};

// Cập nhật sản phẩm (Admin)
export const updateProduct = async (id, payload) => {
  try {
    const { data } = await instance.put(`${endpoint.PRODUCT}/${id}`, payload);
    return normalizeProduct(data);
  } catch (error) {
    console.error('Update product error:', error);
    throw error;
  }
};

// Xóa sản phẩm (Admin)
export const deleteProduct = async (id) => {
  try {
    const { data } = await instance.delete(`${endpoint.PRODUCT}/${id}`);
    return data;
  } catch (error) {
    console.error('Delete product error:', error);
    throw error;
  }
};

// Cập nhật trạng thái sản phẩm (Admin)
export const updateProductStatus = async (id, status) => {
  try {
    const { data } = await instance.patch(`${endpoint.PRODUCT}/${id}/status`, { status });
    return data;
  } catch (error) {
    console.error('Update product status error:', error);
    throw error;
  }
};

// Cập nhật số lượng tồn kho (Admin)
export const updateProductStockBatch = async (items = []) => {
  try {
    if (!Array.isArray(items) || items.length === 0) return;
    for (const item of items) {
      const id = item.productId;
      await instance.patch(`${endpoint.PRODUCT}/${id}/stock`, {
        quantity: item.quantity,
      });
    }
  } catch (error) {
    console.error("❌ updateProductStockBatch error:", error);
  }
};

// ===== PRODUCT REVIEWS =====

// Lấy đánh giá của sản phẩm

// Tạo đánh giá sản phẩm


// Lấy thống kê đánh giá sản phẩm

// Cập nhật đánh giá
export const updateProductReview = async (productId, reviewId, payload) => {
  try {
    const { data } = await instance.put(
      `${endpoint.PRODUCT}/${productId}/reviews/${reviewId}`,
      payload
    );
    return data;
  } catch (error) {
    console.error('Update review error:', error);
    throw error;
  }
};

// Xóa đánh giá
export const deleteProductReview = async (productId, reviewId) => {
  try {
    const { data } = await instance.delete(
      `${endpoint.PRODUCT}/${productId}/reviews/${reviewId}`
    );
    return data;
  } catch (error) {
    console.error('Delete review error:', error);
    throw error;
  }
};

// ===== PRODUCT FILTERING & SEARCH =====

// Lấy sản phẩm nổi bật
export const fetchFeaturedProducts = async () => {
  try {
    const res = await instance.get(`${endpoint.PRODUCT}?featured=true&_limit=8`);
    const data = Array.isArray(res.data) ? res.data : res.data?.content ?? [];
    return data.map(normalizeProduct);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
};

// Lấy sản phẩm theo danh mục
export const fetchProductsByCategory = async (categoryId, extra = {}) => {
  try {
    const qp = new URLSearchParams({ category_id: categoryId, ...extra }).toString();
    const res = await instance.get(`${endpoint.PRODUCT}?${qp}`);
    const data = Array.isArray(res.data) ? res.data : res.data?.content ?? [];
    return data.map(normalizeProduct);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
};

// Tìm kiếm sản phẩm
export const searchProducts = async (query, filters = {}) => {
  try {
    const params = { q: query, ...filters };
    const qp = new URLSearchParams(params).toString();
    const res = await instance.get(`${endpoint.PRODUCT}?${qp}`);
    const data = Array.isArray(res.data) ? res.data : res.data?.content ?? [];
    return data.map(normalizeProduct);
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};

// Lấy sản phẩm liên quan
export const fetchRelatedProducts = async (productId, limit = 4) => {
  try {
    const res = await instance.get(`${endpoint.PRODUCT}/${productId}/related?limit=${limit}`);
    const data = Array.isArray(res.data) ? res.data : res.data?.content ?? [];
    return data.map(normalizeProduct);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
};

// Lấy sản phẩm mới nhất
export const fetchLatestProducts = async (limit = 8) => {
  try {
    const res = await instance.get(`${endpoint.PRODUCT}?sort=created_at:desc&_limit=${limit}`);
    const data = Array.isArray(res.data) ? res.data : res.data?.content ?? [];
    return data.map(normalizeProduct);
  } catch (error) {
    console.error("Error fetching latest products:", error);
    return [];
  }
};

// Lấy sản phẩm bán chạy
export const fetchBestSellingProducts = async (limit = 8) => {
  try {
    const res = await instance.get(`${endpoint.PRODUCT}?sort=sold_count:desc&_limit=${limit}`);
    const data = Array.isArray(res.data) ? res.data : res.data?.content ?? [];
    return data.map(normalizeProduct);
  } catch (error) {
    console.error("Error fetching best selling products:", error);
    return [];
  }
};

// ===== PRODUCT ANALYTICS (Admin) =====

// Lấy thống kê sản phẩm
export const getProductAnalytics = async (productId) => {
  try {
    const { data } = await instance.get(`${endpoint.PRODUCT}/${productId}/analytics`);
    return data;
  } catch (error) {
    console.error('Get product analytics error:', error);
    return null;
  }
};

// Lấy thống kê tổng quan sản phẩm (Admin)
export const getProductsOverview = async () => {
  try {
    const { data } = await instance.get(`${endpoint.PRODUCT}/overview`);
    return data;
  } catch (error) {
    console.error('Get products overview error:', error);
    return null;
  }
};

// Xuất danh sách sản phẩm (Admin)
export const exportProducts = async (filters = {}) => {
  try {
    const qp = new URLSearchParams(filters).toString();
    const response = await instance.get(`${endpoint.PRODUCT}/export?${qp}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Export products error:', error);
    throw error;
  }
};

// Import sản phẩm (Admin)
export const importProducts = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await instance.post(`${endpoint.PRODUCT}/import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  } catch (error) {
    console.error('Import products error:', error);
    throw error;
  }
};
