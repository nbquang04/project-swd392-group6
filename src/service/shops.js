import instance from './index.js';
import { endpoint } from './endpoints.js';



export const fetchShops = async (params={}) => (await instance.get(endpoint.SHOPS, { params })).data;
