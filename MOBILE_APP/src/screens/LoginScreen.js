import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
    const [email, setEmail] = React.useState('');
    const [otp, setOtp] = React.useState('');
    const [role, setRole] = React.useState('staff'); // 'staff' or 'admin'
    const [step, setStep] = React.useState('email'); // 'email' or 'otp'
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const { sendOtp, signIn } = useAuth();

    // Refs for keyboard navigation
    const otpRef = React.useRef(null);

    const handleSendOtp = async () => {
        if (!email) {
            setError('Please enter your email address');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await sendOtp(email, role);
            setStep('otp');
        } catch (err) {
            setError(err.message || 'Failed to send OTP. Please check your email.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length < 4) {
            setError('Please enter the verification code');
            return;
        }
        setLoading(true);
        setError('');
        const result = await signIn(email, otp, role);
        setLoading(false);
        if (!result.success) {
            setError(result.message);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} translucent={true} />
            <KeyboardAwareScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                extraHeight={200}
                extraScrollHeight={100}
                bounces={false}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.headerContainer}>
                    <Image source={require('../../assets/logo.jpg')} style={styles.logo} resizeMode="contain" />
                    <Text style={styles.welcomeText}>KRUTANIC</Text>
                    <Text style={styles.taglineText}>A LADDER FOR BRIGHTER FUTURE</Text>
                    <Text style={styles.loginSubtitle}>Sign in to your workplace account</Text>
                </View>

                <View style={styles.cardContainer}>
                    {/* Glassmorphic Card */}
                    <View style={styles.glassCard}>
                        {/* Role Selector */}
                        <View style={styles.roleSelector}>
                            <TouchableOpacity
                                style={[styles.roleBtn, role === 'staff' && styles.roleBtnActive]}
                                onPress={() => {
                                    setRole('staff');
                                    setStep('email');
                                    setOtp('');
                                    setError('');
                                }}
                            >
                                <Text style={[styles.roleBtnText, role === 'staff' && styles.roleBtnTextActive]}>Staff</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.roleBtn, role === 'admin' && styles.roleBtnActive]}
                                onPress={() => {
                                    setRole('admin');
                                    setStep('email');
                                    setOtp('');
                                    setError('');
                                }}
                            >
                                <Text style={[styles.roleBtnText, role === 'admin' && styles.roleBtnTextActive]}>Admin</Text>
                            </TouchableOpacity>
                        </View>

                        {step === 'email' ? (
                            <View style={styles.formSection}>
                                <Text style={styles.inputLabel}>IDENTITY KEY</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="at-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="tarun@krutanic.org"
                                        value={email}
                                        onChangeText={setEmail}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        placeholderTextColor={COLORS.textDim}
                                        returnKeyType="go"
                                        onSubmitEditing={handleSendOtp}
                                    />
                                </View>
                                {error ? <Text style={styles.error}>{error}</Text> : null}
                                <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={loading}>
                                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>LOG IN</Text>}
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.linkButton} onPress={() => {}}>
                                    <Text style={styles.linkText}>REQUEST TEMPORAL ACCESS CODE</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.formSection}>
                                <View style={styles.otpMessageContainer}>
                                    <Text style={styles.otpMessage}>
                                        Protocol verification sent to{"\n"}
                                        <Text style={styles.otpEmail}>{email}</Text>
                                    </Text>
                                    <TouchableOpacity onPress={() => setStep('email')}>
                                        <Text style={styles.editEmailText}>Change Identity</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.inputLabel}>ACCESS PROTOCOL</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                                    <TextInput
                                        ref={otpRef}
                                        style={styles.input}
                                        placeholder="••••••••"
                                        value={otp}
                                        onChangeText={setOtp}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        placeholderTextColor={COLORS.textDim}
                                        returnKeyType="done"
                                        onSubmitEditing={handleVerifyOtp}
                                    />
                                </View>
                                {error ? <Text style={styles.error}>{error}</Text> : null}
                                <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={loading}>
                                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>AUTHENTICATE</Text>}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.resendContainer}
                                    onPress={handleSendOtp}
                                    disabled={loading}
                                >
                                    <Text style={styles.resendText}>Protocol timeout? <Text style={styles.resendLink}>Resend Code</Text></Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.footerContainer}>
                    <View style={styles.secureIndicator}>
                        <View style={styles.pulseDot} />
                        <Text style={styles.secureText}>SECURE <Text style={{ fontWeight: 'bold' }}>MAINFRAME</Text> CONNECTION ACTIVE</Text>
                        <View style={styles.indicatorLines}>
                            <View style={[styles.line, { height: 10 }]} />
                            <View style={[styles.line, { height: 16 }]} />
                            <View style={[styles.line, { height: 12, backgroundColor: COLORS.primary }]} />
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.background },
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { flexGrow: 1 },
    headerContainer: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 40,
        alignItems: 'center',
        paddingHorizontal: SPACING.lg
    },
    logo: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
    welcomeText: { ...TYPOGRAPHY.h1, color: COLORS.text, fontSize: 36, textAlign: 'center' },
    taglineText: { fontSize: 11, color: COLORS.primary, fontWeight: '700', letterSpacing: 1.5, marginTop: 4, textTransform: 'uppercase' },
    loginSubtitle: { fontSize: 14, color: COLORS.textDim, textAlign: 'center', marginTop: 12, textTransform: 'uppercase', letterSpacing: 1 },

    cardContainer: {
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    glassCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 40,
        padding: 32,
        ...SHADOWS.large,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    roleSelector: {
        flexDirection: 'row',
        backgroundColor: COLORS.background,
        borderRadius: 25,
        padding: 6,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    roleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 20 },
    roleBtnActive: { backgroundColor: COLORS.surface, ...SHADOWS.small },
    roleBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.textDim, textTransform: 'uppercase', letterSpacing: 1 },
    roleBtnTextActive: { color: COLORS.secondary },

    formSection: { width: '100%' },
    inputLabel: { fontSize: 10, fontWeight: '700', color: COLORS.textDim, marginBottom: 8, letterSpacing: 1, marginLeft: 4 },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1.5,
        borderBottomColor: COLORS.border,
        paddingHorizontal: 0,
        marginBottom: 32,
    },
    inputIcon: { marginRight: 12, opacity: 0.8 },
    input: { flex: 1, paddingVertical: 12, fontSize: 18, color: COLORS.text, fontWeight: '500' },

    button: {
        backgroundColor: COLORS.primary,
        padding: 20,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 10,
        ...SHADOWS.glow,
    },
    buttonText: { color: '#fff', fontWeight: '800', fontSize: 18, letterSpacing: 1 },
    error: { ...TYPOGRAPHY.caption, color: COLORS.error, marginBottom: 20, textAlign: 'center', fontWeight: '600' },

    linkButton: { marginTop: 24, alignItems: 'center' },
    linkText: { fontSize: 12, fontWeight: '700', color: COLORS.textDim, letterSpacing: 1 },

    otpMessageContainer: { marginBottom: 24, alignItems: 'center' },
    otpMessage: { fontSize: 15, color: COLORS.textDim, textAlign: 'center', lineHeight: 22 },
    otpEmail: { fontWeight: '700', color: COLORS.text },
    editEmailText: { color: COLORS.primary, fontWeight: '700', marginTop: 8, fontSize: 13 },

    resendContainer: { marginTop: 32, alignItems: 'center' },
    resendText: { fontSize: 13, color: COLORS.textDim },
    resendLink: { color: COLORS.primary, fontWeight: '800' },

    footerContainer: { paddingVertical: 20, paddingHorizontal: 24, alignItems: 'center' },
    secureIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface + '80',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
        width: '100%',
    },
    pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success, marginRight: 12 },
    secureText: { fontSize: 10, color: COLORS.textLight, letterSpacing: 1, flex: 1 },
    indicatorLines: { flexDirection: 'row', alignItems: 'flex-end', marginLeft: 12 },
    line: { width: 2, backgroundColor: COLORS.border, marginLeft: 3, borderRadius: 1 }
});

export default LoginScreen;
