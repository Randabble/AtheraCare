import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Text } from 'react-native-paper';
import { Colors } from '../theme/colors';

interface ProgressRingProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  centerText?: string;
  centerSubtext?: string;
  style?: any;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = Colors.primary,
  backgroundColor = Colors.progressBackground,
  centerText,
  centerSubtext,
  style,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      {/* Center text */}
      {(centerText || centerSubtext) && (
        <View style={styles.centerText}>
          {centerText && (
            <Text variant="headlineSmall" style={styles.centerTextMain}>
              {centerText}
            </Text>
          )}
          {centerSubtext && (
            <Text variant="bodySmall" style={styles.centerTextSub}>
              {centerSubtext}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
  centerText: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerTextMain: {
    color: Colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
  },
  centerTextSub: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
});

export default ProgressRing;
