import { 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  setDoc,
  query,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Family {
  id?: string;
  name: string;
  creatorId: string;
  inviteCode: string;
  members: FamilyMember[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FamilyMember {
  userId: string;
  email: string;
  displayName: string;
  role: 'creator' | 'member';
  joinedAt: Timestamp;
}

// Generate a random 6-character invite code
const generateInviteCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Create a new family
export const createFamily = async (
  creatorId: string, 
  creatorEmail: string, 
  creatorName: string, 
  familyName: string
): Promise<string> => {
  try {
    const inviteCode = generateInviteCode();
    
    const familyData: Omit<Family, 'id'> = {
      name: familyName,
      creatorId,
      inviteCode,
      members: [{
        userId: creatorId,
        email: creatorEmail,
        displayName: creatorName,
        role: 'creator',
        joinedAt: Timestamp.now()
      }],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'families'), familyData);
    console.log('Family created successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating family:', error);
    throw error;
  }
};

// Join a family using invite code
export const joinFamily = async (
  userId: string,
  userEmail: string,
  userName: string,
  inviteCode: string
): Promise<string> => {
  try {
    // Find family by invite code
    const familyQuery = query(
      collection(db, 'families'),
      where('inviteCode', '==', inviteCode)
    );
    
    const querySnapshot = await getDocs(familyQuery);
    
    if (querySnapshot.empty) {
      throw new Error('Invalid invite code');
    }
    
    const familyDoc = querySnapshot.docs[0];
    const familyData = familyDoc.data() as Family;
    
    // Check if user is already a member
    const isAlreadyMember = familyData.members.some(member => member.userId === userId);
    if (isAlreadyMember) {
      throw new Error('You are already a member of this family');
    }
    
    // Add user to family
    const updatedMembers = [...familyData.members, {
      userId,
      email: userEmail,
      displayName: userName,
      role: 'member',
      joinedAt: Timestamp.now()
    }];
    
    await updateDoc(doc(db, 'families', familyDoc.id), {
      members: updatedMembers,
      updatedAt: Timestamp.now()
    });
    
    console.log('User joined family successfully');
    return familyDoc.id;
  } catch (error) {
    console.error('Error joining family:', error);
    throw error;
  }
};

// Get family by ID
export const getFamily = async (familyId: string): Promise<Family | null> => {
  try {
    const familyDoc = await getDoc(doc(db, 'families', familyId));
    
    if (familyDoc.exists()) {
      return familyDoc.data() as Family;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting family:', error);
    throw error;
  }
};

// Get family by user ID
export const getFamilyByUserId = async (userId: string): Promise<Family | null> => {
  try {
    const familiesQuery = query(
      collection(db, 'families'),
      where('members', 'array-contains', { userId })
    );
    
    const querySnapshot = await getDocs(familiesQuery);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as Family;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting family by user ID:', error);
    throw error;
  }
};

// Leave family
export const leaveFamily = async (userId: string, familyId: string): Promise<void> => {
  try {
    const familyDoc = await getDoc(doc(db, 'families', familyId));
    
    if (!familyDoc.exists()) {
      throw new Error('Family not found');
    }
    
    const familyData = familyDoc.data() as Family;
    const updatedMembers = familyData.members.filter(member => member.userId !== userId);
    
    if (updatedMembers.length === 0) {
      // If no members left, delete the family
      await updateDoc(doc(db, 'families', familyId), {
        members: updatedMembers,
        updatedAt: Timestamp.now()
      });
    } else {
      // Update family members
      await updateDoc(doc(db, 'families', familyId), {
        members: updatedMembers,
        updatedAt: Timestamp.now()
      });
    }
    
    console.log('User left family successfully');
  } catch (error) {
    console.error('Error leaving family:', error);
    throw error;
  }
};
