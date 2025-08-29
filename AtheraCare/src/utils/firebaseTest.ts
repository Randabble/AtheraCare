import { db } from '../firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';

// Test Firebase connection
export const testFirebaseConnection = async (): Promise<boolean> => {
  try {
    // Try to access a collection to test permissions
    const testRef = collection(db, 'dailyActivities');
    const testQuery = query(testRef, limit(1));
    await getDocs(testQuery);
    console.log('✅ Firebase connection and permissions test passed');
    return true;
  } catch (error) {
    console.error('❌ Firebase connection or permissions test failed:', error);
    return false;
  }
};

// Test specific collection permissions
export const testCollectionPermissions = async (collectionName: string): Promise<boolean> => {
  try {
    const testRef = collection(db, collectionName);
    const testQuery = query(testRef, limit(1));
    await getDocs(testQuery);
    console.log(`✅ ${collectionName} collection permissions test passed`);
    return true;
  } catch (error) {
    console.error(`❌ ${collectionName} collection permissions test failed:`, error);
    return false;
  }
};

// Check Firebase project configuration
export const checkFirebaseConfig = () => {
  try {
    console.log('Firebase project ID:', db.app.options.projectId);
    console.log('Firebase app name:', db.app.name);
    console.log('Firebase config loaded successfully');
  } catch (error) {
    console.error('Error checking Firebase config:', error);
  }
};
