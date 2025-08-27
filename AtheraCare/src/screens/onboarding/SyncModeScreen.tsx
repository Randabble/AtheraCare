import React from 'react';
import PlaceholderScreen from './PlaceholderScreen';
import { useOnboarding } from '../../contexts/OnboardingContext';

const SyncModeScreen: React.FC = () => {
  const { updatePreferences } = useOnboarding();

  const options = [
    { label: 'Save to my account (recommended)', value: 'cloud' },
    { label: 'Keep on this phone only', value: 'device' },
  ];

  const handleSelect = (value: 'cloud' | 'device') => {
    updatePreferences({ syncMode: value });
  };

  return (
    <PlaceholderScreen
      title="Backup & Privacy"
      subtitle="Choose how your data is stored"
      nextStep={15}
      options={options}
      onSelect={handleSelect}
    />
  );
};

export default SyncModeScreen;
