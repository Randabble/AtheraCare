import { 
  collection, 
  addDoc, 
  getDoc, 
  updateDoc, 
  doc, 
  setDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { UserPreferences } from '../contexts/OnboardingContext';

export interface UserProfile {
  id?: string;
  userId: string;
  email: string;
  displayName: string;
  preferences: UserPreferences;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Save or update user preferences after onboarding
export const saveUserPreferences = async (userId: string, email: string, preferences: UserPreferences): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    
    const userData: Omit<UserProfile, 'id'> = {
      userId,
      email,
      displayName: preferences.displayName,
      preferences,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    await setDoc(userRef, userData, { merge: true });
    console.log('User preferences saved successfully');
  } catch (error) {
    console.error('Error saving user preferences:', error);
    throw error;
  }
};

// Get user profile and preferences
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Update user preferences
export const updateUserPreferences = async (userId: string, updates: Partial<UserPreferences>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      preferences: updates,
      updatedAt: Timestamp.now()
    });
    
    console.log('User preferences updated successfully');
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
};
