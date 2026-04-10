import React, { useEffect, useRef } from 'react';
import { View, Image, ActivityIndicator, StyleSheet, Animated, Text } from 'react-native';
import { COLORS, SHADOWS, TYPOGRAPHY } from '../utils/theme';

const BrandedLoading = ({ message = 'Initializing Krutanic...' }) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [pulseAnim]);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.logoContainer, { transform: [{ scale: pulseAnim }] }]}>
                <Image 
                    source={require('../../assets/logo.jpg')} 
                    style={styles.logo} 
                    resizeMode="contain"
                />
            </Animated.View>
            <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    logoContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.large,
        marginBottom: 30,
        overflow: 'hidden',
    },
    logo: {
        width: 120,
        height: 120,
    },
    loader: {
        marginBottom: 20,
    },
    message: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textDim,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
});

export default BrandedLoading;
