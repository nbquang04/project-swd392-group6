import instance from './index.js';
import { endpoint } from './endpoints.js';

// ============================================
// 🛒 CART SERVICE (chuẩn hóa cho Spring Boot API)
// ============================================

// ✅ Lấy giỏ hàng hiện tại
export const getMyCart = async () => {
  try {
    const { data } = await instance.get(`${endpoint.CART}/me`);
    return data;
  } catch (error) {
    console.error('Get cart error:', error);
    return { items: [] };
  }
};

// ✅ Thêm sản phẩm vào giỏ hàng
export const addToCart = async ({ productId, variantId = null, quantity = 1, price = 0 }) => {
  try {
    const params = new URLSearchParams();
    params.append('productId', productId);
    params.append('quantity', quantity);
    params.append('price', price);
    if (variantId) params.append('variantId', variantId);

    const { data } = await instance.post(`${endpoint.CART}/me/items?${params.toString()}`);
    console.log('✅ Add to cart success:', data);
    return data;
  } catch (error) {
    console.error('❌ Add to cart error:', error.response?.data || error.message);
    throw error;
  }
};

// ✅ Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = async (itemId, quantity) => {
  try {
    // 🧠 Spring Boot nhận quantity qua query param, không phải JSON body
    const { data } = await instance.put(`${endpoint.CART}/me/items/${itemId}?quantity=${quantity}`);
    return data;
  } catch (error) {
    console.error('Update cart item error:', error);
    throw error;
  }
};

// ✅ Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (itemId) => {
  try {
    const { data } = await instance.delete(`${endpoint.CART}/me/items/${itemId}`);
    return data;
  } catch (error) {
    console.error('Remove from cart error:', error);
    throw error;
  }
};

// ✅ Xóa toàn bộ giỏ hàng
export const clearCart = async () => {
  try {
    const { data } = await instance.delete(`${endpoint.CART}/me`);
    return data;
  } catch (error) {
    console.error('Clear cart error:', error);
    throw error;
  }
};

// ✅ Lấy tổng số lượng sản phẩm trong giỏ hàng
export const getCartItemCount = async () => {
  try {
    const cart = await getMyCart();
    return cart.items ? cart.items.reduce((sum, i) => sum + i.quantity, 0) : 0;
  } catch (error) {
    console.error('Get cart item count error:', error);
    return 0;
  }
};

// ✅ Lấy tổng giá trị giỏ hàng
export const getCartTotal = async () => {
  try {
    // Có thể gọi trực tiếp API /me/total nếu muốn dùng backend tính
    const cart = await getMyCart();
    return cart.items
      ? cart.items.reduce((sum, i) => sum + Number(i.price || 0) * i.quantity, 0)
      : 0;
  } catch (error) {
    console.error('Get cart total error:', error);
    return 0;
  }
};

// ✅ Kiểm tra sản phẩm đã có trong giỏ hàng chưa
export const isProductInCart = async (productId, variantId = null) => {
  try {
    const cart = await getMyCart();
    if (!cart.items) return false;
    return cart.items.some(
      (i) =>
        i.productId === productId &&
        ((variantId && i.variantId === variantId) || !variantId)
    );
  } catch (error) {
    console.error('Check product in cart error:', error);
    return false;
  }
};
