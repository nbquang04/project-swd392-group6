import instance from ".";
import { endpoint } from "./endpoints";



export const fetchUsers = async () => {
  try {
    const res = await instance.get(endpoint.USER);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};