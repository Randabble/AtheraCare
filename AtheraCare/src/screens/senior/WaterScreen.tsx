import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, ProgressBar, TextInput } from 'react-native-paper';
import ModernCard from '../../components/ModernCard';
import ProgressRing from '../../components/ProgressRing';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { getTodayHydration, addWater, resetTodayWater, updateWaterGoal } from '../../utils/hydration';
import { updateWaterTracking } from '../../utils/activityTracker';
import CustomAlert from '../../components/CustomAlert';
import { Colors, Spacing, BorderRadius } from '../../theme/colors';
import { WaterIcon, PlusIcon } from '../../components/icons/ModernIcons';

const WaterScreen: React.FC = () => {
  const { user } = useAuth();
  const { preferences } = useOnboarding();
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
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.title}>
          Water Tracker
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Stay hydrated throughout the day
        </Text>
      </View>

      {/* Water Progress Card */}
      <ModernCard style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View style={styles.waterIconContainer}>
            <WaterIcon size={48} color={Colors.waterPrimary} />
          </View>
          <View style={styles.progressInfo}>
            <Text variant="headlineLarge" style={styles.waterAmount}>
              {waterIntake} oz
            </Text>
            <Text variant="bodyMedium" style={styles.goalText}>
              Goal: {waterGoal} oz
            </Text>
          </View>
        </View>
        
        <ProgressRing
          progress={progress}
          size={120}
          strokeWidth={8}
          color={Colors.waterPrimary}
          centerText={`${percentage}%`}
          centerSubtext="Complete"
        />
        
        <Text variant="bodyMedium" style={styles.percentageText}>
          {percentage}% of daily goal
        </Text>
      </ModernCard>

      {/* Quick Add Buttons */}
      <ModernCard 
        title="Quick Add"
        subtitle="Tap to add water quickly"
        style={styles.quickAddCard}
      >
        <View style={styles.quickAddButtons}>
          {quickAmounts.map((amount) => (
            <Button
              key={amount}
              mode="contained"
              onPress={() => handleAddWater(amount)}
              disabled={loading}
              style={styles.quickAddButton}
              contentStyle={styles.quickAddButtonContent}
              buttonColor={Colors.waterPrimary}
              textColor="white"
              icon={() => <Text style={{ color: 'white', fontSize: 16 }}>💧</Text>}
            >
              +{amount} oz
            </Button>
          ))}
        </View>
      </ModernCard>

      {/* Custom Amount */}
      <ModernCard 
        title="Custom Amount"
        style={styles.customAmountCard}
      >
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
            buttonColor={Colors.waterPrimary}
            icon={() => <PlusIcon size={16} color="white" />}
          >
            Add {newGoal || '0'} oz
          </Button>
        </View>
      </ModernCard>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          mode="outlined"
          onPress={() => setShowGoalInput(!showGoalInput)}
          style={styles.actionButton}
          buttonColor={Colors.waterPrimary}
          textColor={Colors.waterPrimary}
          icon="target"
        >
          Change Goal
        </Button>
        
        <Button
          mode="outlined"
          onPress={handleResetWater}
          disabled={loading}
          style={styles.actionButton}
          textColor={Colors.error}
          icon="refresh"
        >
          Reset Today
        </Button>
      </View>

      {/* Goal Input Modal */}
      {showGoalInput && (
        <ModernCard style={styles.goalInputCard}>
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
              icon="close"
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleUpdateGoal}
              disabled={loading || !newGoal.trim() || parseInt(newGoal) <= 0}
              style={styles.updateButton}
              buttonColor={Colors.waterPrimary}
              icon="check"
            >
              Update Goal
            </Button>
          </View>
        </ModernCard>
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
  progressCard: {
    backgroundColor: Colors.waterBackground,
    marginBottom: Spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  waterIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.waterPrimary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressInfo: {
    flex: 1,
  },
  waterAmount: {
    color: Colors.waterPrimary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  goalText: {
    color: Colors.textSecondary,
  },
  percentageText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: Spacing.md,
  },
  quickAddCard: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  quickAddButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickAddButton: {
    flex: 1,
    minWidth: '45%',
    borderRadius: BorderRadius.md,
  },
  quickAddButtonContent: {
    paddingVertical: Spacing.sm,
  },
  customAmountCard: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.lg,
  },
  customAmountRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  customAmountInput: {
    flex: 2,
  },
  customAddButton: {
    flex: 1,
    borderRadius: BorderRadius.md,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  actionButton: {
    flex: 1,
    borderRadius: BorderRadius.md,
  },
  goalInputCard: {
    backgroundColor: Colors.surface,
  },
  goalInput: {
    marginBottom: Spacing.md,
  },
  goalInputButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  cancelButton: {
    flex: 1,
    borderRadius: BorderRadius.md,
  },
  updateButton: {
    flex: 1,
    borderRadius: BorderRadius.md,
  },
});

export default WaterScreen;
