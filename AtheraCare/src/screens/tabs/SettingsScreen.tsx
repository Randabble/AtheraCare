import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, List, Switch, Divider, useTheme } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { signOutUser } from '../../utils/auth';

const SettingsScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const { preferences, resetOnboarding } = useOnboarding();
  const theme = useTheme();

  const handleSignOut = async () => {
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
              await signOutUser();
              signOut();
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
        Customize your AtheraCare experience
      </Text>

      {/* User Profile */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Profile
          </Text>
          <List.Item
            title="Email"
            description={user?.email || 'No email'}
            left={(props) => <List.Icon {...props} icon="email" />}
          />
          <List.Item
            title="Display Name"
            description={preferences.displayName || 'Not set'}
            left={(props) => <List.Icon {...props} icon="account" />}
          />
        </Card.Content>
      </Card>

      {/* Notifications */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Notifications
          </Text>
          <List.Item
            title="Medication Reminders"
            description={preferences.medicationReminders ? 'Enabled' : 'Disabled'}
            left={(props) => <List.Icon {...props} icon="bell" />}
          />
        </Card.Content>
      </Card>

      {/* Health Goals */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Health Goals
          </Text>
          <List.Item
            title="Daily Water Goal"
            description={`${preferences.waterGoal} oz`}
            left={(props) => <List.Icon {...props} icon="cup-water" />}
          />
          <List.Item
            title="Daily Step Goal"
            description={`${preferences.stepGoal.toLocaleString()} steps`}
            left={(props) => <List.Icon {...props} icon="walk" />}
          />
        </Card.Content>
      </Card>

      {/* Family & Sharing */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Family & Sharing
          </Text>
          <List.Item
            title="Family Connection"
            description={preferences.familyConnection ? 'Connected' : 'Not connected'}
            left={(props) => <List.Icon {...props} icon="account-group" />}
          />
        </Card.Content>
      </Card>

      {/* Actions */}
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
          style={styles.signOutButton}
          icon="logout"
          buttonColor={theme.colors.error}
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
            Your personal health companion
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
  },
  actions: {
    gap: 15,
    marginBottom: 20,
  },
  actionButton: {
    paddingVertical: 8,
  },
  signOutButton: {
    paddingVertical: 8,
  },
  infoCard: {
    elevation: 1,
  },
  infoText: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 5,
  },
});

export default SettingsScreen;
