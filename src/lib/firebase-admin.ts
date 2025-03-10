// src/lib/firebase-admin.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Check if Firebase Admin has been initialized
if (!getApps().length) {
  try {
    // Get project ID from environment
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    
    if (!projectId) {
      throw new Error('Firebase Project ID not found in environment variables');
    }
    
    // If service account key is available
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      initializeApp({
        credential: cert(serviceAccount),
        projectId: projectId,
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      });
    } 
    // Fall back to application default credentials
    else {
      initializeApp({
        projectId: projectId,
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      });
      console.warn('Using default Firebase credentials - make sure these are properly configured');
    }
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
    throw error; // Re-throw to prevent silent failures
  }
}

export const auth = getAuth();