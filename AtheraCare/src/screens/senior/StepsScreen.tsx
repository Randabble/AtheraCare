import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, ProgressBar, useTheme } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { Pedometer } from 'expo-sensors';

const StepsScreen: React.FC = () => {
  const { user } = useAuth();
  const { preferences } = useOnboarding();
  const theme = useTheme();
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
        const subscription = Pedometer.watchStepCount((result) => {
          setSteps(result.steps);
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
      <Text variant="headlineMedium" style={styles.title}>
        👟 Step Tracker
      </Text>
      
      <Text variant="bodyLarge" style={styles.subtitle}>
        Track your daily activity
      </Text>

      {/* Today's Steps Card */}
      <Card style={styles.stepsCard}>
        <Card.Content>
          <View style={styles.stepsHeader}>
            <Text variant="titleLarge">Today's Steps</Text>
            <Text variant="headlineLarge" style={styles.stepsAmount}>
              {steps.toLocaleString()}
            </Text>
            <Text variant="bodyMedium" style={styles.goalText}>
              Goal: {preferences.stepGoal.toLocaleString()} steps
            </Text>
          </View>
          
          <ProgressBar 
            progress={progress} 
            color={theme.colors.primary}
            style={styles.progressBar}
          />
          
          <Text variant="bodyMedium" style={styles.percentageText}>
            {percentage}% of daily goal
          </Text>
          
          {progress >= 1 && (
            <Button
              mode="contained"
              onPress={() => Alert.alert('🎉 Goal Achieved!', 'Congratulations on reaching your step goal!')}
              style={styles.celebrationButton}
              icon="trophy"
            >
              Goal Achieved! 🎉
            </Button>
          )}
        </Card.Content>
      </Card>

      {/* Weekly Chart */}
      <Card style={styles.chartCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            This Week's Progress
          </Text>
          
          <View style={styles.chartContainer}>
            {weeklyData.map((day, index) => (
              <View key={index} style={styles.chartBar}>
                <View style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: maxSteps > 0 ? (day.steps / maxSteps) * 100 : 0,
                        backgroundColor: day.steps >= preferences.stepGoal ? '#4CAF50' : theme.colors.primary
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
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Pedometer Status */}
      <Card style={styles.statusCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Device Status
          </Text>
          
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
        </Card.Content>
      </Card>

      {/* Manual Entry (for devices without pedometer) */}
      {!isPedometerAvailable && (
        <Card style={styles.manualCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Manual Step Entry
            </Text>
            <Text variant="bodyMedium" style={styles.manualText}>
              Since your device doesn't have a pedometer, you can manually enter your steps or sync from your health app.
            </Text>
            <Button
              mode="outlined"
              onPress={() => Alert.alert('Coming Soon', 'Manual step entry will be available in the next update.')}
              style={styles.manualButton}
              icon="plus"
            >
              Add Steps Manually
            </Button>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  stepsCard: {
    marginBottom: 20,
    elevation: 2,
  },
  stepsHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  stepsAmount: {
    color: '#4CAF50',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  goalText: {
    color: '#666',
    marginBottom: 15,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  percentageText: {
    textAlign: 'center',
    color: '#666',
    fontWeight: '500',
    marginBottom: 15,
  },
  celebrationButton: {
    backgroundColor: '#4CAF50',
  },
  chartCard: {
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 15,
    color: '#333',
    fontWeight: '500',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 20,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 80,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    minHeight: 4,
  },
  dayLabel: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  stepsLabel: {
    color: '#333',
    fontSize: 10,
    textAlign: 'center',
  },
  statusCard: {
    marginBottom: 20,
    elevation: 2,
  },
  statusRow: {
    marginBottom: 10,
  },
  statusText: {
    color: '#333',
    marginBottom: 5,
  },
  statusSubtext: {
    color: '#666',
    fontSize: 12,
  },
  manualCard: {
    marginBottom: 20,
    elevation: 2,
  },
  manualText: {
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  manualButton: {
    alignSelf: 'center',
  },
});

export default StepsScreen;
