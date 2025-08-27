import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, List, Switch, Divider, useTheme } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding } from '../../contexts/OnboardingContext';

const SettingsScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const { preferences, resetOnboarding } = useTheme();
  const theme = useTheme();
  const [showMedNames, setShowMedNames] = useState(false);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      'Reset Onboarding',
      'This will reset all your preferences and take you back to the onboarding flow. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetOnboarding();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium" style={styles.title}>
        ⚙️ Settings
      </Text>
      
      <Text variant="bodyLarge" style={styles.subtitle}>
        Customize your experience
      </Text>

      {/* Profile Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Profile
          </Text>
          <List.Item
            title="Display Name"
            description={preferences?.displayName || 'Not set'}
            left={(props) => <List.Icon {...props} icon="account" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Coming Soon', 'Name editing will be available in the next update.')}
          />
          <Divider />
          <List.Item
            title="Email"
            description={user?.email || 'Not set'}
            left={(props) => <List.Icon {...props} icon="email" />}
          />
        </Card.Content>
      </Card>

      {/* Notifications Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Notifications
          </Text>
          <List.Item
            title="Medication Reminders"
            description={preferences?.medicationReminders ? 'Enabled' : 'Disabled'}
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={preferences?.medicationReminders || false}
                onValueChange={() => Alert.alert('Coming Soon', 'Notification settings will be available in the next update.')}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Quiet Hours"
            description={preferences?.quietHours ? 'Enabled' : 'Disabled'}
            left={(props) => <List.Icon {...props} icon="moon" />}
            right={() => (
              <Switch
                value={preferences?.quietHours || false}
                onValueChange={() => Alert.alert('Coming Soon', 'Quiet hours settings will be available in the next update.')}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Health Goals Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Health Goals
          </Text>
          <List.Item
            title="Daily Water Goal"
            description={`${preferences?.waterGoal || 64} oz`}
            left={(props) => <List.Icon {...props} icon="water" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Coming Soon', 'Goal editing will be available in the next update.')}
          />
          <Divider />
          <List.Item
            title="Daily Step Goal"
            description={`${(preferences?.stepGoal || 10000).toLocaleString()} steps`}
            left={(props) => <List.Icon {...props} icon="walk" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Coming Soon', 'Goal editing will be available in the next update.')}
          />
        </Card.Content>
      </Card>

      {/* Family & Sharing Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Family & Sharing
          </Text>
          <List.Item
            title="Share Wins"
            description={preferences?.shareWins ? 'Enabled' : 'Disabled'}
            left={(props) => <List.Icon {...props} icon="share" />}
            right={() => (
              <Switch
                value={preferences?.shareWins || false}
                onValueChange={() => Alert.alert('Coming Soon', 'Sharing settings will be available in the next update.')}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Family Connection"
            description={preferences?.familyConnection ? 'Connected' : 'Not connected'}
            left={(props) => <List.Icon {...props} icon="account-group" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Coming Soon', 'Family management will be available in the next update.')}
          />
          <Divider />
          <List.Item
            title="Show Medication Names"
            description="Control what family members see"
            left={(props) => <List.Icon {...props} icon="eye" />}
            right={() => (
              <Switch
                value={showMedNames}
                onValueChange={setShowMedNames}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Privacy Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Privacy & Data
          </Text>
          <List.Item
            title="Privacy Mode"
            description={preferences?.privacyMode ? 'Enabled' : 'Disabled'}
            left={(props) => <List.Icon {...props} icon="shield" />}
            right={() => (
              <Switch
                value={preferences?.privacyMode || false}
                onValueChange={() => Alert.alert('Coming Soon', 'Privacy settings will be available in the next update.')}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Sync Mode"
            description={preferences?.syncMode === 'automatic' ? 'Automatic' : 'Manual'}
            left={(props) => <List.Icon {...props} icon="sync" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Coming Soon', 'Sync settings will be available in the next update.')}
          />
        </Card.Content>
      </Card>

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
      <Card style={styles.infoCard}>
        <Card.Content>
          <Text variant="bodySmall" style={styles.infoText}>
            AtheraCare v1.0.0
          </Text>
          <Text variant="bodySmall" style={styles.infoText}>
            Built with ❤️ for better health and family connection
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
  sectionTitle: {
    marginBottom: 15,
    color: '#333',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
  },
  infoCard: {
    marginBottom: 20,
    elevation: 1,
  },
  infoText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 5,
  },
});

export default SettingsScreen;
