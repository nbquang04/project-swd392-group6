import instance from './index.js';
import { endpoint } from './endpoints.js';



export const loginUser = async (data) => (await instance.post(`${endpoint.AUTH}/login`, data)).data;
export const registerUser = async (data) => (await instance.post(`${endpoint.AUTH}/register`, data)).data;
export const getMe = async () => (await instance.get(`${endpoint.AUTH}/me`)).data;
