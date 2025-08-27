import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, RadioButton } from 'react-native-paper';
import { useOnboarding } from '../../contexts/OnboardingContext';
import OnboardingNavigation from '../../components/OnboardingNavigation';

const MedicationRemindersScreen: React.FC = () => {
  const { preferences, updatePreferences, setCurrentStep } = useOnboarding();
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | null>(null);

  const handleNext = () => {
    if (selectedOption !== null) {
      updatePreferences({ medicationReminders: selectedOption === 'yes' });
      setCurrentStep(3);
    }
  };

  const options = [
    { key: 'yes', label: 'Yes, please remind me', description: 'Get notifications when it\'s time to take medications' },
    { key: 'no', label: 'No, I\'ll track manually', description: 'I prefer to mark medications taken myself' },
  ] as const;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Would you like medication reminders?
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          We can send you notifications when it's time to take your medications
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

export default MedicationRemindersScreen;
