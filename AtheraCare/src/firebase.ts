import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
// You'll need to replace these with your actual Firebase project values
const firebaseConfig = {
  apiKey: "AIzaSyCn_hwWOvhPkUzrsVvyOwaKdyKL06ZFjSI",
  authDomain: "athera-care.firebaseapp.com",
  projectId: "athera-care",
  storageBucket: "athera-care.firebasestorage.app",
  messagingSenderId: "629338928180",
  appId: "1:629338928180:web:7ce3be0209d766a3420661"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
