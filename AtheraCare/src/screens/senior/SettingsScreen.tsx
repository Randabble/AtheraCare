import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, List, Switch, Divider, useTheme, TextInput } from 'react-native-paper';
import ModernCard from '../../components/ModernCard';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import CustomAlert from '../../components/CustomAlert';
import { Colors, Spacing, BorderRadius } from '../../theme/colors';
import { SettingsIcon } from '../../components/icons/ModernIcons';

const SettingsScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const { preferences, resetOnboarding, updatePreferences } = useOnboarding();
  const theme = useTheme();
  
  // Settings state
  const [showMedNames, setShowMedNames] = useState(false);
  const [editingDisplayName, setEditingDisplayName] = useState(false);
  const [editingWaterGoal, setEditingWaterGoal] = useState(false);
  const [editingStepGoal, setEditingStepGoal] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(preferences?.displayName || '');
  const [newWaterGoal, setNewWaterGoal] = useState(preferences?.waterGoal?.toString() || '64');
  const [newStepGoal, setNewStepGoal] = useState(preferences?.stepGoal?.toString() || '10000');
  
  // Custom alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');
  const [alertShowCancel, setAlertShowCancel] = useState(false);
  const [alertOnConfirm, setAlertOnConfirm] = useState<(() => void) | null>(null);

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info', showCancel = false, onConfirm?: () => void) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertShowCancel(showCancel);
    setAlertOnConfirm(onConfirm || (() => {}));
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

  const handleSignOut = () => {
    showAlert(
      'Sign Out',
      'Are you sure you want to sign out?',
      'info',
      true,
      async () => {
        try {
          await signOut();
        } catch (error) {
          console.error('Error signing out:', error);
          showAlert('Error', 'Failed to sign out', 'error');
        }
      }
    );
  };

  const handleResetOnboarding = () => {
    showAlert(
      'Reset Onboarding',
      'This will reset all your preferences and take you back to the onboarding flow. Are you sure?',
      'info',
      true,
      () => {
        resetOnboarding();
      }
    );
  };

  const handleUpdateDisplayName = () => {
    if (newDisplayName.trim() && updatePreferences) {
      updatePreferences({ displayName: newDisplayName.trim() });
      setEditingDisplayName(false);
      showAlert('Success', 'Display name updated successfully!', 'success');
    } else {
      showAlert('Error', 'Please enter a valid display name', 'error');
    }
  };

  const handleUpdateWaterGoal = () => {
    const goal = parseInt(newWaterGoal);
    if (goal > 0 && updatePreferences) {
      updatePreferences({ waterGoal: goal });
      setEditingWaterGoal(false);
      showAlert('Success', 'Water goal updated successfully!', 'success');
    } else {
      showAlert('Error', 'Please enter a valid water goal', 'error');
    }
  };

  const handleUpdateStepGoal = () => {
    const goal = parseInt(newStepGoal);
    if (goal > 0 && updatePreferences) {
      updatePreferences({ stepGoal: goal });
      setEditingStepGoal(false);
      showAlert('Success', 'Step goal updated successfully!', 'success');
    } else {
      showAlert('Error', 'Please enter a valid step goal', 'error');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.title}>
          Settings
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Customize your experience
        </Text>
      </View>

      {/* Profile Section */}
      <ModernCard 
        title="Profile"
        style={styles.card}
      >
        <View style={styles.settingsIcon}>
          <SettingsIcon size={32} color={Colors.primary} />
        </View>
        
        <View style={styles.settingItem}>
          <Text variant="bodyLarge" style={styles.settingLabel}>Display Name</Text>
          {editingDisplayName ? (
            <View style={styles.editRow}>
              <TextInput
                value={newDisplayName}
                onChangeText={setNewDisplayName}
                style={styles.editInput}
                mode="outlined"
                autoFocus
              />
              <Button
                mode="contained"
                onPress={handleUpdateDisplayName}
                style={styles.saveButton}
                buttonColor={Colors.primary}
              >
                Save
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  setEditingDisplayName(false);
                  setNewDisplayName(preferences?.displayName || '');
                }}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
            </View>
          ) : (
            <View style={styles.valueRow}>
              <Text variant="bodyMedium" style={styles.settingValue}>
                {preferences?.displayName || 'Not set'}
              </Text>
              <Button
                mode="outlined"
                onPress={() => setEditingDisplayName(true)}
                style={styles.editButton}
                buttonColor={Colors.primary}
                textColor={Colors.primary}
              >
                Edit
              </Button>
            </View>
          )}
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.settingItem}>
          <Text variant="bodyLarge" style={styles.settingLabel}>Email</Text>
          <Text variant="bodyMedium" style={styles.settingValue}>
            {user?.email || 'Not set'}
          </Text>
        </View>
      </ModernCard>

      {/* Health Goals Section */}
      <ModernCard 
        title="Health Goals"
        style={styles.card}
      >
        <View style={styles.settingItem}>
          <Text variant="bodyLarge" style={styles.settingLabel}>Daily Water Goal</Text>
          {editingWaterGoal ? (
            <View style={styles.editRow}>
              <TextInput
                value={newWaterGoal}
                onChangeText={setNewWaterGoal}
                keyboardType="numeric"
                style={styles.editInput}
                mode="outlined"
                right={<TextInput.Affix text="oz" />}
                autoFocus
              />
              <Button
                mode="contained"
                onPress={handleUpdateWaterGoal}
                style={styles.saveButton}
                buttonColor={Colors.waterPrimary}
              >
                Save
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  setEditingWaterGoal(false);
                  setNewWaterGoal(preferences?.waterGoal?.toString() || '64');
                }}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
            </View>
          ) : (
            <View style={styles.valueRow}>
              <Text variant="bodyMedium" style={styles.settingValue}>
                {preferences?.waterGoal || 64} oz
              </Text>
              <Button
                mode="outlined"
                onPress={() => setEditingWaterGoal(true)}
                style={styles.editButton}
                buttonColor={Colors.waterPrimary}
                textColor={Colors.waterPrimary}
              >
                Edit
              </Button>
            </View>
          )}
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.settingItem}>
          <Text variant="bodyLarge" style={styles.settingLabel}>Daily Step Goal</Text>
          {editingStepGoal ? (
            <View style={styles.editRow}>
              <TextInput
                value={newStepGoal}
                onChangeText={setNewStepGoal}
                keyboardType="numeric"
                style={styles.editInput}
                mode="outlined"
                right={<TextInput.Affix text="steps" />}
                autoFocus
              />
              <Button
                mode="contained"
                onPress={handleUpdateStepGoal}
                style={styles.saveButton}
                buttonColor={Colors.stepsPrimary}
              >
                Save
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  setEditingStepGoal(false);
                  setNewStepGoal(preferences?.stepGoal?.toString() || '10000');
                }}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
            </View>
          ) : (
            <View style={styles.valueRow}>
              <Text variant="bodyMedium" style={styles.settingValue}>
                {preferences?.stepGoal || 10000} steps
              </Text>
              <Button
                mode="outlined"
                onPress={() => setEditingStepGoal(true)}
                style={styles.editButton}
                buttonColor={Colors.stepsPrimary}
                textColor={Colors.stepsPrimary}
              >
                Edit
              </Button>
            </View>
          )}
        </View>
      </ModernCard>

      {/* Notifications Section */}
      <ModernCard 
        title="Notifications"
        style={styles.card}
      >
        <View style={styles.settingItem}>
          <Text variant="bodyLarge" style={styles.settingLabel}>Medication Reminders</Text>
          <View style={styles.valueRow}>
            <Text variant="bodyMedium" style={styles.settingValue}>
              {preferences?.medicationReminders ? 'Enabled' : 'Disabled'}
            </Text>
            <Switch
              value={preferences?.medicationReminders || false}
              onValueChange={(value) => {
                if (updatePreferences) {
                  updatePreferences({ medicationReminders: value });
                }
              }}
              color={Colors.primary}
            />
          </View>
        </View>
      </ModernCard>

      {/* Family & Sharing Section */}
      <ModernCard 
        title="Family & Sharing"
        style={styles.card}
      >
        <View style={styles.settingItem}>
          <Text variant="bodyLarge" style={styles.settingLabel}>Share Wins</Text>
          <View style={styles.valueRow}>
            <Text variant="bodyMedium" style={styles.settingValue}>
              {preferences?.shareWins ? 'Enabled' : 'Disabled'}
            </Text>
            <Switch
              value={preferences?.shareWins || false}
              onValueChange={() => showAlert('Coming Soon', 'Sharing settings will be available in the next update.')}
              color={Colors.primary}
            />
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.settingItem}>
          <Text variant="bodyLarge" style={styles.settingLabel}>Family Connection</Text>
          <Text variant="bodyMedium" style={styles.settingValue}>
            {preferences?.familyConnection ? 'Connected' : 'Not connected'}
          </Text>
        </View>
        
        {preferences?.familyConnection && preferences?.familyEmail && (
          <>
            <Divider style={styles.divider} />
            <View style={styles.settingItem}>
              <Text variant="bodyLarge" style={styles.settingLabel}>Weekly Report Email</Text>
              <Text variant="bodyMedium" style={styles.settingValue}>
                {preferences.familyEmail}
              </Text>
            </View>
          </>
        )}
        
        <Divider style={styles.divider} />
        
        <View style={styles.settingItem}>
          <Text variant="bodyLarge" style={styles.settingLabel}>Show Medication Names</Text>
          <View style={styles.valueRow}>
            <Text variant="bodyMedium" style={styles.settingValue}>
              Control what family members see
            </Text>
            <Switch
              value={showMedNames}
              onValueChange={setShowMedNames}
              color={Colors.primary}
            />
          </View>
        </View>
      </ModernCard>

      {/* Privacy Section */}
      <ModernCard 
        title="Privacy & Data"
        style={styles.card}
      >
        <View style={styles.settingItem}>
          <Text variant="bodyLarge" style={styles.settingLabel}>Privacy Mode</Text>
          <View style={styles.valueRow}>
            <Text variant="bodyMedium" style={styles.settingValue}>
              {preferences?.privacyMode ? 'Enabled' : 'Disabled'}
            </Text>
            <Switch
              value={preferences?.privacyMode || false}
              onValueChange={() => showAlert('Coming Soon', 'Privacy settings will be available in the next update.')}
              color={Colors.primary}
            />
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.settingItem}>
          <Text variant="bodyLarge" style={styles.settingLabel}>Sync Mode</Text>
          <Text variant="bodyMedium" style={styles.settingValue}>
            {preferences?.syncMode === 'automatic' ? 'Automatic' : 'Manual'}
          </Text>
        </View>
      </ModernCard>

      {/* Actions Section */}
      <View style={styles.actions}>
        <Button
          mode="outlined"
          onPress={handleResetOnboarding}
          style={styles.actionButton}
          icon="refresh"
        >
          Reset Preferences
        </Button>
        
        <Button
          mode="contained"
          onPress={handleSignOut}
          style={[styles.actionButton, styles.signOutButton]}
          icon="logout"
        >
          Sign Out
        </Button>
      </View>

      {/* App Info */}
      <ModernCard style={styles.infoCard}>
        <Text variant="bodySmall" style={styles.infoText}>
          AtheraCare v1.0.0
        </Text>
        <Text variant="bodySmall" style={styles.infoText}>
          Built with ❤️ for better health and family connection
        </Text>
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
  card: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.lg,
  },
  settingsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  settingItem: {
    marginBottom: Spacing.md,
  },
  settingLabel: {
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  settingValue: {
    color: Colors.textSecondary,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
  },
  editButton: {
    borderRadius: BorderRadius.md,
  },
  saveButton: {
    borderRadius: BorderRadius.md,
  },
  cancelButton: {
    borderRadius: BorderRadius.md,
  },
  divider: {
    marginVertical: Spacing.sm,
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
  signOutButton: {
    backgroundColor: Colors.error,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.lg,
  },
  infoText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    marginBottom: 5,
  },
});

export default SettingsScreen;
