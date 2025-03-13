// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  getIdToken,
  onIdTokenChanged
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signOut: () => Promise<void>;
  refreshGoogleToken: () => Promise<string | null>;
  getToken: () => Promise<string | null>;
  googleAccessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

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
        // You might want to do something with this token if needed
      }
    });

    return unsubscribe;
  }, []);

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    
    // Request access to Google Contacts and user profile
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    provider.addScope('profile');

    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      
      // Store Google access token
      if (credential?.accessToken) {
        setGoogleAccessToken(credential.accessToken);
      }

      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      return null;
    }
  }

  async function refreshGoogleToken() {
    if (!currentUser) return null;
    
    try {
      // Re-authenticate to get a fresh token
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
      
      const result = await signInWithPopup(auth, provider);
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

  function signOut() {
    setGoogleAccessToken(null);
    return firebaseSignOut(auth);
  }

  const value: AuthContextType = {
    currentUser,
    loading,
    signInWithGoogle,
    signOut,
    refreshGoogleToken,
    getToken,
    googleAccessToken
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}