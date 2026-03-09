import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Default to local development URL. 
// TIP: Update this to your local IP (e.g., 'http://192.168.1.10:5000') for physical device testing.
const BASE_URL = 'https://krutanic-main.vercel.app';

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
