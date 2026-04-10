import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Platform,
    StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import leadService from '../services/leadService';
import FollowUpCard from '../components/FollowUpCard';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY } from '../utils/theme';

const FollowUpsScreen = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [followUps, setFollowUps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchFollowUps = useCallback(async () => {
        if (!user?.id) return;
        
        try {
            const data = await leadService.getUpcomingFollowUps(user?.id);
            setFollowUps(data.followUps || []);
        } catch (error) {
            console.error('[FOLLOWUPS] Fetch failed:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchFollowUps();
    }, [fetchFollowUps]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchFollowUps();
    };

    const handleOpenLead = (leadId) => {
        navigation.navigate('LeadDetails', { leadId });
    };

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
                    <View>
                        <Text style={styles.headerTitle}>Follow-Ups</Text>
                        <Text style={styles.headerSubtitle}>Manage your scheduled callbacks</Text>
                    </View>
                    <View style={styles.countBadge}>
                        <Text style={styles.countText}>{followUps.length}</Text>
                    </View>
                </View>

                {followUps.length === 0 ? (
                    <View style={styles.centerContainer}>
                        <View style={styles.emptyIconCircle}>
                            <Ionicons name="checkmark-done" size={40} color={COLORS.success} />
                        </View>
                        <Text style={styles.noDataText}>All caught up!</Text>
                        <Text style={styles.noDataSubtext}>No upcoming follow-ups scheduled.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={followUps}
                        renderItem={({ item }) => (
                            <FollowUpCard
                                followUp={item}
                                onOpenLead={handleOpenLead}
                            />
                        )}
                        keyExtractor={item => item._id}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} color={COLORS.primary} />
                        }
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.surface },
    container: { flex: 1 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },

    header: {
        backgroundColor: COLORS.surface,
        paddingTop: Platform.OS === 'android' ? 10 : 0,
        paddingBottom: 20,
        paddingHorizontal: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border + '50',
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

    listContent: {
        paddingVertical: SPACING.md,
        paddingBottom: 40,
        backgroundColor: COLORS.background
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
    noDataText: { ...TYPOGRAPHY.h3, color: COLORS.text },
    noDataSubtext: { ...TYPOGRAPHY.body, color: COLORS.textDim, textAlign: 'center', marginTop: 8 },
});

export default FollowUpsScreen;
