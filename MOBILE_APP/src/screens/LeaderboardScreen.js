import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Platform,
    StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import teamService from '../services/teamService';
import LeaderboardCard from '../components/LeaderboardCard';
import BrandedLoading from '../components/BrandedLoading';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY } from '../utils/theme';

const LeaderboardScreen = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [performance, setPerformance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [leaderboardData, performanceData] = await Promise.all([
                teamService.getTeamLeaderboard(),
                teamService.getTeamPerformance()
            ]);
            setLeaderboard(leaderboardData);
            setPerformance(performanceData);
        } catch (error) {
            console.error('[LEADERBOARD] Fetch failed:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const AnalyticsCard = ({ title, value, icon, color }) => (
        <View style={styles.analyticsCard}>
            <View style={[styles.iconBox, { backgroundColor: color + '12' }]}>
                <Ionicons name={icon} size={22} color={color} />
            </View>
            <View style={styles.analyticsInfo}>
                <Text style={styles.analyticsLabel}>{title}</Text>
                <Text style={styles.analyticsValue}>{value}</Text>
            </View>
        </View>
    );

    const PodiumItem = ({ data, rank, size = 60 }) => (
        <View style={[styles.podiumItem, rank === 1 && styles.podiumFirst]}>
            <View style={styles.avatarWrapper}>
                {rank === 1 && (
                    <View style={styles.crownContainer}>
                        <Ionicons name="ribbon" size={28} color="#FFD700" />
                    </View>
                )}
                <View style={[
                    styles.podiumAvatar,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2.2,
                        borderColor: rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32',
                        backgroundColor: rank === 1 ? '#FFF9E6' : COLORS.surface
                    }
                ]}>
                    <Text style={[styles.podiumAvatarText, { fontSize: size / 2.2 }]}>
                        {data.agentName?.charAt(0).toUpperCase()}
                    </Text>
                </View>
                <View style={[
                    styles.podiumRankBadge,
                    { backgroundColor: rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32' }
                ]}>
                    <Text style={styles.podiumRankText}>{rank}</Text>
                </View>
            </View>
            <Text style={styles.podiumName} numberOfLines={1}>{data.agentName.split(' ')[0]}</Text>
            <View style={styles.podiumScoreBadge}>
                <Text style={styles.podiumScoreText}>{data.converted} conv.</Text>
            </View>
        </View>
    );

    if (loading && !refreshing) {
        return <BrandedLoading message="Gathering Elite Performance..." />;
    }

    const topThree = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Leaderboard</Text>
                        <Text style={styles.headerSubtitle}>KRUTANIC PERFORMANCE ELITE</Text>
                    </View>
                    <View style={styles.trophyIcon}>
                        <Ionicons name="trophy" size={28} color={COLORS.primary} />
                    </View>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} color={COLORS.primary} />
                    }
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Podium Area */}
                    {topThree.length > 0 && (
                        <View style={styles.podiumContainer}>
                            <View style={styles.podiumRow}>
                                {topThree[1] && <PodiumItem data={topThree[1]} rank={2} size={76} />}
                                {topThree[0] && <PodiumItem data={topThree[0]} rank={1} size={100} />}
                                {topThree[2] && <PodiumItem data={topThree[2]} rank={3} size={76} />}
                            </View>
                        </View>
                    )}

                    {/* Team Analytics */}
                    {performance && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Global Insights</Text>
                            <View style={styles.analyticsGrid}>
                                <AnalyticsCard title="Total Volume" value={performance.totalCalls} icon="call" color={COLORS.primary} />
                                <AnalyticsCard title="Pickups" value={performance.totalConnected} icon="checkmark-done" color={COLORS.success} />
                                <AnalyticsCard title="Closed" value={performance.totalConverted} icon="flash" color={COLORS.accent} />
                                <AnalyticsCard
                                    title="Efficiency"
                                    value={`${performance.totalConnected > 0 ? ((performance.totalConverted / performance.totalConnected) * 100).toFixed(1) : 0}%`}
                                    icon="pulse"
                                    color={COLORS.info}
                                />
                            </View>
                        </View>
                    )}

                    {/* Full Ranking List */}
                    <View style={styles.listSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Ranking Details</Text>
                            <View style={styles.agentCountBadge}>
                                <Text style={styles.agentCountText}>{leaderboard.length} TOP PERFORMERS</Text>
                            </View>
                        </View>

                        {leaderboard.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="stats-chart-outline" size={56} color={COLORS.textDim} opacity={0.2} />
                                <Text style={styles.emptyText}>Rankings will update based on real-time conversions.</Text>
                            </View>
                        ) : (
                            leaderboard.map((item, index) => (
                                <LeaderboardCard
                                    key={item._id || index}
                                    data={item}
                                    rank={index + 1}
                                />
                            ))
                        )}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.surface },
    container: { flex: 1 },
    scrollContent: {
        paddingBottom: 60,
        backgroundColor: COLORS.background
    },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },

    header: {
        backgroundColor: COLORS.surface,
        paddingTop: Platform.OS === 'android' ? 15 : 5,
        paddingBottom: 25,
        paddingHorizontal: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border + '50',
        zIndex: 10,
    },
    headerTitle: { ...TYPOGRAPHY.h1, color: COLORS.text, fontSize: 32 },
    headerSubtitle: { fontSize: 10, fontWeight: '800', color: COLORS.textDim, marginTop: 4, letterSpacing: 1.5 },
    trophyIcon: {
        width: 56,
        height: 56,
        borderRadius: 20,
        backgroundColor: COLORS.primary + '10',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.primary + '15',
    },

    podiumContainer: {
        paddingVertical: 40,
        backgroundColor: COLORS.surface,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border + '50',
        marginBottom: 10,
    },
    podiumRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    podiumItem: {
        alignItems: 'center',
        marginHorizontal: 12,
    },
    podiumFirst: {
        marginTop: -30,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 12,
    },
    podiumAvatar: {
        borderWidth: 4,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.medium,
    },
    podiumAvatarText: { fontWeight: '900', color: COLORS.text },
    crownContainer: {
        position: 'absolute',
        top: -32,
        alignSelf: 'center',
        zIndex: 20,
    },
    podiumRankBadge: {
        position: 'absolute',
        bottom: -6,
        alignSelf: 'center',
        width: 26,
        height: 26,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        ...SHADOWS.small,
    },
    podiumRankText: { color: '#fff', fontSize: 12, fontWeight: '900' },
    podiumName: {
        ...TYPOGRAPHY.body,
        fontWeight: '800',
        color: COLORS.text,
        width: 90,
        textAlign: 'center',
        fontSize: 15,
        marginBottom: 6
    },
    podiumScoreBadge: {
        backgroundColor: COLORS.primary + '10',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    podiumScoreText: { fontSize: 11, fontWeight: '700', color: COLORS.primary },

    section: { marginTop: 30, paddingHorizontal: SPACING.md },
    listSection: { marginTop: 35, paddingHorizontal: 0 },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: SPACING.md
    },
    sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, fontSize: 20, fontWeight: '800' },
    agentCountBadge: {
        backgroundColor: COLORS.secondary + '10',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    agentCountText: { fontSize: 9, fontWeight: '800', color: COLORS.secondary },

    analyticsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    analyticsCard: {
        backgroundColor: COLORS.surface,
        width: '48%',
        paddingVertical: 18,
        paddingHorizontal: 14,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        ...SHADOWS.medium,
        borderWidth: 1,
        borderColor: COLORS.border + '30',
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    analyticsInfo: { flex: 1 },
    analyticsLabel: { fontSize: 9, color: COLORS.textDim, textTransform: 'uppercase', fontWeight: '800', letterSpacing: 0.5 },
    analyticsValue: { fontSize: 18, fontWeight: '900', color: COLORS.text, marginTop: 2 },

    emptyContainer: { padding: 60, alignItems: 'center' },
    emptyText: { ...TYPOGRAPHY.body, color: COLORS.textDim, marginTop: 15, textAlign: 'center', lineHeight: 22 },
});

export default LeaderboardScreen;
