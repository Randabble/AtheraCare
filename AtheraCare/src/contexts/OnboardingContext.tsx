import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { saveUserPreferences, getUserProfile } from '../utils/users';

export interface UserPreferences {
  displayName: string;
  medicationReminders: boolean;
  waterGoal: number;
  stepGoal: number;
  shareWins: boolean;
  familyConnection: boolean;
  quietHours: boolean;
  privacyMode: boolean;
  syncMode: string;
}

export interface OnboardingContextType {
  currentStep: number;
  totalSteps: number;
  preferences: UserPreferences;
  isOnboardingComplete: boolean;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  setCurrentStep: (step: number) => void;
  goBack: () => void;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => void;
}

const defaultPreferences: UserPreferences = {
  displayName: '',
  medicationReminders: false,
  waterGoal: 64,
  stepGoal: 10000,
  shareWins: false,
  familyConnection: false,
  quietHours: false,
  privacyMode: false,
  syncMode: 'automatic',
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [pendingPreferences, setPendingPreferences] = useState<UserPreferences | null>(null);
  const totalSteps = 8;

  // Load user preferences from Firestore when user changes
  useEffect(() => {
    if (user) {
      loadUserPreferences();
      
      // If there are pending preferences from onboarding, save them now
      if (pendingPreferences) {
        savePendingPreferences();
      }
    }
  }, [user, pendingPreferences]);

  const loadUserPreferences = async () => {
    if (!user) return;
    
    try {
      const userProfile = await getUserProfile(user.uid);
      if (userProfile) {
        setPreferences(userProfile.preferences);
        setIsOnboardingComplete(true);
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  const savePendingPreferences = async () => {
    if (!user || !pendingPreferences) return;
    
    try {
      await saveUserPreferences(user.uid, user.email || '', pendingPreferences);
      console.log('Pending preferences saved to Firestore');
      setPreferences(pendingPreferences);
      setPendingPreferences(null);
    } catch (error) {
      console.error('Error saving pending preferences:', error);
    }
  };

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    try {
      // If user is logged in, save preferences to Firestore
      if (user) {
        await saveUserPreferences(user.uid, user.email || '', preferences);
        console.log('Onboarding completed and preferences saved to Firestore');
      } else {
        // If no user, store preferences as pending to save later
        setPendingPreferences(preferences);
        console.log('Onboarding completed, preferences stored as pending');
      }
      setIsOnboardingComplete(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Still mark as complete even if save fails
      setIsOnboardingComplete(true);
    }
  };

  const resetOnboarding = () => {
    setCurrentStep(0);
    setIsOnboardingComplete(false);
  };

  const value: OnboardingContextType = {
    currentStep,
    totalSteps,
    preferences,
    isOnboardingComplete,
    updatePreferences,
    setCurrentStep,
    goBack,
    completeOnboarding,
    resetOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
