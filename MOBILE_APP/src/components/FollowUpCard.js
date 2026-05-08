import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY } from '../utils/theme';
import { formatUserDate } from '../utils/dateUtils';
import { getCallUrl } from '../utils/phoneUtils';

const FollowUpCard = ({ followUp, onOpenLead }) => {
    const lead = followUp.leadId;
    const date = new Date(followUp.followUpDate);
    const isToday = date.toDateString() === new Date().toDateString();

    const handleCall = () => {
        Linking.openURL(getCallUrl(lead.phone_number));
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.leadInfo}>
                    <Text style={styles.name} numberOfLines={1}>{lead.full_name}</Text>
                    <Text style={styles.domain}>{lead.opted_domain || 'General'}</Text>
                </View>
                <View style={[styles.timeBadge, isToday ? styles.todayBadge : styles.upcomingBadge]}>
                    <Ionicons
                        name={isToday ? "time" : "calendar"}
                        size={12}
                        color={isToday ? COLORS.primary : COLORS.textDim}
                    />
                    <Text style={[styles.timeText, isToday && styles.todayText]}>
                        {formatUserDate(followUp.followUpDate)}
                    </Text>
                </View>
            </View>

            {followUp.summary && (
                <View style={styles.noteContainer}>
                    <Ionicons name="chatbubble-ellipses-outline" size={14} color={COLORS.textDim} />
                    <Text style={styles.noteText} numberOfLines={2}>{followUp.summary}</Text>
                </View>
            )}

            <View style={styles.actions}>
                <TouchableOpacity onPress={handleCall} style={styles.callNowBtn}>
                    <Ionicons name="call" size={18} color="#fff" />
                    <Text style={styles.callNowText}>Call Now</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onOpenLead(lead._id)} style={styles.viewLeadBtn}>
                    <Text style={styles.viewLeadText}>View Details</Text>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: 24,
        padding: SPACING.md,
        marginBottom: 16,
        marginHorizontal: SPACING.md,
        ...SHADOWS.small,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    leadInfo: { flex: 1, marginRight: 12 },
    name: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.text },
    domain: { ...TYPOGRAPHY.tiny, color: COLORS.primary, fontWeight: '600', marginTop: 2 },

    timeBadge: {
        alignItems: 'flex-end',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        minWidth: 90,
    },
    todayBadge: { backgroundColor: COLORS.primary + '10', borderColor: COLORS.primary + '30', borderWidth: 1 },
    upcomingBadge: { backgroundColor: COLORS.background, borderColor: COLORS.border, borderWidth: 1 },

    timeText: { fontSize: 10, color: COLORS.textDim, fontWeight: '800', textTransform: 'uppercase', marginTop: 4 },
    todayText: { color: COLORS.primary },
    hourText: { ...TYPOGRAPHY.body, color: COLORS.text, fontWeight: '700', marginTop: 2 },

    noteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        backgroundColor: COLORS.background,
        padding: 12,
        borderRadius: 14,
    },
    noteText: { ...TYPOGRAPHY.caption, color: COLORS.textLight, marginLeft: 8, fontStyle: 'italic', lineHeight: 18 },

    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: SPACING.md,
        paddingTop: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    callNowBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.success,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 14,
        ...SHADOWS.small,
    },
    callNowText: { color: '#fff', fontSize: 14, fontWeight: '700', marginLeft: 8 },
    viewLeadBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingLeft: 12,
    },
    viewLeadText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '700', marginRight: 4 },
});

export default FollowUpCard;
