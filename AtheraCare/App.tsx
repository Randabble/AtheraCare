import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { OnboardingProvider, useOnboarding } from './src/contexts/OnboardingContext';
import { LoginScreen } from './src/screens/LoginScreen';
import MainApp from './src/screens/MainApp';
import OnboardingScreen from './src/screens/onboarding/OnboardingScreen';

const AppContent = () => {
  const { user, loading } = useAuth();
  const { isOnboardingComplete } = useOnboarding();

  console.log('AppContent render:', { user: !!user, loading, isOnboardingComplete });

  if (loading) {
    return null;
  }

  // Show onboarding first if not complete
  if (!isOnboardingComplete) {
    console.log('Showing onboarding screen');
    return <OnboardingScreen />;
  }

  // Then show auth if no user
  if (!user) {
    console.log('Showing login screen');
    return <LoginScreen onLoginSuccess={() => {}} />;
  }

  // Finally show main app
  console.log('Showing main app');
  return <MainApp />;
};

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <OnboardingProvider>
          <AppContent />
          <StatusBar style="auto" />
        </OnboardingProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
