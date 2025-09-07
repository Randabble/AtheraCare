import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Button, ProgressBar, useTheme } from 'react-native-paper';
import ModernCard from '../../components/ModernCard';
import ProgressRing from '../../components/ProgressRing';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { getTodayHydration } from '../../utils/hydration';
import { getMedications } from '../../utils/medications';
import { Colors, Spacing, BorderRadius } from '../../theme/colors';
import { 
  HomeIcon, 
  MedicationIcon, 
  WaterIcon, 
  StepsIcon, 
  TrophyIcon,
  ShareIcon 
} from '../../components/icons/ModernIcons';

const ProfileScreen: React.FC = () => {
  const { user } = useAuth();
  const { preferences } = useOnboarding();
  const theme = useTheme();
  
  const [hydration, setHydration] = useState<any>(null);
  const [medications, setMedications] = useState<any[]>([]);
  const [steps, setSteps] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Load hydration data
      const todayHydration = await getTodayHydration(user.uid);
      setHydration(todayHydration);
      
      // Load medications
      const meds = await getMedications(user.uid);
      setMedications(meds);
      
      // Mock steps data for now
      setSteps(8500);
      
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const waterProgress = hydration ? hydration.totalOz / preferences.waterGoal : 0;
  const stepsProgress = preferences.stepGoal > 0 ? steps / preferences.stepGoal : 0;
  const medsTaken = medications.filter(med => med.takenToday).length;
  const totalMeds = medications.length;

  const getTodaysMeds = () => {
    if (!medications.length) return [];
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return medications.filter(med => 
      med.days && med.days.includes(today) && !med.takenToday
    );
  };

  const todaysMeds = getTodaysMeds();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text variant="bodyLarge">Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.title}>
          Profile
        </Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* User Info Card */}
      <ModernCard style={styles.userCard}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {preferences?.displayName?.charAt(0) || 'U'}
              </Text>
            </View>
          </View>
          
          <View style={styles.userDetails}>
            <Text variant="headlineSmall" style={styles.userName}>
              {preferences?.displayName || 'User'}
            </Text>
            <Text variant="bodyMedium" style={styles.userEmail}>
              {user?.email}
            </Text>
            
            <View style={styles.userStats}>
              <View style={styles.statItem}>
                <Text variant="bodySmall" style={styles.statLabel}>Cal left</Text>
                <Text variant="headlineSmall" style={styles.statValue}>2,561</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="bodySmall" style={styles.statLabel}>Steps</Text>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {steps.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ModernCard>

      {/* Progress Section */}
      <ModernCard 
        title="My Progress"
        subtitle="Analysis"
        style={styles.progressCard}
      >
        <View style={styles.progressContent}>
          <Text variant="headlineMedium" style={styles.progressTitle}>
            You've lost 0 lb!
          </Text>
          <Text variant="bodyMedium" style={styles.progressSubtitle}>
            just 124 weeks until you reach your goal
          </Text>
          
          <View style={styles.weightProgress}>
            <View style={styles.weightInfo}>
              <Text variant="bodySmall" style={styles.weightLabel}>250.0 lb</Text>
              <Text variant="bodySmall" style={styles.weightChange}>+16.6 lb</Text>
            </View>
            
            <View style={styles.progressBarContainer}>
              <ProgressBar 
                progress={0.1} 
                color={Colors.primary}
                style={styles.progressBar}
              />
            </View>
            
            <View style={styles.weightInfo}>
              <Text variant="bodySmall" style={styles.weightLabel}>130.0 lb</Text>
            </View>
          </View>
        </View>
      </ModernCard>

      {/* Goals Section */}
      <ModernCard 
        title="My Goals"
        subtitle="Edit"
        style={styles.goalsCard}
      >
        <View style={styles.goalsList}>
          <View style={styles.goalItem}>
            <Text variant="bodyMedium" style={styles.goalLabel}>Nutrition:</Text>
            <Text variant="bodyMedium" style={styles.goalValue}>Default</Text>
          </View>
          
          <View style={styles.goalItem}>
            <Text variant="bodyMedium" style={styles.goalLabel}>Goal:</Text>
            <Text variant="bodyMedium" style={styles.goalValue}>Lose weight</Text>
          </View>
          
          <View style={styles.goalItem}>
            <Text variant="bodyMedium" style={styles.goalLabel}>Weight:</Text>
            <Text variant="bodyMedium" style={styles.goalValue}>130.0 lb</Text>
          </View>
          
          <View style={styles.goalItem}>
            <Text variant="bodyMedium" style={styles.goalLabel}>Calories:</Text>
            <Text variant="bodyMedium" style={styles.goalValue}>2,488 Cal</Text>
          </View>
          
          <View style={styles.goalItem}>
            <Text variant="bodyMedium" style={styles.goalLabel}>Step Goal:</Text>
            <Text variant="bodyMedium" style={styles.goalValue}>10,000</Text>
          </View>
        </View>
      </ModernCard>

      {/* Today's Summary */}
      <ModernCard 
        title="Today's Summary"
        style={styles.summaryCard}
      >
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <WaterIcon size={24} color={Colors.waterPrimary} />
            </View>
            <Text variant="bodySmall" style={styles.summaryLabel}>Water</Text>
            <Text variant="headlineSmall" style={styles.summaryValue}>
              {hydration?.totalOz || 0} oz
            </Text>
            <ProgressBar 
              progress={waterProgress} 
              color={Colors.waterPrimary}
              style={styles.miniProgressBar}
            />
          </View>
          
          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <StepsIcon size={24} color={Colors.stepsPrimary} />
            </View>
            <Text variant="bodySmall" style={styles.summaryLabel}>Steps</Text>
            <Text variant="headlineSmall" style={styles.summaryValue}>
              {steps.toLocaleString()}
            </Text>
            <ProgressBar 
              progress={stepsProgress} 
              color={Colors.stepsPrimary}
              style={styles.miniProgressBar}
            />
          </View>
          
          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <MedicationIcon size={24} color={Colors.medsPrimary} />
            </View>
            <Text variant="bodySmall" style={styles.summaryLabel}>Meds</Text>
            <Text variant="headlineSmall" style={styles.summaryValue}>
              {medsTaken}/{totalMeds}
            </Text>
            <ProgressBar 
              progress={totalMeds > 0 ? medsTaken / totalMeds : 0} 
              color={Colors.medsPrimary}
              style={styles.miniProgressBar}
            />
          </View>
        </View>
      </ModernCard>

      {/* Achievements */}
      <ModernCard 
        title="Achievements"
        style={styles.achievementsCard}
      >
        <View style={styles.achievementItem}>
          <View style={styles.achievementIcon}>
            <TrophyIcon size={32} color={Colors.accent} />
          </View>
          <View style={styles.achievementInfo}>
            <Text variant="bodyLarge" style={styles.achievementTitle}>
              First Week Complete!
            </Text>
            <Text variant="bodySmall" style={styles.achievementDescription}>
              You've tracked your health for 7 days straight
            </Text>
          </View>
        </View>
        
        <View style={styles.achievementItem}>
          <View style={styles.achievementIcon}>
            <TrophyIcon size={32} color={Colors.primary} />
          </View>
          <View style={styles.achievementInfo}>
            <Text variant="bodyLarge" style={styles.achievementTitle}>
              Hydration Master
            </Text>
            <Text variant="bodySmall" style={styles.achievementDescription}>
              Reached your water goal 5 days this week
            </Text>
          </View>
        </View>
      </ModernCard>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  settingsButton: {
    padding: Spacing.sm,
  },
  settingsIcon: {
    fontSize: 24,
    color: Colors.textPrimary,
  },
  userCard: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.lg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  userEmail: {
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  userStats: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  statValue: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  progressCard: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.lg,
  },
  progressContent: {
    alignItems: 'center',
  },
  progressTitle: {
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  progressSubtitle: {
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  weightProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    width: '100%',
  },
  weightInfo: {
    alignItems: 'center',
    minWidth: 60,
  },
  weightLabel: {
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  weightChange: {
    color: Colors.error,
    fontSize: 12,
  },
  progressBarContainer: {
    flex: 1,
    height: 6,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  goalsCard: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.lg,
  },
  goalsList: {
    gap: Spacing.sm,
  },
  goalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalLabel: {
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  goalValue: {
    color: Colors.textPrimary,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.lg,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  summaryValue: {
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  miniProgressBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
  },
  achievementsCard: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.lg,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  achievementDescription: {
    color: Colors.textSecondary,
  },
});

export default ProfileScreen;
