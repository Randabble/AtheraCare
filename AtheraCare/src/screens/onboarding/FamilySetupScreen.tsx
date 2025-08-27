import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, RadioButton } from 'react-native-paper';
import { useOnboarding } from '../../contexts/OnboardingContext';
import OnboardingNavigation from '../../components/OnboardingNavigation';

const FamilySetupScreen: React.FC = () => {
  const { preferences, updatePreferences, setCurrentStep } = useOnboarding();
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | null>(null);

  const handleNext = () => {
    if (selectedOption !== null) {
      updatePreferences({ familyConnection: selectedOption === 'yes' });
      setCurrentStep(6);
    }
  };

  const options = [
    { key: 'yes', label: 'Yes, I want to connect with family', description: 'Share health wins and stay connected' },
    { key: 'no', label: 'Not right now', description: 'I\'ll set this up later' },
  ] as const;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Would you like to connect with family?
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Share your health achievements and stay connected with loved ones
        </Text>
      </View>

      <View style={styles.options}>
        {options.map((option) => (
          <Card
            key={option.key}
            style={[
              styles.option,
              selectedOption === option.key && styles.selectedOption
            ]}
            onPress={() => setSelectedOption(option.key)}
          >
            <Card.Content style={styles.optionContent}>
              <RadioButton
                value={option.key}
                status={selectedOption === option.key ? 'checked' : 'unchecked'}
                onPress={() => setSelectedOption(option.key)}
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
        nextDisabled={selectedOption === null}
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

export default FamilySetupScreen;
