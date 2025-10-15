// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { getUserProfile } from '../firebase/firestore';

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setFirebaseUser(firebaseUser);
        
        try {
          // Get user profile from Firestore
          const userProfile = await getUserProfile(firebaseUser.uid);
          if (userProfile) {
            setUser(userProfile);
          } else {
            // Set basic user info if profile doesn't exist
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || '',
              emailVerified: firebaseUser.emailVerified,
              role: 'patient', // Default role if no profile exists
              createdAt: firebaseUser.metadata.creationTime ? new Date(firebaseUser.metadata.creationTime) : new Date(),
              isActive: true
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Set basic user info if there's an error
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || '',
            emailVerified: firebaseUser.emailVerified,
            role: 'patient', // Default role if there's an error
            createdAt: firebaseUser.metadata.creationTime ? new Date(firebaseUser.metadata.creationTime) : new Date(),
            isActive: true
          });
        }
      } else {
        // User is signed out
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
      setAuthInitialized(true);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Check if user has a specific role
  const hasRole = (role) => {
    return user && user.role === role;
 };

  // Context value
  const contextValue = {
    user,
    firebaseUser,
    loading,
    authInitialized,
    isAuthenticated,
    hasRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};