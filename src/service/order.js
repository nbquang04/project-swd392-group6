import instance from ".";
import { endpoint } from "./endpoints";

/**
 * =========================
 * 🧾 ORDER SERVICE FUNCTIONS (SYNCED WITH BACKEND)
 * =========================
 */

// 🧾 Lấy danh sách đơn hàng của người dùng
export const fetchOrders = async () => {
  try {
    const { data } = await instance.get(`${endpoint.ORDERS}/me`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("❌ [fetchOrders] Error:", error.response?.data || error.message);
    return [];
  }
};

// 🔍 Lấy chi tiết đơn hàng theo ID (của user)
export const getOrderById = async (orderId) => {
  try {
    const { data } = await instance.get(`${endpoint.ORDERS}/${orderId}`);
    return data;
  } catch (error) {
    console.error("❌ [getOrderById] Error:", error.response?.data || error.message);
    return null;
  }
};

// 🛍️ Tạo đơn hàng mới (theo CreateOrderRequest)
export const placeOrder = async (payload) => {
  try {
    const res = await instance.post(`${endpoint.ORDERS}/me`, payload);
    console.log("✅ [placeOrder] Success:", res.status, res.data);
    return res.data;
  } catch (error) {
    console.error("❌ [placeOrder] Error:", error.response?.data || error.message);
    return null;
  }
};

// ❌ Hủy đơn hàng — dùng DELETE thay vì POST
export const cancelOrder = async (orderId) => {
  try {
    const { data } = await instance.delete(`${endpoint.ORDERS}/${orderId}`);
    return data;
  } catch (error) {
    console.error("❌ [cancelOrder] Error:", error.response?.data || error.message);
    return null;
  }
};


// 🧾 Lấy tất cả đơn hàng (Admin)
export const getAllOrders = async (filters = {}) => {
  try {
    const query = new URLSearchParams(filters).toString();
    const url = `${endpoint.ORDERS}${query ? `?${query}` : ""}`;
    const { data } = await instance.get(url);
    console.log("✅ [getAllOrders] Loaded", data.length, "orders");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(
      "❌ [getAllOrders] Error:",
      error.response?.data || error.message
    );
    return [];
  }
};

// ⚙️ Cập nhật trạng thái đơn hàng (Admin)
export const updateOrderStatus = async (orderId, status) => {
  try {
    const { data } = await instance.patch(
      `${endpoint.ORDERS}/${orderId}/status`,
      { status } // ✅ body phải là { "status": "Delivered" }
    );
    console.log("✅ [updateOrderStatus] Success:", data);
    return data;
  } catch (error) {
    console.error("❌ [updateOrderStatus] Error:", error.response || error);
    alert(`⚠️ ${error.response?.status || "Network"} - ${error.response?.data || error.message}`);
    return null;
  }
};
