import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, ProgressBar, useTheme, Badge } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { getMedications } from '../../utils/medications';
import { getTodayHydration } from '../../utils/hydration';
import { Pedometer } from 'expo-sensors';

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { preferences } = useOnboarding();
  const theme = useTheme();
  const [medications, setMedications] = useState([]);
  const [hydration, setHydration] = useState(null);
  const [steps, setSteps] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadHomeData();
    }
  }, [user]);

  const loadHomeData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Load medications
      const meds = await getMedications(user.uid);
      setMedications(meds);
      
      // Load hydration
      const todayHydration = await getTodayHydration(user.uid);
      setHydration(todayHydration);
      
      // Load steps (mock for now, will be real in StepsScreen)
      setSteps(0);
      
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTodaysMeds = () => {
    if (!medications.length) return [];
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return medications.filter(med => 
      med.days && med.days.includes(today) && !med.takenToday
    );
  };

  const todaysMeds = getTodaysMeds();
  const medsTaken = medications.filter(med => med.takenToday).length;
  const totalMeds = medications.length;

  const waterProgress = hydration ? hydration.totalOz / preferences.waterGoal : 0;
  const stepsProgress = preferences.stepGoal > 0 ? steps / preferences.stepGoal : 0;

  const handleShareWin = (type: string) => {
    Alert.alert(
      'Share This Win! 🎉',
      `Great job! Would you like to share your ${type} achievement with your family?`,
      [
        { text: 'Not now', style: 'cancel' },
        { 
          text: 'Share!', 
          onPress: () => {
            // TODO: Implement share functionality
            Alert.alert('Shared!', 'Your family will see this win! 💕');
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text variant="bodyLarge">Loading your day...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium" style={styles.title}>
        Welcome back! 👋
      </Text>
      
      <Text variant="bodyLarge" style={styles.subtitle}>
        Here's how you're doing today
      </Text>

      {/* Medications Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text variant="titleLarge">💊 Today's Medications</Text>
            <Badge>{medsTaken}/{totalMeds}</Badge>
          </View>
          
          {todaysMeds.length > 0 ? (
            <View style={styles.medsList}>
              {todaysMeds.slice(0, 3).map((med, index) => (
                <Text key={index} variant="bodyMedium" style={styles.medItem}>
                  • {med.name}
                </Text>
              ))}
              {todaysMeds.length > 3 && (
                <Text variant="bodySmall" style={styles.moreMeds}>
                  +{todaysMeds.length - 3} more
                </Text>
              )}
            </View>
          ) : (
            <Text variant="bodyMedium" style={styles.noMeds}>
              All medications taken for today! 🎉
            </Text>
          )}
          
          <Button
            mode="contained"
            onPress={() => handleShareWin('medication streak')}
            style={styles.actionButton}
            icon="share"
          >
            Share This Win
          </Button>
        </Card.Content>
      </Card>

      {/* Water Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text variant="titleLarge">💧 Water Progress</Text>
            <Text variant="titleMedium" style={styles.waterAmount}>
              {hydration?.totalOz || 0} oz
            </Text>
          </View>
          
          <ProgressBar 
            progress={waterProgress} 
            color={theme.colors.primary}
            style={styles.progressBar}
          />
          
          <Text variant="bodyMedium" style={styles.progressText}>
            {Math.round(waterProgress * 100)}% of {preferences.waterGoal} oz goal
          </Text>
          
          {waterProgress >= 1 && (
            <Button
              mode="contained"
              onPress={() => handleShareWin('water goal')}
              style={styles.actionButton}
              icon="share"
            >
              Share This Win
            </Button>
          )}
        </Card.Content>
      </Card>

      {/* Steps Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text variant="titleLarge">👟 Today's Steps</Text>
            <Text variant="titleMedium" style={styles.stepsAmount}>
              {steps.toLocaleString()}
            </Text>
          </View>
          
          <ProgressBar 
            progress={stepsProgress} 
            color={theme.colors.primary}
            style={styles.progressBar}
          />
          
          <Text variant="bodyMedium" style={styles.progressText}>
            {Math.round(stepsProgress * 100)}% of {preferences.stepGoal.toLocaleString()} step goal
          </Text>
          
          {stepsProgress >= 1 && (
            <Button
              mode="contained"
              onPress={() => handleShareWin('step goal')}
              style={styles.actionButton}
              icon="share"
            >
              Share This Win
            </Button>
          )}
        </Card.Content>
      </Card>

      {/* Weekly Summary */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            📊 This Week
          </Text>
          <View style={styles.weeklyStats}>
            <View style={styles.stat}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {medsTaken}
              </Text>
              <Text variant="bodySmall">Medications</Text>
            </View>
            <View style={styles.stat}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {Math.round(waterProgress * 100)}%
              </Text>
              <Text variant="bodySmall">Water Goal</Text>
            </View>
            <View style={styles.stat}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {Math.round(stepsProgress * 100)}%
              </Text>
              <Text variant="bodySmall">Step Goal</Text>
            </View>
          </View>
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
  card: {
    marginBottom: 20,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    marginBottom: 15,
    color: '#333',
  },
  medsList: {
    marginBottom: 15,
  },
  medItem: {
    marginBottom: 5,
    color: '#333',
  },
  moreMeds: {
    color: '#666',
    fontStyle: 'italic',
  },
  noMeds: {
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '500',
  },
  waterAmount: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  stepsAmount: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 15,
  },
  actionButton: {
    marginTop: 10,
  },
  weeklyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
