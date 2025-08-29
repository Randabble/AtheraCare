import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, ProgressBar, TextInput, useTheme } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { getTodayHydration, addWater, resetTodayWater, updateWaterGoal } from '../../utils/hydration';
import { updateWaterTracking } from '../../utils/activityTracker';
import CustomAlert from '../../components/CustomAlert';

const WaterScreen: React.FC = () => {
  const { user } = useAuth();
  const { preferences } = useOnboarding();
  const theme = useTheme();
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal, setWaterGoal] = useState(64);
  const [loading, setLoading] = useState(true);
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [newGoal, setNewGoal] = useState('');
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

  const quickAmounts = [8, 12, 16, 20];

  useEffect(() => {
    if (user) {
      loadHydration();
    }
  }, [user]);

  useEffect(() => {
    // Update water goal from preferences
    if (preferences.waterGoal) {
      setWaterGoal(preferences.waterGoal);
    }
  }, [preferences.waterGoal]);

  const loadHydration = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const todayHydration = await getTodayHydration(user.uid);
      
      if (todayHydration) {
        setWaterIntake(todayHydration.totalOz);
        setWaterGoal(todayHydration.goalOz);
      }
    } catch (error) {
      console.error('Error loading hydration:', error);
      showAlert('Error', 'Failed to load hydration data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWater = async (amount: number) => {
    if (!user) return;

    try {
      setLoading(true);
      await addWater(user.uid, amount, waterGoal);
      
      // Update activity tracker
      const today = new Date().toISOString().split('T')[0];
      const newTotal = waterIntake + amount;
      await updateWaterTracking(user.uid, today, newTotal, waterGoal, 0); // TODO: Calculate actual streak
      
      await loadHydration();
      showAlert('Success', `Added ${amount} oz of water! 💧`);
    } catch (error) {
      console.error('Error adding water:', error);
      showAlert('Error', 'Failed to add water');
    } finally {
      setLoading(false);
    }
  };

  const handleResetWater = async () => {
    if (!user) return;

    showAlert(
      'Reset Water Intake',
      'Are you sure you want to reset today\'s water intake?'
    );
  };

  const confirmResetWater = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      await resetTodayWater(user.uid);
      await loadHydration();
      showAlert('Success', 'Water intake reset!');
    } catch (error) {
      console.error('Error resetting water:', error);
      showAlert('Error', 'Failed to reset water intake');
    } finally {
      setLoading(false);
    }
    hideAlert();
  };

  const handleUpdateGoal = async () => {
    if (!user || !newGoal.trim()) return;

    const goal = parseInt(newGoal);
    if (isNaN(goal) || goal <= 0) {
      showAlert('Error', 'Please enter a valid goal amount');
      return;
    }

    try {
      setLoading(true);
      await updateWaterGoal(user.uid, goal);
      setWaterGoal(goal);
      setShowGoalInput(false);
      setNewGoal('');
      showAlert('Success', `Water goal updated to ${goal} oz!`);
    } catch (error) {
      console.error('Error updating water goal:', error);
      showAlert('Error', 'Failed to update water goal');
    } finally {
      setLoading(false);
    }
  };

  const progress = waterIntake / waterGoal;
  const percentage = Math.round(progress * 100);

  if (loading && waterIntake === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text variant="bodyLarge">Loading hydration data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium" style={styles.title}>
        💧 Water Tracker
      </Text>
      
      <Text variant="bodyLarge" style={styles.subtitle}>
        Stay hydrated throughout the day
      </Text>

      {/* Water Progress Card */}
      <Card style={styles.progressCard}>
        <Card.Content>
          <View style={styles.progressHeader}>
            <Text variant="titleLarge">Today's Progress</Text>
            <Text variant="headlineLarge" style={styles.waterAmount}>
              {waterIntake} oz
            </Text>
            <Text variant="bodyMedium" style={styles.goalText}>
              Goal: {waterGoal} oz
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
        </Card.Content>
      </Card>

      {/* Quick Add Buttons */}
      <Card style={styles.quickAddCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Quick Add
          </Text>
          <Text variant="bodyMedium" style={styles.sectionSubtitle}>
            Tap to add water quickly
          </Text>
          
          <View style={styles.quickAddButtons}>
            {quickAmounts.map((amount) => (
              <Button
                key={amount}
                mode="outlined"
                onPress={() => handleAddWater(amount)}
                disabled={loading}
                style={styles.quickAddButton}
                contentStyle={styles.quickAddButtonContent}
              >
                {amount} oz
              </Button>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Custom Amount */}
      <Card style={styles.customAmountCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Custom Amount
          </Text>
          <View style={styles.customAmountRow}>
            <TextInput
              label="Ounces"
              value={newGoal}
              onChangeText={setNewGoal}
              keyboardType="numeric"
              style={styles.customAmountInput}
              mode="outlined"
              right={<TextInput.Affix text="oz" />}
            />
            <Button
              mode="contained"
              onPress={() => handleAddWater(parseInt(newGoal) || 0)}
              disabled={loading || !newGoal.trim() || parseInt(newGoal) <= 0}
              style={styles.customAddButton}
            >
              Add
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          mode="outlined"
          onPress={() => setShowGoalInput(!showGoalInput)}
          style={styles.actionButton}
          icon="target"
        >
          Change Goal
        </Button>
        
        <Button
          mode="outlined"
          onPress={handleResetWater}
          disabled={loading}
          style={styles.actionButton}
          icon="refresh"
        >
          Reset Today
        </Button>
      </View>

      {/* Goal Input Modal */}
      {showGoalInput && (
        <Card style={styles.goalInputCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Set New Water Goal
            </Text>
            <TextInput
              label="Daily Goal (oz)"
              value={newGoal}
              onChangeText={setNewGoal}
              keyboardType="numeric"
              style={styles.goalInput}
              mode="outlined"
              right={<TextInput.Affix text="oz" />}
            />
            <View style={styles.goalInputButtons}>
              <Button
                mode="outlined"
                onPress={() => setShowGoalInput(false)}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleUpdateGoal}
                disabled={loading || !newGoal.trim() || parseInt(newGoal) <= 0}
                style={styles.updateButton}
              >
                Update Goal
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}
      
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onConfirm={alertTitle === 'Reset Water Intake' ? confirmResetWater : hideAlert}
        onCancel={hideAlert}
        showCancel={alertTitle === 'Reset Water Intake'}
        confirmText={alertTitle === 'Reset Water Intake' ? 'Reset' : 'OK'}
        cancelText="Cancel"
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
  progressCard: {
    marginBottom: 20,
    elevation: 2,
  },
  progressHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  waterAmount: {
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
  quickAddCard: {
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 8,
    color: '#333',
  },
  sectionSubtitle: {
    color: '#666',
    marginBottom: 15,
  },
  quickAddButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickAddButton: {
    flex: 1,
    minWidth: '45%',
  },
  quickAddButtonContent: {
    paddingVertical: 8,
  },
  customAmountCard: {
    marginBottom: 20,
    elevation: 2,
  },
  customAmountRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  customAmountInput: {
    flex: 2,
  },
  customAddButton: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
  },
  goalInputCard: {
    elevation: 2,
  },
  goalInput: {
    marginBottom: 15,
  },
  goalInputButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
  },
  updateButton: {
    flex: 1,
  },
});

export default WaterScreen;
