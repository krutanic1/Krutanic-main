import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
    TouchableOpacity,
    Platform,
    StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import teamService from '../services/teamService';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY } from '../utils/theme';

const { width } = Dimensions.get('window');

const PipelineScreen = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [timeframe, setTimeframe] = useState('day'); // 'day', 'week', 'month'

    const fetchStats = async (selectedTimeframe = timeframe) => {
        if (!user) {
            setLoading(false);
            setRefreshing(false);
            return;
        }

        try {
            // Even if user.id is email for some admins, the backend now handles it
            const data = await teamService.getPipelineStats(user.id, selectedTimeframe);
            setStats(data);
        } catch (error) {
            console.error('Pipeline Stats Error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (user && user.id) {
            fetchStats();
        }
    }, [timeframe, user]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchStats();
    };

    if (loading && !refreshing) {
        return (
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            </SafeAreaView>
        );
    }

    const stages = [
        { key: 'new', label: 'New Leads', icon: 'star', color: '#64748B' },
        { key: 'contacted', label: 'Contacted', icon: 'call', color: '#3B82F6' },
        { key: 'interested', label: 'Interested', icon: 'heart', color: '#10B981' },
        { key: 'demo_scheduled', label: 'Scheduled', icon: 'calendar', color: '#8B5CF6' },
        { key: 'converted', label: 'Converted', icon: 'trophy', color: '#F59E0B' },
        { key: 'lost', label: 'Lost', icon: 'close-circle', color: '#EF4444' }
    ];

    const statsValues = stats ? Object.values(stats).filter(v => typeof v === 'number') : [];
    const maxCount = statsValues.length > 0 ? Math.max(...statsValues, 1) : 1;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
            <ScrollView
                style={styles.container}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} color={COLORS.primary} />}
            >

                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.headerTitle}>Sales Pipeline</Text>
                            <Text style={styles.headerSub}>Real-time funnel analytics</Text>
                        </View>
                        <TouchableOpacity style={styles.filterBtn}>
                            <Ionicons name="options-outline" size={20} color={COLORS.text} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.timeframeSelector}>
                        {['day', 'week', 'month'].map((tf) => (
                            <TouchableOpacity
                                key={tf}
                                onPress={() => setTimeframe(tf)}
                                style={[
                                    styles.timeframeBtn,
                                    timeframe === tf && styles.timeframeBtnActive
                                ]}
                            >
                                <Text style={[
                                    styles.timeframeText,
                                    timeframe === tf && styles.timeframeTextActive
                                ]}>
                                    {tf.charAt(0).toUpperCase() + tf.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.funnelContainer}>
                    {stages.map((stage, index) => {
                        const count = stats?.[stage.key] || 0;
                        const barWidth = Math.max((count / maxCount) * 100, 4);

                        return (
                            <View key={stage.key} style={styles.stageRow}>
                                <View style={styles.stageInfo}>
                                    <View style={[styles.iconBox, { backgroundColor: stage.color + '15' }]}>
                                        <Ionicons name={stage.icon} size={16} color={stage.color} />
                                    </View>
                                    <Text style={styles.stageLabel}>{stage.label}</Text>
                                    <Text style={styles.stageCount}>{count}</Text>
                                </View>

                                <View style={styles.barContainer}>
                                    <View
                                        style={[
                                            styles.bar,
                                            {
                                                width: `${barWidth}%`,
                                                backgroundColor: stage.color,
                                            }
                                        ]}
                                    />
                                </View>

                                {index < stages.length - 1 && (
                                    <View style={styles.connector}>
                                        <View style={styles.connectorLine} />
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>

                <View style={styles.insightsCard}>
                    <View style={styles.insightsHeader}>
                        <Ionicons name="analytics" size={20} color="#fff" />
                        <Text style={styles.insightTitle}>Pipeline Insights</Text>
                    </View>

                    <View style={styles.insightGrid}>
                        <View style={styles.insightBox}>
                            <Text style={styles.insightLabel}>Active Volume</Text>
                            <Text style={styles.insightValue}>
                                {(stats?.new || 0) + (stats?.contacted || 0) + (stats?.interested || 0) + (stats?.demo_scheduled || 0)}
                            </Text>
                        </View>
                        <View style={styles.insightDivider} />
                        <View style={styles.insightBox}>
                            <Text style={styles.insightLabel}>Conv. Efficiency</Text>
                            <Text style={[styles.insightValue, { color: COLORS.primary }]}>
                                {stats?.contacted > 0
                                    ? ((stats.converted / stats.contacted) * 100).toFixed(1)
                                    : '0.0'}%
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.surface },
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        paddingHorizontal: SPACING.lg,
        paddingTop: 15,
        paddingBottom: 25,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border + '50',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: { ...TYPOGRAPHY.h2, color: COLORS.text, fontWeight: '900' },
    headerSub: { ...TYPOGRAPHY.body, color: COLORS.textDim, fontWeight: '600' },
    filterBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },

    timeframeSelector: {
        flexDirection: 'row',
        backgroundColor: COLORS.background,
        borderRadius: 18,
        padding: 4,
    },
    timeframeBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 14,
    },
    timeframeBtnActive: {
        backgroundColor: COLORS.surface,
        ...SHADOWS.small,
    },
    timeframeText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.textDim,
    },
    timeframeTextActive: {
        color: COLORS.primary,
    },

    funnelContainer: {
        padding: 24,
        backgroundColor: COLORS.surface,
        marginTop: 24,
        borderRadius: 32,
        marginHorizontal: SPACING.md,
        ...SHADOWS.small,
    },
    stageRow: {
        width: '100%',
    },
    stageInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    stageLabel: { flex: 1, ...TYPOGRAPHY.body, color: COLORS.text, fontWeight: '700' },
    stageCount: { ...TYPOGRAPHY.body, fontWeight: '900', color: COLORS.text },

    barContainer: {
        width: '100%',
        height: 8,
        backgroundColor: COLORS.background,
        borderRadius: 4,
        overflow: 'hidden',
    },
    bar: {
        height: '100%',
        borderRadius: 4,
    },
    connector: {
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    connectorLine: {
        width: 2,
        height: 12,
        backgroundColor: COLORS.border,
        borderRadius: 1,
    },

    insightsCard: {
        margin: SPACING.md,
        marginTop: 24,
        padding: 24,
        backgroundColor: COLORS.text, // Dark theme for contrast
        borderRadius: 32,
        ...SHADOWS.medium,
    },
    insightsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    insightTitle: { fontSize: 18, fontWeight: '800', color: '#fff', marginLeft: 10 },

    insightGrid: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        padding: 20,
    },
    insightBox: { flex: 1, alignItems: 'center' },
    insightDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.1)' },
    insightLabel: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
    insightValue: { fontSize: 22, fontWeight: '900', color: '#fff' },
});

export default PipelineScreen;
