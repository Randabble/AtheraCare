import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Card } from 'react-native-paper';
import { useOnboarding } from '../../contexts/OnboardingContext';
import OnboardingNavigation from '../../components/OnboardingNavigation';

const DisplayNameScreen: React.FC = () => {
  const { preferences, updatePreferences, setCurrentStep } = useOnboarding();
  const [displayName, setDisplayName] = useState(preferences.displayName);

  const handleNext = () => {
    if (displayName.trim()) {
      updatePreferences({ displayName: displayName.trim() });
      setCurrentStep(2);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          What should we call you?
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          We'll use this name throughout the app
        </Text>
      </View>

      <Card style={styles.inputCard}>
        <Card.Content>
          <TextInput
            label="Your Name"
            value={displayName}
            onChangeText={setDisplayName}
            style={styles.input}
            mode="outlined"
            placeholder="Enter your name"
            autoFocus
          />
        </Card.Content>
      </Card>

      <OnboardingNavigation 
        onNext={handleNext}
        nextDisabled={!displayName.trim()}
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
    paddingBottom: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
  },
  inputCard: {
    marginBottom: 20,
    elevation: 2,
  },
  input: {
    marginBottom: 10,
  },
});

export default DisplayNameScreen;
