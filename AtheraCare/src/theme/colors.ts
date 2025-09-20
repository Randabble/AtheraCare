export const Colors = {
  // Primary colors - inspired by Yazio's clean blue theme
  primary: '#007AFF',
  primaryLight: '#4A9EFF',
  primaryDark: '#0056CC',
  
  // Secondary colors
  secondary: '#34C759',
  secondaryLight: '#5DD079',
  secondaryDark: '#28A745',
  
  // Accent colors
  accent: '#FF9500',
  accentLight: '#FFB84D',
  accentDark: '#E6850E',
  
  // Dark theme colors (default)
  background: '#1C1C1E',
  surface: '#2C2C2E',
  surfaceSecondary: '#3A3A3C',
  
  // Light theme colors (for future toggle)
  backgroundLight: '#F2F2F7',
  surfaceLight: '#FFFFFF',
  surfaceSecondaryLight: '#F8F9FA',
  
  // Text colors (dark theme)
  textPrimary: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#48484A',
  
  // Light text colors (for future toggle)
  textPrimaryLight: '#1D1D1F',
  textSecondaryLight: '#8E8E93',
  textTertiaryLight: '#C7C7CC',
  
  // Status colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',
  
  // Progress colors
  progressBackground: '#E5E5EA',
  progressFill: '#007AFF',
  
  // Card colors (dark theme)
  cardBackground: '#2C2C2E',
  cardBorder: '#3A3A3C',
  cardShadow: 'rgba(0, 0, 0, 0.3)',
  
  // Light card colors (for future toggle)
  cardBackgroundLight: '#FFFFFF',
  cardBorderLight: '#E5E5EA',
  cardShadowLight: 'rgba(0, 0, 0, 0.1)',
  
  // Water tracking colors
  waterPrimary: '#00C7BE',
  waterSecondary: '#5DD0D0',
  waterBackground: '#1A2A2A',
  
  // Steps tracking colors
  stepsPrimary: '#34C759',
  stepsSecondary: '#5DD079',
  stepsBackground: '#1A2A1A',
  
  // Medication colors
  medsPrimary: '#FF9500',
  medsSecondary: '#FFB84D',
  medsBackground: '#2A1F0A',
  
  // Chart colors
  chartColors: [
    '#007AFF',
    '#34C759',
    '#FF9500',
    '#FF3B30',
    '#AF52DE',
    '#5AC8FA',
    '#FF2D92',
    '#FFCC00'
  ]
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const gradients = {
  primary: ['#007AFF', '#0056CC'],
  secondary: ['#34C759', '#28A745'],
  accent: ['#FF9500', '#E6850E'],
  water: ['#00C7BE', '#5DD0D0'],
  steps: ['#34C759', '#5DD079'],
  meds: ['#FF9500', '#FFB84D'],
};