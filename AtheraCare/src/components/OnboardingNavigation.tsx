import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, ProgressBar, useTheme } from 'react-native-paper';
import { useOnboarding } from '../contexts/OnboardingContext';

interface OnboardingNavigationProps {
  onNext?: () => void;
  nextLabel?: string;
  showBack?: boolean;
  nextDisabled?: boolean;
}

const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({
  onNext,
  nextLabel = 'Next',
  showBack = true,
  nextDisabled = false,
}) => {
  const { currentStep, totalSteps, goBack } = useOnboarding();
  const theme = useTheme();

  const progress = (currentStep + 1) / totalSteps;

  return (
    <View style={styles.container}>
      <ProgressBar 
        progress={progress} 
        color={theme.colors.primary}
        style={styles.progressBar}
      />
      
      <View style={styles.buttonContainer}>
        {showBack && currentStep > 0 && (
          <Button
            mode="outlined"
            onPress={goBack}
            style={styles.backButton}
            icon="arrow-left"
          >
            Back
          </Button>
        )}
        
        <Button
          mode="contained"
          onPress={onNext}
          disabled={nextDisabled}
          style={styles.nextButton}
          icon="arrow-right"
          contentStyle={styles.nextButtonContent}
        >
          {nextLabel}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: 'transparent',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flex: 1,
    marginRight: 10,
  },
  nextButton: {
    flex: 2,
  },
  nextButtonContent: {
    flexDirection: 'row-reverse',
  },
});

export default OnboardingNavigation;
