import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useOnboarding } from '../../contexts/OnboardingContext';
import WelcomeScreen from './WelcomeScreen';
import DisplayNameScreen from './DisplayNameScreen';
import MedicationRemindersScreen from './MedicationRemindersScreen';
import WaterGoalScreen from './WaterGoalScreen';
import StepGoalScreen from './StepGoalScreen';
import FamilySetupScreen from './FamilySetupScreen';
import OnboardingCompleteScreen from './OnboardingCompleteScreen';

const OnboardingScreen: React.FC = () => {
  const { currentStep, totalSteps } = useOnboarding();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeScreen />;
      case 1:
        return <DisplayNameScreen />;
      case 2:
        return <MedicationRemindersScreen />;
      case 3:
        return <WaterGoalScreen />;
      case 4:
        return <StepGoalScreen />;
      case 5:
        return <FamilySetupScreen />;
      case 6:
        return <OnboardingCompleteScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderCurrentStep()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default OnboardingScreen;
