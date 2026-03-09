import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../utils/theme';

const SearchBar = ({ value, onChangeText, placeholder = "Search leads..." }) => {
    return (
        <View style={styles.container}>
            <View style={styles.searchBox}>
                <Ionicons name="search-outline" size={20} color={COLORS.textDim} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    placeholderTextColor={COLORS.textLight}
                />
                {value.length > 0 && (
                    <Ionicons
                        name="close-circle"
                        size={20}
                        color={COLORS.textDim}
                        onPress={() => onChangeText('')}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.md,
        backgroundColor: COLORS.surface,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        borderRadius: 16,
        paddingHorizontal: 12,
        height: 54,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    icon: { marginRight: 8 },
    input: {
        flex: 1,
        ...TYPOGRAPHY.body,
        color: COLORS.text,
    },
});

export default React.memo(SearchBar);
