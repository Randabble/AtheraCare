import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, TextInput, Button } from 'react-native-paper';
import { useOnboarding } from '../../contexts/OnboardingContext';
import OnboardingNavigation from '../../components/OnboardingNavigation';

const FamilyEmailScreen: React.FC = () => {
  const { preferences, updatePreferences, setCurrentStep } = useOnboarding();
  const [familyEmail, setFamilyEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (email: string) => {
    setFamilyEmail(email);
    setIsValidEmail(validateEmail(email));
  };

  const handleNext = () => {
    if (isValidEmail) {
      updatePreferences({ 
        familyConnection: true,
        familyEmail: familyEmail.trim()
      });
      setCurrentStep(6);
    }
  };

  const handleSkip = () => {
    updatePreferences({ familyConnection: false });
    setCurrentStep(6);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          📧 Family Member Email
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Enter the email address of a family member who will receive your weekly health updates
        </Text>
      </View>

      <Card style={styles.emailCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Weekly Health Report Recipient
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Every week, we'll send a summary of your health activities including:
          </Text>
          
          <View style={styles.featuresList}>
            <Text variant="bodyMedium" style={styles.feature}>💊 Medication adherence</Text>
            <Text variant="bodyMedium" style={styles.feature}>💧 Water intake progress</Text>
            <Text variant="bodyMedium" style={styles.feature}>👟 Step count achievements</Text>
            <Text variant="bodyMedium" style={styles.feature}>📊 Overall activity trends</Text>
          </View>

          <TextInput
            label="Family Member Email"
            value={familyEmail}
            onChangeText={handleEmailChange}
            style={styles.emailInput}
            mode="outlined"
            placeholder="family@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={familyEmail.length > 0 && !isValidEmail}
            helperText={familyEmail.length > 0 && !isValidEmail ? "Please enter a valid email address" : ""}
          />

          <Text variant="bodySmall" style={styles.privacyNote}>
            🔒 Your health data is private and secure. Only summary information will be shared.
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={handleSkip}
          style={styles.skipButton}
        >
          Skip for now
        </Button>
      </View>

      <OnboardingNavigation 
        onNext={handleNext}
        nextDisabled={!isValidEmail}
        nextLabel="Continue"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
  },
  emailCard: {
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 15,
    color: '#333',
    fontWeight: '500',
  },
  description: {
    marginBottom: 15,
    color: '#666',
    lineHeight: 20,
  },
  featuresList: {
    marginBottom: 20,
    paddingLeft: 10,
  },
  feature: {
    marginBottom: 8,
    color: '#555',
  },
  emailInput: {
    marginBottom: 15,
  },
  privacyNote: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  skipButton: {
    alignSelf: 'center',
  },
});

export default FamilyEmailScreen;
