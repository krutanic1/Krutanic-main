import { PermissionsAndroid, Platform } from 'react-native';
import CallLogs from 'react-native-call-log';
import * as SecureStore from 'expo-secure-store';
import api from './api';

class CallLogSyncService {
    async requestPermissions() {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
                    PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE
                ]);
                return granted[PermissionsAndroid.PERMISSIONS.READ_CALL_LOG] === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn('Error requesting permissions:', err);
                return false;
            }
        }
        return false;
    }

    async syncCallLogs() {
        try {
            const hasPermission = await this.requestPermissions();
            if (!hasPermission) {
                console.log('No permission to read call logs.');
                return;
            }

            const userData = await SecureStore.getItemAsync('userData');
            if (!userData) {
                console.log('No logged in user to sync call logs for.');
                return;
            }

            const user = JSON.parse(userData);
            const userId = user._id || user.id;

            // Fetch the latest 100 call logs
            const logs = await CallLogs.load(100);

            if (!logs || logs.length === 0) {
                console.log('No call logs found on device.');
                return;
            }

            // Map native call log to our DB schema
            const mappedLogs = logs.map(log => {
                let callType = "UNKNOWN";
                if (log.type === 'OUTGOING') callType = 'OUTGOING';
                else if (log.type === 'INCOMING') callType = 'INCOMING';
                else if (log.type === 'MISSED') callType = 'MISSED';
                else if (log.type === 'REJECTED') callType = 'REJECTED';

                return {
                    deviceCallId: log.timestamp + "_" + log.phoneNumber, // Generate a unique ID based on timestamp and phone
                    userId: userId,
                    callType: callType,
                    contactId: null,
                    contactName: log.name || null,
                    durationSeconds: log.duration,
                    isRecorded: false, // Default unless linked with recording module
                    isSyncedFromDevice: true,
                    notes: null,
                    phoneNumber: log.phoneNumber,
                    recordingId: null,
                    startedAt: new Date(parseInt(log.timestamp)),
                    syncedAt: new Date(),
                };
            });

            const response = await api.post('/api/call-logs/sync', { callLogs: mappedLogs });
            console.log('Call logs synced successfully:', response.data);

        } catch (error) {
            console.error('Failed to sync call logs:', error);
        }
    }
}

export default new CallLogSyncService();
