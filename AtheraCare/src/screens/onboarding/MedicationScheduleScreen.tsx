import React from 'react';
import PlaceholderScreen from './PlaceholderScreen';
import { useOnboarding } from '../../contexts/OnboardingContext';

const MedicationScheduleScreen: React.FC = () => {
  const { updatePreferences } = useOnboarding();

  const options = [
    { label: '8:00 AM', value: ['08:00'] },
    { label: '8:00 AM, 8:00 PM', value: ['08:00', '20:00'] },
    { label: '8:00 AM, 2:00 PM, 8:00 PM', value: ['08:00', '14:00', '20:00'] },
    { label: 'Set custom times', value: ['09:00'] },
  ];

  const handleSelect = (value: string[]) => {
    updatePreferences({ medicationScheduleTimes: value });
  };

  return (
    <PlaceholderScreen
      title="When should we remind you?"
      subtitle="Choose your preferred reminder times"
      nextStep={6}
      options={options}
      onSelect={handleSelect}
    />
  );
};

export default MedicationScheduleScreen;
