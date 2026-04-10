import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import { uploadToCloudinary } from '../utils/cloudinary';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../utils/theme';

const CallLogModal = ({ visible, callData, onSave, onCancel }) => {
    const [outcome, setOutcome] = useState('interested');
    const [summary, setSummary] = useState('');
    const [remark, setRemark] = useState('');
    const [loading, setLoading] = useState(false);

    // Follow-up state
    const [followUpDate, setFollowUpDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Recording state
    const [recordingUri, setRecordingUri] = useState(null);
    const [recordingName, setRecordingName] = useState('');
    const [uploading, setUploading] = useState(false);
    const [recordingUrl, setRecordingUrl] = useState('');

    // Formatted Duration state
    const [minutes, setMinutes] = useState('0');
    const [seconds, setSeconds] = useState('0');

    React.useEffect(() => {
        if (callData?.durationSec) {
            const m = Math.floor(callData.durationSec / 60);
            const s = callData.durationSec % 60;
            setMinutes(m.toString());
            setSeconds(s.toString());
        }
    }, [callData]);

    const outcomes = [
        { id: 'interested', label: 'Interested', color: '#4CAF50' },
        { id: 'callback_requested', label: 'Callback', color: '#2196F3' },
        { id: 'follow_up', label: 'Follow Up', color: '#9C27B0' },
        { id: 'no_answer', label: 'No Answer', color: '#FF9800' },
        { id: 'not_interested', label: 'Rejected', color: '#757575' },
        { id: 'junk', label: 'Junk', color: '#f44336' },
        { id: 'converted', label: 'Converted', color: '#FFC107' }
    ];

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const currentDate = new Date(followUpDate);
            currentDate.setFullYear(selectedDate.getFullYear());
            currentDate.setMonth(selectedDate.getMonth());
            currentDate.setDate(selectedDate.getDate());
            setFollowUpDate(currentDate);
            setShowTimePicker(true);
        }
    };

    const handleTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const currentDate = new Date(followUpDate);
            currentDate.setHours(selectedTime.getHours());
            currentDate.setMinutes(selectedTime.getMinutes());
            setFollowUpDate(currentDate);
        }
    };

    const handlePickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'audio/*',
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                setRecordingUri(asset.uri);
                setRecordingName(asset.name);
                
                // Get duration from file
                try {
                    const { sound, status } = await Audio.Sound.createAsync({ uri: asset.uri });
                    if (status.isLoaded && status.durationMillis) {
                        const totalSec = Math.floor(status.durationMillis / 1000);
                        setMinutes(Math.floor(totalSec / 60).toString());
                        setSeconds((totalSec % 60).toString());
                    }
                    await sound.unloadAsync();
                } catch (audioErr) {
                    console.warn('Could not extract audio duration:', audioErr);
                }

                // Start upload immediately
                setUploading(true);
                try {
                    const url = await uploadToCloudinary(asset.uri, asset.name);
                    setRecordingUrl(url);
                } catch (error) {
                    Alert.alert('Upload Failed', 'Could not upload recording to Cloudinary');
                } finally {
                    setUploading(false);
                }
            }
        } catch (err) {
            console.error('Pick Document Error:', err);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const finalDurationSec = (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);

            await onSave({
                outcome,
                summary,
                remark,
                durationSec: finalDurationSec,
                status: finalDurationSec >= 60 ? 'Connected' : 'Not Connected',
                followUpDate: ['callback_requested', 'follow_up'].includes(outcome) ? followUpDate.toISOString() : null,
                recordingUrl: recordingUrl // Include the Cloudinary URL
            });
            // Reset fields on success
            setSummary('');
            setRemark('');
            setOutcome('interested');
            setFollowUpDate(new Date());
            setRecordingUri(null);
            setRecordingName('');
            setRecordingUrl('');
        } catch (error) {
            console.error('Error saving call log:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalOverlay}
            >
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Call Log Summary</Text>
                        <TouchableOpacity onPress={onCancel}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        {/* Call Info Section */}
                        <View style={styles.infoSection}>
                            <Text style={styles.leadName}>{callData?.leadName || 'Lead'}</Text>
                            <View style={styles.durationEditor}>
                                <Text style={styles.sectionTitle}>Adjust Call Duration</Text>
                                <View style={styles.durationInputs}>
                                    <View style={styles.inputGroup}>
                                        <TextInput
                                            style={styles.durationInput}
                                            value={minutes}
                                            onChangeText={setMinutes}
                                            keyboardType="numeric"
                                            maxLength={3}
                                        />
                                        <Text style={styles.inputLabel}>MIN</Text>
                                    </View>
                                    <Text style={styles.durationSeparator}>:</Text>
                                    <View style={styles.inputGroup}>
                                        <TextInput
                                            style={styles.durationInput}
                                            value={seconds}
                                            onChangeText={(val) => {
                                                if (parseInt(val) < 60 || val === '') setSeconds(val);
                                            }}
                                            keyboardType="numeric"
                                            maxLength={2}
                                        />
                                        <Text style={styles.inputLabel}>SEC</Text>
                                    </View>
                                    {recordingUrl && (
                                        <View style={styles.accuracyBadge}>
                                            <Ionicons name="shield-checkmark" size={14} color={COLORS.success} />
                                            <Text style={styles.accuracyText}>VERIFIED</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>

                        {/* Outcome Section */}
                        <Text style={styles.sectionTitle}>Call Outcome</Text>
                        <View style={styles.outcomeGrid}>
                            {outcomes.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.outcomeBtn,
                                        outcome === item.id && { backgroundColor: item.color, borderColor: item.color }
                                    ]}
                                    onPress={() => setOutcome(item.id)}
                                >
                                    <Text style={[
                                        styles.outcomeBtnText,
                                        outcome === item.id && { color: '#fff' }
                                    ]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Follow-Up Section (Experimental/WIP style) */}
                        {['callback_requested', 'follow_up'].includes(outcome) && (
                            <View style={styles.followUpContainer}>
                                <Text style={styles.sectionTitle}>Follow-Up Time</Text>
                                <TouchableOpacity
                                    style={styles.datePickerBtn}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Ionicons name="calendar-outline" size={20} color="#F15B29" />
                                    <Text style={styles.datePickerText}>
                                        {followUpDate.toLocaleString('en-IN', {
                                            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </Text>
                                    <Ionicons name="chevron-forward" size={16} color="#888" />
                                </TouchableOpacity>

                                {showDatePicker && (
                                    <DateTimePicker
                                        value={followUpDate}
                                        mode="date"
                                        display="default"
                                        minimumDate={new Date()}
                                        onChange={handleDateChange}
                                    />
                                )}
                                {showTimePicker && (
                                    <DateTimePicker
                                        value={followUpDate}
                                        mode="time"
                                        display="default"
                                        onChange={handleTimeChange}
                                    />
                                )}
                            </View>
                        )}

                        {/* Recording Section */}
                        <Text style={styles.sectionTitle}>Call Recording</Text>
                        <TouchableOpacity 
                            style={[styles.recordingBtn, recordingUrl && styles.recordingBtnSuccess]} 
                            onPress={handlePickDocument}
                            disabled={uploading}
                        >
                            {uploading ? (
                                <ActivityIndicator size="small" color="#F15B29" />
                            ) : (
                                <>
                                    <Ionicons 
                                        name={recordingUrl ? "checkmark-circle" : "attach-outline"} 
                                        size={20} 
                                        color={recordingUrl ? "#4CAF50" : "#F15B29"} 
                                    />
                                    <Text style={[styles.recordingBtnText, recordingUrl && { color: "#4CAF50" }]}>
                                        {recordingUrl ? "Recording Attached" : "Attach Call Recording"}
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                        {recordingName ? <Text style={styles.fileNameText}>{recordingName}</Text> : null}

                        {/* Summary Section */}
                        <Text style={styles.sectionTitle}>Interaction Summary {outcome === 'callback_requested' && '(Recommended)'}</Text>
                        <TextInput
                            style={styles.textArea}
                            multiline
                            numberOfLines={3}
                            placeholder="Briefly describe the conversation..."
                            value={summary}
                            onChangeText={setSummary}
                        />

                        {/* Remarks Section */}
                        <Text style={styles.sectionTitle}>Internal Remarks</Text>
                        <TextInput
                            style={styles.textArea}
                            multiline
                            numberOfLines={2}
                            placeholder="Add any internal notes..."
                            value={remark}
                            onChangeText={setRemark}
                        />

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={[styles.submitBtn, loading && { opacity: 0.7 }]}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.submitBtnText}>Submit Call Log</Text>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    scrollContent: { padding: 20 },
    infoSection: { marginBottom: 20, alignItems: 'center' },
    leadName: { fontSize: 20, fontWeight: 'bold', color: '#F15B29', marginBottom: 15 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
    statBox: { alignItems: 'center' },
    statLabel: { fontSize: 12, color: '#888', marginBottom: 5 },
    statValue: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 10, marginTop: 10 },
    outcomeGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
    outcomeBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DDD',
        marginRight: 8,
        marginBottom: 8,
    },
    outcomeBtnText: { fontSize: 13, color: '#666', fontWeight: '600' },
    followUpContainer: {
        backgroundColor: '#FFF5F2',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#FFE0D6',
    },
    datePickerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#EEE',
        marginTop: 5,
    },
    datePickerText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    textArea: {
        backgroundColor: '#F9F9F9',
        borderRadius: 10,
        padding: 12,
        fontSize: 14,
        color: '#333',
        textAlignVertical: 'top',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    submitBtn: {
        backgroundColor: '#F15B29',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    recordingBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF5F2',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FFE0D6',
        borderStyle: 'dashed',
        marginBottom: 5,
    },
    recordingBtnSuccess: {
        backgroundColor: '#E8F5E9',
        borderColor: '#A5D6A7',
        borderStyle: 'solid',
    },
    recordingBtnText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '700',
        color: '#F15B29',
    },
    fileNameText: {
        fontSize: 11,
        color: '#888',
        fontStyle: 'italic',
        marginTop: 2,
        marginBottom: 10,
    },
    durationEditor: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        padding: 16,
        borderRadius: 20,
        marginTop: 10,
    },
    durationInputs: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    inputGroup: {
        alignItems: 'center',
    },
    durationInput: {
        width: 60,
        height: 50,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.primary,
    },
    inputLabel: {
        ...TYPOGRAPHY.tiny,
        color: COLORS.textDim,
        marginTop: 4,
        fontWeight: '700',
    },
    durationSeparator: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.textDim,
        marginHorizontal: 12,
        marginTop: -20,
    },
    accuracyBadge: {
        position: 'absolute',
        right: -60,
        top: 0,
        backgroundColor: COLORS.success + '15',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    accuracyText: {
        ...TYPOGRAPHY.tiny,
        color: COLORS.success,
        fontWeight: '800',
        marginLeft: 4,
    },
});

export default CallLogModal;
