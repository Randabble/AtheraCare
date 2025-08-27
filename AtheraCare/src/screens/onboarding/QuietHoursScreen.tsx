import React from 'react';
import PlaceholderScreen from './PlaceholderScreen';
import { useOnboarding } from '../../contexts/OnboardingContext';

const QuietHoursScreen: React.FC = () => {
  const { updatePreferences } = useOnboarding();

  const options = [
    { label: '9pm - 7am', value: { enabled: true, start: '21:00', end: '07:00' } },
    { label: '10pm - 8am', value: { enabled: true, start: '22:00', end: '08:00' } },
    { label: 'No quiet hours', value: { enabled: false, start: '21:00', end: '07:00' } },
  ];

  const handleSelect = (value: any) => {
    updatePreferences({ quietHours: value });
  };

  return (
    <PlaceholderScreen
      title="Quiet hours for notifications?"
      subtitle="Choose when to silence reminders"
      nextStep={11}
      options={options}
      onSelect={handleSelect}
    />
  );
};

export default QuietHoursScreen;
