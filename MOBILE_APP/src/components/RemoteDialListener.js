import React, { useEffect, useRef } from 'react';
import { AppState, Linking, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';
import { startCallTracking } from '../utils/callTracker';

const RemoteDialListener = () => {
    const { user } = useAuth();
    const navigation = useNavigation();
    const intervalRef = useRef(null);

    const checkQueue = async () => {
        if (!user?.id) return;
        try {
            const response = await api.get(`/api/adv-leads/check-remote-dial?specialistId=${user.id}`);
            if (response.data.hasRequest && response.data.lead) {
                const lead = response.data.lead;

                // 1. Clear the queue so we don't dial twice
                await api.post('/api/adv-leads/clear-remote-dial', { specialistId: user.id });

                // 2. Start tracking
                await startCallTracking(lead._id, lead.full_name);

                // 3. Initiate the call via native dialer
                Linking.openURL(`tel:+91${lead.phone_number}`);

                // 4. Navigate to Lead Details screen so user can save the log afterward
                navigation.navigate('LeadDetails', { leadId: lead._id, autoDialerMode: false });
            }
        } catch (error) {
            // Silently fail polling errors to avoid spamming the logs
        }
    };

    useEffect(() => {
        // Only run polling when app is in the foreground
        const startPolling = () => {
            if (!intervalRef.current) {
                intervalRef.current = setInterval(checkQueue, 3000); // 3 seconds
            }
        };

        const stopPolling = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        // Start initially
        startPolling();

        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'active') {
                startPolling();
            } else {
                stopPolling();
            }
        });

        return () => {
            stopPolling();
            subscription.remove();
        };
    }, [user?.id]);

    return null; // Headless component, renders no UI
};

export default RemoteDialListener;
