import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AutoDialerBar = ({ onStart, activeSession, onResume, onStop }) => {
    if (activeSession) {
        return (
            <View style={[styles.container, styles.activeContainer]}>
                <View style={styles.info}>
                    <View style={styles.pulse} />
                    <Text style={styles.activeText}>Auto Dialer Running</Text>
                    <Text style={styles.progressText}>
                        {activeSession.currentIndex + 1} / {activeSession.queue.length}
                    </Text>
                </View>
                <View style={styles.actions}>
                    <TouchableOpacity onPress={onResume} style={styles.resumeBtn}>
                        <Text style={styles.btnText}>Resume</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onStop} style={styles.stopBtn}>
                        <Ionicons name="close-circle" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <TouchableOpacity onPress={onStart} style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="flash" size={20} color="#fff" />
                </View>
                <View>
                    <Text style={styles.title}>Start Auto Dialer</Text>
                    <Text style={styles.subtitle}>Call your leads sequentially</Text>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#F15B29" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginTop: 15,
        padding: 15,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    activeContainer: {
        backgroundColor: '#F15B29',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F15B29',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    pulse: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#fff',
        marginRight: 10,
    },
    activeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    progressText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        marginLeft: 10,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resumeBtn: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginRight: 10,
    },
    btnText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
    },
});

export default AutoDialerBar;
