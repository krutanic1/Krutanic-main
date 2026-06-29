import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import api from './api';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

// Set up notification channel for Android (Required for modern Android versions)
if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('follow-up', {
        name: 'Follow-Up Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#F15B29',
    });
}

export const requestNotificationPermissions = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        return false;
    }
    return true;
};

export const scheduleFollowUpNotification = async (leadName, followUpDate) => {
    const targetDate = new Date(followUpDate);
    let triggerDate = new Date(targetDate.getTime() - 15 * 60000); // 15 mins before
    const now = new Date();

    // If the 15-minute warning window has already passed, but the call is still in the future,
    // (e.g. you schedule a call for 5 minutes from now), trigger the notification immediately!
    if (triggerDate <= now && targetDate > now) {
        triggerDate = new Date(now.getTime() + 5000); // Trigger in 5 seconds
    }

    // Only schedule if the trigger date is in the future
    if (triggerDate > now) {
        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: "Follow-Up Reminder ⏰",
                body: `Upcoming Follow-up! Call ${leadName} in 15 minutes.`,
                data: { type: 'follow_up' },
                android: {
                    channelId: 'follow-up',
                },
            },
            trigger: {
                date: triggerDate,
                channelId: 'follow-up'
            },
        });
        console.log(`[Notification] Scheduled for ${leadName} at ${triggerDate}`);
        return id;
    }
    return null;
};

// Remote Notification API calls
export const getUnreadNotifications = async (userId) => {
    try {
        const res = await api.get('/api/adv-leads/get-my-notifications', { params: { userId } });
        return res.data;
    } catch (err) {
        console.error('Error fetching notifications:', err);
        return { success: false, notifications: [] };
    }
};

export const getUnreadNotificationCount = async (userId) => {
    try {
        const res = await api.get('/api/adv-leads/get-notification-count', { params: { userId } });
        return res.data;
    } catch (err) {
        console.error('Error fetching notification count:', err);
        return { success: false, count: 0 };
    }
};

export const markRead = async (notificationId) => {
    try {
        const res = await api.post('/api/adv-leads/mark-notification-read', { notificationId });
        return res.data;
    } catch (err) {
        console.error('Error marking notification read:', err);
        return { success: false };
    }
};
