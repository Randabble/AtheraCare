import { auth } from '../firebase';
import { signInAnonymously } from 'firebase/auth';

export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    
    // Test anonymous sign in to verify Firebase is working
    const result = await signInAnonymously(auth);
    console.log('Firebase connection test successful:', result.user.uid);
    
    // Sign out immediately
    await auth.signOut();
    console.log('Firebase test completed successfully');
    
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
};

export const checkFirebaseConfig = () => {
  console.log('Firebase config check:');
  console.log('Auth domain:', auth.config.authDomain);
  console.log('Project ID:', auth.config.projectId);
  console.log('API Key exists:', !!auth.config.apiKey);
  console.log('App ID exists:', !!auth.config.appId);
};
