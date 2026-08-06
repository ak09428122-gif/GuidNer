import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { handleFirestoreError, OperationType } from '../../lib/firestoreErrors';

interface FirebaseAuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  firestoreStatus: 'connected' | 'connecting' | 'error';
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  firestoreStatus: 'connecting',
});

export const FirebaseAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [firestoreStatus, setFirestoreStatus] = useState<'connected' | 'connecting' | 'error'>('connecting');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Sync user profile in Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        try {
          await setDoc(
            userRef,
            {
              uid: currentUser.uid,
              displayName: currentUser.displayName || 'GuideNer Explorer',
              email: currentUser.email || '',
              photoURL: currentUser.photoURL || '',
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
          setFirestoreStatus('connected');
        } catch (err) {
          console.error('Error syncing user profile to Firestore:', err);
          handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}`);
          setFirestoreStatus('error');
        }
      } else {
        setFirestoreStatus('connected');
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign-Out Error:', error);
      throw error;
    }
  };

  return (
    <FirebaseAuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signOut,
        firestoreStatus,
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  );
};

export const useFirebaseAuth = () => useContext(FirebaseAuthContext);
