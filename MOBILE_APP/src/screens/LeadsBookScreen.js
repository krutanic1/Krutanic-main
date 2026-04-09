import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    AppState,
    Alert,
    Platform,
    StatusBar
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY } from '../utils/theme';
import leadService from '../services/leadService';
import LeadCard from '../components/LeadCard';
import SearchBar from '../components/SearchBar';
import FilterTabs from '../components/FilterTabs';
import CallLogModal from '../components/CallLogModal';
import { endCallTracking } from '../utils/callTracker';
import { scheduleFollowUpNotification } from '../services/notificationService';

const LeadsBookScreen = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    // Pagination State
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // Call Log State
    const [callModalVisible, setCallModalVisible] = useState(false);
    const [activeCallData, setActiveCallData] = useState(null);

    const fetchLeads = useCallback(async (pageNumber = 1, isLoadMore = false) => {
        if (isLoadMore) setLoadingMore(true);
        else if (!refreshing) setLoading(true);

        try {
            const data = await leadService.getMyLeads({
                userId: user?.id,
                role: user?.role,
                page: pageNumber,
                limit: 25,
                outcome: activeTab === 'all' ? undefined : activeTab
            });

            const newLeads = data.leads || [];
            if (isLoadMore) {
                setLeads(prev => [...prev, ...newLeads]);
            } else {
                setLeads(newLeads);
            }

            setHasMore(newLeads.length === 25);
            setPage(pageNumber);
        } catch (error) {
            console.error('[LEADS] Fetch failed:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
            setLoadingMore(false);
        }
    }, [user?.id, activeTab, refreshing]);

    useEffect(() => {
        fetchLeads(1);
    }, [activeTab, user?.id]);

    const handleLoadMore = () => {
        if (!loadingMore && hasMore && !loading) {
            fetchLeads(page + 1, true);
        }
    };

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

    const onRefresh = () => {
        setRefreshing(true);
        fetchLeads(1);
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
                followUpDate: logData.followUpDate,
                recordingUrl: logData.recordingUrl
            };
            const logResponse = await leadService.logCall(payload);

            if (logData.outcome === 'callback_requested' && logData.followUpDate) {
                const lead = leads.find(l => l._id === activeCallData.leadId);
                await scheduleFollowUpNotification(lead?.full_name || 'Lead', logData.followUpDate);
            }

            setCallModalVisible(false);
            setActiveCallData(null);
            fetchLeads();
            Alert.alert('Success', 'Call log saved successfully');
        } catch (error) {
            Alert.alert('Error', String(error?.message || error || 'Failed to save call log'));
            throw error;
        }
    };

    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            const matchesSearch =
                lead.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.phone_number?.includes(searchQuery) ||
                lead.opted_domain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.company_name?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesTab = activeTab === 'all' ||
                (activeTab === 'callback_requested'
                    ? (lead.status === 'callback_requested' || lead.status === 'in_followup')
                    : (lead.status === activeTab || lead.last_outcome === activeTab));

            return matchesSearch && matchesTab;
        });
    }, [leads, searchQuery, activeTab]);

    const handleViewDetails = (leadId) => {
        navigation.navigate('LeadDetails', { leadId });
    };

    const renderItem = ({ item }) => (
        <LeadCard lead={item} onViewDetails={handleViewDetails} />
    );

    if (loading && !refreshing) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Leads Book</Text>
                    <View style={styles.countBadge}>
                        <Text style={styles.countText}>{filteredLeads.length}</Text>
                    </View>
                </View>

                <View style={styles.filterArea}>
                    <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
                    <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />
                </View>

                {filteredLeads.length === 0 ? (
                    <View style={styles.centerContainer}>
                        <Ionicons name="search-outline" size={64} color={COLORS.textDim} opacity={0.3} />
                        <Text style={styles.noLeadsText}>No leads found</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredLeads}
                        renderItem={renderItem}
                        keyExtractor={item => item._id}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={() => (
                            loadingMore ? (
                                <View style={{ paddingVertical: 20 }}>
                                    <ActivityIndicator size="small" color={COLORS.primary} />
                                </View>
                            ) : null
                        )}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} color={COLORS.primary} />
                        }
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}

                <CallLogModal
                    visible={callModalVisible}
                    callData={activeCallData}
                    onSave={handleSaveCallLog}
                    onCancel={() => {
                        setCallModalVisible(false);
                        setActiveCallData(null);
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.surface },
    container: { flex: 1 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    header: {
        backgroundColor: COLORS.surface,
        paddingTop: 10,
        paddingBottom: 15,
        paddingHorizontal: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: { ...TYPOGRAPHY.h2, color: COLORS.text },
    countBadge: {
        backgroundColor: COLORS.primary + '15',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    countText: { ...TYPOGRAPHY.tiny, color: COLORS.primary, fontWeight: '700' },

    filterArea: {
        backgroundColor: COLORS.surface,
        paddingBottom: SPACING.sm,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border + '50',
        zIndex: 10,
    },

    listContent: { paddingBottom: 40, paddingTop: SPACING.md },
    noLeadsText: { ...TYPOGRAPHY.body, color: COLORS.textDim, marginTop: 12 },
});

export default LeadsBookScreen;
