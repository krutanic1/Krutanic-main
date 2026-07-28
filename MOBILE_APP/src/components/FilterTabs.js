import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../utils/theme';

const FilterTabs = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'all', label: 'All Records' },
        { id: 'Fresh Lead', label: 'Fresh Lead' },
        { id: 'Attempting Contact', label: 'Attempting Contact' },
        { id: 'In Conversation', label: 'In Conversation' },
        { id: 'Demo Conducted', label: 'Demo Conducted' },
        { id: 'Closed Won', label: 'Closed Won' },
        { id: 'Closed Lost', label: 'Closed Lost' },
        { id: 'old_crm', label: 'Old CRM' }
    ];

    return (
        <View style={styles.outerContainer}>
            <Text style={styles.sectionTitle}>LEAD STAGE</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
            >
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        onPress={() => onTabChange(tab.id)}
                        style={[
                            styles.tab,
                            activeTab === tab.id && styles.activeTab
                        ]}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === tab.id && styles.activeTabText
                        ]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        backgroundColor: COLORS.surface,
        paddingBottom: SPACING.sm,
        marginTop: SPACING.sm,
    },
    sectionTitle: {
        ...TYPOGRAPHY.tiny,
        fontWeight: 'bold',
        color: COLORS.textDim,
        marginBottom: SPACING.sm,
        paddingHorizontal: SPACING.md,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    container: {
        flexGrow: 0,
    },
    contentContainer: {
        paddingHorizontal: SPACING.md,
        alignItems: 'center',
    },
    tab: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginRight: 8,
    },
    activeTab: {
        backgroundColor: '#EFF6FF',
        borderColor: '#3B82F6',
    },
    tabText: {
        ...TYPOGRAPHY.small,
        fontWeight: '600',
        color: '#64748B',
    },
    activeTabText: {
        color: '#1D4ED8',
    },
});

export default React.memo(FilterTabs);
