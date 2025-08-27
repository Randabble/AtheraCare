import React from 'react';
import PlaceholderScreen from './PlaceholderScreen';
import { useOnboarding } from '../../contexts/OnboardingContext';

const MedicationFrequencyScreen: React.FC = () => {
  const { updatePreferences } = useOnboarding();

  const options = [
    { label: 'Once per day', value: 1 },
    { label: 'Twice per day', value: 2 },
    { label: 'Three times per day', value: 3 },
  ];

  const handleSelect = (value: number) => {
    updatePreferences({ medicationTimesPerDay: value as 1 | 2 | 3 });
  };

  return (
    <PlaceholderScreen
      title="How many times do you take medications most days?"
      subtitle="We'll use this to set up your reminder schedule"
      nextStep={5}
      options={options}
      onSelect={handleSelect}
    />
  );
};

export default MedicationFrequencyScreen;
