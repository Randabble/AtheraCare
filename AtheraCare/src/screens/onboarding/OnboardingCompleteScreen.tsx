import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useOnboarding } from '../../contexts/OnboardingContext';

const OnboardingCompleteScreen: React.FC = () => {
  const { completeOnboarding, preferences } = useOnboarding();

  const handleComplete = () => {
    console.log('Onboarding complete button pressed');
    completeOnboarding();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="displaySmall" style={styles.title}>
          🎉 You're All Set!
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Here's what we've configured for you:
        </Text>
        
        <View style={styles.summary}>
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text variant="titleMedium">👤 Display Name: {preferences.displayName}</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text variant="titleMedium">
                💊 Medication Reminders: {preferences.medicationReminders ? 'Yes' : 'No'}
              </Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text variant="titleMedium">💧 Water Goal: {preferences.waterGoal} oz</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text variant="titleMedium">👟 Step Goal: {preferences.stepGoal} steps</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text variant="titleMedium">
                👨‍👩‍👧‍👦 Family Connection: {preferences.familyConnection ? 'Yes' : 'No'}
              </Text>
              {preferences.familyEmail && (
                <Text variant="bodyMedium" style={styles.familyEmail}>
                  📧 Reports will be sent to: {preferences.familyEmail}
                </Text>
              )}
            </Card.Content>
          </Card>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleComplete}
          style={styles.completeButton}
          contentStyle={styles.completeButtonContent}
          icon="check"
        >
          Start Using AtheraCare
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    color: '#666',
  },
  summary: {
    gap: 15,
  },
  summaryCard: {
    marginBottom: 10,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  completeButton: {
    paddingVertical: 8,
  },
  completeButtonContent: {
    paddingVertical: 8,
  },
  familyEmail: {
    marginTop: 5,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default OnboardingCompleteScreen;
