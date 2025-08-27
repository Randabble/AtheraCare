import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useOnboarding } from '../../contexts/OnboardingContext';

interface PlaceholderScreenProps {
  title: string;
  subtitle: string;
  nextStep: number;
  options?: { label: string; value: any }[];
  onSelect?: (value: any) => void;
}

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ 
  title, 
  subtitle, 
  nextStep, 
  options = [],
  onSelect 
}) => {
  const { setCurrentStep } = useOnboarding();

  const handleNext = () => {
    setCurrentStep(nextStep);
  };

  const handleSelect = (value: any) => {
    if (onSelect) {
      onSelect(value);
    }
    setCurrentStep(nextStep);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.options}>
        {options.length > 0 ? (
          options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={() => handleSelect(option.value)}
            >
              <Text style={styles.optionText}>{option.label}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <TouchableOpacity style={styles.option} onPress={handleNext}>
            <Text style={styles.optionText}>Continue</Text>
          </TouchableOpacity>
        )}
      </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  options: {
    flex: 1,
  },
  option: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});

export default PlaceholderScreen;
