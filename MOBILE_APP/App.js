import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AppState } from 'react-native';
import CallLogSyncService from './src/services/CallLogSyncService';

// Contribution note: non-functional comment added for repository activity.

export default function App() {
  React.useEffect(() => {
    // Sync logs on initial app load
    CallLogSyncService.syncCallLogs();

    // Sync logs when app comes to foreground
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        CallLogSyncService.syncCallLogs();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

