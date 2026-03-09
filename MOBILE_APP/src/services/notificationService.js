import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

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
    const triggerDate = new Date(followUpDate);

    // Only schedule if the date is in the future
    if (triggerDate > new Date()) {
        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: "Follow-Up Reminder 📅",
                body: `Time to call ${leadName}. Don't let the lead go cold!`,
                data: { type: 'follow_up' },
                android: {
                    channelId: 'follow-up',
                },
            },
            trigger: triggerDate,
        });
        console.log(`[Notification] Scheduled for ${leadName} at ${triggerDate}`);
        return id;
    }
    return null;
};
