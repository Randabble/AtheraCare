import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useOnboarding } from '../../contexts/OnboardingContext';
import OnboardingNavigation from '../../components/OnboardingNavigation';

const WelcomeScreen: React.FC = () => {
  const { setCurrentStep } = useOnboarding();

  const handleNext = () => {
    setCurrentStep(1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="displaySmall" style={styles.title}>
          Welcome to AtheraCare
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Your personal health companion for medications, hydration, and staying connected with family.
        </Text>
        
        <View style={styles.features}>
          <Card style={styles.featureCard}>
            <Card.Content>
              <Text variant="titleMedium">💊 Simple medication tracking</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.featureCard}>
            <Card.Content>
              <Text variant="titleMedium">💧 Daily hydration goals</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.featureCard}>
            <Card.Content>
              <Text variant="titleMedium">👟 Step counting and activity</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.featureCard}>
            <Card.Content>
              <Text variant="titleMedium">👨‍👩‍👧‍👦 Family connection and sharing</Text>
            </Card.Content>
          </Card>
        </View>
      </View>

      <OnboardingNavigation 
        onNext={handleNext}
        nextLabel="Get Started"
        showBack={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    color: '#666',
  },
  features: {
    gap: 15,
  },
  featureCard: {
    marginBottom: 10,
  },
});

export default WelcomeScreen;
