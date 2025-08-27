import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, RadioButton } from 'react-native-paper';
import { useOnboarding } from '../../contexts/OnboardingContext';
import OnboardingNavigation from '../../components/OnboardingNavigation';

const TextSizeScreen: React.FC = () => {
  const { preferences, updatePreferences, setCurrentStep } = useOnboarding();
  const [selectedSize, setSelectedSize] = useState(preferences.textScale);

  const handleNext = () => {
    if (selectedSize) {
      updatePreferences({ textScale: selectedSize });
      setCurrentStep(2);
    }
  };

  const sizes = [
    { key: 'small', label: 'Small', description: 'Compact text for more content' },
    { key: 'medium', label: 'Medium', description: 'Standard size (recommended)' },
    { key: 'large', label: 'Large', description: 'Easier to read' },
    { key: 'extraLarge', label: 'Extra Large', description: 'Maximum readability' },
  ] as const;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          What text size is comfortable for you?
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          We'll adjust the app to match your preference
        </Text>
      </View>

      <View style={styles.options}>
        {sizes.map((size) => (
          <Card
            key={size.key}
            style={[
              styles.option,
              selectedSize === size.key && styles.selectedOption
            ]}
            onPress={() => setSelectedSize(size.key)}
          >
            <Card.Content style={styles.optionContent}>
              <RadioButton
                value={size.key}
                status={selectedSize === size.key ? 'checked' : 'unchecked'}
                onPress={() => setSelectedSize(size.key)}
              />
              <View style={styles.optionText}>
                <Text variant="titleMedium" style={styles.optionLabel}>
                  {size.label}
                </Text>
                <Text variant="bodyMedium" style={styles.optionDescription}>
                  {size.description}
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>

      <OnboardingNavigation 
        onNext={handleNext}
        nextDisabled={!selectedSize}
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

export default TextSizeScreen;
