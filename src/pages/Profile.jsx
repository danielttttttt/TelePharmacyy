import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../firebase/auth';
import ProfileEditForm from '../components/ProfileEditForm';
import AccountDeletion from '../components/AccountDeletion';
import useTranslation from '../hooks/useTranslation';

const Profile = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  const handleEditSuccess = () => {
    setIsEditing(false);
    // Optionally refresh user data here
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>{t('profile.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{t('profile.title')}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{t('profile.personalDetails')}</p>
          </div>
          <div className="border-t border-gray-200">
            {isEditing ? (
              <div className="px-4 py-5 sm:p-6">
                <ProfileEditForm 
                  onSuccess={handleEditSuccess} 
                  onCancel={() => setIsEditing(false)} 
                />
              </div>
            ) : (
              <div className="px-4 py-5 sm:p-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">{t('profile.fullName')}</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.displayName || t('profile.notProvided')}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">{t('profile.emailAddress')}</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">{t('profile.phoneNumber')}</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.phoneNumber || t('profile.notProvided')}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">{t('profile.accountCreated')}</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user.createdAt ? new Date(user.createdAt.toDate ? user.createdAt.toDate() : user.createdAt).toLocaleDateString() : t('profile.unknown')}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">{t('profile.emailVerified')}</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user.emailVerified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {t('profile.verified')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {t('profile.notVerified')}
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    {t('profile.editProfile')}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-4 py-2 border border-gray-30 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    {t('profile.logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Account Deletion Section */}
        <div className="mt-8">
          <h4 className="text-lg font-medium text-gray-900">{t('profile.dangerZone')}</h4>
          <div className="mt-4">
            <AccountDeletion />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;