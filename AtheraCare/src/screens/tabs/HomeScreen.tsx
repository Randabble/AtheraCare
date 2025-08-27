import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, ProgressBar, useTheme } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { getMedications } from '../../utils/medications';
import { getTodayHydration } from '../../utils/hydration';
import { Medication } from '../../utils/medications';
import { HydrationLog } from '../../utils/hydration';

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [hydration, setHydration] = useState<HydrationLog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user) return;
    
    try {
      const [meds, todayHydration] = await Promise.all([
        getMedications(user.uid),
        getTodayHydration(user.uid)
      ]);
      
      setMedications(meds);
      setHydration(todayHydration);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTodaysMeds = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return medications.filter(med => 
      med.days.includes(today) && !med.takenToday
    );
  };

  const todaysMeds = getTodaysMeds();
  const waterProgress = hydration ? hydration.totalOz / hydration.goalOz : 0;
  const stepsProgress = 0.6; // Placeholder - will be replaced with actual step data

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text variant="bodyLarge">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium" style={styles.welcomeText}>
        Welcome back, {user?.email?.split('@')[0]}! 👋
      </Text>
      
      <Text variant="bodyLarge" style={styles.subtitle}>
        Here's your health summary for today
      </Text>

      {/* Today's Medications Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text variant="titleLarge">💊 Today's Medications</Text>
            <Text variant="bodyMedium" style={styles.countText}>
              {todaysMeds.length} remaining
            </Text>
          </View>
          
          {todaysMeds.length > 0 ? (
            <View style={styles.medsList}>
              {todaysMeds.slice(0, 3).map((med, index) => (
                <Text key={index} variant="bodyMedium" style={styles.medItem}>
                  • {med.name}
                </Text>
              ))}
              {todaysMeds.length > 3 && (
                <Text variant="bodySmall" style={styles.moreText}>
                  +{todaysMeds.length - 3} more
                </Text>
              )}
            </View>
          ) : (
            <Text variant="bodyMedium" style={styles.emptyText}>
              All medications taken! 🎉
            </Text>
          )}
          
          <Button 
            mode="contained" 
            style={styles.actionButton}
            onPress={() => {/* Navigate to Meds tab */}}
          >
            View All Medications
          </Button>
        </Card.Content>
      </Card>

      {/* Water Intake Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text variant="titleLarge">💧 Water Intake</Text>
            <Text variant="bodyMedium" style={styles.countText}>
              {hydration?.totalOz || 0} / {hydration?.goalOz || 64} oz
            </Text>
          </View>
          
          <ProgressBar 
            progress={waterProgress} 
            color={theme.colors.primary}
            style={styles.progressBar}
          />
          
          <Button 
            mode="contained" 
            style={styles.actionButton}
            onPress={() => {/* Navigate to Water tab */}}
          >
            Add Water
          </Button>
        </Card.Content>
      </Card>

      {/* Steps Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text variant="titleLarge">👟 Daily Steps</Text>
            <Text variant="bodyMedium" style={styles.countText}>
              6,000 / 10,000 steps
            </Text>
          </View>
          
          <ProgressBar 
            progress={stepsProgress} 
            color={theme.colors.primary}
            style={styles.progressBar}
          />
          
          <Button 
            mode="contained" 
            style={styles.actionButton}
            onPress={() => {/* Navigate to Steps tab */}}
          >
            View Activity
          </Button>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text variant="titleMedium" style={styles.quickActionsTitle}>
          Quick Actions
        </Text>
        <View style={styles.actionButtons}>
          <Button 
            mode="outlined" 
            style={styles.quickActionButton}
            icon="plus"
            onPress={() => {/* Add medication */}}
          >
            Add Med
          </Button>
          <Button 
            mode="outlined" 
            style={styles.quickActionButton}
            icon="cup-water"
            onPress={() => {/* Add water */}}
          >
            Add Water
          </Button>
        </View>
      </View>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
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
  countText: {
    color: '#666',
    fontWeight: '500',
  },
  medsList: {
    marginBottom: 15,
  },
  medItem: {
    marginBottom: 5,
    color: '#333',
  },
  moreText: {
    color: '#666',
    fontStyle: 'italic',
  },
  emptyText: {
    color: '#34C759',
    textAlign: 'center',
    marginBottom: 15,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 15,
  },
  actionButton: {
    marginTop: 5,
  },
  quickActions: {
    marginTop: 10,
  },
  quickActionsTitle: {
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickActionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default HomeScreen;
