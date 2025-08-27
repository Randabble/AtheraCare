import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, RadioButton } from 'react-native-paper';
import { useOnboarding } from '../../contexts/OnboardingContext';
import OnboardingNavigation from '../../components/OnboardingNavigation';

const ContrastScreen: React.FC = () => {
  const { preferences, updatePreferences, setCurrentStep } = useOnboarding();
  const [selectedContrast, setSelectedContrast] = useState(preferences.contrast);

  const handleNext = () => {
    if (selectedContrast) {
      updatePreferences({ contrast: selectedContrast });
      setCurrentStep(3);
    }
  };

  const contrastOptions = [
    { key: 'standard', label: 'Standard', description: 'Normal contrast for most users' },
    { key: 'high', label: 'High Contrast', description: 'Easier to read in bright light' },
    { key: 'dark', label: 'Dark Mode', description: 'Reduces eye strain in low light' },
  ] as const;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          How would you like the app to look?
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Choose the visual style that works best for you
        </Text>
      </View>

      <View style={styles.options}>
        {contrastOptions.map((option) => (
          <Card
            key={option.key}
            style={[
              styles.option,
              selectedContrast === option.key && styles.selectedOption
            ]}
            onPress={() => setSelectedContrast(option.key)}
          >
            <Card.Content style={styles.optionContent}>
              <RadioButton
                value={option.key}
                status={selectedContrast === option.key ? 'checked' : 'unchecked'}
                onPress={() => setSelectedContrast(option.key)}
              />
              <View style={styles.optionText}>
                <Text variant="titleMedium" style={styles.optionLabel}>
                  {option.label}
                </Text>
                <Text variant="bodyMedium" style={styles.optionDescription}>
                  {option.description}
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>

      <OnboardingNavigation 
        onNext={handleNext}
        nextDisabled={!selectedContrast}
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
  options: {
    flex: 1,
    gap: 15,
  },
  option: {
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  selectedOption: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionText: {
    flex: 1,
    marginLeft: 10,
  },
  optionLabel: {
    color: '#333',
    marginBottom: 5,
  },
  optionDescription: {
    color: '#666',
  },
});

export default ContrastScreen;
