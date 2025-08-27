import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  UserCredential 
} from 'firebase/auth';
import { auth } from '../firebase';

export const signUp = async (email: string, password: string): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async (): Promise<void> => {
  return signOut(auth);
};
