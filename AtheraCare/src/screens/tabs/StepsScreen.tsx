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
  
  const [currentSteps, setCurrentSteps] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  const stepGoal = preferences.stepGoal;
  const progress = currentSteps / stepGoal;
  const percentage = Math.round(progress * 100);

  useEffect(() => {
    checkPedometerAvailability();
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const checkPedometerAvailability = async () => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(isAvailable);
      
      if (isAvailable) {
        startStepCounting();
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error checking pedometer availability:', error);
      setIsPedometerAvailable(false);
      setLoading(false);
    }
  };

  const startStepCounting = async () => {
    try {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 1);

      const { steps } = await Pedometer.getStepCountAsync(start, end);
      setCurrentSteps(steps || 0);

      // Subscribe to step updates
      const subscription = Pedometer.watchStepCount((result) => {
        setCurrentSteps(result.steps);
      });

      setSubscription(subscription);
    } catch (error) {
      console.error('Error starting step counting:', error);
      // Fallback to mock data for testing
      setCurrentSteps(Math.floor(Math.random() * stepGoal));
    }
  };

  const generateMockWeeklyData = () => {
    return Array.from({ length: 7 }, () => Math.floor(Math.random() * stepGoal));
  };

  const getDayLabel = (index: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    const dayIndex = (today - 6 + index + 7) % 7;
    return days[dayIndex];
  };

  const getBarHeight = (steps: number) => {
    const maxSteps = Math.max(...weeklyData, stepGoal);
    return Math.max((steps / maxSteps) * 100, 10);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text variant="bodyLarge">Checking step counter...</Text>
      </View>
    );
  }

  if (!isPedometerAvailable) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          👟 Step Tracking
        </Text>
        
        <Text variant="bodyLarge" style={styles.subtitle}>
          Step counting is not available on this device
        </Text>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.infoTitle}>
              Device Compatibility
            </Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              Step counting requires a device with a built-in pedometer sensor. 
              This feature works best on newer smartphones and smartwatches.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.mockCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.mockTitle}>
              Demo Mode
            </Text>
            <Text variant="bodyMedium" style={styles.mockText}>
              For now, you can see how the interface would look with sample data.
            </Text>
            <Button 
              mode="contained" 
              onPress={() => setWeeklyData(generateMockWeeklyData())}
              style={styles.demoButton}
            >
              Generate Demo Data
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium" style={styles.title}>
        👟 Daily Steps
      </Text>
      
      <Text variant="bodyLarge" style={styles.subtitle}>
        Track your daily activity and reach your goal
      </Text>

      {/* Today's Progress */}
      <Card style={styles.progressCard}>
        <Card.Content>
          <View style={styles.progressHeader}>
            <Text variant="titleLarge">Today's Progress</Text>
            <Text variant="headlineLarge" style={styles.stepCount}>
              {currentSteps.toLocaleString()}
            </Text>
            <Text variant="bodyMedium" style={styles.goalText}>
              Goal: {stepGoal.toLocaleString()} steps
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

          {currentSteps >= stepGoal && (
            <View style={styles.celebration}>
              <Text variant="titleMedium" style={styles.celebrationText}>
                🎉 Goal Achieved! Great job!
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Weekly Overview */}
      <Card style={styles.weeklyCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            This Week
          </Text>
          
          <View style={styles.weeklyChart}>
            {weeklyData.map((steps, index) => (
              <View key={index} style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: getBarHeight(steps),
                      backgroundColor: steps >= stepGoal ? theme.colors.primary : theme.colors.outline
                    }
                  ]} 
                />
                <Text variant="bodySmall" style={styles.barLabel}>
                  {getDayLabel(index)}
                </Text>
                <Text variant="bodySmall" style={styles.barValue}>
                  {steps.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <View style={styles.actions}>
        <Button
          mode="outlined"
          onPress={() => Alert.alert('Info', 'Step counting is automatic when available')}
          style={styles.actionButton}
          icon="information"
        >
          How It Works
        </Button>
        
        <Button
          mode="outlined"
          onPress={() => Alert.alert('Info', 'Your step goal is set to ' + stepGoal.toLocaleString() + ' steps')}
          style={styles.actionButton}
          icon="target"
        >
          View Goal
        </Button>
      </View>

      {/* Tips */}
      <Card style={styles.tipsCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.tipsTitle}>
            💡 Tips to Reach Your Goal
          </Text>
          <Text variant="bodyMedium" style={styles.tipText}>
            • Take the stairs instead of the elevator
          </Text>
          <Text variant="bodyMedium" style={styles.tipText}>
            • Park further away from your destination
          </Text>
          <Text variant="bodyMedium" style={styles.tipText}>
            • Take walking breaks during work
          </Text>
          <Text variant="bodyMedium" style={styles.tipText}>
            • Walk while talking on the phone
          </Text>
        </Card.Content>
      </Card>
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
  progressCard: {
    marginBottom: 20,
    elevation: 2,
  },
  progressHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  stepCount: {
    color: '#007AFF',
    marginVertical: 10,
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
  },
  celebration: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#34C759',
    borderRadius: 8,
  },
  celebrationText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  weeklyCard: {
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 20,
    color: '#333',
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    marginBottom: 8,
  },
  barLabel: {
    color: '#666',
    marginBottom: 4,
  },
  barValue: {
    color: '#333',
    fontSize: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
  },
  infoCard: {
    marginBottom: 20,
    elevation: 2,
  },
  infoTitle: {
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    color: '#666',
    lineHeight: 20,
  },
  mockCard: {
    marginBottom: 20,
    elevation: 2,
  },
  mockTitle: {
    marginBottom: 10,
    color: '#333',
  },
  mockText: {
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  demoButton: {
    marginTop: 10,
  },
  tipsCard: {
    elevation: 2,
  },
  tipsTitle: {
    marginBottom: 15,
    color: '#333',
  },
  tipText: {
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default StepsScreen;
