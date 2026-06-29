import React, { useState, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Platform,
    StatusBar,
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import leadService from '../services/leadService';
import LeadCard from '../components/LeadCard';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY } from '../utils/theme';

const FollowUpsScreen = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [rawFollowUps, setRawFollowUps] = useState([]);
    const [filterType, setFilterType] = useState('today'); // 'all', 'overdue', 'today'
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchFollowUps = useCallback(async (isRefreshing = false) => {
        if (!user?.id) return;
        
        if (!isRefreshing) setLoading(true);
        setError(null);

        try {
            // Using the exact same endpoint as the PC view for permanent parity!
            const data = await leadService.getMyLeads({ 
                userId: user.id,
                role: user.role || "adv_team",
                reminderOnly: true, 
                limit: 200 
            });
            setRawFollowUps(data.leads || []);
        } catch (err) {
            console.error('[FOLLOWUPS] Fetch failed:', err);
            setError(err.toString());
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user?.id]);

    // Use focus effect so it refetches when coming back to this tab
    useFocusEffect(
        useCallback(() => {
            fetchFollowUps();
        }, [fetchFollowUps])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchFollowUps(true);
    };

    const handleOpenLead = (leadId) => {
        navigation.navigate('LeadDetails', { leadId });
    };

    const filteredFollowUps = useMemo(() => {
        const now = Date.now();
        const todayStr = new Date().toDateString();
        
        return rawFollowUps.filter(lead => {
            if (!lead.next_followup_at) return false;
            const itemDate = new Date(lead.next_followup_at);
            
            if (filterType === 'today') {
                return itemDate.toDateString() === todayStr;
            }
            if (filterType === 'overdue') {
                return itemDate.getTime() < now;
            }
            return true; // 'all'
        });
    }, [rawFollowUps, filterType]);

    if (loading && !refreshing) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    const renderEmptyState = () => {
        if (error) {
            return (
                <View style={styles.emptyContainer}>
                    <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
                    <Text style={styles.noDataText}>Connection Error</Text>
                    <Text style={styles.noDataSubtext}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={() => fetchFollowUps()}>
                        <Text style={styles.retryText}>Retry Now</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyIconCircle}>
                    <Ionicons name="checkmark-done" size={40} color={COLORS.success} />
                </View>
                <Text style={styles.noDataText}>All caught up!</Text>
                <Text style={styles.noDataSubtext}>No {filterType} follow-ups scheduled.</Text>
                <Text style={styles.pullHint}>Pull down to check for new tasks</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Follow-Ups</Text>
                        <Text style={styles.headerSubtitle}>Manage your scheduled callbacks</Text>
                    </View>
                    <View style={styles.countBadge}>
                        <Text style={styles.countText}>{filteredFollowUps.length}</Text>
                    </View>
                </View>

                {/* Filter Tabs */}
                <View style={styles.filterContainer}>
                    <View style={styles.filterWrapper}>
                        {['all', 'overdue', 'today'].map((f) => (
                            <TouchableOpacity
                                key={f}
                                style={[styles.filterBtn, filterType === f && styles.filterBtnActive]}
                                onPress={() => setFilterType(f)}
                            >
                                <Text style={[styles.filterText, filterType === f && styles.filterTextActive]}>
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <FlatList 
                    data={filteredFollowUps}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={filteredFollowUps.length === 0 ? styles.emptyScrollContent : styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} color={COLORS.primary} />
                    }
                    renderItem={({ item }) => (
                        <View style={styles.cardWrapper}>
                            <LeadCard
                                lead={item}
                                onViewDetails={() => handleOpenLead(item._id)}
                            />
                        </View>
                    )}
                    ListEmptyComponent={renderEmptyState}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.surface },
    container: { flex: 1, backgroundColor: COLORS.background },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
    
    header: {
        backgroundColor: COLORS.surface,
        paddingTop: Platform.OS === 'android' ? 10 : 0,
        paddingBottom: 20,
        paddingHorizontal: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
    },
    headerTitle: { ...TYPOGRAPHY.h2, color: COLORS.text },
    headerSubtitle: { ...TYPOGRAPHY.tiny, color: COLORS.textDim, marginTop: 2 },
    countBadge: {
        backgroundColor: COLORS.primary + '15',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    countText: { ...TYPOGRAPHY.tiny, color: COLORS.primary, fontWeight: '800' },

    filterContainer: {
        paddingHorizontal: SPACING.md,
        paddingBottom: 12,
        backgroundColor: COLORS.surface,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border + '50',
    },
    filterWrapper: {
        flexDirection: 'row',
        backgroundColor: COLORS.background,
        borderRadius: 12,
        padding: 4,
    },
    filterBtn: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    filterBtnActive: {
        backgroundColor: COLORS.primary,
        ...SHADOWS.small,
    },
    filterText: {
        ...TYPOGRAPHY.tiny,
        fontWeight: '700',
        color: COLORS.textDim,
    },
    filterTextActive: {
        color: '#fff',
    },

    listContent: {
        paddingVertical: SPACING.md,
        paddingBottom: 40,
        paddingHorizontal: SPACING.sm
    },
    emptyScrollContent: {
        flexGrow: 1,
        justifyContent: 'center'
    },
    cardWrapper: {
        marginBottom: SPACING.md
    },

    emptyContainer: { 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: SPACING.xl 
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.success + '10',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16
    },
    noDataText: { ...TYPOGRAPHY.h3, color: COLORS.text, marginTop: 16 },
    noDataSubtext: { ...TYPOGRAPHY.body, color: COLORS.textDim, textAlign: 'center', marginTop: 8 },
    pullHint: { ...TYPOGRAPHY.tiny, color: COLORS.primary, marginTop: 16, fontWeight: '700', opacity: 0.6 },
    retryBtn: {
        marginTop: 24,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: COLORS.primary,
        borderRadius: 14,
        ...SHADOWS.small
    },
    retryText: { color: '#fff', fontWeight: '700' },
});

export default FollowUpsScreen;
