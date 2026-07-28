import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Dynamic Backend URL: Local IP in development, Vercel URL in production
const BASE_URL = __DEV__ 
    ? 'http://192.168.0.25:5000' 
    : 'https://krutanic-main.vercel.app';

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
