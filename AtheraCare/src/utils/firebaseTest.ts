import { db } from '../firebase';
import { collection, getDocs, query, where, limit, doc, setDoc } from 'firebase/firestore';

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
    if (error instanceof Error) {
      if (error.message.includes('permission') || error.message.includes('insufficient')) {
        console.error('This is a permissions error. Please update your Firebase security rules.');
      }
    }
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

// Create test data to verify permissions
export const createTestActivityData = async (userId: string): Promise<boolean> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const testData = {
      date: today,
      userId: userId,
      medications: {
        total: 2,
        taken: 1,
        missed: 1,
        streak: 0
      },
      water: {
        totalOz: 32,
        goalOz: 64,
        percentage: 50,
        streak: 0
      },
      steps: {
        count: 5000,
        goal: 10000,
        percentage: 50,
        streak: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = doc(db, 'dailyActivities', `${userId}_${today}`);
    await setDoc(docRef, testData);
    console.log('✅ Test activity data created successfully');
    return true;
  } catch (error) {
    console.error('❌ Error creating test activity data:', error);
    if (error instanceof Error) {
      if (error.message.includes('permission') || error.message.includes('insufficient')) {
        console.error('This is a permissions error. Please update your Firebase security rules.');
      }
    }
    return false;
  }
};

// Test if we can read from dailyActivities collection
export const testDailyActivitiesRead = async (userId: string): Promise<boolean> => {
  try {
    const activitiesRef = collection(db, 'dailyActivities');
    const q = query(activitiesRef, where('userId', '==', userId), limit(1));
    await getDocs(q);
    console.log('✅ DailyActivities read test passed');
    return true;
  } catch (error) {
    console.error('❌ DailyActivities read test failed:', error);
    return false;
  }
};
