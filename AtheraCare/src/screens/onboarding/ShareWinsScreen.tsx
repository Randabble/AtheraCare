import React from 'react';
import PlaceholderScreen from './PlaceholderScreen';
import { useOnboarding } from '../../contexts/OnboardingContext';

const ShareWinsScreen: React.FC = () => {
  const { updatePreferences } = useOnboarding();

  const options = [
    { label: 'Yes, share my wins', value: true },
    { label: 'Not right now', value: false },
  ];

  const handleSelect = (value: boolean) => {
    updatePreferences({ shareWins: value });
  };

  return (
    <PlaceholderScreen
      title="Share wins with family?"
      subtitle="Let family know when you reach your goals"
      nextStep={12}
      options={options}
      onSelect={handleSelect}
    />
  );
};

export default ShareWinsScreen;
