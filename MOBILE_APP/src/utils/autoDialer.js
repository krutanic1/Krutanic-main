import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';
import { getCallUrl } from './phoneUtils';

const STORAGE_KEY = '@krutanic_auto_dialer';

export const startDialerSession = async (leads) => {
    const session = {
        queue: leads,
        currentIndex: 0,
        isActive: true,
        startTime: new Date().toISOString()
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return session;
};

export const getDialerSession = async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
};

export const stopDialerSession = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
};

export const getNextLead = async () => {
    const session = await getDialerSession();
    if (!session || !session.isActive) return null;

    const nextIndex = session.currentIndex + 1;
    if (nextIndex >= session.queue.length) {
        await stopDialerSession();
        return null;
    }

    session.currentIndex = nextIndex;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return session.queue[nextIndex];
};

export const getCurrentLead = async () => {
    const session = await getDialerSession();
    if (!session || !session.isActive) return null;
    return session.queue[session.currentIndex];
};

export const dialLead = (phoneNumber) => {
    if (!phoneNumber) return;
    Linking.openURL(getCallUrl(phoneNumber));
};
