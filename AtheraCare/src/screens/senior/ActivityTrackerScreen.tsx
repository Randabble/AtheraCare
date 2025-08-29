import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, Chip, useTheme, SegmentedButtons } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { 
  DailyActivity, 
  WeeklyStats,
  getWeeklyActivity, 
  calculateWeeklyStats,
  getCurrentWeekRange,
  getPreviousWeekRange,
  updateMedicationTracking,
  updateWaterTracking,
  updateStepsTracking,
  updateMoodEnergy
} from '../../utils/activityTracker';
import { testFirebaseConnection, testCollectionPermissions } from '../../utils/firebaseTest';
import ActivityChart from '../../components/ActivityChart';
import CustomAlert from '../../components/CustomAlert';

const ActivityTrackerScreen: React.FC = () => {
  const { user } = useAuth();
  const { preferences } = useOnboarding();
  const theme = useTheme();
  
  const [currentWeekData, setCurrentWeekData] = useState<DailyActivity[]>([]);
  const [previousWeekData, setPreviousWeekData] = useState<DailyActivity[]>([]);
  const [currentWeekStats, setCurrentWeekStats] = useState<WeeklyStats | null>(null);
  const [previousWeekStats, setPreviousWeekStats] = useState<WeeklyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<'current' | 'previous'>('current');
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<number | null>(null);
  
  // Custom alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

  const testFirebasePermissions = async () => {
    try {
      const connectionTest = await testFirebaseConnection();
      const permissionsTest = await testCollectionPermissions('dailyActivities');
      
      if (connectionTest && permissionsTest) {
        showAlert('Firebase Test', '✅ All tests passed! Firebase is working correctly.');
      } else {
        showAlert('Firebase Test', '❌ Some tests failed. Check the console for details.');
      }
    } catch (error) {
      console.error('Error testing Firebase:', error);
      showAlert('Firebase Test', '❌ Test failed with error. Check the console.');
    }
  };

  useEffect(() => {
    if (user) {
      loadActivityData();
    }
  }, [user, selectedWeek]);

  const loadActivityData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const currentRange = getCurrentWeekRange();
      const previousRange = getPreviousWeekRange();
      
      const [currentData, previousData] = await Promise.all([
        getWeeklyActivity(user.uid, currentRange.startDate, currentRange.endDate),
        getWeeklyActivity(user.uid, previousRange.startDate, previousRange.endDate)
      ]);
      
      setCurrentWeekData(currentData);
      setPreviousWeekData(previousData);
      setCurrentWeekStats(calculateWeeklyStats(currentData));
      setPreviousWeekStats(calculateWeeklyStats(previousData));
      
    } catch (error) {
      console.error('Error loading activity data:', error);
      // Don't show alert for empty data, just log the error
      if (error instanceof Error && error.message.includes('permissions')) {
        showAlert('Permission Error', 'Please check your Firebase security rules for the dailyActivities collection');
      } else if (error instanceof Error && error.message.includes('network')) {
        showAlert('Network Error', 'Please check your internet connection and try again');
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadActivityData();
    setRefreshing(false);
  };

  const handleMoodSelect = async (mood: number) => {
    if (!user) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      await updateMoodEnergy(user.uid, today, mood, selectedEnergy || undefined);
      setSelectedMood(mood);
      showAlert('Success', 'Mood updated successfully!');
      await loadActivityData(); // Refresh data
    } catch (error) {
      console.error('Error updating mood:', error);
      showAlert('Error', 'Failed to update mood');
    }
  };

  const handleEnergySelect = async (energy: number) => {
    if (!user) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      await updateMoodEnergy(user.uid, today, selectedMood || undefined, energy);
      setSelectedEnergy(energy);
      showAlert('Success', 'Energy level updated successfully!');
      await loadActivityData(); // Refresh data
    } catch (error) {
      console.error('Error updating energy:', error);
      showAlert('Error', 'Failed to update energy level');
    }
  };

  const getSelectedData = () => {
    return selectedWeek === 'current' ? currentWeekData : previousWeekData;
  };

  const getSelectedStats = () => {
    return selectedWeek === 'current' ? currentWeekStats : previousWeekStats;
  };

  const getWeekLabel = () => {
    if (selectedWeek === 'current') {
      const range = getCurrentWeekRange();
      return `This Week (${range.startDate} - ${range.endDate})`;
    } else {
      const range = getPreviousWeekRange();
      return `Last Week (${range.startDate} - ${range.endDate})`;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text variant="bodyLarge">Loading your activity data...</Text>
      </View>
    );
  }

  // If no data is available, show a message
  if (!currentWeekData.length && !previousWeekData.length) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          📊 Activity Tracker
        </Text>
        
        <Text variant="bodyLarge" style={styles.subtitle}>
          Track your daily progress and weekly trends
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              No Data Available
            </Text>
            <Text variant="bodyMedium" style={styles.noDataText}>
              Start tracking your medications, water intake, and steps to see your activity data here.
            </Text>
            <Text variant="bodySmall" style={styles.noDataSubtext}>
              Data will appear after you use the other tabs to log your activities.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }

  const stats = getSelectedStats();
  const weekData = getSelectedData();

  // Safety check - if stats is null, create default stats
  if (!stats) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          📊 Activity Tracker
        </Text>
        
        <Text variant="bodyLarge" style={styles.subtitle}>
          Track your daily progress and weekly trends
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Loading Statistics...
            </Text>
            <Text variant="bodyMedium" style={styles.noDataText}>
              Please wait while we calculate your weekly statistics.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text variant="headlineMedium" style={styles.title}>
        📊 Activity Tracker
      </Text>
      
      <Text variant="bodyLarge" style={styles.subtitle}>
        Track your daily progress and weekly trends
      </Text>

      {/* Firebase Test Button - Remove this after fixing permissions */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            🔧 Firebase Debug
          </Text>
          <Text variant="bodyMedium" style={styles.debugText}>
            If you're seeing permission errors, tap this button to test Firebase connection and permissions.
          </Text>
          <Button
            mode="outlined"
            onPress={testFirebasePermissions}
            style={styles.testButton}
            icon="bug"
          >
            Test Firebase Permissions
          </Button>
        </Card.Content>
      </Card>

      {/* Week Selector */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Week Selection
          </Text>
          <SegmentedButtons
            value={selectedWeek}
            onValueChange={(value) => setSelectedWeek(value as 'current' | 'previous')}
            buttons={[
              { value: 'current', label: 'This Week' },
              { value: 'previous', label: 'Last Week' }
            ]}
          />
          <Text variant="bodySmall" style={styles.weekLabel}>
            {getWeekLabel()}
          </Text>
        </Card.Content>
      </Card>

      {/* Weekly Summary Stats */}
      {stats && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              📈 Weekly Summary
            </Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text variant="headlineSmall" style={styles.statNumber}>
                  {stats.medications.completionRate.toFixed(0)}%
                </Text>
                                 <Text variant="bodySmall">Medication</Text>
                 <Text style={styles.captionText}>Completion Rate</Text>
               </View>
               
               <View style={styles.statItem}>
                 <Text variant="headlineSmall" style={styles.statNumber}>
                   {stats.water.averagePercentage.toFixed(0)}%
                 </Text>
                 <Text variant="bodySmall">Water</Text>
                 <Text style={styles.captionText}>Average Goal</Text>
               </View>
               
               <View style={styles.statItem}>
                 <Text variant="headlineSmall" style={styles.statNumber}>
                   {stats.steps.averagePercentage.toFixed(0)}%
                 </Text>
                 <Text variant="bodySmall">Steps</Text>
                 <Text style={styles.captionText}>Average Goal</Text>
               </View>
               
               <View style={styles.statItem}>
                 <Text variant="headlineSmall" style={styles.statNumber}>
                   {stats.totalDays}
                 </Text>
                 <Text variant="bodySmall">Days</Text>
                 <Text style={styles.captionText}>Tracked</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Medication Chart */}
      <ActivityChart
        title="💊 Medication Adherence"
        data={weekData}
        type="medications"
      />

      {/* Water Chart */}
      <ActivityChart
        title="💧 Water Intake"
        data={weekData}
        type="water"
      />

      {/* Steps Chart */}
      <ActivityChart
        title="👟 Daily Steps"
        data={weekData}
        type="steps"
      />

      {/* Today's Mood & Energy */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            😊 Today's Mood & Energy
          </Text>
          
          <View style={styles.moodEnergyContainer}>
            <View style={styles.moodSection}>
              <Text variant="bodyMedium" style={styles.moodLabel}>
                How are you feeling today?
              </Text>
              <View style={styles.moodButtons}>
                {[1, 2, 3, 4, 5].map((mood) => (
                  <Chip
                    key={mood}
                    selected={selectedMood === mood}
                    onPress={() => handleMoodSelect(mood)}
                    style={styles.moodChip}
                    textStyle={styles.moodChipText}
                  >
                    {mood === 1 ? '😢' : mood === 2 ? '😕' : mood === 3 ? '😐' : mood === 4 ? '🙂' : '😄'}
                  </Chip>
                ))}
              </View>
            </View>
            
            <View style={styles.energySection}>
              <Text variant="bodyMedium" style={styles.energyLabel}>
                Energy level today?
              </Text>
              <View style={styles.energyButtons}>
                {[1, 2, 3, 4, 5].map((energy) => (
                  <Chip
                    key={energy}
                    selected={selectedEnergy === energy}
                    onPress={() => handleEnergySelect(energy)}
                    style={styles.energyChip}
                    textStyle={styles.energyChipText}
                  >
                    {energy === 1 ? '😴' : energy === 2 ? '😴' : energy === 3 ? '😐' : energy === 4 ? '😊' : '⚡'}
                  </Chip>
                ))}
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Mood & Energy Chart */}
      <ActivityChart
        title="😊 Mood & Energy Trends"
        data={weekData}
        type="mood"
        height={150}
      />

      {/* Detailed Stats */}
      {stats && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              📋 Detailed Statistics
            </Text>
            
            <View style={styles.detailedStats}>
              <View style={styles.detailItem}>
                <Text variant="bodyMedium" style={styles.detailLabel}>
                  Medications Taken:
                </Text>
                <Text variant="bodyLarge" style={styles.detailValue}>
                  {stats.medications.totalTaken} / {stats.medications.totalTaken + stats.medications.totalMissed}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text variant="bodyMedium" style={styles.detailLabel}>
                  Total Water:
                </Text>
                <Text variant="bodyLarge" style={styles.detailValue}>
                  {stats.water.totalOz.toFixed(0)} oz
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text variant="bodyMedium" style={styles.detailLabel}>
                  Total Steps:
                </Text>
                <Text variant="bodyLarge" style={styles.detailValue}>
                  {stats.steps.totalSteps.toLocaleString()}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text variant="bodyMedium" style={styles.detailLabel}>
                  Average Mood:
                </Text>
                <Text variant="bodyLarge" style={styles.detailValue}>
                  {stats.mood.average > 0 ? `${stats.mood.average.toFixed(1)}/5` : 'Not tracked'}
                </Text>
              </View>
              
                             <View style={styles.detailItem}>
                 <Text variant="bodyMedium" style={styles.detailLabel}>
                   Average Energy:
                 </Text>
                 <Text variant="bodyLarge" style={styles.detailValue}>
                   {stats.energy.average > 0 ? `${stats.energy.average.toFixed(1)}/5` : 'Not tracked'}
                 </Text>
               </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Custom Alert */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onConfirm={hideAlert}
        confirmText="OK"
      />
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
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 16,
    color: '#333',
    fontWeight: '500',
  },
  weekLabel: {
    textAlign: 'center',
    marginTop: 8,
    color: '#666',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    marginBottom: 16,
    minWidth: 80,
  },
  statNumber: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  moodEnergyContainer: {
    gap: 20,
  },
  moodSection: {
    gap: 8,
  },
  moodLabel: {
    color: '#333',
    fontWeight: '500',
  },
  moodButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moodChip: {
    marginHorizontal: 2,
  },
  moodChipText: {
    fontSize: 16,
  },
  energySection: {
    gap: 8,
  },
  energyLabel: {
    color: '#333',
    fontWeight: '500',
  },
  energyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  energyChip: {
    marginHorizontal: 2,
  },
  energyChipText: {
    fontSize: 16,
  },
  detailedStats: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    color: '#666',
    flex: 1,
  },
  detailValue: {
    color: '#333',
    fontWeight: '500',
  },
  captionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  noDataSubtext: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    fontStyle: 'italic',
  },
  debugText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  testButton: {
    alignSelf: 'center',
  },
});

export default ActivityTrackerScreen;
