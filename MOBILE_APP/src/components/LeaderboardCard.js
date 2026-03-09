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
            case 1: return { bg: '#FFF5D1', text: '#B8860B', icon: 'medal', borderColor: '#FFD700' };
            case 2: return { bg: '#F2F2F2', text: '#7A7A7A', icon: 'medal-outline', borderColor: '#C0C0C0' };
            case 3: return { bg: '#FFECDF', text: '#8B4513', icon: 'medal-outline', borderColor: '#CD7F32' };
            default: return { bg: COLORS.background, text: COLORS.textDim, icon: null, borderColor: 'transparent' };
        }
    };

    const rankStyle = getRankStyle(rank);

    return (
        <View style={styles.card}>
            {/* Left: Rank & Avatar */}
            <View style={styles.leftSection}>
                <View style={[styles.rankBadge, { backgroundColor: rankStyle.bg, borderColor: rankStyle.borderColor }]}>
                    {rankStyle.icon ? (
                        <Ionicons name={rankStyle.icon} size={16} color={rankStyle.text} />
                    ) : (
                        <Text style={[styles.rankNumber, { color: rankStyle.text }]}>{rank}</Text>
                    )}
                </View>
                <View style={[styles.avatar, { backgroundColor: rank <= 3 ? rankStyle.text : COLORS.secondary + '20' }]}>
                    <Text style={[styles.avatarText, { color: rank <= 3 ? '#fff' : COLORS.secondary }]}>
                        {data.agentName?.charAt(0).toUpperCase()}
                    </Text>
                </View>
            </View>

            {/* Middle: Name & Metrics */}
            <View style={styles.midSection}>
                <Text style={styles.agentName} numberOfLines={1}>{data.agentName || 'Anonymous'}</Text>

                <View style={styles.metricsContainer}>
                    <View style={styles.metric}>
                        <Text style={styles.metricLabel}>CALLS</Text>
                        <Text style={styles.metricValue}>{data.calls}</Text>
                    </View>
                    <View style={styles.metric}>
                        <Text style={styles.metricLabel}>CONN</Text>
                        <Text style={styles.metricValue}>{data.connected}</Text>
                    </View>
                    <View style={styles.metric}>
                        <Text style={styles.metricLabel}>CONV</Text>
                        <Text style={[styles.metricValue, { color: COLORS.success }]}>{data.converted}</Text>
                    </View>
                </View>
            </View>

            {/* Right: Performance Badge */}
            <View style={styles.rightSection}>
                <View style={styles.efficiencyPill}>
                    <Text style={styles.efficiencyValue}>{conversionRate}%</Text>
                    <Text style={styles.efficiencyLabel}>GROWTH</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        flexDirection: 'row',
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginBottom: 16,
        marginHorizontal: SPACING.md,
        borderRadius: 28,
        alignItems: 'center',
        ...SHADOWS.medium,
        borderWidth: 1,
        borderColor: COLORS.border + '30',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    rankBadge: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        marginRight: 10,
    },
    rankNumber: {
        fontSize: 16,
        fontWeight: '900',
    },
    avatar: {
        width: 46,
        height: 46,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        ...SHADOWS.small,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '800',
    },
    midSection: {
        flex: 1,
        justifyContent: 'center',
    },
    agentName: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    metricsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 10,
    },
    metric: {
        alignItems: 'flex-start',
    },
    metricLabel: {
        fontSize: 9,
        fontWeight: '800',
        color: COLORS.textDim,
        letterSpacing: 0.5,
    },
    metricValue: {
        fontSize: 15,
        fontWeight: '900',
        color: COLORS.text,
        marginTop: 2,
    },
    rightSection: {
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftWidth: 1,
        borderLeftColor: COLORS.border + '50',
        paddingLeft: 12,
    },
    efficiencyPill: {
        backgroundColor: COLORS.primary + '10',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 18,
        alignItems: 'center',
        minWidth: 70,
    },
    efficiencyValue: {
        fontSize: 14,
        fontWeight: '900',
        color: COLORS.primary,
    },
    efficiencyLabel: {
        fontSize: 8,
        fontWeight: '800',
        color: COLORS.primary,
        marginTop: 1,
        opacity: 0.7,
    },
});

export default LeaderboardCard;
