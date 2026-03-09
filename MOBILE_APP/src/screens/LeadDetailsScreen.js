import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Linking,
    AppState,
    Alert,
    StatusBar
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import leadService from '../services/leadService';
import { useAuth } from '../context/AuthContext';
import CallLogModal from '../components/CallLogModal';
import CallTimeline from '../components/CallTimeline';
import { endCallTracking, startCallTracking } from '../utils/callTracker';
import { requestNotificationPermissions, scheduleFollowUpNotification } from '../services/notificationService';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY } from '../utils/theme';

const LeadDetailsScreen = ({ route, navigation }) => {
    const { leadId, autoDialerMode } = route.params;
    const { user } = useAuth();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshTimeline, setRefreshTimeline] = useState(0);

    // Call Log State
    const [callModalVisible, setCallModalVisible] = useState(false);
    const [activeCallData, setActiveCallData] = useState(null);

    const fetchLeadDetails = async () => {
        try {
            const data = await leadService.getLeadDetails(leadId);
            setLead(data);
        } catch (error) {
            console.error('[DETAILS] Fetch failed:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeadDetails();
        requestNotificationPermissions();
    }, [leadId]);

    useFocusEffect(
        useCallback(() => {
            const subscription = AppState.addEventListener('change', async (nextAppState) => {
                if (nextAppState === 'active') {
                    const callData = await endCallTracking();
                    if (callData) {
                        setActiveCallData(callData);
                        setCallModalVisible(true);
                    }
                }
            });

            return () => {
                subscription.remove();
            };
        }, [])
    );

    const handleCall = async () => {
        await startCallTracking(lead._id, lead.full_name);
        Linking.openURL(`tel:+91${lead.phone_number}`);
    };

    const handleSaveCallLog = async (logData) => {
        try {
            const payload = {
                leadId: activeCallData.leadId,
                specialistId: user.id,
                specialistName: user.name,
                callOutcome: logData.outcome,
                summary: logData.summary,
                remark: logData.remark,
                duration: logData.durationSec,
                status: logData.status,
                followUpDate: logData.followUpDate
            };
            const logResponse = await leadService.logCall(payload);

            if (logData.outcome === 'callback_requested' && logData.followUpDate) {
                await scheduleFollowUpNotification(lead.full_name, logData.followUpDate);
            }

            setCallModalVisible(false);
            setActiveCallData(null);

            if (autoDialerMode) {
                Alert.alert('Success', 'Call log saved. Returning to Auto Dialer...', [
                    { text: 'OK', onPress: () => navigation.navigate('AutoDialer', { refresh: true }) }
                ]);
            } else {
                fetchLeadDetails();
                setRefreshTimeline(prev => prev + 1);
                Alert.alert('Success', 'Call log saved successfully');
            }
        } catch (error) {
            Alert.alert('Error', error || 'Failed to save call log');
            throw error;
        }
    };

    const InfoItem = ({ label, value, icon, color = COLORS.primary }) => (
        <View style={styles.infoItem}>
            <View style={[styles.infoIcon, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={16} color={color} />
            </View>
            <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value || 'N/A'}</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!lead) {
        return (
            <View style={styles.centerContainer}>
                <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
                <Text style={styles.errorText}>Lead not found</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={28} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Lead Details</Text>
                    <TouchableOpacity onPress={handleCall} style={styles.headerCallBtn}>
                        <Ionicons name="call" size={20} color={COLORS.success} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Profile Section */}
                    <View style={styles.profileSection}>
                        <View style={styles.avatarLarge}>
                            <Text style={styles.avatarLargeText}>{lead.full_name?.charAt(0).toUpperCase()}</Text>
                        </View>
                        <Text style={styles.profileName}>{lead.full_name}</Text>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusBadgeText}>{(lead.status || 'Fresh').replace(/_/g, ' ')}</Text>
                        </View>
                    </View>

                    {/* Contact Card */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Contact Details</Text>
                        <InfoItem label="Phone Number" value={lead.phone_number} icon="call-outline" />
                        <View style={styles.divider} />
                        <InfoItem label="Email Address" value={lead.email} icon="mail-outline" color={COLORS.info} />
                        {lead.company_name && (
                            <>
                                <View style={styles.divider} />
                                <InfoItem label="Company / Organization" value={lead.company_name} icon="business-outline" color={COLORS.secondary} />
                            </>
                        )}
                    </View>

                    {/* Details Card */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Application Info</Text>
                        <View style={styles.infoGrid}>
                            <View style={{ flex: 1 }}>
                                <InfoItem label="Domain" value={lead.opted_domain} icon="layers-outline" color={COLORS.accent} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <InfoItem label="Education" value={lead.education_background} icon="school-outline" color={COLORS.info} />
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoGrid}>
                            <View style={{ flex: 1 }}>
                                <InfoItem label="Passing Year" value={lead.year_of_passing} icon="calendar-outline" color={COLORS.textLight} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <InfoItem label="Lead Source" value={lead.source} icon="link-outline" color={COLORS.textDim} />
                            </View>
                        </View>
                    </View>

                    {/* Timeline Section */}
                    <View style={styles.timelineSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.timelineTitle}>Interaction History</Text>
                            <View style={styles.historyBadge}>
                                <Ionicons name="time" size={12} color={COLORS.info} />
                                <Text style={styles.historyBadgeText}>Recent</Text>
                            </View>
                        </View>
                        <CallTimeline leadId={leadId} refreshTrigger={refreshTimeline} />
                    </View>
                </ScrollView>

                <View style={styles.bottomActions}>
                    <TouchableOpacity
                        style={[styles.primaryAction, { backgroundColor: COLORS.success }]}
                        onPress={handleCall}
                    >
                        <Ionicons name="call" size={20} color="#fff" />
                        <Text style={styles.primaryActionText}>Start Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.secondaryAction, { backgroundColor: '#25D366' }]}
                        onPress={() => Linking.openURL(`https://wa.me/91${lead.phone_number}`)}
                    >
                        <Ionicons name="logo-whatsapp" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <CallLogModal
                    visible={callModalVisible}
                    callData={activeCallData}
                    onSave={handleSaveCallLog}
                    onCancel={() => {
                        setCallModalVisible(false);
                        setActiveCallData(null);
                    }}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.surface },
    container: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 120 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
    errorText: { ...TYPOGRAPHY.body, color: COLORS.textDim, marginTop: 12 },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.md,
        paddingTop: 10,
        paddingBottom: 15,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border + '50',
    },
    headerTitle: { ...TYPOGRAPHY.h3, color: COLORS.text },
    backBtn: { padding: 4 },
    headerCallBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: COLORS.success + '15',
        justifyContent: 'center',
        alignItems: 'center'
    },

    profileSection: {
        alignItems: 'center',
        paddingVertical: 32,
        backgroundColor: COLORS.surface,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        ...SHADOWS.small,
    },
    avatarLarge: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        ...SHADOWS.medium,
        borderWidth: 3,
        borderColor: '#fff',
    },
    avatarLargeText: { fontSize: 36, color: '#fff', fontWeight: '800' },
    profileName: { ...TYPOGRAPHY.h2, color: COLORS.text, marginBottom: 8 },
    statusBadge: {
        backgroundColor: COLORS.background,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    statusBadgeText: { ...TYPOGRAPHY.tiny, color: COLORS.textLight, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },

    card: {
        marginTop: SPACING.lg,
        marginHorizontal: SPACING.md,
        padding: SPACING.md,
        backgroundColor: COLORS.surface,
        borderRadius: 24,
        ...SHADOWS.small,
    },
    cardTitle: { ...TYPOGRAPHY.tiny, color: COLORS.textDim, marginBottom: SPACING.lg, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },

    infoItem: { flexDirection: 'row', alignItems: 'center' },
    infoIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    infoContent: { flex: 1 },
    infoLabel: { ...TYPOGRAPHY.tiny, color: COLORS.textDim },
    infoValue: { ...TYPOGRAPHY.body, color: COLORS.text, fontWeight: '600', marginTop: 1 },
    divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
    infoGrid: { flexDirection: 'row', justifyContent: 'space-between' },

    timelineSection: { marginTop: SPACING.xl, paddingHorizontal: SPACING.md },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
    timelineTitle: { ...TYPOGRAPHY.h3, color: COLORS.text },
    historyBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.info + '15', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
    historyBadgeText: { ...TYPOGRAPHY.tiny, color: COLORS.info, fontWeight: '700', marginLeft: 4 },

    bottomActions: {
        position: 'absolute',
        bottom: 24,
        left: 24,
        right: 24,
        flexDirection: 'row',
        alignItems: 'center',
    },
    primaryAction: {
        flex: 1,
        height: 60,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        ...SHADOWS.large,
    },
    primaryActionText: { color: '#fff', fontSize: 18, fontWeight: '800', marginLeft: 12 },
    secondaryAction: {
        width: 60,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.large,
    },
});

export default LeadDetailsScreen;
