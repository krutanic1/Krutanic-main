export const COLORS = {
    primary: '#FF8343', // Warm Soft Orange
    primaryLight: '#FF9F66',
    secondary: '#1A1A1A',
    accent: '#FFC107',
    success: '#00D084', // More vibrant green for 'Secure' indicator
    error: '#F44336',
    info: '#2196F3',
    background: '#F1F4F9', // Slightly cooler background for depth
    surface: '#FFFFFF',
    text: '#1A1A1A',
    textLight: '#666666',
    textDim: '#888888',
    border: '#E8EBF0',
    shadow: '#000000',
    glass: 'rgba(255, 255, 255, 0.7)',
    glassBorder: 'rgba(255, 255, 255, 0.4)',
    glassDark: 'rgba(0, 0, 0, 0.03)',
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
};

export const SHADOWS = {
    small: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    medium: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
    },
    large: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 10,
    },
    glow: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    }
};

export const TYPOGRAPHY = {
    h1: { fontSize: 32, fontWeight: '800', letterSpacing: -1 },
    h2: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5 },
    h3: { fontSize: 20, fontWeight: '600' },
    body: { fontSize: 16, fontWeight: '400' },
    caption: { fontSize: 14, fontWeight: '500', color: COLORS.textLight },
    tiny: { fontSize: 12, fontWeight: '500' },
};

export default { COLORS, SPACING, SHADOWS, TYPOGRAPHY };
