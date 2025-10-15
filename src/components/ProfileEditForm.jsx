// src/components/ProfileEditForm.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../firebase/firestore';
import { updateUserEmail } from '../firebase/auth';
import useTranslation from '../hooks/useTranslation';

const ProfileEditForm = ({ onSuccess, onCancel }) => {
  const { user, firebaseUser } = useAuth();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    currentPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [requiresReauth, setRequiresReauth] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        displayName: user.displayName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleReauthSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const { reauthenticateUser } = await import('../firebase/auth');
      await reauthenticateUser(firebaseUser, formData.currentPassword);
      setRequiresReauth(false);
      setFormData(prev => ({ ...prev, currentPassword: '' }));
    } catch (err) {
      console.error('Re-authentication error:', err);
      switch (err.code) {
        case 'auth/wrong-password':
          setError(t('auth.wrongPassword'));
          break;
        default:
          setError(t('auth.reauthFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      if (formData.email !== user.email) {
        try {
          await updateUserEmail(firebaseUser, formData.email);
        } catch (err) {
          if (err.code === 'auth/requires-recent-login') {
            setRequiresReauth(true);
            setIsLoading(false);
            return;
          }
          throw err;
        }
      }
      
      await updateUserProfile(user.uid, {
        displayName: formData.displayName,
        email: formData.email,
        phoneNumber: formData.phoneNumber
      });
      
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Profile update error:', err);
      switch (err.code) {
        case 'auth/invalid-email':
          setError(t('auth.invalidEmail'));
          break;
        case 'auth/email-already-in-use':
          setError(t('auth.emailInUse'));
          break;
        default:
          setError(t('auth.updateProfileFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (requiresReauth) {
    return (
      <div className="space-y-6">
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.34-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 0 0-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">{t('profile.reauthRequired')}</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>{t('profile.reauthDescription')}</p>
              </div>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleReauthSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 01.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}
          
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
              {t('profile.currentPassword')}
            </label>
            <div className="mt-1">
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                value={formData.currentPassword}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          </div> {/* ✅ <-- this was missing */}
 
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {t('profile.cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('profile.verifying')}
                </>
              ) : (
                t('profile.verifyIdentity')
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ... rest of your normal profile form stays unchanged ... */}
    </form>
  );
};

export default ProfileEditForm;
