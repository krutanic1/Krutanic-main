import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import BrandedLoading from '../components/BrandedLoading';
// Screens
import LoginScreen from '../screens/LoginScreen';
import MainTabNavigator from './MainTabNavigator';
import LeadDetailsScreen from '../screens/LeadDetailsScreen';
import AutoDialerScreen from '../screens/AutoDialerScreen';
import RemoteDialListener from '../components/RemoteDialListener';

const Stack = createStackNavigator();

export const AppNavigator = () => {
    const { userToken, isLoading } = useAuth();

    if (isLoading) {
        return <BrandedLoading message="Securing Connection..." />;
    }

    return (
        <>
            {userToken != null && <RemoteDialListener />}
            <Stack.Navigator>
                {userToken == null ? (
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                ) : (
                    <>
                        <Stack.Screen
                            name="Main"
                            component={MainTabNavigator}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="LeadDetails"
                            component={LeadDetailsScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="AutoDialer"
                            component={AutoDialerScreen}
                            options={{ headerShown: false }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </>
    );

};
