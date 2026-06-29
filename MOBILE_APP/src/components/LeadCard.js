import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { startCallTracking } from '../utils/callTracker';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY } from '../utils/theme';
import { Audio } from 'expo-av';
import { getCallUrl, getWhatsAppUrl } from '../utils/phoneUtils';
import { formatSystemDate, formatUserDate } from '../utils/dateUtils';

const LeadCard = ({ lead, onViewDetails }) => {
    const handleCall = async () => {
        await startCallTracking(lead._id, lead.full_name);
        Linking.openURL(getCallUrl(lead.phone_number));
    };

    const handleWhatsApp = () => {
        Linking.openURL(getWhatsAppUrl(lead.phone_number));
    };

    const [sound, setSound] = React.useState(null);
    const [isPlaying, setIsPlaying] = React.useState(false);

    React.useEffect(() => {
        return sound ? () => { sound.unloadAsync(); } : undefined;
    }, [sound]);

    const handlePlayPause = async () => {
        try {
            if (sound) {
                if (isPlaying) {
                    await sound.pauseAsync();
                    setIsPlaying(false);
                } else {
                    await sound.playAsync();
                    setIsPlaying(true);
                }
                return;
            }

            // Create new sound
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: lead.last_recording_url },
                { shouldPlay: true }
            );
            setSound(newSound);
            setIsPlaying(true);

            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    setIsPlaying(false);
                    newSound.setPositionAsync(0);
                }
            });
        } catch (error) {
            console.error('[LEAD_CARD] Playback error:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Fresh Lead': return COLORS.textDim;
            case 'Attempting Contact': return COLORS.warning;
            case 'First Call Connected': return COLORS.info;
            case 'Demo Conducted': return COLORS.secondary;
            case 'Closed Won': return COLORS.success;
            case 'Closed Lost': return COLORS.error;
            default: return COLORS.textDim;
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.leadInfo}>
                    <View style={[styles.avatar, { backgroundColor: COLORS.primary + '15' }]}>
                        <Text style={styles.avatarText}>
                            {lead.full_name?.charAt(0).toUpperCase() || '?'}
                        </Text>
                    </View>
                    <View style={styles.nameContainer}>
                        <Text style={styles.name} numberOfLines={1}>{lead.full_name}</Text>
                        <Text style={styles.domain}>{lead.opted_domain || 'General'}</Text>
                    </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(lead.stage) + '15' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(lead.stage) }]}>
                        {(lead.stage || 'Fresh Lead')}
                    </Text>
                </View>
            </View>

            <View style={styles.details}>
                <View style={styles.detailItem}>
                    <View style={styles.detailIcon}>
                        <Ionicons name="call-outline" size={14} color={COLORS.textDim} />
                    </View>
                    <Text style={styles.detailText}>{lead.phone_number}</Text>
                </View>
                {lead.company_name && (
                    <View style={styles.detailItem}>
                        <View style={styles.detailIcon}>
                            <Ionicons name="business-outline" size={14} color={COLORS.textDim} />
                        </View>
                        <Text style={styles.detailText}>{lead.company_name}</Text>
                    </View>
                )}
                {lead.last_contacted_at && (
                    <View style={styles.detailItem}>
                        <View style={styles.detailIcon}>
                            <Ionicons name="time-outline" size={14} color={COLORS.textDim} />
                        </View>
                        <Text style={styles.detailText}>
                            Last: {formatSystemDate(lead.last_contacted_at)}
                        </Text>
                    </View>
                )}
                {lead.next_followup_at && (
                    <View style={styles.detailItem}>
                        <View style={styles.detailIcon}>
                            <Ionicons name="calendar-outline" size={14} color={COLORS.accent} />
                        </View>
                        <Text style={[styles.detailText, { color: COLORS.accent, fontWeight: '700' }]}>
                            Next: {formatUserDate(lead.next_followup_at)}
                        </Text>
                    </View>
                )}
            </View>

            {lead.last_note && (
                <View style={styles.lastNoteContainer}>
                    <Text style={styles.lastNoteLabel}>LATEST SUMMARY</Text>
                    <Text style={styles.lastNoteText} numberOfLines={2}>{lead.last_note}</Text>
                </View>
            )}

            <View style={styles.actions}>
                <TouchableOpacity onPress={handleCall} style={[styles.actionBtn, { borderColor: COLORS.success + '40' }]}>
                    <Ionicons name="call" size={18} color={COLORS.success} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleWhatsApp} style={[styles.actionBtn, { borderColor: '#25D36640' }]}>
                    <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
                </TouchableOpacity>
                {lead.last_recording_url && (
                    <TouchableOpacity 
                        onPress={handlePlayPause} 
                        style={[styles.actionBtn, isPlaying && styles.actionBtnActive, { borderColor: COLORS.primary + '40' }]}
                    >
                        <Ionicons name={isPlaying ? "pause" : "play"} size={18} color={isPlaying ? "#fff" : COLORS.primary} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => onViewDetails(lead._id)} style={styles.viewDetailsBtn}>
                    <Text style={styles.viewDetailsText}>View Details</Text>
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
        marginBottom: SPACING.md,
    },
    leadInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
    nameContainer: { flex: 1 },
    name: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.text },
    domain: { ...TYPOGRAPHY.tiny, color: COLORS.primary, fontWeight: '600' },

    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        marginLeft: 8,
    },
    statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },

    details: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: SPACING.md,
        backgroundColor: COLORS.background,
        padding: 10,
        borderRadius: 16,
    },
    detailItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16, marginVertical: 2 },
    detailIcon: { marginRight: 6 },
    detailText: { ...TYPOGRAPHY.caption, color: COLORS.textLight },

    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    actionBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        marginRight: 12,
    },
    actionBtnActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    viewDetailsBtn: {
        flex: 1,
        height: 44,
        backgroundColor: COLORS.secondary,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.small,
    },
    viewDetailsText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
    },
    lastNoteContainer: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#F8FAFC',
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.primary,
    },
    lastNoteLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: COLORS.primary,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    lastNoteText: {
        fontSize: 13,
        color: '#475569',
        lineHeight: 18,
    }
});

export default React.memo(LeadCard);
