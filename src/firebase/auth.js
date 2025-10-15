// src/firebase/auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  applyActionCode,
  confirmPasswordReset as _confirmPasswordReset
} from 'firebase/auth';
import { auth } from './firebase';

// Register a new user with email and password
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw error;
  }
};

// Login user with email and password
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Send email verification
export const sendVerificationEmail = async (user) => {
  try {
    await sendEmailVerification(user);
  } catch (error) {
    throw error;
  }
};

// Send password reset email
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

// Update user email
export const updateUserEmail = async (user, newEmail) => {
  try {
    await updateEmail(user, newEmail);
  } catch (error) {
    throw error;
  }
};

// Update user password
export const updateUserPassword = async (user, newPassword) => {
  try {
    await updatePassword(user, newPassword);
  } catch (error) {
    throw error;
  }
};

// Delete user account
export const deleteAccount = async (user) => {
  try {
    await deleteUser(user);
  } catch (error) {
    throw error;
  }
};

// Reauthenticate user
export const reauthenticateUser = async (user, currentPassword) => {
  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
 } catch (error) {
    throw error;
  }
};

// Apply email verification code
export const applyEmailVerificationCode = async (code) => {
  try {
    await applyActionCode(auth, code);
  } catch (error) {
    throw error;
  }
};

// Confirm password reset
export const confirmPasswordReset = async (oobCode, newPassword) => {
  try {
    await _confirmPasswordReset(auth, oobCode, newPassword);
  } catch (error) {
    throw error;
  }
};

// Get Firebase ID token for API requests
export const getIdToken = async () => {
  const user = auth.currentUser;
  
  if (user) {
    return await user.getIdToken();
  }
  
  throw new Error('No authenticated user');
};