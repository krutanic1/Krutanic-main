import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY } from '../utils/theme';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
    const { user, role, team, signOut } = useAuth();

    const ProfileItem = ({ icon, label, value, color = COLORS.primary }) => (
        <View style={styles.profileItem}>
            <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={20} color={color} />
            </View>
            <View style={styles.profileTextContainer}>
                <Text style={styles.profileLabel}>{label}</Text>
                <Text style={styles.profileValue}>{value}</Text>
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>
                        {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                </View>
                <Text style={styles.userName}>{user?.name || 'Krutanic User'}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account Information</Text>
                <View style={styles.card}>
                    <ProfileItem
                        icon="person-outline"
                        label="Full Name"
                        value={user?.name || 'N/A'}
                    />
                    <View style={styles.divider} />
                    <ProfileItem
                        icon="briefcase-outline"
                        label="Role / Designation"
                        value={role || 'N/A'}
                        color={COLORS.info}
                    />
                    <View style={styles.divider} />
                    <ProfileItem
                        icon="people-outline"
                        label="Team"
                        value={team || 'Direct Assignment'}
                        color={COLORS.success}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
                    <Ionicons name="log-out-outline" size={20} color="#fff" />
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.footerVersion}>V 1.0.4 | Secure CRM</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { paddingBottom: SPACING.xxl },
    header: {
        backgroundColor: COLORS.surface,
        paddingTop: 80,
        paddingBottom: SPACING.xl,
        alignItems: 'center',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        ...SHADOWS.medium,
    },
    avatarCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
        borderWidth: 4,
        borderColor: COLORS.surface,
        ...SHADOWS.small,
    },
    avatarText: { fontSize: 42, fontWeight: '800', color: '#fff' },
    userName: { ...TYPOGRAPHY.h2, color: COLORS.text, marginBottom: 4 },
    userEmail: { ...TYPOGRAPHY.caption, color: COLORS.textDim },

    section: { marginTop: SPACING.xl, paddingHorizontal: SPACING.md },
    sectionTitle: { ...TYPOGRAPHY.caption, color: COLORS.textLight, marginBottom: SPACING.sm, paddingLeft: 4, textTransform: 'uppercase', letterSpacing: 1 },

    card: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: SPACING.md,
        ...SHADOWS.small,
    },
    profileItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm },
    iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    profileTextContainer: { marginLeft: SPACING.md, flex: 1 },
    profileLabel: { ...TYPOGRAPHY.tiny, color: COLORS.textDim },
    profileValue: { ...TYPOGRAPHY.body, color: COLORS.text, fontWeight: '600', marginTop: 1 },
    divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.sm, marginLeft: 56 },

    signOutButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.error,
        padding: SPACING.md,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.sm,
        ...SHADOWS.medium,
    },
    signOutText: { color: '#fff', fontSize: 16, fontWeight: '700', marginLeft: SPACING.sm },
    footerVersion: { textAlign: 'center', marginTop: SPACING.xxl, color: COLORS.textDim, fontSize: 12, opacity: 0.5 },
});

export default HomeScreen;
