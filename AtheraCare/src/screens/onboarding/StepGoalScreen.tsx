import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, RadioButton } from 'react-native-paper';
import { useOnboarding } from '../../contexts/OnboardingContext';
import OnboardingNavigation from '../../components/OnboardingNavigation';

const StepGoalScreen: React.FC = () => {
  const { preferences, updatePreferences, setCurrentStep } = useOnboarding();
  const [selectedGoal, setSelectedGoal] = useState(preferences.stepGoal);

  const handleNext = () => {
    if (selectedGoal) {
      updatePreferences({ stepGoal: selectedGoal });
      setCurrentStep(5);
    }
  };

  const goalOptions = [
    { key: 2000, label: '2,000 steps', description: 'Light activity level' },
    { key: 5000, label: '5,000 steps', description: 'Moderate activity' },
    { key: 8000, label: '8,000 steps', description: 'Active lifestyle' },
    { key: 10000, label: '10,000 steps', description: 'Standard goal' },
    { key: 12000, label: '12,000 steps', description: 'High activity level' },
  ] as const;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          What's your daily step goal?
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Choose a target that motivates you to move more
        </Text>
      </View>

      <View style={styles.options}>
        {goalOptions.map((option) => (
          <Card
            key={option.key}
            style={[
              styles.option,
              selectedGoal === option.key && styles.selectedOption
            ]}
            onPress={() => setSelectedGoal(option.key)}
          >
            <Card.Content style={styles.optionContent}>
              <RadioButton
                value={option.key}
                status={selectedGoal === option.key ? 'checked' : 'unchecked'}
                onPress={() => setSelectedGoal(option.key)}
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
        nextDisabled={!selectedGoal}
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

export default StepGoalScreen;
