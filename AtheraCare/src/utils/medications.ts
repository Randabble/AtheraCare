import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  where,
  orderBy,
  Timestamp,
  updateDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Medication {
  id?: string;
  name: string;
  userId: string;
  days: string[];
  takenToday: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  active: boolean;
}

// Add a new medication
export const addMedication = async (userId: string, name: string, days: string[]): Promise<string> => {
  try {
    console.log('Adding medication to Firestore:', { userId, name, days });
    
    const medicationData: Omit<Medication, 'id'> = {
      name: name.trim(),
      userId,
      days: days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      takenToday: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      active: true
    };

    console.log('Medication data:', medicationData);
    const docRef = await addDoc(collection(db, 'medications'), medicationData);
    console.log('Medication added successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding medication:', error);
    throw error;
  }
};

// Get all medications for a user
export const getMedications = async (userId: string): Promise<Medication[]> => {
  try {
    console.log('Getting medications for user:', userId);
    
    const q = query(
      collection(db, 'medications'),
      where('userId', '==', userId)
    );

    console.log('Executing Firestore query...');
    const querySnapshot = await getDocs(q);
    console.log('Query completed, found', querySnapshot.size, 'documents');
    
    const medications: Medication[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('Document data:', data);
      medications.push({
        id: doc.id,
        name: data.name,
        userId: data.userId,
        days: data.days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        takenToday: data.takenToday || false,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt || data.createdAt,
        active: data.active !== false // Default to true if not set
      } as Medication);
    });

    // Sort in JavaScript instead of Firestore
    medications.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      }
      return 0;
    });

    console.log('Returning medications:', medications);
    return medications;
  } catch (error) {
    console.error('Error getting medications:', error);
    throw error;
  }
};

// Delete a medication (soft delete by setting active to false)
export const deleteMedication = async (medicationId: string): Promise<void> => {
  try {
    const medicationRef = doc(db, 'medications', medicationId);
    await deleteDoc(medicationRef);
  } catch (error) {
    console.error('Error deleting medication:', error);
    throw error;
  }
};

// Mark medication as taken for today
export const markMedicationTaken = async (userId: string, medicationId: string): Promise<void> => {
  try {
    const medicationRef = doc(db, 'medications', medicationId);
    await updateDoc(medicationRef, {
      takenToday: true,
      updatedAt: Timestamp.now()
    });
    console.log('Medication marked as taken:', medicationId);
  } catch (error) {
    console.error('Error marking medication as taken:', error);
    throw error;
  }
};

// Reset all medications for a new day
export const resetDailyMedications = async (userId: string): Promise<void> => {
  try {
    const medications = await getMedications(userId);
    const batch = writeBatch(db);
    
    medications.forEach((med) => {
      if (med.id) {
        const medicationRef = doc(db, 'medications', med.id);
        batch.update(medicationRef, {
          takenToday: false,
          updatedAt: Timestamp.now()
        });
      }
    });
    
    await batch.commit();
    console.log('Daily medications reset for user:', userId);
  } catch (error) {
    console.error('Error resetting daily medications:', error);
    throw error;
  }
};
