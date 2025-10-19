
import instance from ".";
import { endpoint } from "./endpoints";



// Legacy-compatible for Header1 & ShopCartDetail (expects array of carts)
export const fetchCart = async () => {
  try {
    const { data } = await instance.get(`${endpoint.CART}/me`);
    const userStr = localStorage.getItem('user');
    let userId = null; try { userId = JSON.parse(userStr)?.id } catch {}
    const cart = data && typeof data === 'object' ? { ...data } : { items: [] };
    if (userId && !cart.user_id) cart.user_id = String(userId);
    return [cart];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getMyCart = async () => {
  const { data } = await instance.get(`${endpoint.CART}/me`);
  return data;
};

export const addToCart = async ({ productId, variantId=null, quantity=1, price=0 }) => {
  const params = new URLSearchParams({ productId, quantity, price });
  if (variantId) params.append('variantId', variantId);
  const { data } = await instance.post(`${endpoint.CART}/me/items?${params.toString()}`);
  return data;
};

export const clearCart = async () => {
  const { data } = await instance.delete(`${endpoint.CART}/me`);
  return data;
};
