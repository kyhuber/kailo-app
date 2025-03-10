// src/context/AuthContext.tsx (partial update)
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  reauthenticateWithPopup
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signOut: () => Promise<void>;
  refreshGoogleToken: () => Promise<string | null>;
  googleAccessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Update ID token when it changes
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await getIdToken(user);
        setIdToken(token);
      } else {
        setIdToken(null);
      }
    });

    return unsubscribe;
  }, []);

  async function refreshGoogleToken() {
    if (!currentUser) return null;
    
    try {
      // Re-authenticate to get a fresh token
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
      
      const result = await reauthenticateWithPopup(currentUser, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      
      if (credential && credential.accessToken) {
        setGoogleAccessToken(credential.accessToken);
        return credential.accessToken;
      }
      
      return null;
    } catch (error) {
      console.error('Error refreshing Google token:', error);
      return null;
    }
  }

  const value = {
    currentUser,
    loading,
    signInWithGoogle,
    signOut,
    refreshGoogleToken,
    googleAccessToken
  };
  
  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    
    // Request access to Google Contacts
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      return null;
    }
  }

  function signOut() {
    return firebaseSignOut(auth);
  }

  async function getToken() {
    if (!currentUser) return null;
    
    try {
      // Refresh the token to ensure it's valid
      const freshToken = await getIdToken(currentUser, true);
      return freshToken;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  const value = {
    currentUser,
    loading,
    signInWithGoogle,
    signOut,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}