import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc,
  doc,
  query, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

export interface HydrationLog {
  id?: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  totalOz: number;
  goalOz: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Get today's hydration log for a user
export const getTodayHydration = async (userId: string): Promise<HydrationLog | null> => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    console.log('Getting hydration for date:', today, 'user:', userId);
    
    const q = query(
      collection(db, 'hydration'),
      where('userId', '==', userId),
      where('date', '==', today)
    );

    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('No hydration log found for today');
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();
    console.log('Found hydration log:', data);
    
    return {
      id: doc.id,
      userId: data.userId,
      date: data.date,
      totalOz: data.totalOz,
      goalOz: data.goalOz,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    } as HydrationLog;
  } catch (error) {
    console.error('Error getting today\'s hydration:', error);
    throw error;
  }
};

// Add water to today's log
export const addWater = async (userId: string, amountOz: number, goalOz: number = 64): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    console.log('Adding water:', amountOz, 'oz for date:', today, 'user:', userId);
    
    // Check if today's log exists
    const existingLog = await getTodayHydration(userId);
    
    if (existingLog) {
      // Update existing log
      const logRef = doc(db, 'hydration', existingLog.id!);
      const newTotal = existingLog.totalOz + amountOz;
      
      await updateDoc(logRef, {
        totalOz: newTotal,
        updatedAt: Timestamp.now()
      });
      
      console.log('Updated hydration log, new total:', newTotal);
    } else {
      // Create new log for today
      const hydrationData: Omit<HydrationLog, 'id'> = {
        userId,
        date: today,
        totalOz: amountOz,
        goalOz,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'hydration'), hydrationData);
      console.log('Created new hydration log with ID:', docRef.id);
    }
  } catch (error) {
    console.error('Error adding water:', error);
    throw error;
  }
};

// Reset today's water intake
export const resetTodayWater = async (userId: string): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    console.log('Resetting water for date:', today, 'user:', userId);
    
    const existingLog = await getTodayHydration(userId);
    
    if (existingLog) {
      const logRef = doc(db, 'hydration', existingLog.id!);
      await updateDoc(logRef, {
        totalOz: 0,
        updatedAt: Timestamp.now()
      });
      console.log('Reset hydration log to 0');
    }
  } catch (error) {
    console.error('Error resetting water:', error);
    throw error;
  }
};

// Update water goal
export const updateWaterGoal = async (userId: string, goalOz: number): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    console.log('Updating water goal to:', goalOz, 'oz for user:', userId);
    
    const existingLog = await getTodayHydration(userId);
    
    if (existingLog) {
      const logRef = doc(db, 'hydration', existingLog.id!);
      await updateDoc(logRef, {
        goalOz,
        updatedAt: Timestamp.now()
      });
      console.log('Updated water goal');
    } else {
      // Create new log with the goal
      const hydrationData: Omit<HydrationLog, 'id'> = {
        userId,
        date: today,
        totalOz: 0,
        goalOz,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await addDoc(collection(db, 'hydration'), hydrationData);
      console.log('Created new hydration log with goal');
    }
  } catch (error) {
    console.error('Error updating water goal:', error);
    throw error;
  }
};
