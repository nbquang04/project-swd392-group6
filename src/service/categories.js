import instance from './index.js';
import { endpoint } from './endpoints.js';



export const fetchCategories = async () => (await instance.get(endpoint.CATEGORIES)).data;
