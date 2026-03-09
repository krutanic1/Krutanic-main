import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import authService from '../services/authService';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const bootstrapAsync = async () => {
            let token;
            let userData;
            try {
                token = await SecureStore.getItemAsync('userToken');
                userData = await SecureStore.getItemAsync('userData');
            } catch (e) {
                console.log('Restoring token failed', e);
            }
            setUserToken(token);
            if (userData) {
                setUser(JSON.parse(userData));
            }
            setIsLoading(false);
        };

        bootstrapAsync();
    }, []);

    const authContext = {
        sendOtp: async (email, role) => {
            try {
                return await authService.sendOtp(email, role);
            } catch (error) {
                throw error;
            }
        },
        signIn: async (email, otp, role) => {
    try {

        const userData = await authService.verifyOtp(email, otp, role);

        const token = await SecureStore.getItemAsync('userToken');

        setUserToken(token);
        setUser(userData);

        return { success: true };

    } catch (error) {

        return {
            success: false,
            message: error || 'Login failed'
        };

    }
},
        signOut: async () => {
            await authService.logout();
            setUserToken(null);
            setUser(null);
        },
        userToken,
        isLoading,
        user,
        role: user?.role || null,
        team: user?.team || null,
    };

    return (
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
