import React from 'react';
import PlaceholderScreen from './PlaceholderScreen';
import { useOnboarding } from '../../contexts/OnboardingContext';

const ReminderStyleScreen: React.FC = () => {
  const { updatePreferences } = useOnboarding();

  const options = [
    { label: 'Gentle chime', value: 'gentle' },
    { label: 'Standard alert', value: 'standard' },
    { label: 'Vibrate only', value: 'vibrate' },
  ];

  const handleSelect = (value: 'gentle' | 'standard' | 'vibrate') => {
    updatePreferences({ reminderStyle: value });
  };

  return (
    <PlaceholderScreen
      title="How should reminders feel?"
      subtitle="Choose your preferred notification style"
      nextStep={14}
      options={options}
      onSelect={handleSelect}
    />
  );
};

export default ReminderStyleScreen;
