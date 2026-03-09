import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Platform,
    StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { getDialerSession, stopDialerSession, dialLead, getNextLead } from '../utils/autoDialer';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY } from '../utils/theme';

const AutoDialerScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            if (route.params?.refresh) {
                handleAutoProgress();
            } else {
                loadSession();
            }
        }, [route.params?.refresh])
    );

    const handleAutoProgress = async () => {
        const next = await getNextLead();
        if (next) {
            loadSession();
            navigation.setParams({ refresh: false });
        } else {
            Alert.alert('Success!', 'Dialer queue completed.', [
                { text: 'Finish', onPress: () => navigation.goBack() }
            ]);
        }
    };

    const loadSession = async () => {
        const activeSession = await getDialerSession();
        if (!activeSession) {
            navigation.goBack();
            return;
        }
        setSession(activeSession);
        setLoading(false);
    };

    const handleStartCall = async () => {
        const lead = session.queue[session.currentIndex];
        dialLead(lead.phone_number);
        navigation.navigate('LeadDetails', { leadId: lead._id, autoDialerMode: true });
    };

    const handleSkip = async () => {
        const next = await getNextLead();
        if (next) {
            loadSession();
        } else {
            Alert.alert('Queue End', 'No more leads in the queue.', [
                { text: 'Done', onPress: () => navigation.goBack() }
            ]);
        }
    };

    const handleStop = async () => {
        await stopDialerSession();
        navigation.goBack();
    };

    if (loading) return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
    );

    const currentLead = session.queue[session.currentIndex];
    const progress = ((session.currentIndex + 1) / session.queue.length) * 100;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" translucent={true} />
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Active Session</Text>
                    <TouchableOpacity onPress={handleStop} style={styles.stopIconBtn}>
                        <Ionicons name="power" size={20} color={COLORS.error} />
                    </TouchableOpacity>
                </View>

                <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Daily Progress</Text>
                        <Text style={styles.progressValue}>{session.currentIndex + 1} / {session.queue.length}</Text>
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${progress}%` }]} />
                    </View>
                </View>

                <View style={styles.leadSection}>
                    <View style={styles.leadCard}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{currentLead.full_name?.charAt(0).toUpperCase()}</Text>
                            </View>
                            <View style={styles.activePulse} />
                        </View>

                        <Text style={styles.leadName}>{currentLead.full_name}</Text>
                        <Text style={styles.leadPhone}>{currentLead.phone_number}</Text>

                        <View style={styles.tagContainer}>
                            <View style={styles.tag}>
                                <Ionicons name="school-outline" size={12} color={COLORS.primary} />
                                <Text style={styles.tagText}>{currentLead.opted_domain || 'Sales'}</Text>
                            </View>
                            {currentLead.last_outcome && (
                                <View style={[styles.tag, { backgroundColor: COLORS.background }]}>
                                    <Text style={[styles.tagText, { color: COLORS.textDim }]}>Last: {currentLead.last_outcome}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                <View style={styles.footer}>
                    <View style={styles.secondaryActions}>
                        <TouchableOpacity onPress={handleStop} style={styles.actionCircleBtn}>
                            <Ionicons name="close" size={24} color={COLORS.error} />
                            <Text style={styles.actionLabel}>End</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleSkip} style={styles.actionCircleBtn}>
                            <Ionicons name="play-skip-forward" size={24} color={COLORS.textDim} />
                            <Text style={styles.actionLabel}>Skip</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={handleStartCall} style={styles.mainDialBtn}>
                        <View style={styles.dialIconCircle}>
                            <Ionicons name="call" size={32} color="#fff" />
                        </View>
                        <Text style={styles.dialBtnText}>Dial Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.surface },
    container: { flex: 1, backgroundColor: COLORS.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    header: {
        backgroundColor: COLORS.surface,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingBottom: 16,
        paddingTop: Platform.OS === 'android' ? 10 : 0,
    },
    headerTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, fontWeight: '800' },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    stopIconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.error + '10', justifyContent: 'center', alignItems: 'center' },

    progressContainer: { padding: SPACING.md, backgroundColor: COLORS.surface, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, ...SHADOWS.small },
    progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    progressLabel: { ...TYPOGRAPHY.tiny, color: COLORS.textDim, textTransform: 'uppercase', fontWeight: '700' },
    progressValue: { ...TYPOGRAPHY.body, fontWeight: '800', color: COLORS.primary },
    progressBar: { width: '100%', height: 6, backgroundColor: COLORS.background, borderRadius: 3, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },

    leadSection: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: SPACING.lg },
    leadCard: {
        width: '100%',
        backgroundColor: COLORS.surface,
        borderRadius: 40,
        padding: 32,
        alignItems: 'center',
        ...SHADOWS.medium,
    },
    avatarContainer: { position: 'relative', marginBottom: 20 },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 35,
        backgroundColor: COLORS.primary + '10',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.primary + '20',
    },
    avatarText: { fontSize: 40, fontWeight: '800', color: COLORS.primary },
    activePulse: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.success,
        borderWidth: 4,
        borderColor: COLORS.surface,
    },
    leadName: { ...TYPOGRAPHY.h2, color: COLORS.text, textAlign: 'center' },
    leadPhone: { ...TYPOGRAPHY.body, color: COLORS.textDim, fontWeight: '600', marginTop: 4 },

    tagContainer: { flexDirection: 'row', marginTop: 20 },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary + '08',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginHorizontal: 4,
    },
    tagText: { ...TYPOGRAPHY.tiny, color: COLORS.primary, fontWeight: '700', marginLeft: 4 },

    footer: {
        padding: SPACING.xl,
        paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.xl,
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        ...SHADOWS.medium,
    },
    secondaryActions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, paddingHorizontal: 20 },
    actionCircleBtn: { alignItems: 'center' },
    actionLabel: { ...TYPOGRAPHY.tiny, color: COLORS.textDim, marginTop: 4, fontWeight: '700' },

    mainDialBtn: {
        backgroundColor: COLORS.success,
        height: 80,
        borderRadius: 40,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        ...SHADOWS.medium,
    },
    dialIconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialBtnText: { flex: 1, textAlign: 'center', color: '#fff', fontSize: 22, fontWeight: '800', marginRight: 40 },
});

export default AutoDialerScreen;
