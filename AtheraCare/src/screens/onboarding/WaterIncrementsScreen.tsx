import React from 'react';
import PlaceholderScreen from './PlaceholderScreen';
import { useOnboarding } from '../../contexts/OnboardingContext';

const WaterIncrementsScreen: React.FC = () => {
  const { updatePreferences } = useOnboarding();

  const options = [
    { label: '4 oz, 8 oz, 16 oz', value: [4, 8, 16] },
    { label: '8 oz, 16 oz, 32 oz', value: [8, 16, 32] },
    { label: 'Custom increments', value: [4, 12, 24] },
  ];

  const handleSelect = (value: number[]) => {
    updatePreferences({ waterQuickIncrements: value });
  };

  return (
    <PlaceholderScreen
      title="How do you like to log water?"
      subtitle="Choose quick-add button sizes"
      nextStep={8}
      options={options}
      onSelect={handleSelect}
    />
  );
};

export default WaterIncrementsScreen;
