import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, RadioButton } from 'react-native-paper';
import { useOnboarding } from '../../contexts/OnboardingContext';
import OnboardingNavigation from '../../components/OnboardingNavigation';

const WaterGoalScreen: React.FC = () => {
  const { preferences, updatePreferences, setCurrentStep } = useOnboarding();
  const [selectedGoal, setSelectedGoal] = useState(preferences.waterGoal);

  const handleNext = () => {
    if (selectedGoal) {
      updatePreferences({ waterGoal: selectedGoal });
      setCurrentStep(4);
    }
  };

  const goalOptions = [
    { key: 32, label: '32 oz (4 cups)', description: 'Light hydration' },
    { key: 48, label: '48 oz (6 cups)', description: 'Moderate hydration' },
    { key: 64, label: '64 oz (8 cups)', description: 'Standard recommendation' },
    { key: 80, label: '80 oz (10 cups)', description: 'Active lifestyle' },
    { key: 96, label: '96 oz (12 cups)', description: 'High activity level' },
  ] as const;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          How much water do you want to drink daily?
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Choose a goal that feels achievable for you
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
                value={option.key.toString()}
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

export default WaterGoalScreen;
