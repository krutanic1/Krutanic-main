import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Production Backend URL
//const BASE_URL = 'https://krutanic-main.vercel.app';
const BASE_URL = 'http://192.168.0.20:5000'; // Development IP

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Error fetching token from SecureStore', error);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
