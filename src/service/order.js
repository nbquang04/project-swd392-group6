import instance from ".";
import { endpoint } from "./endpoints";

const fetchOrders = async () => {
  try {
    const res = await instance.get(endpoint.ORDERS);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export { fetchOrders }