import instance from ".";
import { endpoint } from "./endpoints";

const normalizeProduct = (p = {}) => {
  const name = p.name ?? p.productName ?? p.title ?? "";
  const price = p.price ?? p.unitPrice ?? p.unit_price ?? 0;
  const id = p.id ?? p.productId ?? p.code ?? p.sku ?? null;
  return { ...p, id, name, price };
};

// ✅ Lấy danh sách sản phẩm (có thể lọc, phân trang)
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
    console.log(error);
    return [];
  }
};

// ✅ Lấy chi tiết sản phẩm
export const fetchProductDetail = async (id) => {
  try {
    const { data } = await instance.get(`${endpoint.PRODUCT}/${id}`);
    return normalizeProduct(data);
  } catch (error) {
    console.log(error);
    return null;
  }
};

// ✅ Tạo, sửa, xóa sản phẩm (admin)
export const createProduct = async (payload) => {
  const { data } = await instance.post(endpoint.PRODUCT, payload);
  return normalizeProduct(data);
};
export const updateProduct = async (id, payload) => {
  const { data } = await instance.put(`${endpoint.PRODUCT}/${id}`, payload);
  return normalizeProduct(data);
};
export const deleteProduct = async (id) => {
  const { data } = await instance.delete(`${endpoint.PRODUCT}/${id}`);
  return data;
};

// ✅ Reviews
export const getReviewsByProductId = async (productId) => {
  const { data } = await instance.get(
    `${endpoint.PRODUCT}/${productId}/reviews`
  );
  return data;
};
export const createProductReview = async (productId, payload) => {
  const { data } = await instance.post(
    `${endpoint.PRODUCT}/${productId}/reviews`,
    payload
  );
  return data;
};
export const updateProductReview = async (productId, reviewId, payload) => {
  const { data } = await instance.put(
    `${endpoint.PRODUCT}/${productId}/reviews/${reviewId}`,
    payload
  );
  return data;
};
export const deleteProductReview = async (productId, reviewId) => {
  const { data } = await instance.delete(
    `${endpoint.PRODUCT}/${productId}/reviews/${reviewId}`
  );
  return data;
};

//
// 🧩 Thêm các hàm còn thiếu (để khớp với FE)
//

// ✅ Lấy danh sách sản phẩm nổi bật
export const fetchFeaturedProducts = async () => {
  try {
    const res = await instance.get(`${endpoint.PRODUCT}?featured=true&_limit=8`);
    const data = Array.isArray(res.data) ? res.data : res.data?.content ?? [];
    return data.map(normalizeProduct);
  } catch (error) {
    console.log("Error fetching featured products:", error);
    return [];
  }
};

// ✅ Lấy danh sách category
export const fetchCategory = async () => {
  try {
    const res = await instance.get(endpoint.CATEGORY);
    return res.data;
  } catch (error) {
    console.log("Error fetching categories:", error);
    return [];
  }
};

// ✅ Lấy sản phẩm theo category
export const fetchProductsByCategory = async (categoryId, extra = {}) => {
  try {
    const qp = new URLSearchParams({ category_id: categoryId, ...extra }).toString();
    const res = await instance.get(`${endpoint.PRODUCT}?${qp}`);
    const data = Array.isArray(res.data) ? res.data : res.data?.content ?? [];
    return data.map(normalizeProduct);
  } catch (error) {
    console.log("Error fetching products by category:", error);
    return [];
  }
};

// ✅ Lấy review theo product (FE dùng)
export const fetchProductReviews = async (productId) => {
  try {
    const res = await instance.get(`${endpoint.REVIEW}/${productId}`);
    return res.data;
  } catch (error) {
    console.log("Error fetching product reviews:", error);
    return [];
  }
};

// ✅ Gửi review sản phẩm (FE gọi)
export const submitProductReview = async (payload) => {
  try {
    const res = await instance.post(endpoint.REVIEW, payload);
    return res.data;
  } catch (error) {
    console.log("Error submitting product review:", error);
    throw error;
  }
};
