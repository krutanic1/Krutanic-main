import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY } from '../utils/theme';

const ProfileScreen = () => {
    const { user, signOut } = useAuth();

    const MenuItem = ({ icon, label, onPress, destructive }) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={[styles.menuIconContainer, destructive && { backgroundColor: COLORS.error + '10' }]}>
                <Ionicons name={icon} size={20} color={destructive ? COLORS.error : COLORS.text} />
            </View>
            <Text style={[styles.menuText, destructive && { color: COLORS.error }]}>{label}</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textDim} opacity={0.3} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.avatarShadow}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase()}</Text>
                        </View>
                    </View>
                    <Text style={styles.name}>{user?.name}</Text>
                    <View style={styles.roleBadge}>
                        <Text style={styles.roleText}>{user?.role || 'Sales Specialist'}</Text>
                    </View>
                </View>

                <View style={styles.menuContainer}>
                    <Text style={styles.sectionTitle}>Support & Feedback</Text>
                    <View style={styles.menuCard}>
                        <MenuItem 
                            icon="bug-outline" 
                            label="Report Bug" 
                            onPress={() => Linking.openURL('https://wa.me/918088766989?text=Hello%20Krutanic%20Support,%20I%20found%20a%20bug%20in%20the%20mobile%20app.')} 
                        />
                        <View style={styles.divider} />
                        <MenuItem icon="information-circle-outline" label="About Dashboard" onPress={() => { }} />
                    </View>

                    <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
                        <Ionicons name="log-out" size={20} color={COLORS.error} />
                        <Text style={styles.signOutText}>Sign Out of Workplace</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.versionText}>Version 2.4.5 (Executive Sanctum)</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.surface },
    container: { flex: 1 },
    header: {
        backgroundColor: COLORS.surface,
        paddingTop: 30,
        paddingBottom: 40,
        alignItems: 'center',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border + '50',
    },
    avatarShadow: {
        ...SHADOWS.medium,
        shadowColor: COLORS.primary,
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 35,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#fff',
    },
    avatarText: { fontSize: 42, color: '#fff', fontWeight: '900' },
    name: { ...TYPOGRAPHY.h2, color: COLORS.text, fontWeight: '800' },
    roleBadge: {
        backgroundColor: COLORS.primary + '10',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
    },
    roleText: { ...TYPOGRAPHY.tiny, color: COLORS.primary, fontWeight: '800', textTransform: 'uppercase' },

    menuContainer: { padding: SPACING.lg },
    sectionTitle: { ...TYPOGRAPHY.tiny, color: COLORS.textDim, fontWeight: '800', textTransform: 'uppercase', marginBottom: 12, marginLeft: 12 },
    menuCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOWS.small,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuText: { flex: 1, ...TYPOGRAPHY.body, color: COLORS.text, fontWeight: '600' },
    divider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: 16 },

    signOutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.error + '10',
        marginTop: 40,
        padding: 18,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.error + '20',
    },
    signOutText: { ...TYPOGRAPHY.body, color: COLORS.error, fontWeight: '800', marginLeft: 10 },
    versionText: { ...TYPOGRAPHY.tiny, color: COLORS.textDim, textAlign: 'center', marginTop: 'auto', marginBottom: 20, opacity: 0.5 },
});

export default ProfileScreen;
