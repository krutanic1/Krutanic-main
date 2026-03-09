import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import teamService from '../services/teamService';
import leadService from '../services/leadService';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY } from '../utils/theme';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
    const navigation = useNavigation();
    const { user, role, team, signOut } = useAuth();
    const [stats, setStats] = useState({
        totalLeads: 0,
        callsMade: 0,
        connectedCalls: 0,
        convertedLeads: 0,
        followUpsToday: 0
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const isAdmin = role?.toLowerCase() === 'admin';

    const fetchStats = useCallback(async () => {
        // If no user, we can't fetch anything. For admins, we just need the flag.
        if (!user && !isAdmin) {
            setLoading(false);
            setRefreshing(false);
            return;
        }

        try {
            if (isAdmin) {
                const adminData = await teamService.getAdminSystemStats();
                setStats({
                    totalLeads: adminData.totalLeads || 0,
                    activeAgents: adminData.activeAgents || 0,
                    callsMade: adminData.callsToday || 0,
                    convertedLeads: adminData.conversionsToday || 0,
                    followUpsToday: 0
                });
            } else if (user?.id) {
                const data = await teamService.getDashboardStats(user.id);
                const followUpData = await leadService.getTodayFollowUpCount(user.id);
                setStats({
                    ...data,
                    followUpsToday: followUpData.count || 0
                });
            }
        } catch (error) {
            console.error('[DASHBOARD] Fetch failed:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user, isAdmin]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchStats();
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    const StatCard = ({ title, value, icon, color }) => (
        <View style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={22} color={color} />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardValue}>{value}</Text>
                <Text style={styles.cardTitle}>{title}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} color={COLORS.primary} />
                }
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.welcomeText}>{isAdmin ? 'Command Center' : 'Welcome back,'}</Text>
                        <Text style={styles.userName}>{user?.name || (isAdmin ? 'Admin' : 'Specialist')}</Text>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={signOut} style={styles.logoutBtn}>
                            <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileBtn}>
                            <View style={styles.avatarMini}>
                                <Text style={styles.avatarMiniText}>
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Info Pills */}
                <View style={styles.pillRow}>
                    <View style={styles.pill}>
                        <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.textDim} />
                        <Text style={styles.pillText}>{role || 'Staff'}</Text>
                    </View>
                    {!isAdmin && (
                        <View style={styles.pill}>
                            <Ionicons name="people-outline" size={14} color={COLORS.textDim} />
                            <Text style={styles.pillText}>{team || 'General'}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.mainContent}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{isAdmin ? 'System Telemetry' : 'Performance Overview'}</Text>
                        <Text style={styles.dateLabel}>Today</Text>
                    </View>

                    {/* Stats Grid */}
                    <View style={styles.statsGrid}>
                        {isAdmin ? (
                            <>
                                <StatCard
                                    title="Total Leads"
                                    value={stats?.totalLeads || 0}
                                    icon="people-outline"
                                    color={COLORS.info}
                                />
                                <StatCard
                                    title="Active Agents"
                                    value={stats?.activeAgents || 0}
                                    icon="person-outline"
                                    color={COLORS.primary}
                                />
                                <StatCard
                                    title="Calls Today"
                                    value={stats?.callsMade || 0}
                                    icon="call-outline"
                                    color={COLORS.accent}
                                />
                                <StatCard
                                    title="Conversions"
                                    value={stats?.convertedLeads || 0}
                                    icon="trophy-outline"
                                    color={COLORS.success}
                                />
                            </>
                        ) : (
                            <>
                                <StatCard
                                    title="Assignments"
                                    value={stats?.totalLeads || 0}
                                    icon="person-add-outline"
                                    color={COLORS.info}
                                />
                                <StatCard
                                    title="Total Calls"
                                    value={stats?.callsMade || 0}
                                    icon="call-outline"
                                    color={COLORS.primary}
                                />
                                <StatCard
                                    title="Connected"
                                    value={stats?.connectedCalls || 0}
                                    icon="checkmark-circle-outline"
                                    color={COLORS.success}
                                />
                                <StatCard
                                    title="Follow-Ups"
                                    value={stats?.followUpsToday || 0}
                                    icon="notifications-outline"
                                    color="#9B59B6"
                                />
                                <View style={styles.fullWidthCard}>
                                    <StatCard
                                        title="Closed Deals"
                                        value={stats?.convertedLeads || 0}
                                        icon="trophy-outline"
                                        color={COLORS.accent}
                                    />
                                </View>
                            </>
                        )}
                    </View>

                    {!isAdmin && (
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('Leads')}
                        >
                            <Text style={styles.actionButtonText}>Open Leads Book</Text>
                            <View style={styles.actionIcon}>
                                <Ionicons name="arrow-forward" size={18} color="#fff" />
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.surface },
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { paddingBottom: 40 },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.md,
        backgroundColor: COLORS.surface,
    },
    welcomeText: { ...TYPOGRAPHY.caption, color: COLORS.textDim },
    userName: { ...TYPOGRAPHY.h2, color: COLORS.text },
    profileBtn: { padding: 4 },
    avatarMini: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.surface,
        ...SHADOWS.small,
    },
    avatarMiniText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    headerActions: { flexDirection: 'row', alignItems: 'center' },
    logoutBtn: { marginRight: 16, padding: 4 },

    pillRow: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.lg,
        backgroundColor: COLORS.surface,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border + '50',
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    pillText: { ...TYPOGRAPHY.tiny, color: COLORS.textLight, marginLeft: 6 },

    mainContent: { paddingHorizontal: SPACING.md, paddingTop: SPACING.xl },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md
    },
    sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.text },
    dateLabel: { ...TYPOGRAPHY.tiny, color: COLORS.textDim, backgroundColor: COLORS.surface, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, overflow: 'hidden' },

    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: COLORS.surface,
        width: (width - 48) / 2,
        padding: SPACING.md,
        marginBottom: 16,
        borderRadius: 24,
        ...SHADOWS.small,
    },
    fullWidthCard: { width: '100%' },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardContent: {},
    cardValue: { ...TYPOGRAPHY.h2, color: COLORS.text },
    cardTitle: { ...TYPOGRAPHY.tiny, color: COLORS.textDim, marginTop: 2 },

    actionButton: {
        backgroundColor: COLORS.secondary,
        marginVertical: SPACING.lg,
        height: 64,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        ...SHADOWS.medium,
    },
    actionButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
    actionIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DashboardScreen;
