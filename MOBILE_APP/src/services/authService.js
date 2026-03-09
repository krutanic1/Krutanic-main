import api from './api';
import * as SecureStore from 'expo-secure-store';

export const authService = {
    sendOtp: async (email, role = 'staff') => {
        try {
            const endpoint = role === 'admin' ? '/otpsend' : '/advteamsendotp';
            console.log(`[AUTH] Sending OTP request to ${endpoint} for email: ${email}`);
            const response = await api.post(endpoint, { email });
            console.log(`[AUTH] OTP request successful:`, response.data);
            return response.data;
        } catch (error) {
            console.error(`[AUTH ERROR] OTP dispatch failed:`, error.response?.data || error);
            throw error.response?.data?.message || 'Failed to send OTP';
        }
    },

    verifyOtp: async (email, otp, role = 'staff') => {
        try {
            const endpoint = role === 'admin' ? '/otpverify' : '/advteamverifyotp';
            const response = await api.post(endpoint, { email, otp });
            const { token, user } = response.data;

            // Admin verify response might be slightly different in nested structure
            let finalUser = user;
            if (role === 'admin' && !user) {
                // Try to find any ID provided by the backend, or default to email if none
                const adminId = response.data.admin?._id || response.data.admin?.id || response.data._id || response.data.id || email;
                finalUser = {
                    id: adminId,
                    email: email,
                    role: 'admin',
                    name: response.data.admin?.fullname || 'Admin'
                };
            }

            if (token) {
                await SecureStore.setItemAsync('userToken', token);
                if (finalUser) {
                    await SecureStore.setItemAsync('userData', JSON.stringify(finalUser));
                }
            }

            return finalUser || response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Invalid OTP';
        }
    },

    logout: async () => {
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userData');
    },

    getCurrentUser: async () => {
        const userData = await SecureStore.getItemAsync('userData');
        return userData ? JSON.parse(userData) : null;
    }
};

export default authService;
