import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import leadService from '../services/leadService';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY } from '../utils/theme';

const CallTimeline = ({ leadId, refreshTrigger }) => {
    const [calls, setCalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playingId, setPlayingId] = useState(null);
    const [sound, setSound] = useState(null);

    const fetchHistory = useCallback(async () => {
        try {
            const data = await leadService.getCallHistory(leadId);
            setCalls(data.calls || []);
        } catch (error) {
            console.error('[TIMELINE] Fetch failed:', error);
        } finally {
            setLoading(false);
        }
    }, [leadId]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory, refreshTrigger]);

    const playSound = async (uri, id) => {
        try {
            if (sound) {
                await sound.unloadAsync();
            }

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri },
                { shouldPlay: true }
            );
            setSound(newSound);
            setPlayingId(id);

            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    setPlayingId(null);
                }
            });
        } catch (error) {
            console.error('[AUDIO] Playback error:', error);
        }
    };

    const stopSound = async () => {
        if (sound) {
            await sound.stopAsync();
            setPlayingId(null);
        }
    };

    const getOutcomeColor = (outcome) => {
        switch (outcome?.toLowerCase()) {
            case 'interested': return COLORS.success;
            case 'callback_requested': return COLORS.info;
            case 'no_answer': return COLORS.accent;
            case 'not_interested': return COLORS.error;
            case 'converted': return COLORS.accent;
            default: return COLORS.textDim;
        }
    };

    const renderCallItem = (item, index) => (
        <View style={styles.timelineItem} key={item._id || index}>
            <View style={styles.markerArea}>
                <View style={[styles.dot, { backgroundColor: getOutcomeColor(item.callOutcome) }]} />
                {index !== calls.length - 1 && <View style={styles.line} />}
            </View>

            <View style={styles.contentCard}>
                <View style={styles.cardHeader}>
                    <View style={[styles.badge, { backgroundColor: getOutcomeColor(item.callOutcome) + '15' }]}>
                        <Text style={[styles.badgeText, { color: getOutcomeColor(item.callOutcome) }]}>
                            {item.callOutcome?.replace(/_/g, ' ')}
                        </Text>
                    </View>
                    <Text style={styles.dateText}>
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                    </Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Ionicons name="time-outline" size={12} color={COLORS.textLight} />
                        <Text style={styles.statText}>
                            {item.duration >= 60
                                ? `${Math.floor(item.duration / 60)}m ${item.duration % 60}s`
                                : `${item.duration}s`}
                        </Text>
                    </View>
                    <View style={styles.stat}>
                        <Ionicons name="person-outline" size={12} color={COLORS.textLight} />
                        <Text style={styles.statText}>{item.specialistName}</Text>
                    </View>
                </View>

                {item.summary && (
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryText}>{item.summary}</Text>
                    </View>
                )}

                {item.recordingUrl && (
                    <TouchableOpacity
                        style={[styles.playbackBtn, playingId === item._id && styles.playbackBtnActive]}
                        onPress={() => playingId === item._id ? stopSound() : playSound(item.recordingUrl, item._id)}
                    >
                        <View style={[styles.playIconContainer, { backgroundColor: playingId === item._id ? '#fff' : COLORS.primary + '15' }]}>
                            <Ionicons
                                name={playingId === item._id ? "pause" : "play"}
                                size={14}
                                color={playingId === item._id ? COLORS.primary : COLORS.primary}
                            />
                        </View>
                        <Text style={[styles.playbackText, playingId === item._id && styles.playbackTextActive]}>
                            {playingId === item._id ? "Playing Audio..." : "Listen Recording"}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 32 }} />;
    }

    if (calls.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyIconCircle}>
                    <Ionicons name="calendar-outline" size={32} color={COLORS.textDim} opacity={0.3} />
                </View>
                <Text style={styles.emptyText}>No interaction history found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {calls.map((item, index) => renderCallItem(item, index))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { paddingVertical: SPACING.sm },
    timelineItem: { flexDirection: 'row' },
    markerArea: { width: 32, alignItems: 'center' },
    dot: { width: 10, height: 10, borderRadius: 5, marginTop: 22, zIndex: 1, borderWidth: 2, borderColor: '#fff' },
    line: { width: 2, flex: 1, backgroundColor: COLORS.border, position: 'absolute', top: 32, bottom: 0 },

    contentCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        marginLeft: 8,
        ...SHADOWS.small,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
    badgeText: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
    dateText: { ...TYPOGRAPHY.tiny, color: COLORS.textDim },

    statsRow: { flexDirection: 'row', marginBottom: 12 },
    stat: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
    statText: { fontSize: 11, color: COLORS.textLight, marginLeft: 4, fontWeight: '500' },

    summaryContainer: { backgroundColor: COLORS.background, padding: 10, borderRadius: 12, marginBottom: 12 },
    summaryText: { ...TYPOGRAPHY.caption, color: COLORS.text, lineHeight: 18, fontStyle: 'italic' },

    emptyContainer: { padding: 48, alignItems: 'center' },
    emptyIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    emptyText: { ...TYPOGRAPHY.body, color: COLORS.textDim },

    playbackBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        padding: 8,
        borderRadius: 12,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    playbackBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    playIconContainer: { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    playbackText: { ...TYPOGRAPHY.tiny, fontWeight: '700', color: COLORS.primary },
    playbackTextActive: { color: '#fff' },
});

export default CallTimeline;
