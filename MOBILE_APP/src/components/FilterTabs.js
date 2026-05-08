import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../utils/theme';

const FilterTabs = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'Fresh Lead', label: 'Fresh' },
        { id: 'Attempting Contact', label: 'Attempting' },
        { id: 'First Call Connected', label: 'Connected' },
        { id: 'Demo Conducted', label: 'Demo' },
        { id: 'Closed Won', label: 'Won' },
        { id: 'Closed Lost', label: 'Lost' },
        { id: 'old_crm', label: 'Old CRM' }
    ];

    return (
        <View style={styles.outerContainer}>
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
    },
    container: {
        height: 48,
    },
    contentContainer: {
        paddingHorizontal: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 14,
        backgroundColor: COLORS.background,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    activeTab: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
        ...SHADOWS.small,
    },
    tabText: {
        ...TYPOGRAPHY.tiny,
        fontWeight: '700',
        color: COLORS.textLight,
    },
    activeTabText: {
        color: '#fff',
    },
});

export default React.memo(FilterTabs);
