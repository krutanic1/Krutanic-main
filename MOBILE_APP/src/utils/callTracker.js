import AsyncStorage from '@react-native-async-storage/async-storage';

const CALL_TRACKER_KEY = '@krutanic_call_tracking';

export const startCallTracking = async (leadId, leadName) => {
    const startTime = Date.now();
    const callData = {
        leadId,
        leadName,
        startTime,
        status: 'ongoing'
    };
    await AsyncStorage.setItem(CALL_TRACKER_KEY, JSON.stringify(callData));
    console.log(`[CallTracker] Started tracking for lead: ${leadName} at ${startTime}`);
};

export const getActiveCallTracking = async () => {
    const data = await AsyncStorage.getItem(CALL_TRACKER_KEY);
    return data ? JSON.parse(data) : null;
};

export const endCallTracking = async () => {
    const activeCall = await getActiveCallTracking();
    if (!activeCall) return null;

    const endTime = Date.now();
    const durationMs = endTime - activeCall.startTime;
    const durationSec = Math.floor(durationMs / 1000);

    // Tele-CRM Rule: duration >= 60 seconds = Connected
    const isConnected = durationSec >= 60;

    const result = {
        ...activeCall,
        endTime,
        durationSec,
        durationFormatted: formatDuration(durationSec),
        status: isConnected ? 'Connected' : 'Not Connected'
    };

    await AsyncStorage.removeItem(CALL_TRACKER_KEY);
    return result;
};

export const clearCallTracking = async () => {
    await AsyncStorage.removeItem(CALL_TRACKER_KEY);
};

const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
        return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
};
