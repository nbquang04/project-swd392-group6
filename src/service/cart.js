import instance from ".";
import { endpoint } from "./endpoints";

export const fetchCart = async () => {
  try {
    const res = await instance.get(endpoint.CART);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};