import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, ProgressBar } from 'react-native-paper';
import ModernCard from '../../components/ModernCard';
import ProgressRing from '../../components/ProgressRing';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { Pedometer } from 'expo-sensors';
import { updateStepsTracking } from '../../utils/activityTracker';
import { Colors, Spacing, BorderRadius } from '../../theme/colors';
import { StepsIcon, TrophyIcon } from '../../components/icons/ModernIcons';

const StepsScreen: React.FC = () => {
  const { user } = useAuth();
  const { preferences } = useOnboarding();
  const [steps, setSteps] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock weekly data for now
  const weeklyData = [
    { day: 'Mon', steps: 8500 },
    { day: 'Tue', steps: 7200 },
    { day: 'Wed', steps: 9100 },
    { day: 'Thu', steps: 6800 },
    { day: 'Fri', steps: 10500 },
    { day: 'Sat', steps: 6300 },
    { day: 'Sun', steps: 0 },
  ];

  useEffect(() => {
    if (user) {
      checkPedometerAvailability();
      loadSteps();
    }
  }, [user]);

  const checkPedometerAvailability = async () => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(isAvailable);
      
      if (isAvailable) {
        // Start listening to step updates
        const subscription = Pedometer.watchStepCount(async (result) => {
          setSteps(result.steps);
          
          // Update activity tracker
          if (user) {
            try {
              const today = new Date().toISOString().split('T')[0];
              await updateStepsTracking(user.uid, today, result.steps, preferences.stepGoal, 0); // TODO: Calculate actual streak
            } catch (error) {
              console.error('Error updating steps tracking:', error);
            }
          }
        });
        
        // Cleanup subscription on unmount
        return () => subscription && subscription.remove();
      }
    } catch (error) {
      console.error('Error checking pedometer availability:', error);
      setIsPedometerAvailable(false);
    }
  };

  const loadSteps = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // TODO: Load steps from Firestore
      // For now, use mock data
      setSteps(weeklyData[6].steps); // Today (Sunday)
    } catch (error) {
      console.error('Error loading steps:', error);
    } finally {
      setLoading(false);
    }
  };

  const progress = preferences.stepGoal > 0 ? steps / preferences.stepGoal : 0;
  const percentage = Math.round(progress * 100);

  const getMaxSteps = () => {
    return Math.max(...weeklyData.map(day => day.steps));
  };

  const maxSteps = getMaxSteps();

  if (loading && steps === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text variant="bodyLarge">Loading step data...</Text>
      </View>
      );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.title}>
          Step Tracker
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Track your daily activity
        </Text>
      </View>

      {/* Today's Steps Card */}
      <ModernCard 
        title="Today's Steps"
        subtitle={`${steps.toLocaleString()} / ${preferences.stepGoal.toLocaleString()} steps`}
        style={styles.stepsCard}
      >
        <View style={styles.stepsContent}>
          <View style={styles.stepsIconContainer}>
            <StepsIcon size={48} color={Colors.stepsPrimary} />
          </View>
          
          <View style={styles.stepsProgress}>
            <ProgressRing
              progress={progress}
              size={100}
              strokeWidth={6}
              color={Colors.stepsPrimary}
              centerText={`${percentage}%`}
              centerSubtext="Complete"
            />
            
            <Text variant="bodyMedium" style={styles.percentageText}>
              {percentage}% of daily goal
            </Text>
          </View>
        </View>
        
        {progress >= 1 && (
          <Button
            mode="contained"
            onPress={() => Alert.alert('🎉 Goal Achieved!', 'Congratulations on reaching your step goal!')}
            style={styles.celebrationButton}
            buttonColor={Colors.stepsPrimary}
            icon={() => <TrophyIcon size={16} color="white" />}
          >
            Goal Achieved! 🎉
          </Button>
        )}
      </ModernCard>

      {/* Weekly Chart */}
      <ModernCard 
        title="This Week's Progress"
        subtitle="Track your daily step count"
        style={styles.chartCard}
      >
        <View style={styles.chartContainer}>
          {weeklyData.map((day, index) => (
            <View key={index} style={styles.chartBar}>
              <View style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: maxSteps > 0 ? (day.steps / maxSteps) * 100 : 0,
                      backgroundColor: day.steps >= preferences.stepGoal ? Colors.success : Colors.stepsPrimary
                    }
                  ]} 
                />
              </View>
              <Text variant="bodySmall" style={styles.dayLabel}>
                {day.day}
              </Text>
              <Text variant="bodySmall" style={styles.stepsLabel}>
                {day.steps.toLocaleString()}
              </Text>
              {day.steps >= preferences.stepGoal && (
                <Text style={styles.goalBadge}>🎯</Text>
              )}
            </View>
          ))}
        </View>
        
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: Colors.success }]} />
            <Text variant="bodySmall" style={styles.legendText}>Goal Met</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: Colors.stepsPrimary }]} />
            <Text variant="bodySmall" style={styles.legendText}>In Progress</Text>
          </View>
        </View>
      </ModernCard>

      {/* Pedometer Status */}
      <ModernCard 
        title="Device Status"
        style={styles.statusCard}
      >
        {isPedometerAvailable ? (
          <View style={styles.statusRow}>
            <Text variant="bodyMedium" style={styles.statusText}>
              ✅ Pedometer is available and tracking your steps
            </Text>
          </View>
        ) : (
          <View style={styles.statusRow}>
            <Text variant="bodyMedium" style={styles.statusText}>
              ⚠️ Pedometer not available on this device
            </Text>
            <Text variant="bodySmall" style={styles.statusSubtext}>
              Steps will be manually entered or synced from your device's health app
            </Text>
          </View>
        )}
      </ModernCard>

      {/* Manual Entry (for devices without pedometer) */}
      {!isPedometerAvailable && (
        <ModernCard 
          title="Manual Step Entry"
          style={styles.manualCard}
        >
          <Text variant="bodyMedium" style={styles.manualText}>
            Since your device doesn't have a pedometer, you can manually enter your steps or sync from your health app.
          </Text>
          <Button
            mode="outlined"
            onPress={() => Alert.alert('Coming Soon', 'Manual step entry will be available in the next update. You\'ll be able to enter your daily step count manually or sync from your health app.')}
            style={styles.manualButton}
            buttonColor={Colors.stepsPrimary}
            textColor={Colors.stepsPrimary}
            icon={() => <Text style={{ color: Colors.stepsPrimary, fontSize: 16 }}>👟</Text>}
          >
            Add Steps Manually
          </Button>
        </ModernCard>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    color: Colors.textSecondary,
  },
  stepsCard: {
    backgroundColor: Colors.stepsBackground,
    marginBottom: Spacing.lg,
  },
  stepsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  stepsIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.stepsPrimary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepsProgress: {
    flex: 1,
    alignItems: 'center',
  },
  percentageText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: Spacing.sm,
  },
  celebrationButton: {
    marginTop: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  chartCard: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.lg,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: Spacing.lg,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 80,
    justifyContent: 'flex-end',
    marginBottom: Spacing.sm,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    minHeight: 4,
  },
  dayLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  stepsLabel: {
    color: Colors.textPrimary,
    fontSize: 10,
    textAlign: 'center',
  },
  goalBadge: {
    fontSize: 12,
    marginTop: 2,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.md,
    gap: Spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  statusCard: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.lg,
  },
  statusRow: {
    marginBottom: Spacing.sm,
  },
  statusText: {
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  statusSubtext: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  manualCard: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.lg,
  },
  manualText: {
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  manualButton: {
    alignSelf: 'center',
    borderRadius: BorderRadius.md,
  },
});

export default StepsScreen;
