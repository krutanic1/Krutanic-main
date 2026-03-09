export const COLORS = {
    primary: '#F15B29',
    primaryLight: '#FF8B66',
    secondary: '#1A1A1A',
    accent: '#FFC107',
    success: '#4CAF50',
    error: '#F44336',
    info: '#2196F3',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    textLight: '#666666',
    textDim: '#888888',
    border: '#EEEEEE',
    shadow: '#000000',
    glass: 'rgba(255, 255, 255, 0.8)',
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    medium: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    large: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
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
