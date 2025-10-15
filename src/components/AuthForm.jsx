import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  registerUser,
  loginUser,
  sendVerificationEmail,
  resetPassword
} from '../firebase/auth';
import { createUserProfile } from '../firebase/firestore';
import useTranslation from '../hooks/useTranslation';

const AuthForm = ({ isLogin = true }) => {
  const { setUser } = useAuth();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();

 const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        // Login flow
        const userCredential = await loginUser(formData.email, formData.password);
        const user = userCredential.user;
        
        // Check if email is verified
        if (!user.emailVerified) {
          setError(t('auth.emailNotVerified'));
          return;
        }
        
        // Redirect to home
        navigate('/');
      } else {
        // Registration flow
        const userCredential = await registerUser(formData.email, formData.password);
        const user = userCredential.user;
        
        // Create user profile in Firestore
        await createUserProfile(user, { displayName: formData.name });
        
        // Send email verification
        await sendVerificationEmail(user);
        
        // Redirect to login with success message
        navigate('/login', {
          state: {
            message: t('auth.registrationSuccess')
          }
        });
      }
    } catch (err) {
      console.error('Auth error:', err);
      // Handle specific Firebase error codes
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError(t('auth.emailInUse'));
          break;
        case 'auth/invalid-email':
          setError(t('auth.invalidEmail'));
          break;
        case 'auth/weak-password':
          setError(t('auth.weakPassword'));
          break;
        case 'auth/user-not-found':
          setError(t('auth.userNotFound'));
          break;
        case 'auth/wrong-password':
          setError(t('auth.wrongPassword'));
          break;
        case 'auth/user-disabled':
          setError(t('auth.userDisabled'));
          break;
        case 'auth/too-many-requests':
          setError(t('auth.tooManyRequests'));
          break;
        case 'auth/network-request-failed':
          setError(t('auth.networkError'));
          break;
        default:
          setError(`${t('auth.error')}: ${err.message}. ${t('auth.tryAgain')}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      setError(t('auth.enterEmailForReset'));
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await resetPassword(formData.email);
      setResetEmailSent(true);
    } catch (err) {
      console.error('Password reset error:', err);
      switch (err.code) {
        case 'auth/invalid-email':
          setError(t('auth.invalidEmail'));
          break;
        case 'auth/user-not-found':
          setError(t('auth.userNotFound'));
          break;
        case 'auth/too-many-requests':
          setError(t('auth.tooManyRequests'));
          break;
        case 'auth/network-request-failed':
          setError(t('auth.networkError'));
          break;
        default:
          setError(`${t('auth.resetFailed')}: ${err.message}. ${t('auth.tryAgain')}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!isLogin && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            {t('auth.name')}
          </label>
          <div className="mt-1">
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {t('auth.email')}
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          {t('auth.password')}
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
            value={formData.password}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
      </div>

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

      {resetEmailSent && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 0 00 16zm3.707-9.293a1 1 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                {t('auth.resetEmailSent')}
              </h3>
            </div>
          </div>
        </div>
      )}

      {!isLogin && (
        <div className="text-sm text-gray-500">
          <p>
            {t('auth.termsAgreement')}
          </p>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
            isLoading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('auth.processing')}
            </>
          ) : isLogin ? (
            t('auth.login')
          ) : (
            t('auth.register')
          )}
        </button>
      </div>

      {isLogin && (
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={isLoading}
              className="font-medium text-primary hover:text-primary-dark"
            >
              {t('auth.forgotPassword')}
            </button>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500 mt-4">
        <p>
          {isLogin ? t('auth.dontHaveAccount') : t('auth.alreadyHaveAccount')}{' '}
          <button
            type="button"
            onClick={() => navigate(isLogin ? '/register' : '/login')}
            className="font-medium text-primary hover:text-primary-dark"
          >
            {isLogin ? t('auth.register') : t('auth.login')}
          </button>
        </p>
      </div>

      {/* Email Verification Note */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h4 className="text-sm font-medium text-blue-800">{t('auth.emailVerification')}</h4>
        <p className="mt-1 text-sm text-blue-700">
          {t('auth.emailVerificationNote')}
        </p>
      </div>
    </form>
  );
};

export default AuthForm;