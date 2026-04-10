import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY } from '../utils/theme';

const LeaderboardCard = ({ data, rank }) => {
    const conversionRate = data.connected > 0
        ? ((data.converted / data.connected) * 100).toFixed(1)
        : '0.0';

    const getRankStyle = (rank) => {
        switch (rank) {
            case 1: return { bg: '#FFF5D1', text: '#B8860B', icon: 'medal', borderColor: '#FFD700', shadow: '#FFD70040' };
            case 2: return { bg: '#F2F2F2', text: '#7A7A7A', icon: 'medal-outline', borderColor: '#C0C0C0', shadow: '#00000010' };
            case 3: return { bg: '#FFECDF', text: '#8B4513', icon: 'medal-outline', borderColor: '#CD7F32', shadow: '#CD7F3220' };
            default: return { bg: COLORS.background, text: COLORS.textDim, icon: null, borderColor: 'transparent', shadow: 'transparent' };
        }
    };

    const rankStyle = getRankStyle(rank);

    const MetricItem = ({ icon, label, value, color = COLORS.text }) => (
        <View style={styles.metricItem}>
            <View style={styles.metricHeader}>
                <Ionicons name={icon} size={10} color={COLORS.textDim} style={styles.metricIcon} />
                <Text style={styles.metricLabel}>{label}</Text>
            </View>
            <Text style={[styles.metricValue, { color }]}>{value}</Text>
        </View>
    );

    return (
        <View style={[styles.card, rank <= 3 && { borderColor: rankStyle.borderColor + '40', shadowColor: rankStyle.shadow }]}>
            {/* Top Right: Performance Badge (Positioned Absolutely) */}
            <View style={styles.efficiencyPill}>
                <Text style={styles.efficiencyValue}>{conversionRate}%</Text>
                <Text style={styles.efficiencyLabel}>GROWTH</Text>
            </View>

            {/* Left: Rank & Avatar */}
            <View style={styles.leftSection}>
                <View style={[styles.rankBadge, { backgroundColor: rankStyle.bg, borderColor: rankStyle.borderColor }]}>
                    {rankStyle.icon ? (
                        <Ionicons name={rankStyle.icon} size={16} color={rankStyle.text} />
                    ) : (
                        <Text style={[styles.rankNumber, { color: rankStyle.text }]}>{rank}</Text>
                    )}
                </View>
                <View style={[styles.avatar, { backgroundColor: rank <= 3 ? rankStyle.text : COLORS.secondary + '15' }]}>
                    <Text style={[styles.avatarText, { color: rank <= 3 ? '#fff' : COLORS.secondary }]}>
                        {data.agentName?.charAt(0).toUpperCase()}
                    </Text>
                </View>
            </View>

            {/* Middle: Name & Metrics */}
            <View style={styles.midSection}>
                <Text style={styles.agentName} numberOfLines={1}>{data.agentName || 'Anonymous'}</Text>
                
                <View style={styles.metricsWrapper}>
                    <MetricItem icon="call-outline" label="CALLS" value={data.calls} />
                    <MetricItem icon="git-network-outline" label="CONN" value={data.connected} />
                    <MetricItem icon="trophy-outline" label="CONV" value={data.converted} color={COLORS.success} />
                    <MetricItem icon="time-outline" label="TALK" value={`${Math.floor((data.totalDuration || 0) / 60)}m`} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        flexDirection: 'row',
        paddingVertical: 18,
        paddingHorizontal: 16,
        marginBottom: 12,
        marginHorizontal: SPACING.md,
        borderRadius: 24,
        alignItems: 'center',
        ...SHADOWS.medium,
        borderWidth: 1,
        borderColor: COLORS.border + '20',
        position: 'relative', // For absolute positioning of the pill
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 14,
    },
    rankBadge: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        marginRight: 8,
    },
    rankNumber: {
        fontSize: 14,
        fontWeight: '900',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fff',
    },
    avatarText: {
        fontSize: 16,
        fontWeight: '900',
    },
    midSection: {
        flex: 1,
    },
    agentName: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: 10,
        letterSpacing: -0.3,
        paddingRight: 60, // Ensure name doesn't hit the pill
    },
    metricsWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 8,
    },
    metricItem: {
        alignItems: 'center',
        minWidth: 38,
    },
    metricHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    metricIcon: {
        marginRight: 2,
        opacity: 0.6,
    },
    metricLabel: {
        fontSize: 7.5,
        fontWeight: '800',
        color: COLORS.textDim,
        letterSpacing: 0.1,
    },
    metricValue: {
        fontSize: 13,
        fontWeight: '900',
        color: COLORS.text,
    },
    efficiencyPill: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: COLORS.primary + '08',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.primary + '10',
        minWidth: 50,
        zIndex: 10,
    },
    efficiencyValue: {
        fontSize: 11,
        fontWeight: '900',
        color: COLORS.primary,
    },
    efficiencyLabel: {
        fontSize: 6,
        fontWeight: '800',
        color: COLORS.primary,
        marginTop: 0,
        opacity: 0.7,
        letterSpacing: 0.2,
    },
});

export default LeaderboardCard;
