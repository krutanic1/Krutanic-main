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
                    <Image source={require('../../assets/logowhite.png')} style={styles.logo} resizeMode="contain" />
                    <Text style={styles.welcomeText}>Welcome Back</Text>
                    <Text style={styles.loginSubtitle}>Sign in to your workplace account</Text>
                </View>

                <View style={styles.cardContainer}>
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
                            <View style={styles.inputWrapper}>
                                <Ionicons name="mail-outline" size={20} color={COLORS.textDim} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email Address"
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
                                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send OTP</Text>}
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.formSection}>
                            <View style={styles.otpMessageContainer}>
                                <Text style={styles.otpMessage}>
                                    Verification code sent to{"\n"}
                                    <Text style={styles.otpEmail}>{email}</Text>
                                </Text>
                                <TouchableOpacity onPress={() => setStep('email')}>
                                    <Text style={styles.editEmailText}>Change Email</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="key-outline" size={20} color={COLORS.textDim} style={styles.inputIcon} />
                                <TextInput
                                    ref={otpRef}
                                    style={styles.input}
                                    placeholder="6-Digit OTP"
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
                                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify & Login</Text>}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.resendContainer}
                                onPress={handleSendOtp}
                                disabled={loading}
                            >
                                <Text style={styles.resendText}>Didn't receive code? <Text style={styles.resendLink}>Resend</Text></Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Secure Workplace | SDK 54</Text>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.primary },
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { flexGrow: 1 },
    headerContainer: {
        backgroundColor: COLORS.primary,
        paddingTop: Platform.OS === 'ios' ? 40 : 20,
        paddingBottom: 60,
        alignItems: 'center',
        paddingHorizontal: SPACING.lg
    },
    logo: { width: 180, height: 60, marginBottom: 20 },
    welcomeText: { ...TYPOGRAPHY.h1, color: '#fff', textAlign: 'center' },
    loginSubtitle: { ...TYPOGRAPHY.body, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 4 },

    cardContainer: {
        flex: 1,
        marginTop: -30,
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 28,
        paddingTop: 32,
    },
    roleSelector: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 6,
        marginBottom: 32,
        ...SHADOWS.small,
    },
    roleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 16 },
    roleBtnActive: { backgroundColor: COLORS.primary, ...SHADOWS.small },
    roleBtnText: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.textDim },
    roleBtnTextActive: { color: '#fff' },

    formSection: { width: '100%' },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        paddingHorizontal: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, paddingVertical: 16, fontSize: 16, color: COLORS.text },

    button: {
        backgroundColor: COLORS.primary,
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 10,
        ...SHADOWS.medium,
        shadowColor: COLORS.primary,
    },
    buttonText: { color: '#fff', fontWeight: '800', fontSize: 17 },
    error: { ...TYPOGRAPHY.caption, color: COLORS.error, marginBottom: 20, textAlign: 'center', fontWeight: '600' },

    otpMessageContainer: { marginBottom: 24, alignItems: 'center' },
    otpMessage: { ...TYPOGRAPHY.body, color: COLORS.textDim, textAlign: 'center', lineHeight: 24 },
    otpEmail: { fontWeight: '700', color: COLORS.text },
    editEmailText: { color: COLORS.primary, fontWeight: '700', marginTop: 8, fontSize: 14 },

    resendContainer: { marginTop: 32, alignItems: 'center' },
    resendText: { ...TYPOGRAPHY.caption, color: COLORS.textDim },
    resendLink: { color: COLORS.primary, fontWeight: '800' },

    footerContainer: { paddingVertical: 30, alignItems: 'center' },
    footerText: { ...TYPOGRAPHY.tiny, color: COLORS.textDim, opacity: 0.5 }
});

export default LoginScreen;
