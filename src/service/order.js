
import instance from ".";
import { endpoint } from "./endpoints";



export const fetchOrders = async (params={}) => {
  const qp = new URLSearchParams(params).toString();
  const { data } = await instance.get(`${endpoint.ORDERS}/me${qp?`?${qp}`:''}`);
  return data;
};

export const updateOrderStatus = async (orderId, status) => {
  const { data } = await instance.put(`${endpoint.ORDERS}/${orderId}`, { status });
  return data;
};

export const placeOrder = async (payload) => {
  const { data } = await instance.post(`${endpoint.ORDERS}/me`, payload);
  return data;
};
