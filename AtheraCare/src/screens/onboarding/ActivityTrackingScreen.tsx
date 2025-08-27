import React from 'react';
import PlaceholderScreen from './PlaceholderScreen';
import { useOnboarding } from '../../contexts/OnboardingContext';

const ActivityTrackingScreen: React.FC = () => {
  const { updatePreferences } = useOnboarding();

  const options = [
    { label: 'Yes, track my steps', value: true },
    { label: 'Not right now', value: false },
  ];

  const handleSelect = (value: boolean) => {
    updatePreferences({ activityTracking: value });
  };

  return (
    <PlaceholderScreen
      title="Track steps with this phone?"
      subtitle="We can count your daily steps automatically"
      nextStep={9}
      options={options}
      onSelect={handleSelect}
    />
  );
};

export default ActivityTrackingScreen;
