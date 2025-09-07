import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme/colors';

interface ModernCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'highlighted' | 'outlined';
  padding?: keyof typeof Spacing;
}

const ModernCard: React.FC<ModernCardProps> = ({
  children,
  title,
  subtitle,
  onPress,
  style,
  variant = 'default',
  padding = 'md',
}) => {
  const CardComponent = onPress ? TouchableOpacity : View;

  const getCardStyle = () => {
    const baseStyle = [styles.card, styles[variant]];
    
    if (padding) {
      baseStyle.push({ padding: Spacing[padding] });
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  return (
    <CardComponent style={getCardStyle()} onPress={onPress}>
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && (
            <Text variant="titleMedium" style={styles.title}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text variant="bodyMedium" style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
      {children}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  default: {
    backgroundColor: Colors.surface,
    borderWidth: 0,
  },
  highlighted: {
    backgroundColor: Colors.primary,
    borderWidth: 0,
  },
  outlined: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Shadows.sm,
  },
  header: {
    marginBottom: Spacing.sm,
  },
  title: {
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    color: Colors.textSecondary,
  },
});

export default ModernCard;
