import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Image,
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
import BrandedLoading from '../components/BrandedLoading';

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
                const data = await teamService.getDashboardStats(user.id, role);
                console.log('[DASHBOARD] Specialist Stats received:', data);
                const followUpData = await leadService.getTodayFollowUpCount(user.id);
                setStats({
                    ...data,
                    totalLeads: data.totalLeads || 0, // Explicit mapping just in case
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
        return <BrandedLoading message="Loading Dashboard..." />;
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
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            
            {/* Mesh-style Background (Simulated with a container) */}
            <View style={styles.meshBackground}>
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} color={COLORS.primary} />
                    }
                >
                    {/* Header Section */}
                    <View style={styles.header}>
                        <View style={styles.headerTitleContainer}>
                            <View style={styles.logoRing}>
                                <Image source={require('../../assets/logo.jpg')} style={styles.logoMini} />
                            </View>
                            <Text style={styles.brandText}>KRUTANIC</Text>
                        </View>
                        <TouchableOpacity style={styles.notificationBtn}>
                            <Ionicons name="notifications-outline" size={20} color={COLORS.text} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.mainPadding}>
                        {/* Personalized Greeting */}
                        <View style={styles.greetingSection}>
                            <Text style={styles.greetingText}>Good morning, {user?.name?.split(' ')[0] || (isAdmin ? 'Admin' : 'Specialist')}</Text>
                            <Text style={styles.commandCenterText}>Command Center</Text>
                        </View>

                        {/* Bento Grid: 3D-Effect Cards */}
                        <View style={styles.bentoGrid}>
                            {/* Large Card: Total Leads */}
                            <TouchableOpacity style={[styles.threeDCard, styles.fullWidthCard, { backgroundColor: '#FFF5F0' }]}>
                                <View style={styles.cardHeaderRow}>
                                    <View>
                                        <Text style={styles.bentoCardLabel}>TOTAL LEADS</Text>
                                        <Text style={styles.bentoCardValue}>{stats?.totalLeads || 0}</Text>
                                        <Text style={styles.cardInfoText}>Total assigned database</Text>
                                    </View>
                                    <View style={styles.iconCircleLarge}>
                                        <Ionicons name="people" size={32} color={COLORS.primary} />
                                    </View>
                                </View>
                            </TouchableOpacity>

                            {/* Large Card: Called Today */}
                            <View style={[styles.threeDCard, styles.fullWidthCard, { marginTop: 16 }]}>
                                <View style={styles.cardHeaderRow}>
                                    <View>
                                        <Text style={styles.bentoCardLabel}>CALLED TODAY</Text>
                                        <Text style={styles.bentoCardValue}>{stats?.callsMade || 0}</Text>
                                        <Text style={styles.cardInfoText}>Outbound activity today</Text>
                                    </View>
                                    <View style={[styles.iconCircleLarge, { backgroundColor: '#F1F4F9' }]}>
                                        <Ionicons name="call" size={32} color={COLORS.secondary} />
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Quick Action Glass Card */}
                        <TouchableOpacity 
                            style={styles.glassActionCard}
                            onPress={() => navigation.navigate('Leads')}
                        >
                            <View style={styles.glassHeaderRow}>
                                <View style={styles.actionIconBox}>
                                    <Ionicons name="book" size={28} color="#fff" />
                                </View>
                                <View style={styles.actionTextBox}>
                                    <Text style={styles.actionTitle}>Open Leads Book</Text>
                                    <Text style={styles.actionSubtitle}>34 new entries since yesterday</Text>
                                </View>
                            </View>
                            <View style={styles.gradientButton}>
                                <Text style={styles.gradientButtonText}>Access Dashboard</Text>
                                <Ionicons name="arrow-forward" size={18} color="#fff" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f5f6f7' },
    meshBackground: { flex: 1, backgroundColor: '#f5f6f7' },
    container: { flex: 1 },
    scrollContent: { paddingBottom: 120 },
    mainPadding: { paddingHorizontal: 24 },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: 'rgba(255,255,255,0.7)',
        marginBottom: 8,
    },
    headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
    logoRing: { padding: 2, borderRadius: 20, backgroundColor: COLORS.surface, ...SHADOWS.small },
    logoMini: { width: 34, height: 34, borderRadius: 17 },
    brandText: { fontSize: 20, fontWeight: '800', color: COLORS.primary, marginLeft: 12, letterSpacing: -0.5 },
    notificationBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eff1f2', justifyContent: 'center', alignItems: 'center' },

    greetingSection: { marginTop: 16, marginBottom: 24 },
    greetingText: { fontSize: 13, fontWeight: '600', color: COLORS.textDim, textTransform: 'uppercase', letterSpacing: 1 },
    commandCenterText: { fontSize: 32, fontWeight: '800', color: COLORS.text, marginTop: 4 },

    bentoGrid: { gap: 16 },
    threeDCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 24,
        padding: 24,
        ...SHADOWS.medium,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.8)',
    },
    fullWidthCard: { width: '100%' },
    cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    bentoCardLabel: { fontSize: 11, fontWeight: '700', color: COLORS.secondary, letterSpacing: 1.5, opacity: 0.8 },
    bentoCardValue: { fontSize: 42, fontWeight: '800', color: COLORS.text, marginTop: 4 },
    cardInfoText: { fontSize: 13, color: COLORS.textDim, marginTop: 4, fontWeight: '500' },
    trendingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    trendingText: { fontSize: 14, fontWeight: '800', color: COLORS.primary, marginLeft: 4 },
    iconCircleLarge: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.4)', justifyContent: 'center', alignItems: 'center' },

    halfWidthRow: { flexDirection: 'row', gap: 16 },
    halfWidthCard: { flex: 1, padding: 20 },
    iconSquare: { width: 48, height: 48, borderRadius: 16, backgroundColor: COLORS.surface, ...SHADOWS.small, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    bentoCardSmallLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textDim },
    bentoCardSmallValue: { fontSize: 24, fontWeight: '800', color: COLORS.text, marginTop: 2 },

    glassActionCard: {
        marginTop: 32,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 24,
        padding: 24,
        ...SHADOWS.large,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    glassHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
    actionIconBox: { width: 56, height: 56, borderRadius: 18, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', ...SHADOWS.glow },
    actionTextBox: {},
    actionTitle: { fontSize: 19, fontWeight: '800', color: COLORS.text },
    actionSubtitle: { fontSize: 13, color: COLORS.textDim, marginTop: 2 },
    gradientButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        height: 60,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        ...SHADOWS.glow,
    },
    gradientButtonText: { color: '#fff', fontSize: 16, fontWeight: '800' },

    activitySection: { marginTop: 32 },
    activityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    activityTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
    viewAllText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
    activityList: { gap: 20 },
    activityItem: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    activityIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#e0e3e4', justifyContent: 'center', alignItems: 'center' },
    activityTextBox: { flex: 1 },
    activityItemTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text },
    activityItemSubtitle: { fontSize: 12, color: COLORS.textDim, marginTop: 2 },
    activityTime: { fontSize: 11, fontWeight: '600', color: COLORS.textDim },
});

export default DashboardScreen;
