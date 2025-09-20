import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CustomAlert from '../../components/CustomAlert';
import ModernCard from '../../components/ModernCard';
import ProgressRing from '../../components/ProgressRing';
import { Text, Button, ProgressBar, Badge } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { getMedications, Medication } from '../../utils/medications';
import { getTodayHydration, HydrationLog } from '../../utils/hydration';
import { Pedometer } from 'expo-sensors';
import { Colors, Spacing, BorderRadius } from '../../theme/colors';
import { MedicationIcon, WaterIcon, StepsIcon, ShareIcon } from '../../components/icons/ModernIcons';

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { preferences } = useOnboarding();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [hydration, setHydration] = useState<HydrationLog | null>(null);
  const [steps, setSteps] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Custom alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertShowCancel, setAlertShowCancel] = useState(false);
  const [alertOnConfirm, setAlertOnConfirm] = useState<(() => void) | null>(null);

  const showAlert = (title: string, message: string, showCancel = false, onConfirm?: () => void) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertShowCancel(showCancel);
    setAlertOnConfirm(onConfirm || (() => {}));
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

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

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  const handleShareWin = (type: string) => {
    showAlert(
      'Share This Win! 🎉',
      `Great job! Would you like to share your ${type} achievement with your family?`,
      true,
      () => {
        // TODO: Implement share functionality
        showAlert('Shared!', 'Your family will see this win! 💕');
      }
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
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.title}>
          Good {getTimeOfDay()}! 👋
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Here's your health summary for today
        </Text>
      </View>

      {/* Quick Stats Summary */}
      <ModernCard style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text variant="titleLarge" style={styles.summaryTitle}>Today's Progress</Text>
        </View>
        
        <View style={styles.quickStats}>
          <View style={styles.statItem}>
            <Text variant="headlineSmall" style={styles.statNumber}>{medsTaken}</Text>
            <Text variant="bodySmall" style={styles.statLabel}>Medications</Text>
            <Text variant="bodySmall" style={styles.statSubtext}>of {totalMeds} taken</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text variant="headlineSmall" style={styles.statNumber}>{hydration?.totalOz || 0}</Text>
            <Text variant="bodySmall" style={styles.statLabel}>Water (oz)</Text>
            <Text variant="bodySmall" style={styles.statSubtext}>of {preferences.waterGoal} goal</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text variant="headlineSmall" style={styles.statNumber}>{Math.round(steps / 1000)}k</Text>
            <Text variant="bodySmall" style={styles.statLabel}>Steps</Text>
            <Text variant="bodySmall" style={styles.statSubtext}>of {Math.round(preferences.stepGoal / 1000)}k goal</Text>
          </View>
        </View>
      </ModernCard>

      {/* Medications Card */}
      <ModernCard 
        title="Medications"
        subtitle={`${medsTaken}/${totalMeds} taken today`}
        style={styles.medsCard}
      >
        <View style={styles.medsContent}>
          <View style={styles.medsIcon}>
            <MedicationIcon size={32} color={Colors.medsPrimary} />
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
            buttonColor={Colors.medsPrimary}
            icon={() => <ShareIcon size={16} color="white" />}
          >
            Share This Win
          </Button>
        </View>
      </ModernCard>

      {/* Water Card */}
      <ModernCard 
        title="Water Tracker"
        subtitle={`${hydration?.totalOz || 0} / ${preferences.waterGoal} oz`}
        style={styles.waterCard}
      >
        <View style={styles.waterContent}>
          <View style={styles.waterIcon}>
            <WaterIcon size={32} color={Colors.waterPrimary} />
          </View>
          
          <View style={styles.waterProgress}>
            <ProgressBar 
              progress={waterProgress} 
              color={Colors.waterPrimary}
              style={styles.progressBar}
            />
            <Text variant="bodyMedium" style={styles.progressText}>
              {Math.round(waterProgress * 100)}% of daily goal
            </Text>
          </View>
          
          {waterProgress >= 1 && (
            <Button
              mode="contained"
              onPress={() => handleShareWin('water goal')}
              style={styles.actionButton}
              buttonColor={Colors.waterPrimary}
              icon={() => <ShareIcon size={16} color="white" />}
            >
              Share This Win
            </Button>
          )}
        </View>
      </ModernCard>

      {/* Steps Card */}
      <ModernCard 
        title="Steps"
        subtitle={`${steps.toLocaleString()} / ${preferences.stepGoal.toLocaleString()} steps`}
        style={styles.stepsCard}
      >
        <View style={styles.stepsContent}>
          <View style={styles.stepsIcon}>
            <StepsIcon size={32} color={Colors.stepsPrimary} />
          </View>
          
          <View style={styles.stepsProgress}>
            <ProgressBar 
              progress={stepsProgress} 
              color={Colors.stepsPrimary}
              style={styles.progressBar}
            />
            <Text variant="bodyMedium" style={styles.progressText}>
              {Math.round(stepsProgress * 100)}% of daily goal
            </Text>
          </View>
          
          {stepsProgress >= 1 && (
            <Button
              mode="contained"
              onPress={() => handleShareWin('step goal')}
              style={styles.actionButton}
              buttonColor={Colors.stepsPrimary}
              icon={() => <ShareIcon size={16} color="white" />}
            >
              Share This Win
            </Button>
          )}
        </View>
      </ModernCard>
      
      {/* Custom Alert */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onConfirm={() => {
          if (alertOnConfirm) {
            alertOnConfirm();
          }
          hideAlert();
        }}
        onCancel={hideAlert}
        showCancel={alertShowCancel}
        confirmText="OK"
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
  summaryCard: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.lg,
  },
  summaryHeader: {
    marginBottom: Spacing.md,
  },
  summaryTitle: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    color: Colors.textPrimary,
    fontWeight: '500',
    marginBottom: 2,
  },
  statSubtext: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  medsCard: {
    backgroundColor: Colors.medsBackground,
  },
  medsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  medsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.medsPrimary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  medsList: {
    flex: 1,
  },
  medItem: {
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  moreMeds: {
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  noMeds: {
    color: Colors.success,
    textAlign: 'center',
    fontWeight: '500',
  },
  waterCard: {
    backgroundColor: Colors.waterBackground,
  },
  waterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  waterIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.waterPrimary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterProgress: {
    flex: 1,
  },
  stepsCard: {
    backgroundColor: Colors.stepsBackground,
  },
  stepsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  stepsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.stepsPrimary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepsProgress: {
    flex: 1,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: Spacing.xs,
  },
  progressText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  actionButton: {
    marginTop: Spacing.sm,
  },
});

export default HomeScreen;
