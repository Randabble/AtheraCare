import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

interface IconProps {
  size?: number;
  color?: string;
  style?: any;
}

export const HomeIcon: React.FC<IconProps> = ({ size = 24, color = Colors.textPrimary, style }) => (
  <View style={[styles.container, { width: size, height: size }, style]}>
    <View style={[styles.icon, { backgroundColor: color }]} />
  </View>
);

export const MedicationIcon: React.FC<IconProps> = ({ size = 24, color = Colors.textPrimary, style }) => (
  <View style={[styles.container, { width: size, height: size }, style]}>
    <View style={[styles.pill, { backgroundColor: color }]} />
  </View>
);

export const WaterIcon: React.FC<IconProps> = ({ size = 24, color = Colors.textPrimary, style }) => (
  <View style={[styles.container, { width: size, height: size }, style]}>
    <View style={[styles.water, { borderColor: color }]} />
  </View>
);

export const ActivityIcon: React.FC<IconProps> = ({ size = 24, color = Colors.textPrimary, style }) => (
  <View style={[styles.container, { width: size, height: size }, style]}>
    <View style={[styles.chart, { borderColor: color }]} />
  </View>
);

export const SettingsIcon: React.FC<IconProps> = ({ size = 24, color = Colors.textPrimary, style }) => (
  <View style={[styles.container, { width: size, height: size }, style]}>
    <View style={[styles.gear, { borderColor: color }]} />
  </View>
);

export const StepsIcon: React.FC<IconProps> = ({ size = 24, color = Colors.textPrimary, style }) => (
  <View style={[styles.container, { width: size, height: size }, style]}>
    <View style={[styles.footprint, { backgroundColor: color }]} />
  </View>
);

export const TrophyIcon: React.FC<IconProps> = ({ size = 24, color = Colors.textPrimary, style }) => (
  <View style={[styles.container, { width: size, height: size }, style]}>
    <View style={[styles.trophy, { backgroundColor: color }]} />
  </View>
);

export const PlusIcon: React.FC<IconProps> = ({ size = 24, color = Colors.textPrimary, style }) => (
  <View style={[styles.container, { width: size, height: size }, style]}>
    <View style={[styles.plus, { backgroundColor: color }]} />
  </View>
);

export const ShareIcon: React.FC<IconProps> = ({ size = 24, color = Colors.textPrimary, style }) => (
  <View style={[styles.container, { width: size, height: size }, style]}>
    <View style={[styles.share, { borderColor: color }]} />
  </View>
);

export const ProfileIcon: React.FC<IconProps> = ({ size = 24, color = Colors.textPrimary, style }) => (
  <View style={[styles.container, { width: size, height: size }, style]}>
    <View style={[styles.profile, { borderColor: color }]} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 16,
    borderRadius: 2,
  },
  pill: {
    width: 16,
    height: 8,
    borderRadius: 4,
  },
  water: {
    width: 12,
    height: 16,
    borderWidth: 2,
    borderRadius: 6,
    borderTopWidth: 0,
  },
  chart: {
    width: 16,
    height: 12,
    borderWidth: 2,
    borderRadius: 2,
  },
  gear: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderRadius: 8,
  },
  footprint: {
    width: 8,
    height: 12,
    borderRadius: 4,
  },
  trophy: {
    width: 12,
    height: 16,
    borderRadius: 2,
  },
  plus: {
    width: 16,
    height: 2,
    borderRadius: 1,
  },
  share: {
    width: 16,
    height: 12,
    borderWidth: 2,
    borderRadius: 2,
  },
  profile: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderRadius: 8,
  },
});
